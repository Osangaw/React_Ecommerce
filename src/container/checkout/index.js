import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Typography, Button, Divider, 
  Container, Paper, Dialog, DialogTitle, 
  DialogContent, TextField, DialogActions, 
  Avatar, Badge, CircularProgress, 
  Card, CardContent, Step, Stepper, StepLabel, 
  Radio, RadioGroup, IconButton, Tooltip
} from "@mui/material";
import { 
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  EditOutlined as EditIcon, // ✅ Imported Edit Icon
  LocalShippingOutlined as ShippingIcon,
  Payment as PaymentIcon,
  Lock as LockIcon,
  HomeOutlined as HomeIcon,
  PhoneIphone as PhoneIcon,
  Money as MoneyIcon,
  CreditCard as CreditCardIcon
} from '@mui/icons-material'; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Layout from '../../components/layout';
import PaystackPayment from '../../components/paystackPayment';

// ✅ Import updateAddress
import { addAddress, deleteAddress, getAddress, updateAddress } from '../../actions/address.Action';
import { getCartItems } from '../../actions/cart.Action';
import { addOrder } from '../../actions/order.Action';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // --- REDUX STATE ---
  const auth = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const addressState = useSelector((state) => state.address);
  const orderState = useSelector((state) => state.order); 
  
  // --- LOCAL STATE ---
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentOption, setPaymentOption] = useState("card"); 
  const [open, setOpen] = useState(false);
  
  // ✅ New State for Editing Logic
  const [isEditing, setIsEditing] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);

  const [formData, setFormData] = useState({
      name: "", address: "", city: "", phoneNumber: "", postalCode: "", country: "Nigeria"
  });

  // --- 1. INITIALIZATION ---
  useEffect(() => {
    if (!auth.authenticate) {
        navigate("/signin", { state: { from: "/checkout" } });
        return;
    }
    dispatch(getAddress());
    dispatch(getCartItems());
  }, [auth.authenticate, dispatch, navigate]);

  // --- 2. SELECT DEFAULT ADDRESS ---
  useEffect(() => {
    const addresses = addressState.address || [];
    if (!selectedAddressId && addresses.length > 0) {
        setSelectedAddressId(addresses[0]._id);
    }
  }, [addressState.address, selectedAddressId]);

  // --- 3. REDIRECT ON SUCCESS ---
  useEffect(() => {
      if (orderState.placedOrderId) {
          navigate('/orders'); 
      }
  }, [orderState.placedOrderId, navigate]);

  // --- CALCULATIONS ---
  const getProduct = (item) => {
      const product = item.productId || item.product || {};
      return {
          name: product.name || "Unknown Item",
          price: product.price || 0,
          image: product.image || "https://via.placeholder.com/50",
          qty: item.quantity
      };
  };

  const cartItems = cart.cartItems || [];
  const totalAmount = cartItems.reduce((acc, item) => {
      const p = getProduct(item);
      return acc + (p.price * p.qty);
  }, 0);

  // --- HANDLERS ---
  
  // ✅ Open Add Modal (Reset Form)
  const handleOpenAdd = () => {
      setFormData({ name: "", address: "", city: "", phoneNumber: "", postalCode: "", country: "Nigeria" });
      setIsEditing(false);
      setEditAddressId(null);
      setOpen(true);
  };

  // ✅ Open Edit Modal (Pre-fill Form)
  const handleOpenEdit = (addr, e) => {
      e.stopPropagation(); // Prevent selecting the card when clicking edit
      setFormData({
          name: addr.name,
          address: addr.address,
          city: addr.city,
          phoneNumber: addr.phoneNumber,
          postalCode: addr.postalCode,
          country: addr.country || "Nigeria"
      });
      setIsEditing(true);
      setEditAddressId(addr._id);
      setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
      setIsEditing(false); // Reset mode on close
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  // ✅ Handle Save (Add or Update)
  const handleSaveAddress = () => {
      if (isEditing) {
          // Dispatch Update Action with ID
          const payload = { ...formData, _id: editAddressId };
          dispatch(updateAddress(payload));
      } else {
          // Dispatch Add Action
          dispatch(addAddress(formData));
      }
      setOpen(false);
  };
  
  const handleDeleteAddress = (id, e) => {
      e.stopPropagation();
      dispatch(deleteAddress({ addressId: id }));
  };

  const onConfirmCOD = () => {
      if (!selectedAddressId) {
          alert("Please select a delivery address.");
          return;
      }
      const payload = {
          addressId: selectedAddressId,
          totalAmount,
          items: cartItems.map(item => {
             const product = item.productId || item.product;
             return {
                productId: product._id,
                payablePrice: product.price, 
                purchasedQty: item.quantity
             }
          }),
          paymentType: "cod",
          paymentStatus: "pending"
      };
      dispatch(addOrder(payload));
  };

  const onPaystackSuccess = (reference) => {
      console.log("Paystack Success Response:", reference);

      if (!selectedAddressId) {
          alert("Please select a delivery address.");
          return;
      }

      const refString = reference.reference || reference;

      if (!refString) {
          alert("Payment failed: Could not retrieve transaction reference.");
          return;
      }

      const payload = {
          addressId: selectedAddressId,
          totalAmount,
          items: cartItems.map(item => {
             const product = item.productId || item.product;
             return {
                productId: product._id,
                payablePrice: product.price,
                purchasedQty: item.quantity
             }
          }),
          paymentType: "card",
          paymentInfo: {
              reference: refString,
              status: "success"
          }
      };
      dispatch(addOrder(payload));
  };

  if (addressState.loading || orderState.loading) {
      return (
         <Layout>
             <Box sx={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress sx={{ color: '#6A1B1A' }} />
             </Box>
         </Layout>
      );
  }

  const steps = ['Shipping', 'Payment', 'Review'];

  return (
    <Layout>
        <Box sx={{ minHeight: '100vh', bgcolor: '#F4F7F9', pb: 8, pt: 4 }}>
            <Container maxWidth="lg">
                
                {/* STEPPER */}
                <Box sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
                    <Stepper activeStep={1} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel StepIconProps={{ sx: { '&.Mui-active': { color: '#6A1B1A' }, '&.Mui-completed': { color: '#2E7D32' } } }}>
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                <Grid container spacing={4}>
                    
                    {/* LEFT COLUMN: ADDRESS & PAYMENT SELECTION */}
                    <Grid item xs={12} md={8}>
                        
                        {/* 1. SHIPPING ADDRESS */}
                        <Typography variant="h6" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#333', mb: 3 }}>
                            <ShippingIcon sx={{ color: '#6A1B1A' }} /> Shipping Address
                        </Typography>

                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            {(addressState.address || []).map((addr) => {
                                const isSelected = selectedAddressId === addr._id;
                                return (
                                    <Grid item xs={12} sm={6} key={addr._id}>
                                        <Paper
                                            elevation={isSelected ? 3 : 0}
                                            onClick={() => setSelectedAddressId(addr._id)}
                                            sx={{ 
                                                p: 2.5, cursor: 'pointer', borderRadius: 3,
                                                border: isSelected ? '2px solid #6A1B1A' : '1px solid #E0E0E0',
                                                bgcolor: isSelected ? 'rgba(106, 27, 26, 0.03)' : 'white',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: isSelected ? '#6A1B1A' : '#F5F5F5', color: isSelected ? 'white' : '#999' }}>
                                                    <HomeIcon fontSize="small" />
                                                </Avatar>
                                                <Typography fontWeight="bold" variant="subtitle1" color="#333">{addr.name || "Home"}</Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                {addr.address}, {addr.city}, {addr.state}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PhoneIcon sx={{ fontSize: 16, color: '#999' }} />
                                                <Typography variant="body2" fontWeight="600">{addr.phoneNumber}</Typography>
                                            </Box>
                                            
                                            {/* ✅ EDIT & DELETE BUTTONS */}
                                            <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed #EEE', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                
                                                {/* Edit Button */}
                                                <Tooltip title="Edit Address">
                                                    <IconButton size="small" onClick={(e) => handleOpenEdit(addr, e)}>
                                                        <EditIcon fontSize="small" sx={{ color: '#1976D2' }} />
                                                    </IconButton>
                                                </Tooltip>

                                                {/* Delete Button */}
                                                <Tooltip title="Delete Address">
                                                    <IconButton size="small" onClick={(e) => handleDeleteAddress(addr._id, e)}>
                                                        <DeleteIcon fontSize="small" sx={{ color: '#D32F2F' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                )
                            })}
                            
                            {/* ADD BUTTON CARD */}
                            <Grid item xs={12} sm={6}>
                                <Button onClick={handleOpenAdd} sx={{ height: '100%', width: '100%', minHeight: '180px', border: '2px dashed #CFD8DC', borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 1, color: '#78909C', bgcolor: '#FAFAFA', textTransform: 'none' }}>
                                    <AddIcon sx={{ fontSize: 40 }} />
                                    <Typography fontWeight="bold">Add New Address</Typography>
                                </Button>
                            </Grid>
                        </Grid>

                        {/* 2. PAYMENT METHOD SELECTION */}
                        <Typography variant="h6" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#333', mb: 2 }}>
                            <PaymentIcon sx={{ color: '#6A1B1A' }} /> Payment Method
                        </Typography>

                        <Paper sx={{ p: 0, borderRadius: 3, border: '1px solid #E0E0E0', overflow: 'hidden' }}>
                            <RadioGroup 
                                name="paymentMethod" 
                                value={paymentOption} 
                                onChange={(e) => setPaymentOption(e.target.value)}
                            >
                                {/* Card Option */}
                                <Box 
                                    onClick={() => setPaymentOption("card")}
                                    sx={{ 
                                        p: 2, cursor: 'pointer', borderBottom: '1px solid #E0E0E0',
                                        bgcolor: paymentOption === 'card' ? 'rgba(106, 27, 26, 0.04)' : 'white',
                                        display: 'flex', alignItems: 'center', transition: 'all 0.2s'
                                    }}
                                >
                                    <Radio checked={paymentOption === 'card'} value="card" sx={{ color: '#6A1B1A', '&.Mui-checked': { color: '#6A1B1A' } }} />
                                    <Box sx={{ ml: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CreditCardIcon color="primary" />
                                        <Box>
                                            <Typography fontWeight="bold">Pay with Card (Paystack)</Typography>
                                            <Typography variant="caption" color="text.secondary">Secure online payment</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* COD Option */}
                                <Box 
                                    onClick={() => setPaymentOption("cod")}
                                    sx={{ 
                                        p: 2, cursor: 'pointer',
                                        bgcolor: paymentOption === 'cod' ? 'rgba(106, 27, 26, 0.04)' : 'white',
                                        display: 'flex', alignItems: 'center', transition: 'all 0.2s'
                                    }}
                                >
                                    <Radio checked={paymentOption === 'cod'} value="cod" sx={{ color: '#6A1B1A', '&.Mui-checked': { color: '#6A1B1A' } }} />
                                    <Box sx={{ ml: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <MoneyIcon color="success" />
                                        <Box>
                                            <Typography fontWeight="bold">Cash on Delivery</Typography>
                                            <Typography variant="caption" color="text.secondary">Pay when you receive</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </RadioGroup>
                        </Paper>

                    </Grid>

                    {/* RIGHT COLUMN: SUMMARY & ACTION */}
                    <Grid item xs={12} md={4}>
                        <Card elevation={0} sx={{ borderRadius: 4, position: 'sticky', top: 100, border: '1px solid #E0E0E0', bgcolor: 'white' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <LockIcon sx={{ fontSize: 18, color: '#2E7D32' }} />
                                    <Typography variant="h6" fontWeight="bold">Order Summary</Typography>
                                </Box>
                                
                                <Box sx={{ bgcolor: '#F9FAFB', p: 2, borderRadius: 2, mb: 2, maxHeight: 300, overflowY: 'auto' }}>
                                    {cartItems.map((item, index) => {
                                        const p = getProduct(item);
                                        return (
                                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, fontSize: '0.9rem' }}>
                                                <Box sx={{ display: 'flex', gap: 1.5 }}>
                                                    <Badge badgeContent={p.qty} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}>
                                                        <Avatar src={p.image} variant="rounded" sx={{ width: 40, height: 40, border: '1px solid #eee' }} />
                                                    </Badge>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="600" sx={{ maxWidth: 120 }} noWrap>{p.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">QTY: {p.qty}</Typography>
                                                    </Box>
                                                </Box>
                                                <Typography variant="body2" fontWeight="bold">₦{(p.price * p.qty).toLocaleString()}</Typography>
                                            </Box>
                                        )
                                    })}
                                </Box>

                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, pt: 2 }}>
                                    <Typography variant="h6" fontWeight="800">Total</Typography>
                                    <Typography variant="h5" fontWeight="800" color="#6A1B1A">₦{totalAmount.toLocaleString()}</Typography>
                                </Box>

                                {paymentOption === 'card' ? (
                                    <Box>
                                        <PaystackPayment 
                                            totalAmount={totalAmount} 
                                            email={auth.user?.email} 
                                            onSuccess={onPaystackSuccess} 
                                        />
                                        <Typography variant="caption" align="center" display="block" sx={{ mt: 1, color: '#999' }}>
                                            Secured by Paystack
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        onClick={onConfirmCOD}
                                        sx={{ bgcolor: '#2E7D32', fontWeight: 'bold', py: 1.5, '&:hover': { bgcolor: '#1B5E20' } }}
                                    >
                                        Confirm COD Order
                                    </Button>
                                )}

                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
            </Container>

            {/* DIALOG: ADD / EDIT ADDRESS */}
            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
                <DialogTitle fontWeight="800" sx={{ pb: 1 }}>
                    {isEditing ? "Edit Address" : "Add New Address"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField label="Label (e.g. Home)" name="name" fullWidth size="small" value={formData.name} onChange={handleChange} />
                        <TextField label="Full Address" name="address" fullWidth multiline rows={2} size="small" value={formData.address} onChange={handleChange} />
                        <Grid container spacing={2}>
                            <Grid item xs={6}><TextField label="City" name="city" fullWidth size="small" value={formData.city} onChange={handleChange} /></Grid>
                            <Grid item xs={6}><TextField label="Postal Code" name="postalCode" fullWidth size="small" value={formData.postalCode} onChange={handleChange} /></Grid>
                        </Grid>
                        <TextField label="Phone Number" name="phoneNumber" fullWidth size="small" value={formData.phoneNumber} onChange={handleChange} />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={handleClose} sx={{ color: '#666' }}>Cancel</Button>
                    <Button onClick={handleSaveAddress} variant="contained" sx={{ bgcolor: '#6A1B1A', '&:hover': { bgcolor: '#8B2323' } }}>
                        {isEditing ? "Update Address" : "Save Address"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    </Layout>
  );
};

export default Checkout;