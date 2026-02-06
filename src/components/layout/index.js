import React, { useState, useEffect } from "react"; 
import { 
  Box, 
  Typography, 
  Badge, 
  Snackbar, 
  Alert,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  InputBase
} from "@mui/material";

// Icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"; 
import PersonIcon from "@mui/icons-material/Person";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom"; 
import { signout } from "../../actions/auth.action";
import { searchProducts } from "../../actions/product.Action";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); 
  
  const auth = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const cartCount = cart.cartItems ? cart.cartItems.length : 0;
  const isAdmin = auth.user?.role === 'admin';

  // ✅ UPDATED LOGIC: Show Search ONLY on Homepage AND if not Admin
  const showSearch = !isAdmin && location.pathname === "/";

  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (location.state?.welcome && auth.user) {
      setUserName(auth.user.name || "User");
      setWelcomeOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, auth.user]);

  const handleCloseWelcome = () => setWelcomeOpen(false);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => { handleMenuClose(); dispatch(signout()); navigate('/signin'); };
  const handleNavigate = (path) => { handleMenuClose(); navigate(path); };

  const onSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchTerm.trim()) {
        dispatch(searchProducts(searchTerm));
        // No need to navigate if we are already on home, but safe to keep
        navigate('/'); 
      }
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
      
      <Snackbar open={welcomeOpen} autoHideDuration={4000} onClose={handleCloseWelcome} anchorOrigin={{ vertical: "top", horizontal: "center" }} sx={{ mt: 8 }}>
        <Alert onClose={handleCloseWelcome} severity="success" variant="filled" sx={{ width: "100%", bgcolor: "#4caf50", color: "white" }}>
          Welcome back, {userName}! Login Successful.
        </Alert>
      </Snackbar>

      {/* --- HEADER --- */}
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
          zIndex: 1000,
          gap: 1
        }}
      >
        {/* 1. LOGO */}
        <Typography
          variant="h5"
          sx={{ 
              fontWeight: "bold", 
              cursor: "pointer", 
              letterSpacing: 1, 
              fontSize: { xs: '1.2rem', md: '1.5rem' }, 
              display: { xs: 'none', sm: 'block' } 
          }}
          onClick={() => navigate("/")}
        >
          MyStore
        </Typography>
        {/* Mobile Logo Fallback */}
        <Typography 
            variant="h6" 
            sx={{ 
                fontWeight: "bold", 
                cursor: "pointer", 
                display: { xs: 'block', sm: 'none' } 
            }}
            onClick={() => navigate("/")}
        >
            Store
        </Typography>

        {/* 2. SEARCH BAR (Conditionally Rendered) */}
        {showSearch && (
            <Box
            sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f3f3f3",
                borderRadius: 5,
                px: { xs: 1, md: 2 },
                width: { xs: "130px", sm: "220px", md: "350px" }, 
                height: 40,
                transition: "width 0.3s ease"
            }}
            >
            <InputBase 
                placeholder="Search..." 
                sx={{ flex: 1, ml: 1, fontSize: '0.9rem' }} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={onSearch} 
            />
            <SearchIcon 
                sx={{ color: "gray", cursor: 'pointer', fontSize: 20 }} 
                onClick={onSearch} 
            />
            </Box>
        )}

        {/* 3. RIGHT SIDE ICONS */}
        <Box sx={{ display: "flex", gap: { xs: 1, md: 3 }, alignItems: "center" }}>

          {/* Cart */}
          {!isAdmin && (
            <Typography
                sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 1, fontWeight: 500 }}
                onClick={() => navigate("/cart")}
            >
                <Box component="span" sx={{ display: { xs: "none", md: "block" } }}>Cart</Box> 
                <Badge badgeContent={cartCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}>
                    <ShoppingCartIcon />
                </Badge>
            </Typography>
          )}

          {/* Auth */}
          {auth.authenticate ? (
            <>
                <Tooltip title="Account settings">
                    <IconButton onClick={handleMenuClick} size="small" sx={{ ml: 0 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: isAdmin ? "#6A1B1A" : "#1976d2", fontSize: 14 }}>
                            {auth.user?.name ? auth.user.name.charAt(0).toUpperCase() : "U"}
                        </Avatar>
                    </IconButton>
                </Tooltip>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    PaperProps={{ elevation: 0, sx: { filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))', mt: 1.5 } }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={() => handleNavigate('/profile')}><ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon> Profile</MenuItem>
                    {!isAdmin && <MenuItem onClick={() => handleNavigate('/orders')}><ListItemIcon><ShoppingBagIcon fontSize="small" /></ListItemIcon> My Orders</MenuItem>}
                    {isAdmin && (
                        <div>
                            <MenuItem onClick={() => handleNavigate('/admin/dashboard')}><ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon> Dashboard</MenuItem>
                            <MenuItem onClick={() => handleNavigate('/product/add')}><ListItemIcon><AddCircleIcon fontSize="small" /></ListItemIcon> Add Product</MenuItem>
                        </div>
                    )}
                    <Divider />
                    <MenuItem onClick={handleLogout}><ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon> Logout</MenuItem>
                </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography sx={{ cursor: "pointer", fontWeight: 500, fontSize: '0.9rem', display: { xs: "none", sm: "block" } }} onClick={() => navigate("/signup")}>Sign Up</Typography>
                <Typography sx={{ cursor: "pointer", fontWeight: 500, fontSize: '0.9rem' }} onClick={() => navigate("/signin")}>Login <LockIcon sx={{ verticalAlign: "middle", ml: 0.5, fontSize: 16 }} /></Typography>
            </Box>
          )}
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