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
  IconButton,
  Container
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
                mb: { xs: 4, sm: 3 }, // More space on mobile
                mt: { xs: 4, sm: 0 }, // Top margin on mobile
                cursor: 'pointer', 
                color: '#333',
                fontSize: { xs: '2.5rem', sm: '3rem' } // Smaller font on mobile
            }}
            onClick={() => navigate('/')}
        >
            MyStore
        </Typography>

        <Paper 
            elevation={3} 
            sx={{ 
                p: { xs: 3, sm: 4 }, // Reduced padding on mobile
                width: "90%", 
                maxWidth: 450, 
                borderRadius: { xs: 0, sm: 2 }, // No border radius on mobile (full screen feel)
                boxShadow: { xs: 'none', sm: 3 }, // Remove shadow on mobile
                bgcolor: { xs: 'transparent', sm: 'white' }
            }}
        >
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

            {/* Forgot Password Link */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <MuiLink 
                    component={Link} 
                    to="/reset-password" 
                    underline="hover" 
                    variant="body2"
                    sx={{ color: "#1976d2", fontWeight: "bold" }}
                >
                    Forgot Password?
                </MuiLink>
            </Box>

            <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                size="large" // Larger touch target for mobile
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
                        cursor: "pointer",
                        fontSize: '1rem'
                    }}
                >
                    Register Here
                </MuiLink>
            </Box>
        </Paper>

        {/* Footer Links - Hide on very small screens if needed, or stack them */}
        <Box sx={{ mt: 4, mb: 4, display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Typography variant="caption" color="text.secondary">Conditions of Use</Typography>
            <Typography variant="caption" color="text.secondary">Privacy Notice</Typography>
            <Typography variant="caption" color="text.secondary">Help</Typography>
        </Box>

    </Box>
  );
};

export default Signin;