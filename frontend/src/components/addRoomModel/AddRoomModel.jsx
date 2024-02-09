import React, { useState } from "react";
import style from "./AddRoomModel.module.css";
import TextInput from "../shared/TextInput/TextInput";
import { createRoom as create } from "../../http";
import { useNavigate } from "react-router-dom";

const AddRoomModel = ({ onClose }) => {
  const [roomType, setRoomType] = useState("Open");
  const [topic, setTopic] = useState("");
  const navigate = useNavigate();

  const createRoom = async () => {
    if (!topic) {
      return;
    }
    try {
      const { data } = await create({ topic, roomType });
      console.log(data);
      navigate(`/room/${data._id}`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={style.modalMask}>
      <div className={style.modalBody}>
        <button onClick={onClose} className={style.closeButton}>
          <img src="/images/close.png" alt="" />
        </button>
        <div className={style.modalHeader}>
          <h3>Enter the topic to be discussed</h3>
          <TextInput
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            fullweidth="true"
          />
          <h2 className={style.subHeading}>Room Types</h2>
          <div className={style.roomTypes}>
            <div
              onClick={() => setRoomType("Open")}
              className={`${style.typeBox} ${
                roomType === "Open" ? style.active : ""
              }`}
            >
              <img src="/images/globe.png" alt="globe" />
              <span>Open</span>
            </div>
            <div
              onClick={() => setRoomType("Social")}
              className={`${style.typeBox} ${
                roomType === "Social" ? style.active : ""
              }`}
            >
              <img src="/images/social.png" alt="social" />
              <span>Social</span>
            </div>
            <div
              onClick={() => setRoomType("Private")}
              className={`${style.typeBox} ${
                roomType === "Private" ? style.active : ""
              }`}
            >
              <img src="/images/lock.png" alt="lock" />
              <span>Private</span>
            </div>
          </div>
        </div>
        <div className={style.modalFutter}>
          <h2>Start a room, open to everyone</h2>
          <button onClick={createRoom} className={style.futterButton}>
            <img src="/images/celebration.png" alt="celebration" />
            <span>Let's go</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModel;
