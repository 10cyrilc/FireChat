import { signOut } from "firebase/auth";
import { auth } from "../fireBase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function NavBar() {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="navbar">
      <span className="logo">FireChat</span>
      <div className="user">
        <img src={currentUser.photoURL} alt={currentUser.displayName} />
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
}

export default NavBar;
