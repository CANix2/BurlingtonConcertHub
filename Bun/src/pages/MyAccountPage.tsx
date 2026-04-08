

import { LockOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";

interface MyAccountProps {
  user: { name: string; email: string } | null;
}

const MyAccountPage = ({ user }: MyAccountProps) => {
  
 // gather account details in state to allow for editing
  const [accountDetails, setAccountDetails] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });

  useEffect(() => {
    // fetch account details on component mount
    fetchAccountDetails();
  }, []);
  
  // get token from local storage
  const token = localStorage.getItem("token");
  
  // if no token, user is not logged in (maybe unnecessary)
  if (!token) {
    return <p>Please log in to view your account details.</p>;
  }

  // fetch GET api/account with token in Authorization header
  const fetchAccountDetails = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/account", {
        headers: { Authorization: `Bearer ${token}` }
      });
        if (!response.ok) {
            throw new Error("Failed to fetch account details");
        }
    // if successful, update account details state with response data
      const data = await response.json();
      setAccountDetails({
        name: data.account.name,
        email: data.account.email
      });
    } catch (err: any) {
        alert(err.message);
    }
    };

    // render
    return (
      <div>
        <h2>My Account</h2>
        <p>Name: {accountDetails.name}</p>
        <p>Email: {accountDetails.email}</p>
      </div>
    );
};

export default MyAccountPage;
