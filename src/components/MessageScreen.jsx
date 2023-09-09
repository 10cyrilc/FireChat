import { useEffect, useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import Message from "./Message";
import { db } from "../fireBase";
import { doc, onSnapshot } from "firebase/firestore";

function MessageScreen() {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unSub = onSnapshot(doc(db, "chats", data.chatID), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });

      return () => {
        unSub();
      };
    };
    data.chatID && getChats();
  }, [data.chatID]);

  return (
    <div className="messageScreen">
      {messages.map((msg) => (
        <Message message={msg} key={msg.id} />
      ))}
    </div>
  );
}

export default MessageScreen;
