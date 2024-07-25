import React, { useState } from 'react';
import './Dashboard.css';
import Home from './LoginReg/Home.js';
import Post from './Posts/Post.js';
import AccountSettings from './AccountSet/AccountSettings.js';
import Chat from './Chat/Chat.js';
import Game from "./Games/games";
import Logout from './logout.js';

import { List, X, HouseSimple, ChatsTeardrop, GameController, FileArrowUp, SignOut, User } from 'phosphor-react';

//import logo from './tmuLogo.png';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('home');
  const [sidePanelVisible, setSidePanelVisible] = useState(true);
  const [homeKey, setHomeKey] = useState(0);

  

  const handleNavigation = (section) => {
    if (section === 'home') {
      setHomeKey(prevKey => prevKey + 1);
    }
    setActiveSection(section);
  };

  const toggleSidePanel = () => {
    setSidePanelVisible(!sidePanelVisible);
  };

  const handleBack = () => {
    setActiveSection('home');
  };

  const hamburgerMenuIcon = (
    <div className={`hamburger-menu-icon ${!sidePanelVisible ? 'visible' : 'hidden'}`} onClick={toggleSidePanel}>
      <List size={32} className="icon" />
    </div>
  );
  
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  
  const handleMobileNavigation = (section) => {
    handleNavigation(section);
    setIsMenuOpen(false);
  };

  return (
    <div className="app-container">
      <nav className={`side-panel ${sidePanelVisible ? 'visible' : 'hidden'}`}>
        <X size={24} className="icon" onClick={toggleSidePanel} />
        <img className='dash' src={require('./tmuLogo.png')} alt="tmulogo" />
        <br />
        <h4>Navigation</h4> <br />
        <button className={`nav-button ${activeSection === 'home' ? 'active' : ''}`} onClick={() => handleNavigation('home')}>
          <HouseSimple size={24} style={{ display: "inline-block" }} /> Home
        </button>
        <button className={`nav-button ${activeSection === 'post' ? 'active' : ''}`} onClick={() => handleNavigation('post')}>
          <FileArrowUp size={24} style={{ display: "inline-block" }} /> Post
        </button>
        <button className={`nav-button ${activeSection === 'chat' ? 'active' : ''}`} onClick={() => handleNavigation('chat')}>
          <ChatsTeardrop size={24} style={{ display: "inline-block" }} /> Chat
        </button>
        <button className={`nav-button ${activeSection === 'account-settings' ? 'active' : ''}`} onClick={() => handleNavigation('account-settings')}>
          <User size={24} style={{ display: "inline-block" }} /> Profile
        </button>
        <button className={`nav-button ${activeSection === 'game' ? 'active' : ''}`} onClick={() => handleNavigation('game')}>
          <GameController size={24} style={{ display: "inline-block" }} /> Games
        </button>
        <button className={`nav-button ${activeSection === 'lol' ? 'active' : ''}`} onClick={() => handleNavigation('lol')}>
          <SignOut size={24} style={{ display: "inline-block" }} /> Logout
        </button>
      </nav>
      <div className='meow'>
        <br />
        {!sidePanelVisible && (
          <List size={24} className="icon" alt="tmulogo" onClick={toggleSidePanel} />
        )}
      </div>

      <div className="dashboard">
        {activeSection === 'home' && <Home key ={homeKey} onBackButtonClick={handleBack} />}
        {activeSection === 'post' && <Post />}
        {activeSection === 'account-settings' && <AccountSettings />}
        {activeSection === 'chat' && <Chat />}
        {activeSection === 'lol' && <Logout />}
        {activeSection === 'game' && <Game />}
      </div>
    </div>
  );
}

export default Dashboard;