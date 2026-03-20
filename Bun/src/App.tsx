import "./index.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import NewPostPage from "./pages/NewPostPage.tsx";

function Navigation() {
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
          <Link to="/account">Account Details</Link>
          <Link to="/your-posts">Your Posts</Link>
          <Link to="/new-post">New Post</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/signout">Sign Out</Link>
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <>
        <h1 className="mx-auto bg-green-800 text-center text-white mt-1 mb-1 max-w-sm object-center pt-1 pb-1 rounded-xl">
          Vermont Concert Hub
          </h1>
        <Navigation />
        <Routes>
          <Route path="/new-post" element={<NewPostPage />} />
        </Routes>
      </>
    </BrowserRouter>
  );
}

export default App;