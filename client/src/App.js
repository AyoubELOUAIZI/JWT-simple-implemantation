import "./App.css";
import axios from "axios";
import { useState } from "react";
import jwt_decode from "jwt-decode";

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const refreshToken = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/refresh", { token: user.refreshToken });
      setUser({
        ...user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

//-------------------------------------------------------------------------------------------------------------//
  // Create a new instance of the Axios HTTP client
  const axiosJWT = axios.create();

  // Attach an interceptor function to the 'request' method of the Axios instance
  axiosJWT.interceptors.request.use(

    // The first argument is a callback function that modifies the request configuration
    async (config) => {

      // Get the current date
      let currentDate = new Date();

      // Decode the JWT token stored in the user object
      const decodedToken = jwt_decode(user.accessToken);
      console.log('5555555555555555555555555555555')
      console.log(decodedToken)

      // Check if the token has expired by comparing the expiration time to the current time
      if (decodedToken.exp * 1000 < currentDate.getTime()) {

        // If the token has expired, call the 'refreshToken()' function to get a new access token
        const data = await refreshToken();

        // Set the 'authorization' header of the request with the new access token
        config.headers["authorization"] = "Bearer " + data.accessToken;
      }

      // Return the modified request configuration
      return config;
    },

    // The second argument is a callback function that handles errors
    (error) => {

      // Reject the request with the error object
      return Promise.reject(error);
    }
  );
//-------------------------------------------------------------------------------------------------------------//

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", { username, password });
      console.log(res.data)
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    setSuccess(false);
    setError(false);
    try {
      await axiosJWT.delete("http://localhost:5000/api/users/" + id, {
        headers: { authorization: "Bearer " + user.accessToken },
      });
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="container">
      {user ? (
        <div className="home">
          <span>
            Welcome to the <b>{user.isAdmin ? "admin" : "user"}</b> dashboard{" "}
            <b>{user.username}</b>.
          </span>
          <span>Delete Users:</span>
          <button className="deleteButton" onClick={() => handleDelete(1)}>
            Delete ayoub
          </button>
          <button className="deleteButton" onClick={() => handleDelete(2)}>
            Delete amal
          </button>
          {error && (
            <span className="error">
              You are not allowed to delete this user!
            </span>
          )}
          {success && (
            <span className="success">
              User has been deleted successfully...
            </span>
          )}
        </div>
      ) : (
        <div className="login">
          <form onSubmit={handleSubmit}>
            <span className="formTitle">Login</span>
            <input
              type="text"
              placeholder="user name"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="submitButton">
              Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;