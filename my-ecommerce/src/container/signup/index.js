import React, { useState, useEffect } from "react";
import { Typography, TextField, Box, Button, Grid, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { signup } from "../../actions/auth.action";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!auth.loading && (auth.message || auth.authenticate)) {
      alert("Registration Successful! Please Sign In.");
      navigate("/signin", { replace: true });
    }
  }, [auth.loading, auth.message, auth.authenticate, navigate]);

  const userSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    const user = { 
      name, 
      email, 
      phoneNumber, 
      password 
    };
    dispatch(signup(user));
  };

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: "#f1f1f1" 
      }}
    >
      
      {/* Logo Header */}
      <Typography 
        variant="h3" 
        sx={{ fontFamily: "cursive", fontWeight: "bold", mb: 3, cursor: 'pointer', color: '#333' }}
        onClick={() => navigate('/')}
      >
        MyStore
      </Typography>

      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 450, borderRadius: 2 }}>
        <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Create Account
        </Typography>

        <Box component="form" onSubmit={userSignup}>
          <Grid container spacing={2}>
            
            {/* NAME FIELD */}
            <Grid item xs={12}>
              <TextField
                name="name"
                required
                fullWidth
                label="Full Name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            {/* EMAIL */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            {/* PHONE NUMBER */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                type="tel" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="08012345678"
              />
            </Grid>

            {/* PASSWORD */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                helperText="Passwords must be at least 6 characters."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2, 
              bgcolor: "#6A1B1A", 
              py: 1.5,
              fontWeight: "bold",
              "&:hover": { bgcolor: "#8B2323" }
            }}
          >
            {auth.loading ? "Creating Account..." : "Create Account"}
          </Button>

          {/* Success/Error Messages */}
          {auth.message && (
              <Typography 
                color={auth.message.toLowerCase().includes("success") ? "green" : "error"} 
                textAlign="center" 
                sx={{ mt: 2, fontSize: '0.9rem', fontWeight: "bold" }}
              >
                  {auth.message}
              </Typography>
          )}
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
                Already have an account? <span style={{ color: "#6A1B1A", cursor: "pointer", fontWeight: "bold" }} onClick={() => navigate('/signin')}>Sign in</span>
            </Typography>
          </Box>

        </Box>
      </Paper>
      
      <Box sx={{ mt: 4, display: 'flex', gap: 3 }}>
          <Typography variant="caption" color="text.secondary">Conditions of Use</Typography>
          <Typography variant="caption" color="text.secondary">Privacy Notice</Typography>
          <Typography variant="caption" color="text.secondary">Help</Typography>
      </Box>

    </Box>
  );
};

export default SignUp;