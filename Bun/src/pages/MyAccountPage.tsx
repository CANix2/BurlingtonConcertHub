
import "./MyAccount.css";
import { useEffect, useState } from "react";

interface MyAccountProps {
  user: { name: string; email: string } | null;
  onSignOut: () => void;
}

const MyAccountPage = ({ user, onSignOut }: MyAccountProps) => {
  
 // gather account details in state to allow for editing
  const [accountDetails, setAccountDetails] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });
  const [isEditing, setIsEditing] = useState(false);   // toggles between view and edit
  const [formValues, setFormValues] = useState({   // holds form values while editing
    name: user?.name || "",
    email: user?.email || ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // get token from local storage
  const token = localStorage.getItem("token");

  useEffect(() => {
    // fetch account details on component mount
    if (token) {
    fetchAccountDetails();
  }
  }, [token]);

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
      setFormValues({
        name: data.account.name,
        email: data.account.email
      });
    } catch (err: any) {
        alert(err.message);
    }
    };

  const handleEditSave = async () => {
    // set api/account with new name/email and token
    try {
        // if success, update account Details state and exit edit mode
      const response = await fetch("http://localhost:3001/api/account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formValues.name,
          email: formValues.email
        })
      });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed update");
    }
    setAccountDetails(formValues);
    setIsEditing(false);
    alert("Account details updated successfully");
    } catch (err: any) {
        alert(err.message);
    }
  };

  const handlePasswordChange = async () => {
    // validate newPassword matches confirmPassword
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
        alert("New password and confirmation do not match");
        return;
    }
    // set api/account/password with current and new password and token
    try {
        const response = await fetch("http://localhost:3001/api/account/password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            })
        });
    alert("Password changed successfully");
    setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    setShowPasswordForm(false);
    } catch (err: any) {
        alert(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    // set api/account with token to delete account
    try {
        const response = await fetch("http://localhost:3001/api/account", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Failed to delete account");
        }
        alert("Account deleted successfully");
        localStorage.removeItem("token");
        onSignOut();

    } catch (err: any) {
        alert(err.message);
    }};


  

    // render
    return (
        <div className="account-container">
            <div className="account-header">
                <h2>My Account</h2>
                <p className="account-subtitle">Manage your account settings and information</p>
            </div>

        {/* Front page, View / Edit */}
        <div className="account-section">
            <h3 className="section-title">Account Info / Change Info</h3>
        {!isEditing ? (
            <div className="account-info">
                <div className="info-row"><span className="info-label">Name</span><span>{accountDetails.name}</span></div>
                <div className="info-row"><span className="info-label">Email</span><span>{accountDetails.email}</span></div>
                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Account</button>
            </div>
      ) : (
        <div className="account-form">
            <label>Name</label>
            <input type="text" value={formValues.name} onChange={(e) => setFormValues({ ...formValues, name: e.target.value })} />
            <label>Email </label>
            <input type="email" value={formValues.email} onChange={(e) => setFormValues({ ...formValues, email: e.target.value })} />
            <div className="btn-row">
                <button className="btn btn-primary" onClick={handleEditSave}>Save Changes</button>
                <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
        </div>
    )}
    </div>

    

        {/* Change Password */}
        <div className="account-section">
            <h3 className="section-title">Change Password</h3>
            <button className="btn btn-primary" onClick={() => setShowPasswordForm(!showPasswordForm)}>
               {showPasswordForm ? "Cancel" : "Change Password"}
            </button>
            {showPasswordForm && (
                <div className="account-form">
                    <label>Current Password</label>
                    <input type="password" 
                    placeholder="Current Password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
                <input
                    type="password"                    
                    placeholder="New Password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordForm.confirmNewPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                />
                <button className="btn btn-primary" onClick={handlePasswordChange}>
                    Change Password
                </button>
            </div>
            )}
        </div>

        {/* Delete Account */}
        <div className="account-section danger-section">
            <h3 className="section-title">Delete Account</h3>
            {!showDeleteConfirmation ? (
                <button className="btn btn-danger" onClick={() => setShowDeleteConfirmation(true)}>Delete Account</button>
            ) : (
            <div>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="btn-row">
                <button className='btn btn-danger' onClick={handleDeleteAccount}>Yes, Delete My Account</button>
                <button className='btn btn-secondary' onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
            </div>
            </div>
        )}

    </div>
    </div>
    );
};


export default MyAccountPage;
