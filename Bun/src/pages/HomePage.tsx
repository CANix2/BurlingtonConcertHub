import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
    return (
        <div className="home-container">
            <div className="home-header">
                <h1>Welcome to Burlington Concert Hub!</h1>
                <p> The front page of Vermont Live Music</p>
            </div>
            <div className="home-cards">
                <div className="home-card">
                    <h2>What is Burlington Concert Hub?</h2>
                    <p>
                        Burlington Concert Hub is a community driven platform
                        to share, promote and discover live music in Burlington,
                        Vermont and the surrounding area. Our goal is to create
                        a space for music lovers to connect, share their experiences,
                        and support the vibrant local music scene.
                    </p>
                </div>

                <div className="home-card">
                    <h2>How to get started</h2>
                    <ol>
                        <li>Create an account using the dropdown menu in the top right corner</li>
                        <li>View other user's reviews using the feed button</li>
                        <li>See announcements from your favorite venues and artists</li>
                        <li>Once logged in, post your own reviews by clicking the "New Post" button</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default HomePage;