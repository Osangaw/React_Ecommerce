import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert, 
  CircularProgress 
} from "@mui/material";
import { forgotPassword, resetPassword } from "../../actions/auth.action";

const ResetPassword = () => {
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP + New Pass
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await dispatch(forgotPassword(email));
      setLoading(false);
      setStep(2); // Move to next step
      setMessage("OTP sent! Check your email.");
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to send OTP");
    }
  };

  // Handle Step 2: Verify & Reset
  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await dispatch(resetPassword({ email, otp, newPassword }));
      setLoading(false);
      setMessage("Password Reset Successful! Redirecting...");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/signin");
      }, 2000);

    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to reset password");
    }
  };

  return (
    // ✅ 1. Match Layout Wrapper (Grey Background, Centered)
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
        {/* ✅ 2. Match Logo Header */}
        <Typography 
            variant="h3" 
            sx={{ fontFamily: "cursive", fontWeight: "bold", mb: 3, cursor: 'pointer', color: '#333' }}
            onClick={() => navigate('/')}
        >
            MyStore
        </Typography>

        {/* ✅ 3. Match Paper Card Styling */}
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 450, borderRadius: 2 }}>
            
            <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
                {step === 1 ? "Forgot Password" : "Reset Password"}
            </Typography>

            {/* Feedback Messages */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

            {/* STEP 1 FORM: EMAIL ONLY */}
            {step === 1 && (
                <form onSubmit={handleSendOtp}>
                    <TextField
                        label="Enter your Email"
                        type="email"
                        fullWidth
                        required
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ 
                            mt: 3, 
                            bgcolor: "#6A1B1A", // ✅ Match Red Color
                            py: 1.5, 
                            fontWeight: "bold",
                            "&:hover": { bgcolor: "#8B2323" } 
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Send OTP Code"}
                    </Button>
                    
                    <Button 
                        fullWidth 
                        sx={{ mt: 2, color: "#333" }} 
                        onClick={() => navigate('/signin')}
                    >
                        Back to Login
                    </Button>
                </form>
            )}

            {/* STEP 2 FORM: OTP + NEW PASSWORD */}
            {step === 2 && (
                <form onSubmit={handleReset}>
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={email}
                        disabled
                        variant="filled"
                    />
                    
                    <TextField
                        label="Enter 6-digit Code (OTP)"
                        fullWidth
                        required
                        margin="normal"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        required
                        margin="normal"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ 
                            mt: 3, 
                            bgcolor: "#6A1B1A", // ✅ Match Red Color
                            py: 1.5, 
                            fontWeight: "bold",
                            "&:hover": { bgcolor: "#8B2323" } 
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Change Password"}
                    </Button>
                    
                    <Button 
                        fullWidth 
                        sx={{ mt: 2, color: "#333" }} 
                        onClick={() => setStep(1)}
                    >
                        Wrong Email? Go Back
                    </Button>
                </form>
            )}

        </Paper>

        {/* ✅ 4. Match Footer Links */}
        <Box sx={{ mt: 4, display: 'flex', gap: 3 }}>
            <Typography variant="caption" color="text.secondary">Conditions of Use</Typography>
            <Typography variant="caption" color="text.secondary">Privacy Notice</Typography>
            <Typography variant="caption" color="text.secondary">Help</Typography>
        </Box>

    </Box>
  );
};

export default ResetPassword;