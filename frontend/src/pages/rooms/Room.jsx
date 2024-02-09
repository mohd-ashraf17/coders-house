import React, { useState } from "react";
import style from "./Rooms.module.css";
import RoomCard from "../../components/roomCard/RoomCard";
import AddRoomModel from "../../components/addRoomModel/AddRoomModel";

const Room = () => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };
  return (
    <>
      <div className="container">
        <div className={style.roomsHeader}>
          <div className={style.left}>
            <span className={style.heading}>All voice rooms</span>
            <div className={style.searchBox}>
              <img src="/images/search-icon.png" alt="search" />
              <input className={style.searchInput} type="text" />
            </div>
          </div>
          <div className={style.right}>
            <button onClick={openModal} className={style.startRoomButton}>
              <img src="/images/add-room-icon.png" alt="start-button" />
              <span>Start a room</span>
            </button>
          </div>
        </div>
        <div className={style.roomList}>
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
      {showModal && <AddRoomModel onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Room;
