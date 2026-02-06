import React, { useState, useEffect } from "react";
import { 
  Typography, 
  TextField, 
  Box, 
  Button, 
  Paper, 
  CircularProgress, 
  Alert,
  Link as MuiLink,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../actions/auth.action";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!auth.loading && isSubmitting) {
      if (auth.message?.toLowerCase().includes("success")) {
        const timer = setTimeout(() => {
           navigate("/signin", { replace: true });
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [auth.loading, auth.message, isSubmitting, navigate]);

  useEffect(() => {
     if (auth.error) {
         setIsSubmitting(false);
     }
  }, [auth.error]);

  const userSignup = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!name || !email || !password) {
      setLocalError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    const user = { name, email, phoneNumber, password };
    
    setIsSubmitting(true);
    dispatch(signup(user));
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: { xs: "white", sm: "#f1f1f1" } 
      }}
    >
      {/* Logo */}
      <Typography 
        variant="h3" 
        sx={{ 
            fontFamily: "cursive", 
            fontWeight: "bold", 
            mb: { xs: 3, sm: 3 }, 
            mt: { xs: 2, sm: 0 }, 
            cursor: 'pointer', 
            color: '#333',
            fontSize: { xs: '2.5rem', sm: '3rem' } 
        }}
        onClick={() => navigate('/')}
      >
        MyStore
      </Typography>

      <Paper 
        elevation={3} 
        sx={{ 
            p: { xs: 3, sm: 4 }, 
            width: "90%", 
            maxWidth: 450, 
            borderRadius: { xs: 0, sm: 2 }, 
            boxShadow: { xs: 'none', sm: 3 }, 
            bgcolor: { xs: 'transparent', sm: 'white' }
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: "bold", textAlign: 'center' }}>
          Create Account
        </Typography>

        <Box component="form" onSubmit={userSignup}>
          
          {(localError || (auth.error && isSubmitting)) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {localError || auth.error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 2 }}>
            
            <TextField
              name="name"
              required
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              required
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              required
              fullWidth
              label="Phone Number"
              type="tel" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <TextField
              required
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              helperText="Passwords must be at least 6 characters."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                  endAdornment: (
                      <InputAdornment position="end">
                      <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                      >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                      </InputAdornment>
                  ),
              }}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={auth.loading}
            sx={{ 
              mt: 4, 
              mb: 2, 
              bgcolor: "#6A1B1A", 
              py: 1.5,
              fontWeight: "bold",
              "&:hover": { bgcolor: "#8B2323" }
            }}
          >
            {auth.loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sign Up"}
          </Button>
          
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
                Already have an account?
            </Typography>
            <MuiLink 
                component={Link} 
                to="/signin" 
                underline="hover" 
                sx={{ 
                    color: "#6A1B1A", 
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: '1rem'
                }}
            >
                Sign In
            </MuiLink>
          </Box>

        </Box>
      </Paper>
      
      {/* Footer Links */}
      <Box sx={{ mt: 4, mb: 4, display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Typography variant="caption" color="text.secondary">Conditions of Use</Typography>
          <Typography variant="caption" color="text.secondary">Privacy Notice</Typography>
          <Typography variant="caption" color="text.secondary">Help</Typography>
      </Box>

    </Box>
  );
};

export default SignUp;