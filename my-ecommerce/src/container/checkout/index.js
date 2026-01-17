import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Typography, Button, Divider, 
  Container, Paper, Dialog, DialogTitle, 
  DialogContent, TextField, DialogActions, 
  Avatar, Badge, CircularProgress, 
  Card, CardContent, Step, Stepper, StepLabel, 
  Radio, alpha
} from "@mui/material";
import { 
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  LocalShippingOutlined as ShippingIcon,
  ArrowBackIosNew as ArrowBackIcon,
  PersonOutline as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Payment as PaymentIcon,
  Lock as LockIcon
} from '@mui/icons-material'; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PaystackPayment from '../../components/paystackPayment';
import { addAddress, deleteAddress, getAddress } from '../../actions/address.Action';
import { getCartItems } from '../../actions/cart.Action';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // --- REDUX STATE ---
  const auth = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const addressState = useSelector((state) => state.address);
  
  // --- LOCAL STATE ---
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
      name: "", address: "", city: "", phoneNumber: "", postalCode: "", country: "Nigeria"
  });

  // --- INITIALIZATION ---
  useEffect(() => {
    if (!auth.authenticate) {
        navigate("/signin", { state: { from: "/checkout" } });
        return;
    }
    dispatch(getAddress());
    dispatch(getCartItems());
  }, [auth.authenticate, dispatch, navigate]);

  useEffect(() => {
    const addresses = addressState.address || [];
    if (!selectedAddressId && addresses.length > 0) {
        setSelectedAddressId(addresses[0]._id);
    }
  }, [addressState.address, selectedAddressId]);

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
  const handleOpenAdd = () => {
      setFormData({ name: "", address: "", city: "", phoneNumber: "", postalCode: "", country: "Nigeria" });
      setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSaveAddress = () => {
      dispatch(addAddress(formData));
      setOpen(false);
  };
  const handleDeleteAddress = (id, e) => {
      e.stopPropagation();
      dispatch(deleteAddress({ addressId: id }));
  };

  if (addressState.loading) {
      return (
         <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: '#6A1B1A' }} />
         </Box>
      );
  }

  const steps = ['Shipping', 'Review', 'Payment'];

  return (
    // ❌ NO LAYOUT WRAPPER HERE
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8F9FA', pb: 8 }}>
        
        {/* CHECKOUT HEADER (Replaces Global Header) */}
        <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #EAEAEA', py: 2, mb: 4, position: 'sticky', top: 0, zIndex: 10 }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    
                    {/* Brand / Logo Area */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                         {/* Optional: Add your Logo Image Here */}
                        <Typography variant="h5" sx={{ fontFamily: 'cursive', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/')}>
                            MyStore
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center' }} />
                        <Typography variant="subtitle1" color="text.secondary">Checkout</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LockIcon sx={{ fontSize: 16, color: '#2E7D32' }} />
                        <Typography variant="caption" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                            SECURE PAYMENT
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>

        <Container maxWidth="lg">
            
            {/* STEPPER */}
            <Box sx={{ mb: 5, maxWidth: 600, mx: 'auto' }}>
                <Stepper activeStep={0} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel StepIconProps={{
                                sx: { '&.Mui-active': { color: '#6A1B1A' }, '&.Mui-completed': { color: '#2E7D32' } }
                            }}>
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            <Grid container spacing={4}>
                
                {/* LEFT COLUMN: ADDRESS SELECTION */}
                <Grid item xs={12} md={8}>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                         <Typography variant="h5" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ShippingIcon color="primary" sx={{ color: '#6A1B1A' }} /> Shipping Address
                        </Typography>
                        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/cart')} sx={{ textTransform: 'none' }}>
                            Back to Cart
                        </Button>
                    </Box>

                    <Grid container spacing={2}>
                        {/* MAP ADDRESSES */}
                        {(addressState.address || []).map((addr) => {
                            const isSelected = selectedAddressId === addr._id;
                            return (
                                <Grid item xs={12} sm={6} key={addr._id}>
                                    <Paper
                                        elevation={isSelected ? 4 : 0}
                                        onClick={() => setSelectedAddressId(addr._id)}
                                        sx={{ 
                                            p: 2, 
                                            cursor: 'pointer',
                                            borderRadius: 3,
                                            border: isSelected ? '2px solid #6A1B1A' : '1px solid #E0E0E0',
                                            bgcolor: isSelected ? alpha('#6A1B1A', 0.04) : 'white',
                                            transition: 'all 0.2s',
                                            height: '100%',
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Avatar sx={{ width: 24, height: 24, bgcolor: isSelected ? '#6A1B1A' : '#EEE' }}>
                                                        <PersonIcon sx={{ fontSize: 16, color: isSelected ? 'white' : '#999' }} />
                                                    </Avatar>
                                                    <Typography fontWeight="bold">{addr.name}</Typography>
                                                </Box>
                                                <Radio 
                                                    checked={isSelected} 
                                                    sx={{ p: 0, color: '#DDD', '&.Mui-checked': { color: '#6A1B1A' } }} 
                                                />
                                            </Box>
                                            
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, lineHeight: 1.6 }}>
                                                {addr.address}, {addr.city}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" fontWeight="500">
                                                {addr.phoneNumber}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #EEE', display: 'flex', justifyContent: 'space-between' }}>
                                            {isSelected && 
                                                <Typography variant="caption" sx={{ color: '#6A1B1A', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <CheckCircleIcon sx={{ fontSize: 14 }} /> SELECTED
                                                </Typography>
                                            }
                                            <Button 
                                                size="small" 
                                                onClick={(e) => handleDeleteAddress(addr._id, e)}
                                                sx={{ minWidth: 0, p: 0, color: '#999', ml: 'auto', '&:hover': { color: '#D32F2F' } }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </Button>
                                        </Box>
                                    </Paper>
                                </Grid>
                            )
                        })}

                        {/* ADD NEW BUTTON */}
                        <Grid item xs={12} sm={6}>
                            <Button
                                onClick={handleOpenAdd}
                                sx={{
                                    height: '100%',
                                    width: '100%',
                                    minHeight: '160px',
                                    border: '2px dashed #DDD',
                                    borderRadius: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    color: '#666',
                                    bgcolor: 'transparent',
                                    '&:hover': { borderColor: '#6A1B1A', color: '#6A1B1A', bgcolor: alpha('#6A1B1A', 0.02) }
                                }}
                            >
                                <AddIcon fontSize="large" />
                                <Typography fontWeight="bold">Add New Address</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                {/* RIGHT COLUMN: SUMMARY */}
                <Grid item xs={12} md={4}>
                    <Card elevation={3} sx={{ borderRadius: 4, position: 'sticky', top: 100, border: '1px solid rgba(0,0,0,0.05)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Order Summary</Typography>
                            
                            <Box sx={{ bgcolor: '#F8F9FA', p: 2, borderRadius: 2, mb: 2, maxHeight: 250, overflowY: 'auto' }}>
                                {cartItems.map((item, index) => {
                                    const p = getProduct(item);
                                    return (
                                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, fontSize: '0.9rem' }}>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Badge badgeContent={p.qty} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: 10, height: 16, minWidth: 16 } }}>
                                                    <Avatar src={p.image} variant="rounded" sx={{ width: 30, height: 30 }} />
                                                </Badge>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="600" sx={{ maxWidth: 140 }} noWrap>{p.name}</Typography>
                                                </Box>
                                            </Box>
                                            <Typography variant="body2" fontWeight="bold">₦{(p.price * p.qty).toLocaleString()}</Typography>
                                        </Box>
                                    )
                                })}
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography color="text.secondary">Subtotal</Typography>
                                <Typography fontWeight="600">₦{totalAmount.toLocaleString()}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography color="text.secondary">Delivery</Typography>
                                <Typography color="success.main" fontWeight="bold">Free</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, pt: 2, borderTop: '2px dashed #EEE' }}>
                                <Typography variant="h6" fontWeight="800">Total</Typography>
                                <Typography variant="h5" fontWeight="800" color="#6A1B1A">₦{totalAmount.toLocaleString()}</Typography>
                            </Box>

                            {/* PAYMENT BUTTON */}
                            <PaystackPayment totalAmount={totalAmount} email={auth.user?.email} />

                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5, color: '#999' }}>
                                <PaymentIcon sx={{ fontSize: 14 }} />
                                <Typography variant="caption" fontWeight="500">Secured by Paystack</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </Container>

        {/* DIALOG: ADD ADDRESS */}
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle fontWeight="bold">New Shipping Address</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField label="Label (e.g. Office)" name="name" fullWidth value={formData.name} onChange={handleChange} />
                    <TextField label="Full Address" name="address" fullWidth multiline rows={2} value={formData.address} onChange={handleChange} />
                    <Grid container spacing={2}>
                        <Grid item xs={6}><TextField label="City" name="city" fullWidth value={formData.city} onChange={handleChange} /></Grid>
                        <Grid item xs={6}><TextField label="Postal Code" name="postalCode" fullWidth value={formData.postalCode} onChange={handleChange} /></Grid>
                    </Grid>
                    <TextField label="Phone Number" name="phoneNumber" fullWidth value={formData.phoneNumber} onChange={handleChange} />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleClose} color="inherit">Cancel</Button>
                <Button onClick={handleSaveAddress} variant="contained" sx={{ bgcolor: '#6A1B1A', fontWeight: 'bold' }}>Save Address</Button>
            </DialogActions>
        </Dialog>
    </Box>
  );
};

export default Checkout;