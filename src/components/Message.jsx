import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { Timestamp } from "firebase/firestore";

function Message({ message }) {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const toHoursAndMinutes = (totalSeconds) => {
    const totalMinutes = Math.floor(totalSeconds / 60);

    const seconds = Math.floor(totalSeconds % 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    if (hours !== 0) {
      return `${hours} Hours Ago`;
    } else if (hours === 0 && minutes !== 0) {
      return `${minutes} Minutes Ago`;
    } else if (hours === 0 && minutes === 0 && seconds !== 0) {
      return `${seconds} Seconds Ago`;
    } else if (hours === 0 && minutes === 0 && seconds === 0) {
      return "Just now";
    }
  };

  return (
    <div
      ref={ref}
      className={`message ${message.senderID === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderID === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>{toHoursAndMinutes(Timestamp.now() - message.date)}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt={message.text} />}
      </div>
    </div>
  );
}

export default Message;
