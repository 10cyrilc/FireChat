import { ImAttachment } from "react-icons/im";
import { AiOutlineSend } from "react-icons/ai";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../fireBase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function MsgInput() {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      await uploadBytes(storageRef, img).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateDoc(doc(db, "chats", data.chatID), {
              messages: arrayUnion({
                id: uuid(),
                text: text,
                senderID: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          } catch (err) {
            // setErr(true);
            // setLoading(false);
          }
        });
      });
    } else {
      await updateDoc(doc(db, "chats", data.chatID), {
        messages: arrayUnion({
          id: uuid(),
          text: text,
          senderID: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatID + ".lastmessage"]: {
        text: text,
      },
      [data.chatID + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatID + ".lastmessage"]: {
        text: text,
      },
      [data.chatID + ".date"]: serverTimestamp(),
    });
    setText("");
    setImg(null);
  };

  const handleKey = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      handleSend();
    }
  };

  return (
    <div className="msgInput">
      <input
        type="text"
        name=""
        id=""
        placeholder="Enter Message..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={handleKey}
      />
      <div className="send">
        <input
          type="file"
          name=""
          id="imgAttachment"
          style={{ display: "none" }}
          onChange={(e) => setImg(e.target.files[0])}
          onKeyDown={handleKey}
        />
        <label htmlFor="imgAttachment" className="imgAttachment">
          <ImAttachment size={20} />
        </label>
        <button onClick={handleSend}>
          <AiOutlineSend size={25} />
        </button>
      </div>
    </div>
  );
}

export default MsgInput;
