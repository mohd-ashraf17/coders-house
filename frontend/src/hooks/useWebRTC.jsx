import { useCallback, useEffect, useRef, useState } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import { socketInit } from "../socket";
import freeice from "freeice";

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const socket = useRef(null);
  const localMediaStream = useRef(null);
  const clientsRef = useRef([]);
  // console.log(audioElements.current)

  useEffect(() => {
    socket.current = socketInit();
  }, []);

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  const addNewClient = useCallback(
    (newClient, cb) => {
      // console.log(newClient)
      const lookingFor = clients.find((client) => client._id === newClient._id);
      // console.log(lookingFor);
      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb);
      }
    },
    [clients, setClients]
  );

  // Capture midia
  useEffect(() => {
    const startCapture = async () => {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    };
    startCapture().then(() => {
      addNewClient({ ...user, muted: true }, () => {
        // console.log(user._id)
        const localElement = audioElements.current[user._id];
        // console.log(audioElements.current[user._id])
        // console.log(localElement)
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }

        //socket emit join socket io
        socket.current.emit("join", { roomId, user });
      });
    });
    return () => {
      // leaving room
      localMediaStream.current.getTracks().forEach((track) => track.stop());
      socket.current.emit("leave", { roomId });
    };
  }, []);
  useEffect(() => {
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      // if already connected then give warning
      if (peerId in connections.current) {
        return console.warn(`you are already connected with ${peerId}`);
      }
      connections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(),
      });
      // handle new ice candidate
      connections.current[peerId].onicecandidate = (event) => {
        socket.current.emit("relay-ice", {
          peerId,
          icecandidate: event.candidate,
        });
      };
      // handle on track on this connection
      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        console.log(remoteStream);
        addNewClient({ ...remoteUser, muted: true }, () => {
          if (audioElements.current[remoteUser._id]) {
            // console.log(audioElements.current[remoteUser._id])
            audioElements.current[remoteUser._id].srcObject = remoteStream;
          } else {
            let settled = false;
            const interval = setInterval(() => {
              if (audioElements.current[remoteUser._id]) {
                // console.log(audioElements.current[remoteUser._id]);
                audioElements.current[remoteUser._id].srcObject = remoteStream;
                settled = true;
              }
              if (settled) {
                clearInterval(interval);
              }
            }, 300);
          }
        });
      };
      // add local track to local connections
      localMediaStream.current.getTracks().forEach((track) => {
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });
      // create offer
      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();
        await connections.current[peerId].setLocalDescription(offer);
        // console.log(offer);
        // send offer to another client
        socket.current.emit("relay-SDP", { peerId, sessionDescription: offer });
      }
    };
    socket.current.on("add_peer", handleNewPeer);
    return () => {
      socket.current.off("add_peer");
      socket.current.off("relay-SDP");
    };
  }, []);
  // candle ice candidate
  useEffect(() => {
    socket.current.on("ice-candidate", ({ peerId, icecandidate }) => {
      if (icecandidate) {
        connections.current[peerId].addIceCandidate(icecandidate);
      }
    });
    return () => {
      socket.current.off("ice-candidate");
    };
  }, []);
  // handle SDP
  useEffect(() => {
    const handleRemoteSDP = async ({
      peerId,
      sessionDescription: remoteSessionDescription,
    }) => {
      connections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteSessionDescription)
      );
      // if session description is type off offer then create an answer
      if (remoteSessionDescription.type === "offer") {
        const connection = connections.current[peerId];
        const answer = await connection.createAnswer();

        connection.setLocalDescription(answer);
        socket.current.emit("relay-SDP", {
          peerId,
          sessionDescription: answer,
        });
      }
    };
    socket.current.on("sessionDespription", handleRemoteSDP);
    return () => {
      socket.current.off("sessionDespription");
    };
  }, []);
  // handle remote peer
  useEffect(() => {
    const handleRemovePeer = async ({ peerId, user }) => {
      // console.log(userId)
      if (connections.current[peerId]) {
        connections.current[peerId].close();
      }
      delete connections.current[peerId];
      delete audioElements.current[user._id];
      setClients((list) => list.filter((client) => client._id !== user._id));
    };
    socket.current.on("remove-peer", handleRemovePeer);
    return () => {
      socket.current.off("remove-peer");
    };
  }, []);

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);
  // listenng for mute unMute

  useEffect(() => {
    socket.current.on("mute", ({ peerId, userId }) => {
      // console.log('mute')
      setMute(true, userId);
    });

    socket.current.on("unMute", ({ peerId, userId }) => {
      // console.log('unmute')
      setMute(false, userId);
    });

    const setMute = (mute, userId) => {
      const clientIdX = clientsRef.current
        .map((client) => client._id)
        .indexOf(userId);
      const connectedClients = JSON.parse(JSON.stringify(clientsRef.current));
      if (clientIdX > -1) {
        connectedClients[clientIdX].muted = mute;
        setClients(connectedClients);
      }
    };
  }, []);

  // handling mute
  const handleMute = (ismute, userId) => {
    // console.log('mute', ismute)
    let settled = false;
    const interval = setInterval(() => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks()[0].enabled = !ismute;
        if (ismute) {
          socket.current.emit("mute", { roomId, userId });
        } else {
          socket.current.emit("unMute", { roomId, userId });
        }
        settled = true;
      }
      if (settled) {
        clearInterval(interval);
      }
    }, 200);
  };
  return { clients, provideRef, handleMute };
};
