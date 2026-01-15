import React, { useState } from 'react'
import '../CSS/dashboard.css'
import {useNavigate} from 'react-router-dom'
import journalImg from '../assets/journal.png'
import logoutImg from '../assets/log-out.png'
import profileImg from '../assets/profile.jpg'
import { useEffect } from 'react'
import API from './api'

const Dashboard = () => {

const navigate = useNavigate();
const [userName, setUserName] = useState('');
const [selectDate, setSelectDate] = useState('');
const [journalText, setJournalText] = useState('');
const [selectMoods, setSelectMoods] = useState(null);
const [quoteText, setQouteText] = useState('');
const [message, setMessage] = useState(null); 


useEffect(() => {
  const storedUserName = localStorage.getItem('username');
  if(storedUserName) 
  setUserName(storedUserName);
 }, [])

const moods = [
  {label: "happy", emoji: "😄" },
  {label: "sad", emoji: "😔" },
  {label: "angry", emoji: "😤" },
  {label: "tired", emoji: "😴" }
];


const handleSubmit = async () => {
if(!journalText.trim()){
  setMessage({type:"error", text:"Please write something!"});
  return;
}
const token = localStorage.getItem('token')
const entry = {
  date: selectDate || new Date().toISOString().split('T')[0],
  text: journalText,
  mood: selectMoods,
  quote: quoteText
} 
try {
  const res = await API.post('journals', entry);
  console.log('Entry saved', res.data);
  setMessage({type: 'success', text:"Entery added successfully!"});
  setSelectDate('');
  setJournalText('');
  setSelectMoods(null);
} catch (error) {
  console.error(error);
  setMessage({type:"error", text: error.response?.data?.error
  ||  "Server error!"})
  }
};
const handleClear = () => {
  setSelectDate('');
  setJournalText('');
  setSelectMoods(null);
  setMessage(null);
}
const handleLogout = () => {
  localStorage.removeItem('username');
  localStorage.removeItem('token');
 navigate('/login')
}

  return (
    <div>
        <aside className="logoHeading">
      <div className="logo">
        <div className="logosec">
          <img src={journalImg} alt="journal" className="journal" />
          <h2 className="htext">DailyNotes</h2>
        </div>
        <p className="textline">Capture your day, live it fully</p>
      </div>
      <nav className="sidebar">
        <a href="#" className="home">Home</a>
        <a href="#" className="calender">Calender</a>
        <a href="#" className="allentities">All Entities</a>
        <a href="#" className="insights">Insights</a>
        <a href="#" className="settings">Settings</a>
      </nav>

      <button className="logoutBox" onClick={handleLogout} style={{cursor:'pointer'}}>
        <img src={logoutImg} alt="logout" className="logout-icon" />
        <span className="logoutname">Logout</span>
      </button>
    </aside>
    <main className="main">
      <div className="topmain">
        <div className="profile">
          <img src={profileImg} alt="profile" className="profileimg" />
          <p className="username">{userName}</p>
          {/* <input type="text" className="username" />UserName */}
        </div>
        <input type="date" className="date"
        value={selectDate}
        onChange={(e) => setSelectDate(e.target.value)} />
      </div>
      <textarea
        name="text"
        id="journaltext"
        className="journaltext"
        value={journalText}
        onChange={(e) => setJournalText(e.target.value)}
        placeholder="Write about your day... thoughts, feelings, moments ✨"
      ></textarea>

      {/* <div className="intrange">
        <label htmlFor="" className="moodintensity">Mood intensity</label>
        <input type="range" min="1" max="10" />
      </div> */}

      <div className="moods-time">
        <div className="feelings">
         {moods.map((mood) => (
          <button className={`moods ${mood.label} ${selectMoods === mood.label ? 'selected' : ''}`}
          key={mood.label}
          onClick={() => setSelectMoods(mood.label)}>
           <span className="emoji">{mood.emoji}</span>
           <span className="label">{mood.label.charAt(0).
           toUpperCase()+mood.label.slice(1)}</span>
          </button>
         ))
         }
        </div>
        <p className="timeweather">
          <span className="time">🕑 9:45 PM</span>
          <span className="dot">.</span>
          <span className="weather">Cloudy</span>
          <span className="weatheremoji">⛅</span>
        </p>
      </div>
      <div className="bottom">
        <p className="quote">Happiness is a journey, not a destination.</p>
        <div className="actions">
          <button onClick={handleSubmit} className="newEntryBtn">Add Entry</button>
          <button onClick={handleClear} className="clear">Clear</button>
        </div>
      </div>
    </main>
    </div>
  )
}
export default Dashboard
