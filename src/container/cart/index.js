import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  Paper
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"; // Cleaner icon
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'; // For empty state
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import {
  decrementQuantity,
  getCartItems,
  incrementQuantity,
  removeCartItem,
} from "../../actions/cart.Action";
import Layout from "../../components/layout";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems, loading } = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth); 

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  // --- DATA ADAPTER (Keeps logic safe) ---
  const getProductData = (item) => {
    if (item.productId && typeof item.productId === "object") {
      return {
        _id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.image,
        quantity: item.quantity,
        isValid: true,
      };
    }
    const localProduct = item.product || item;
    if (localProduct && localProduct.name) {
      return {
        _id: localProduct._id,
        name: localProduct.name,
        price: localProduct.price,
        image: localProduct.image,
        quantity: item.quantity || localProduct.qty,
        isValid: true,
      };
    }
    return {
      _id: item._id || Math.random(),
      name: "Unavailable Product",
      price: 0,
      image: "",
      quantity: item.quantity,
      isValid: false,
    };
  };

  const totalAmount =
    cartItems && Array.isArray(cartItems)
      ? cartItems.reduce((total, item) => {
          const data = getProductData(item);
          return total + Number(data.price) * Number(data.quantity);
        }, 0)
      : 0;

  const onCheckoutClick = () => {
    if (auth.authenticate) {
      navigate("/checkout");
    } else {
      navigate("/signin", { state: { from: "/cart" } });
    }
  };

  if (loading)
    return (
      <Layout>
        <Box sx={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress sx={{ color: "#6A1B1A" }} />
        </Box>
      </Layout>
    );

  // --- EMPTY STATE ---
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <Layout>
        <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            minHeight: "60vh",
            textAlign: "center"
        }}>
            <ShoppingBagOutlinedIcon sx={{ fontSize: 100, color: "#e0e0e0", mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
                Your cart is currently empty
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mb: 4 }}>
                Looks like you haven't added anything to your cart yet.
            </Typography>
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              size="large"
              sx={{ bgcolor: "#6A1B1A", px: 4, py: 1.5, borderRadius: 50 }}
            >
              Start Shopping
            </Button>
        </Box>
      </Layout>
    );
  }

  // --- MAIN CONTENT ---
  return (
    <Layout>
      <Box sx={{ px: { xs: 2, md: 8 }, py: 4, bgcolor: "#f9f9f9", minHeight: "100vh" }}>
        
        {/* Page Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <IconButton onClick={() => navigate("/")} sx={{ mr: 2 }}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" fontWeight="bold" sx={{ color: "#333" }}>
                Shopping Cart
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ ml: 2, fontWeight: "normal" }}>
                ({cartItems.length} items)
            </Typography>
        </Box>

        <Grid container spacing={4}>
            {/* LEFT COLUMN: Cart Items */}
            <Grid item xs={12} md={8}>
                {cartItems.map((item, index) => {
                    const data = getProductData(item);
                    return (
                        <Card 
                            key={data._id || index} 
                            sx={{ 
                                mb: 2, 
                                borderRadius: 3, 
                                boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                                border: "1px solid rgba(0,0,0,0.05)",
                                overflow: "visible" 
                            }}
                        >
                            <CardContent sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", p: 3 }}>
                                {/* Product Image */}
                                <Box sx={{ 
                                    width: { xs: "100%", sm: "120px" }, 
                                    height: "120px", 
                                    display: "flex", 
                                    justifyContent: "center", 
                                    alignItems: "center",
                                    bgcolor: "#f4f4f4",
                                    borderRadius: 2,
                                    mr: { xs: 0, sm: 3 },
                                    mb: { xs: 2, sm: 0 }
                                }}>
                                    <img 
                                        src={data.image} 
                                        alt={data.name} 
                                        style={{ maxWidth: "80%", maxHeight: "80%", objectFit: "contain" }} 
                                    />
                                </Box>

                                {/* Product Details */}
                                <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
                                    <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                                        {data.name}
                                    </Typography>
                                    <Typography variant="h6" color="#6A1B1A" fontWeight="bold">
                                        ₦{Number(data.price).toLocaleString()}
                                    </Typography>
                                </Box>

                                {/* Quantity & Remove */}
                                <Box sx={{ 
                                    display: "flex", 
                                    flexDirection: { xs: "row", sm: "column" }, 
                                    alignItems: "center", 
                                    justifyContent: "space-between",
                                    mt: { xs: 2, sm: 0 },
                                    width: { xs: "100%", sm: "auto" }
                                }}>
                                    
                                    {/* Capsule Quantity Button */}
                                    <Box sx={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        bgcolor: "#f5f5f5", 
                                        borderRadius: 50, 
                                        px: 1,
                                        mb: { xs: 0, sm: 1 } 
                                    }}>
                                        <IconButton size="small" disabled={data.quantity <= 1} onClick={() => dispatch(decrementQuantity(data._id))}>
                                            <RemoveIcon fontSize="small" />
                                        </IconButton>
                                        <Typography sx={{ mx: 2, fontWeight: "600" }}>{data.quantity}</Typography>
                                        <IconButton size="small" onClick={() => dispatch(incrementQuantity(data._id))}>
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    </Box>

                                    {/* Remove Link */}
                                    <Button 
                                        startIcon={<DeleteOutlineIcon />} 
                                        color="error" 
                                        size="small"
                                        sx={{ textTransform: "none", ml: { xs: "auto", sm: 0 } }}
                                        onClick={() => dispatch(removeCartItem({ productId: data._id }))}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    );
                })}
            </Grid>

            {/* RIGHT COLUMN: Order Summary */}
            <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", position: "sticky", top: 100 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Order Summary
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Typography color="text.secondary">Subtotal</Typography>
                        <Typography fontWeight="600">₦{totalAmount.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                        <Typography color="text.secondary">Delivery</Typography>
                        <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>Calculated at checkout</Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                        <Typography variant="h6" fontWeight="bold">Total</Typography>
                        <Typography variant="h5" fontWeight="bold" color="#6A1B1A">₦{totalAmount.toLocaleString()}</Typography>
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={onCheckoutClick}
                        sx={{ 
                            bgcolor: "#6A1B1A", 
                            py: 1.8, 
                            borderRadius: 2,
                            fontWeight: "bold",
                            fontSize: "1rem",
                            "&:hover": { bgcolor: "#8B2323" }
                        }}
                    >
                        Proceed to Checkout
                    </Button>
                </Paper>
            </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Cart;