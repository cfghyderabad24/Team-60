// src/Header.js
import React from 'react';
import './Home.css'; 
import logo from './assets/logo.jpeg'; 
import bannerImage from './assets/banner-image.png';

const Home = () => {
    return (
        <header className="header">
            <div className="contact-info">
                <p>info@jaldhaara.org</p>
                <p>040 2771 6789</p>
                <p>+91 6281706245</p>
            </div>
            <div className="navbar">
                <img src={logo} alt="jaldhaara foundation" className="logo" />
                <nav>
                    <ul>
                        <li><a href="/"><b>Home</b></a></li>
                        <li><a href="/donor"><b>Donor</b></a></li>
                       
                    </ul>
                </nav>
            </div>
            <div className="banner">
                <div className="banner-text">
                    <h1>Clean Drinking Water Allows Me To Be More Regular In School.</h1>
                </div>
                <div className="banner-image">
                    <img src={bannerImage} alt="banner image" />
                </div>
            </div>
        </header>
    );
};

export default Home;