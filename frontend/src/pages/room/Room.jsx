import React, { useEffect, useState } from "react";
import { useWebRTC } from "../../hooks/useWebRTC";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import style from "./Room.module.css";
import { getRoom } from "../../http";

const Room = () => {
  const { id: roomId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  const [room, setRoom] = useState(null);
  const [ismute, setMute] = useState(true);
  // console.log(clients);
  const navigate = useNavigate();
  const handleManualLeave = () => {
    navigate("/rooms");
  };
  useEffect(() => {
    handleMute(ismute, user._id);
  }, [ismute]);
  useEffect(() => {
    (async () => {
      const { data } = await getRoom(roomId);
      setRoom((prev) => data);
    })();
  }, [roomId]);
  const handleMuteClick = (clientId) => {
    if (clientId !== user._id) {
      return;
    }
    setMute((ismute) => !ismute);
  };
  return (
    <div>
      <div className="container">
        <button onClick={handleManualLeave} className={style.goBack}>
          <img src="/images/arrow-left.png" alt="arrow-laft" />
          <span>All voice rooms</span>
        </button>
      </div>
      <div className={style.clientsWrap}>
        <div className={style.header}>
          <h2 className={style.topic}>{room?.topic}</h2>
          <div className={style.actions}>
            <button className={style.actionBtn}>
              <img src="/images/palm.png" alt="palm-icon" />
            </button>
            <button onClick={handleManualLeave} className={style.actionBtn}>
              <img src="/images/win.png" alt="win-icon" />
              <span>Leave quietly</span>
            </button>
          </div>
        </div>
        <div className={style.clientList}>
          {clients.map((client) => {
            return (
              <div key={client._id} className={style.client}>
                <div className={style.userHead}>
                  <audio
                    ref={(instance) => provideRef(instance, client._id)}
                    autoPlay
                  ></audio>
                  <img
                    className={style.userAvatar}
                    src={client.avatar}
                    alt="avatar"
                  />
                  <button
                    onClick={() => {
                      handleMuteClick(client._id);
                    }}
                    className={style.micBtn}
                  >
                    {client.muted ? (
                      <img src="/images/mic-mute.png" alt="mic-icon" />
                    ) : (
                      <img src="/images/mic.png" alt="mic-mute-icon" />
                    )}
                  </button>
                </div>
                <h4>{client.name}</h4>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Room;
