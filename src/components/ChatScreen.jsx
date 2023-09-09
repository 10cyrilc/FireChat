import React, { useContext } from "react";
import MessageScreen from "./MessageScreen";
import MsgInput from "./MsgInput";
import { ChatContext } from "../context/ChatContext";

function ChatScreen() {
  const { data } = useContext(ChatContext);

  return (
    <div className="chatScreen">
      <div className="chatInfo">
        <span>{data.user.displayName}</span>
      </div>
      <MessageScreen />
      <MsgInput />
    </div>
  );
}

export default ChatScreen;
