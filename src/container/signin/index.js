import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Alert, 
  Link as MuiLink,
  CircularProgress,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { login } from "../../actions/auth.action";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.authenticate) {
      const destination = location.state?.from || "/";
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

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    // ✅ 1. Layout Wrapper (Matches Signup Page)
    <Box 
      sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: "#f1f1f1" // Grey background
      }}
    >
        {/* ✅ 2. Logo Header (Matches Signup Page) */}
        <Typography 
            variant="h3" 
            sx={{ fontFamily: "cursive", fontWeight: "bold", mb: 3, cursor: 'pointer', color: '#333' }}
            onClick={() => navigate('/')}
        >
            MyStore
        </Typography>

        {/* ✅ 3. Paper Card */}
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 450, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
                Sign In
            </Typography>

            <form onSubmit={handleSubmit}>
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
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                value={password}
                onChange={handleInput(setPassword)}
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

            <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                sx={{ 
                    mt: 3, 
                    bgcolor: "#6A1B1A", 
                    py: 1.5, 
                    fontWeight: "bold",
                    "&:hover": { bgcolor: "#8B2323" }
                }}
                disabled={auth.authenticating}
            >
                {auth.authenticating ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                "Login"
                )}
            </Button>
            </form>

            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'center' }}>
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

        <Box sx={{ mt: 4, display: 'flex', gap: 3 }}>
            <Typography variant="caption" color="text.secondary">Conditions of Use</Typography>
            <Typography variant="caption" color="text.secondary">Privacy Notice</Typography>
            <Typography variant="caption" color="text.secondary">Help</Typography>
        </Box>

    </Box>
  );
};

export default Signin;