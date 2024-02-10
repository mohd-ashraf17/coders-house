import React, { useEffect, useState } from "react";
import style from "./Rooms.module.css";
import RoomCard from "../../components/roomCard/RoomCard";
import AddRoomModel from "../../components/addRoomModel/AddRoomModel";
import { getAllRooms } from "../../http";

const Rooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    (async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");
      const { data } = await getAllRooms({ refreshToken, accessToken });
      console.log(data);
      setRooms(data);
    })();
  }, []);
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
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      </div>
      {showModal && <AddRoomModel onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Rooms;
