import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface RegisterProps {
  onRegisterSuccess: (user: { name: string; email: string }) => void;
}



const Register = ({ onRegisterSuccess }: RegisterProps) => {
    
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // validation
    if (!name || !email || !password) {
        alert("Please fill in all fields");
        return;
    }

    // tell app that user is logged in
    onRegisterSuccess({ name, email });

    // redirect to home page
    navigate("/");
}

  return (
    <>
    <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">Register</Typography>
            <Box sx={{ mt: 1 }}>
                <TextField
                margin="normal"
                name="name"
                required
                fullWidth
                label="Name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
                <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </Box>
            <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleRegister}>
                Register
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link to="/login">Already have an account? Login</Link>
            </Box>
            </Box>
      </Container>
    </>
  );
};

export default Register;