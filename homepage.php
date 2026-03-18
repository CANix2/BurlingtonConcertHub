
<!DOCTYPE HTML>
<html lang="en">
    <body>
        <main>
            <h1 class="header">Vermont Concert Hub</h1>
            <div class = "navbar">
                <a href="homepage.php">Home</a>
                <a href="feed.php">Feed</a>
                <a href="venues.php">Venues</a>
                <a href="artists.php">Artists</a>
                <a href="concerts.php">Past Concerts</a>
                <a href="map.php">Map</a>
                <div class="dropdown">
                    <button class="dropbtn">Account
                        <i class="fa fa-caret-down"></i>
                    </button>
                    <div class="dropdown-content">
                        <a href="account.php">Account Details</a>
                        <a href="#">Your Posts</a>
                        <a href="#">New Post</a>
                        <a href="#">Settings</a>
                        <a href="#">Sign Out</a>
                    </div>
                </div>
            </div>
            <div>

            </div>
        </main>
    </body>
</html>

<style>
/* Navbar container */
.navbar {
  display: flex;
  overflow: hidden;
  background-color: #333;
  font-family: Arial;
  align-items: center;
  margin-right: 30px; 
  margin-left: 30px;
}

/* Links inside the navbar */
.navbar a {
  float: left;
  font-size: 16px;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

/* The dropdown container */
.dropdown {
  float: left;
  overflow: hidden;
  margin-left: auto;
}

/* Dropdown button */
.dropdown .dropbtn {
  font-size: 16px;
  border: none;
  outline: none;
  color: white;
  padding: 14px 16px;
  background-color: inherit;
  font-family: inherit; /* Important for vertical align on mobile phones */
  margin: 0; /* Important for vertical align on mobile phones */
}

/* Add a red background color to navbar links on hover */
.navbar a:hover, .dropdown:hover .dropbtn {
  background-color: red;
}

/* Dropdown content (hidden by default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  float: none;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

/* Add a grey background color to dropdown links on hover */
.dropdown-content a:hover {
  background-color: #ddd;
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}
</style>