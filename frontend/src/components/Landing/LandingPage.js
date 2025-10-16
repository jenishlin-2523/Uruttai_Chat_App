import React from "react";
import { useNavigate } from "react-router-dom";
import "../Landing/LandingPage.css";
import img1 from "../../assets/4.jpg";
import img2 from "../../assets/5.jpg";
import img3 from "../../assets/6.jpg";
import img4 from "../../assets/7.jpg";
import img5 from "../../assets/8.jpg";


const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-left">
        <div className="logo">
          <div className="logo-box">U</div>
          <h2>Uruttai</h2>
        </div>

        <h1 className="landing-title">
          Speak Like Nobody's <br /> Listening
        </h1>

        <p className="landing-text">
          Uruttai is an easy-to-use, instant messaging app that helps you stay
          connected. It is simple, secure, and Indian-made.
        </p>

        <div className="landing-buttons">
          <button
            className="register-btn"
            onClick={() => navigate("/register")}
          >
            Register Now
          </button>
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login →
          </button>
        </div>
      </div>

      <div className="landing-right">
        <div className="image-grid">
          <img src={img1} alt="chat-preview-1" className="grid-img" />
          <img src={img2} alt="chat-preview-2" className="grid-img" />
          <img src={img3} alt="chat-preview-3" className="grid-img" />
          <img src={img4} alt="chat-preview-4" className="grid-img" />
          <img src={img5} alt="chat-preview-5" className="grid-img" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
