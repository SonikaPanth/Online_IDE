import React, { useState } from "react";
import logo from "../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import image from "../images/authPageSide.png";
import { api_base_url } from "../helper";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch(`${api_base_url}/signUp`, {
        mode: "cors",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, email, password: pwd }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Account created successfully!");
        navigate("/login"); // Redirect to login page
      } else {
        setError(data.message || "Signup failed. Try again.");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <>
      <div className="container w-screen min-h-screen flex items-center justify-between pl-[100px]">
        <div className="left w-[35%]">
          <img className="w-[200px]" src={logo} alt="Logo" />
          <form onSubmit={submitForm} className="w-full mt-[60px]">
            <div className="inputBox">
              <input
                required
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="inputBox">
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="inputBox">
              <input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="inputBox">
              <input
                required
                type="password"
                placeholder="Password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
            </div>

            <p className="text-[gray]">
              Already have an account?{" "}
              <Link to="/login" className="text-[#00AEEF]">
                Login
              </Link>
            </p>

            {error && <p className="text-red-500 text-[14px] my-2">{error}</p>}

            <button className="btnBlue w-full mt-[20px]">Sign Up</button>
          </form>
        </div>
        <div className="right w-[55%]">
          <img className="h-[100vh] w-[100%] object-cover" src={image} alt="Auth Page" />
        </div>
      </div>
    </>
  );
};

export default SignUp;
