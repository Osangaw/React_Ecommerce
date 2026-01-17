import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Typography, Button, Divider, 
  Container, Paper, Dialog, DialogTitle, 
  DialogContent, TextField, DialogActions, 
  Avatar, Badge, CircularProgress, 
  Card, CardContent, Step, Stepper, StepLabel, 
  Radio, alpha, IconButton, Tooltip
} from "@mui/material";
import { 
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  LocalShippingOutlined as ShippingIcon,
  ArrowBackIosNew as ArrowBackIcon,
  PersonOutline as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Payment as PaymentIcon,
  Lock as LockIcon,
  Logout as LogoutIcon, // Imported Logout Icon
  HomeOutlined as HomeIcon,
  PhoneIphone as PhoneIcon
} from '@mui/icons-material'; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PaystackPayment from '../../components/paystackPayment';
import { addAddress, deleteAddress, getAddress } from '../../actions/address.Action';
import { getCartItems } from '../../actions/cart.Action';
import { signout } from '../../actions/auth.action'; // Import Signout Action

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
  const handleLogout = () => {
      dispatch(signout());
      navigate('/signin');
  };

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
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F7F9', pb: 8 }}>
        
        {/* --- HEADER --- */}
        <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #EAEAEA', py: 2, mb: 4, position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    
                    {/* Brand Area */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h5" sx={{ fontFamily: 'cursive', fontWeight: 'bold', cursor: 'pointer', color: '#333' }} onClick={() => navigate('/')}>
                            MyStore
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center', borderColor: '#ccc' }} />
                        <Typography variant="subtitle1" fontWeight="500" color="text.secondary">Checkout</Typography>
                    </Box>
                    
                    {/* Logout Button */}
                    <Button 
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                        sx={{ 
                            color: '#666', 
                            textTransform: 'none', 
                            fontWeight: 600,
                            '&:hover': { color: '#d32f2f', bgcolor: 'transparent' }
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Container>
        </Box>

        <Container maxWidth="lg">
            
            {/* STEPPER */}
            <Box sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
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
                         <Typography variant="h6" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#333' }}>
                            <ShippingIcon sx={{ color: '#6A1B1A' }} /> Shipping Address
                        </Typography>
                        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/cart')} sx={{ textTransform: 'none', color: '#555' }}>
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
                                        elevation={isSelected ? 3 : 0}
                                        onClick={() => setSelectedAddressId(addr._id)}
                                        sx={{ 
                                            p: 2.5, 
                                            cursor: 'pointer',
                                            borderRadius: 3,
                                            // ✅ NEW VISUAL STYLE FOR CARDS
                                            border: isSelected ? '2px solid #6A1B1A' : '1px solid #E0E0E0',
                                            bgcolor: isSelected ? alpha('#6A1B1A', 0.03) : 'white',
                                            transition: 'all 0.3s ease',
                                            height: '100%',
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                borderColor: isSelected ? '#6A1B1A' : '#bbb'
                                            }
                                        }}
                                    >
                                        {/* SELECTED BADGE */}
                                        {isSelected && (
                                            <Box sx={{ position: 'absolute', top: 12, right: 12, color: '#6A1B1A' }}>
                                                <CheckCircleIcon />
                                            </Box>
                                        )}

                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: isSelected ? '#6A1B1A' : '#F5F5F5', color: isSelected ? 'white' : '#999' }}>
                                                    <HomeIcon fontSize="small" />
                                                </Avatar>
                                                <Typography fontWeight="bold" variant="subtitle1" color="#333">
                                                    {addr.name || "Home"}
                                                </Typography>
                                            </Box>
                                            
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6, minHeight: '40px' }}>
                                                {addr.address}, {addr.city}, <br/>
                                                {addr.state} {addr.postalCode}
                                            </Typography>
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                <PhoneIcon sx={{ fontSize: 16, color: '#999' }} />
                                                <Typography variant="body2" fontWeight="600" color="text.primary">
                                                    {addr.phoneNumber}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* ACTIONS */}
                                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #EEE', display: 'flex', justifyContent: 'flex-end' }}>
                                            <Tooltip title="Delete Address">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={(e) => handleDeleteAddress(addr._id, e)}
                                                    sx={{ color: '#aaa', '&:hover': { color: '#D32F2F', bgcolor: '#ffebee' } }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
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
                                    minHeight: '210px',
                                    border: '2px dashed #CFD8DC',
                                    borderRadius: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1.5,
                                    color: '#78909C',
                                    bgcolor: '#FAFAFA',
                                    textTransform: 'none',
                                    transition: 'all 0.2s',
                                    '&:hover': { 
                                        borderColor: '#6A1B1A', 
                                        color: '#6A1B1A', 
                                        bgcolor: 'white',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
                                    }
                                }}
                            >
                                <AddIcon sx={{ fontSize: 40 }} />
                                <Typography fontWeight="bold">Add New Address</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                {/* RIGHT COLUMN: SUMMARY */}
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

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography color="text.secondary" variant="body2">Subtotal</Typography>
                                <Typography fontWeight="600">₦{totalAmount.toLocaleString()}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography color="text.secondary" variant="body2">Delivery Fee</Typography>
                                <Typography color="success.main" fontWeight="bold" fontSize="0.9rem">Free</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, pt: 2, borderTop: '2px dashed #E0E0E0' }}>
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
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
            <DialogTitle fontWeight="800" sx={{ pb: 1 }}>Add New Address</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Please enter your delivery details below.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Label (e.g. Home, Office)" name="name" fullWidth size="small" value={formData.name} onChange={handleChange} />
                    <TextField label="Full Address" name="address" fullWidth multiline rows={2} size="small" value={formData.address} onChange={handleChange} />
                    <Grid container spacing={2}>
                        <Grid item xs={6}><TextField label="City" name="city" fullWidth size="small" value={formData.city} onChange={handleChange} /></Grid>
                        <Grid item xs={6}><TextField label="Postal Code" name="postalCode" fullWidth size="small" value={formData.postalCode} onChange={handleChange} /></Grid>
                    </Grid>
                    <TextField label="Phone Number" name="phoneNumber" fullWidth size="small" value={formData.phoneNumber} onChange={handleChange} />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={handleClose} sx={{ color: '#666', fontWeight: 600 }}>Cancel</Button>
                <Button onClick={handleSaveAddress} variant="contained" sx={{ bgcolor: '#6A1B1A', fontWeight: 'bold', px: 3, '&:hover': { bgcolor: '#8B2323' } }}>
                    Save Address
                </Button>
            </DialogActions>
        </Dialog>
    </Box>
  );
};

export default Checkout;