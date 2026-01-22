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
import { searchProducts } from "../../actions/product.Action";

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

  // ✅ 3. Search State
  const [searchTerm, setSearchTerm] = useState("");

  // Listen for Login Success Signal
  useEffect(() => {
    if (location.state?.welcome && auth.user) {
      setUserName(auth.user.name || "User");
      setWelcomeOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, auth.user]);

  const handleCloseWelcome = () => {
    setWelcomeOpen(false);
  };

  const logout = () => {
    dispatch(signout());
    navigate('/signin');
  };

  // ✅ 4. Search Handler
  const onSearch = (e) => {
    // Check if key is Enter OR if it's a click event
    if (e.key === "Enter" || e.type === "click") {
      if (searchTerm.trim()) {
        dispatch(searchProducts(searchTerm));
        navigate('/');
      }
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
      
      {/* GLOBAL WELCOME SNACKBAR */}
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

        {/* ✅ Search Bar Box */}
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
          <InputBase 
            placeholder="Search products..." 
            sx={{ flex: 1 }} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={onSearch} // Listen for Enter key
          />
          <SearchIcon 
            sx={{ color: "gray", cursor: 'pointer' }} 
            onClick={onSearch} // Listen for Click
          />
        </Box>

        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          
          {/* CONDITIONAL RENDERING */}
          {auth.authenticate ? (
            <Typography 
                sx={{ cursor: "pointer", fontFamily: "cursive", color: "#d32f2f" }} 
                onClick={logout}
            >
              Logout <LogoutIcon sx={{ verticalAlign: "middle", ml: 0.5, fontSize: 18 }} />
            </Typography>
          ) : (
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