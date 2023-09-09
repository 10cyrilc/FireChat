import { useState } from "react";
import { RiImageAddFill } from "react-icons/ri";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../fireBase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (error !== null) {
    setTimeout(() => {
      setError(null);
    }, 5000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const passwordCheck = e.target[3].value;
    const file = e.target[4].files[0];

    if (password !== passwordCheck) {
      setError("Passwords Don't Match");
      setLoading(false);
    } else {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);

        const storageRef = ref(storage, res.user.uid);

        await uploadBytesResumable(storageRef, file).then(() => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            try {
              //Update profile
              await updateProfile(res.user, {
                displayName,
                photoURL: downloadURL,
              });
              //create user on firestore
              await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                displayName,
                email,
                photoURL: downloadURL,
              });

              //create empty user chats on firestore
              await setDoc(doc(db, "userChats", res.user.uid), {});
              navigate("/");
            } catch (err) {
              setErr(true);
              setLoading(false);
            }
          });
        });
      } catch (error) {
        const errorMessage = error.message;
        S;
        setError(errorMessage);
        setLoading(false);
      }
    }
    setLoading(false);
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">FireChat</span>
        <span className="title">Register</span>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Display Name" required />
          <input type="email" placeholder="e-Mail" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Repeat Password" required />
          <input
            type="file"
            name="avatar"
            id="avatar"
            style={{ display: "none" }}
            required
          />
          <label htmlFor="avatar">
            <RiImageAddFill size={20} />
            <span>Add an Avatar</span>
          </label>
          <button disabled={loading}>
            {!loading ? "Sign Up" : "Signing Up"}
          </button>
          {error && (
            <span
              className="title"
              style={{ color: "#f00", fontSize: "0.8em" }}
            >
              {error}
            </span>
          )}
        </form>
        <p>
          Already Registered? <Link to="/login">Login now</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
