import React, { useState, useEffect } from "react";
import { 
  Typography, 
  TextField, 
  Box, 
  Button, 
  Grid, 
  Paper, 
  CircularProgress, 
  Alert 
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "../../actions/auth.action";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const auth = useSelector((state) => state.auth);

  // ✅ 2. Auto-Redirect Logic (No more Alerts)
  useEffect(() => {
    if (!auth.loading) {
      // If we have a success message or authentication is true
      if (auth.message?.toLowerCase().includes("success") || auth.authenticate) {
        // Small delay (500ms) so user briefly sees the success state, then move to login
        const timer = setTimeout(() => {
           navigate("/signin", { replace: true });
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [auth.loading, auth.message, auth.authenticate, navigate]);

  const userSignup = (e) => {
    e.preventDefault();
    setLocalError(""); // Clear previous errors

    if (!name || !email || !password) {
      setLocalError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long");
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
        {/* ✅ 3. Fixed Title */}
        <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Sign Up
        </Typography>

        <Box component="form" onSubmit={userSignup}>
          
          {/* Show Errors (Local or Server) */}
          {(localError || auth.error) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {localError || auth.error}
            </Alert>
          )}

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

          {/* ✅ 4. Button with Spinner */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={auth.loading} // Disable while loading
            sx={{ 
              mt: 3, 
              mb: 2, 
              bgcolor: "#6A1B1A", 
              py: 1.5,
              fontWeight: "bold",
              "&:hover": { bgcolor: "#8B2323" }
            }}
          >
            {auth.loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Sign Up"
            )}
          </Button>
          
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