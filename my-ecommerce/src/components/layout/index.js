import React, { useState, useEffect } from "react"; 
import { 
  Box, 
  Typography, 
  InputBase, 
  Badge, 
  Snackbar, 
  Alert     
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom"; 
import { signout } from "../../actions/auth.action";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); 
  
  // 1. Get Auth State
  const auth = useSelector((state) => state.auth);
  
  // Logic for Cart Count
  const cart = useSelector((state) => state.cart);
  const cartCount = cart.cartItems ? cart.cartItems.length : 0;

  // 2. Popup State
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [userName, setUserName] = useState("");

  // 3. Listen for Login Success Signal
  useEffect(() => {
    // If we have the 'welcome' flag in state AND the user is actually logged in
    if (location.state?.welcome && auth.user) {
      
      // ✅ FIX: Changed 'firstName' to 'name' to match your backend
      setUserName(auth.user.name || "User");
      
      setWelcomeOpen(true);
      
      // Clean the history state so the popup doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, auth.user]);

  const handleCloseWelcome = () => {
    setWelcomeOpen(false);
  };

  // 4. Logout Handler
  const logout = () => {
    dispatch(signout());
    navigate('/signin');
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
      
      {/* ✅ GLOBAL WELCOME SNACKBAR */}
      <Snackbar
        open={welcomeOpen}
        autoHideDuration={4000} 
        onClose={handleCloseWelcome}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 8 }} 
      >
        <Alert 
          onClose={handleCloseWelcome} 
          severity="success" 
          variant="filled"
          sx={{ width: "100%", bgcolor: "#4caf50", color: "white" }}
        >
          Welcome back, {userName}! Login Successful.
        </Alert>
      </Snackbar>

      {/* --- GLOBAL HEADER --- */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
          p: 2,
          mb: 3,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 1000
        }}
      >
        <Typography
          sx={{ fontSize: 30, fontWeight: "bold", fontFamily: "cursive", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          MyStore
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f3f3f3",
            borderRadius: 5,
            px: 2,
            width: 350,
            display: { xs: "none", md: "flex" } 
          }}
        >
          <InputBase placeholder="Search products..." sx={{ flex: 1 }} />
          <SearchIcon sx={{ color: "gray" }} />
        </Box>

        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          
          {/* CONDITIONAL RENDERING */}
          {auth.authenticate ? (
            // --- VIEW FOR LOGGED IN USERS ---
            <Typography 
                sx={{ cursor: "pointer", fontFamily: "cursive", color: "#d32f2f" }} 
                onClick={logout}
            >
              Logout <LogoutIcon sx={{ verticalAlign: "middle", ml: 0.5, fontSize: 18 }} />
            </Typography>
          ) : (
            // --- VIEW FOR GUESTS ---
            <>
                <Typography sx={{ cursor: "pointer", fontFamily: "cursive" }} onClick={() => navigate("/signup")}>
                    Sign Up <LockOpenIcon sx={{ verticalAlign: "middle", ml: 0.5, fontSize: 18 }} />
                </Typography>

                <Typography sx={{ cursor: "pointer", fontFamily: "cursive" }} onClick={() => navigate("/signin")}>
                    Login <LockIcon sx={{ verticalAlign: "middle", ml: 0.5, fontSize: 18 }} />
                </Typography>
            </>
          )}

          {/* Cart Icon with Badge */}
          <Typography
             sx={{ cursor: "pointer", fontFamily: "cursive", display: "flex", alignItems: "center", gap: 1 }}
             onClick={() => navigate("/cart")}
          >
            Cart 
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </Typography>
        </Box>
      </Box>

      {/* --- PAGE CONTENT --- */}
      <Box sx={{ p: { xs: 1, md: 3 } }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;