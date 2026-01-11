import { useEffect, useState } from "react";
import "./App.css";

import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";
import RatingChart from "./components/RatingChart";

const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

export default function App() {
  const STORAGE_KEY = "feedbacks";
  const [loaded, setLoaded] = useState(false);


  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    setFeedbacks(JSON.parse(stored));
  }
}, []);

useEffect(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    setFeedbacks(JSON.parse(stored));
  }
  setLoaded(true);
}, []);

useEffect(() => {
  if (!loaded) return; // ⛔ prevent overwrite
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
}, [feedbacks, loaded]);

  useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("feedbacks"));
  if (saved) setFeedbacks(saved);
}, []);


 useEffect(() => {
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
}, [feedbacks]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitFeedback = (e) => {
    e.preventDefault();
    if (!name || rating === 0) return alert("Name & rating required");

    setFeedbacks([
      ...feedbacks,
      { id: Date.now(), name, rating, comment },
    ]);

    setName("");
    setRating(0);
    setComment("");
  };

  const adminLogin = () => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setIsAdmin(true);
      setShowLogin(false);
    } else alert("Invalid admin credentials");
  };

  const deleteFeedback = (id) => {
  if (!isAdmin) return; // SAFETY CHECK
  setFeedbacks(feedbacks.filter((f) => f.id !== id));
};


  const editFeedback = (f) => {
    setName(f.name);
    setRating(f.rating);
    setComment(f.comment);
    deleteFeedback(f.id);
  };

  const overall =
    feedbacks.length === 0
      ? 0
      : (
          feedbacks.reduce((s, f) => s + f.rating, 0) /
          feedbacks.length
        ).toFixed(1);

  return (
    <div>
      {/* HERO NAVBAR */}
<div className="hero-nav">
  <img src="/bg.jpeg" alt="Cover" className="hero-img" />

  <div className="hero-overlay">
    <h1 className="hero-title">Your Feedback</h1>

    <button
      className="admin-float-btn"
      onClick={() => setShowLogin(!showLogin)}
      aria-label="Admin Login"
    >
      👤
    </button>
  </div>
</div>


      {/* ADMIN LOGIN MODAL */}
      {showLogin && !isAdmin && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>Admin Login</h3>
            <input
              placeholder="Username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <button onClick={adminLogin}>Login</button>
          </div>
        </div>
      )}

      <div className="content">
        <p className="overall">Overall ⭐ {overall}</p>

        {!isAdmin && (
          <FeedbackForm
            name={name}
            setName={setName}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            onSubmit={submitFeedback}
          />
        )}

        {isAdmin && (
          <>
            <button className="logout" onClick={() => setIsAdmin(false)}>
              Logout
            </button>
            <FeedbackList
              feedbacks={feedbacks}
              onEdit={editFeedback}
              onDelete={deleteFeedback}
            />
            <RatingChart feedbacks={feedbacks} />
          </>
        )}
      </div>
    </div>
  );
}
