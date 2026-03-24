import "./index.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import NewPostPage from "./pages/NewPostPage.tsx";
import MyPostsPage from "./pages/MyPostsPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";

// stores username and email
interface User {
  name: string;
  email: string;
}

// stores login status
interface LoginProps {
  isLoggedIn: boolean;
  onSignOut: () => void;
}

function Navigation({ isLoggedIn, onSignOut }: LoginProps) {


  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/feed">Feed</Link>
      <Link to="/venues">Venues</Link>
      <Link to="/artists">Artists</Link>
      <Link to="/concerts">Past Concerts</Link>
      <Link to="/map">Map</Link>
      <div className="dropdown">
        <button className="dropbtn">Account
          <i className="fa fa-caret-down"></i>
        </button>
        <div className="dropdown-content">
          {isLoggedIn ? (
             <>
          <Link to="/account">Account Details</Link>
          <Link to="/your-posts">Your Posts</Link>
          <Link to="/new-post">New Post</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/signout">Sign Out</Link>
          </>
          ) : (
            <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          </>
          )}

        </div>
      </div>
    </div>
  );
}

export function App() {

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // handles input validation for login
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  // handles input validation for sign out
  const handleSignOut = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <>
        <h1 className="mx-auto bg-green-800 text-center text-white mt-1 mb-1 max-w-sm object-center pt-1 pb-1 rounded-xl">
          Vermont Concert Hub
          </h1>
        <Navigation isLoggedIn={isLoggedIn} onSignOut={handleSignOut} />
        <Routes>
          <Route path="/new-post" element={<NewPostPage />} />
          <Route path="/your-posts" element={<MyPostsPage />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<RegisterPage onRegisterSuccess={handleLoginSuccess} />} />
        </Routes>
      </>
    </BrowserRouter>
  );
}



export default App;

