import { useContext, useState } from "react";

import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../fireBase";
import { AuthContext } from "../context/AuthContext";

function Search() {
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const { currentUser } = useContext(AuthContext);
  // const { dispatch } = useContext(ChatContext);

  // Search Handler
  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", userName)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      setError(error.message);
    }
  };

  // KeyDown Handler
  const handleKey = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      handleSearch();
    }
  };

  // Chat Select Action

  const handleSelect = async () => {
    // Existing Chat

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        // create a chat session
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        // create chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      setError(error.message);
    }
    setUser(null);
    setUserName("");
    //  Create New
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          name=""
          id=""
          placeholder="Search Users....."
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
          onKeyDown={handleKey}
        />
      </div>
      {error && <span>User Not Found</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt={user.displayName} />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
