import React from "react";
import style from "./RoomCard.module.css";
import { useNavigate } from "react-router-dom";
const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        // onClick={() => {
        //   navigate(`/room/${room._id}`);
        // }}
        className={style.card}
      >
        <div className={style.topic}>{room.topic}</div>
        <div
          className={`${style.speackers} ${
            room.speackers.length === 1 ? style.singleSpeacker : ""
          }`}
        >
          <div className={style.avatar}>
            {room.speackers.map((speacker) => (
              <img
                className={style.avatarImage}
                key={speacker._id}
                src={speacker.avatar ? speacker.avatar : "/images/monkey-avatar.png"}
                alt="speacker"
              />
            ))}
          </div>
          <div className={style.names}>
            {room.speackers.map((speacker) => (
              <div key={speacker._id} className={style.nameWrapper}>
                <span>{speacker.name}</span>
                <img src="/images/chat-bubble.png" alt="chat-bubble" />
              </div>
            ))}
          </div>
        </div>
        <div className={style.peopleCount}>
          <span>{room.totalPeople}</span>
          <img src="/images/user-icon.png" alt="user-icon" />
        </div>
      </div>
    </>
  );
};

export default RoomCard;
