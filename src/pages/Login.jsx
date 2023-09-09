import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../fireBase";

function Login() {
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

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setError(errorMessage);
      setLoading(false);
    }
    setLoading(false);
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">FireChat</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="e-Mail" />
          <input type="password" placeholder="Password" />
          {error && (
            <span
              className="title"
              style={{ color: "#f00", fontSize: "0.8em" }}
            >
              {error}
            </span>
          )}
          <button disabled={loading}>
            {!loading ? "Login" : "Logging In.."}
          </button>
        </form>
        <p>
          No Account? <Link to="/signup">Register now</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
