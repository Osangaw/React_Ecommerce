import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper, 
  Alert, 
  Link as MuiLink 
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom"; // ✅ Import useLocation
import { login } from "../../actions/auth.action";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get access to previous navigation state
  
  const auth = useSelector((state) => state.auth);

  // ✅ UPDATED REDIRECT LOGIC
  useEffect(() => {
    if (auth.authenticate) {
      // 1. Check if the user was trying to go somewhere specific (like /cart)
      //    If not, default to Home ("/")
      const destination = location.state?.from || "/";

      // 2. Navigate there AND send the "welcome" signal
      //    We keep ...location.state in case there was other data
      navigate(destination, { state: { ...location.state, welcome: true } });
    }
  }, [auth.authenticate, navigate, location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    const user = { email, password };
    dispatch(login(user));
  };

  const handleInput = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError("");
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, textAlign: "center", borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} color="#6A1B1A">
          Sign In
        </Typography>

        <form onSubmit={handleSubmit}>
           {/* Show local validation error OR Redux auth error */}
           {(error || auth.error) && (
            <Alert sx={{ width: "100%", mb: 2 }} severity="error">
              {error || auth.error}
            </Alert>
          )}
          
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={handleInput(setEmail)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={handleInput(setPassword)}
          />

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 3, bgcolor: "#6A1B1A", py: 1.5, fontWeight: "bold" }}
            disabled={auth.authenticating}
          >
            {auth.authenticating ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* --- Link to Signup --- */}
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
                Don't have an account?
            </Typography>
            <MuiLink 
                component={Link} 
                to="/signup" 
                underline="hover" 
                sx={{ 
                    color: "#6A1B1A", 
                    fontWeight: "bold",
                    cursor: "pointer" 
                }}
            >
                Register Here
            </MuiLink>
        </Box>

      </Paper>
    </Container>
  );
};

export default Signin;