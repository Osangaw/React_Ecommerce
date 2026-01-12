import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
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
  
  // ✅ 1. Get Auth state to check login status
  const { cartItems, loading } = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth); 

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

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

  // ✅ 2. Handle Checkout Click
  const onCheckoutClick = () => {
    if (auth.authenticate) {
      // User is logged in, proceed
      navigate("/checkout");
    } else {
      // User is NOT logged in, send to signin
      // We pass state so we can redirect them back here after they login
      navigate("/signin", { state: { from: "/cart" } });
    }
  };

  // ✅ 3. Custom Style for Buttons (Hover & Click effect)
  const buttonStyle = {
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      transform: "scale(1.1)", // Grows slightly on hover
    },
    "&:active": {
      transform: "scale(0.9)", // Shrinks slightly on click
    },
  };

  if (loading)
    return (
      <Layout>
        <Box p={5} textAlign="center">
          <CircularProgress />
        </Box>
      </Layout>
    );

  return (
    <Layout>
      <Box sx={{ pb: 5 }}>
        <Typography
          sx={{
            fontFamily: "cursive",
            fontWeight: "bolder",
            fontSize: "40px",
            textAlign: "center",
            mb: 3,
            pt: 3,
          }}
        >
          MY CART
        </Typography>

        {!cartItems || !Array.isArray(cartItems) || cartItems.length === 0 ? (
          <Box textAlign="center" mt={4}>
            <Typography variant="h6">Your cart is empty</Typography>
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              sx={{ mt: 2, bgcolor: "#6A1B1A" }}
            >
              Start Shopping
            </Button>
          </Box>
        ) : (
          cartItems.map((item, index) => {
            const data = getProductData(item);

            return (
              <Box
                key={data._id || index}
                sx={{
                  padding: "20px",
                  backgroundColor: "white",
                  borderRadius: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "0 auto 20px auto",
                  maxWidth: "900px",
                  boxShadow: 1,
                }}
              >
                <img
                  src={data.image || "https://via.placeholder.com/100"}
                  alt={data.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                  }}
                />

                <Box sx={{ flex: 1, ml: 2 }}>
                  <Typography
                    variant="h6"
                    color={data.isValid ? "textPrimary" : "error"}
                  >
                    {data.name}
                  </Typography>
                  <Typography fontWeight="bold" color="green">
                    ₦{Number(data.price).toLocaleString()}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    p: 0.5, // Added a little padding container
                  }}
                >
                  <IconButton
                    disabled={data.quantity <= 1}
                    onClick={() => dispatch(decrementQuantity(data._id))}
                    sx={buttonStyle} // ✅ Applied styles
                  >
                    <RemoveIcon />
                  </IconButton>
                  
                  <Typography sx={{ mx: 2, fontWeight: "bold" }}>
                    {data.quantity}
                  </Typography>

                  <IconButton
                    disabled={!data.isValid}
                    onClick={() => dispatch(incrementQuantity(data._id))}
                    sx={buttonStyle} // ✅ Applied styles
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                <IconButton
                  onClick={() =>
                    dispatch(removeCartItem({ productId: data._id }))
                  }
                  sx={{
                    ml: 2,
                    "&:hover": { backgroundColor: "#ffebee" }, // Red hover for delete
                  }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            );
          })
        )}

        {cartItems && Array.isArray(cartItems) && cartItems.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              sx={{ bgcolor: "#6A1B1A" }}
              onClick={onCheckoutClick} // ✅ Updated logic here
            >
              Checkout (₦{totalAmount.toLocaleString()})
            </Button>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default Cart;