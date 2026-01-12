import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Typography, Button, Divider, 
  Container, Paper, Dialog, DialogTitle, 
  DialogContent, TextField, DialogActions, 
  Avatar, Badge, Stepper, Step, StepLabel, IconButton, Tooltip, CircularProgress 
} from "@mui/material";
import { 
  Edit as EditIcon, 
  DeleteOutline as DeleteIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioIcon,
  PhoneAndroid as PhoneIcon,
  ShoppingCartOutlined as CartIcon,
  LocalShippingOutlined as ShippingIcon,
  ArrowBackIosNew as ArrowBackIcon,
  Logout as LogoutIcon
} from '@mui/icons-material'; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PaystackPayment from '../../components/paystackPayment';
import { addAddress, deleteAddress, getAddress } from '../../actions/address.Action';
import { signout } from '../../actions/auth.action';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const addressState = useSelector((state) => state.address);
  
  // --- STATE ---
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  
  // Matched to your Backend Schema
  const [formData, setFormData] = useState({
      name: "", 
      address: "", 
      city: "", 
      phoneNumber: "",
      postalCode: "",
      country: "Nigeria"
  });

  useEffect(() => {
    if (auth.authenticate) {
        dispatch(getAddress());
    }
  }, [auth.authenticate, dispatch]);

  useEffect(() => {
    const addresses = addressState.address || [];
    if (!selectedAddressId && addresses.length > 0) {
        setSelectedAddressId(addresses[0]._id);
    }
  }, [addressState.address, selectedAddressId]);


  const cartItems = cart.cartItems || [];
  
  const getProduct = (item) => {
      const product = item.productId || item.product || {};
      return {
          name: product.name || "Unknown Item",
          price: product.price || 0,
          image: product.image || "https://via.placeholder.com/50",
          qty: item.quantity
      };
  };

  const subtotal = cartItems.reduce((acc, item) => {
      const p = getProduct(item);
      return acc + (p.price * p.qty);
  }, 0);
  
  const total = subtotal;

  // --- HANDLERS ---
  const handleLogout = () => {
    dispatch(signout());
    navigate('/signin');
  };

  const handleOpenAdd = () => {
      setFormData({ name: "", address: "", city: "", phoneNumber: "", postalCode: "", country: "Nigeria" });
      setIsEditing(false);
      setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- 3. SAVE ADDRESS (MATCHING BACKEND) ---
  const handleSave = () => {
      // Backend expects: { name, phoneNumber, address, city, postalCode, country }
      const payload = { ...formData };

      if (isEditing) {
          // You need an update API endpoint for this. 
          // For now, we console log.
          console.log("Update logic not implemented in backend snippet yet");
      } else {
          dispatch(addAddress(payload));
      }
      setOpen(false);
  };

  // --- 4. DELETE ADDRESS ---
  const handleDelete = (id, e) => {
      e.stopPropagation();
      // Assuming your delete endpoint expects { addressId: "..." } or { payload: { addressId } }
      // Check your delete controller. Usually it's:
      const payload = { addressId: id }; 
      dispatch(deleteAddress(payload));
  };

  const steps = ['Shipping Address', 'Payment', 'Order Complete'];
  // Safety check with ?. in case address is null
  const addresses = addressState?.address || [];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F4F7F9', pb: 8 }}>
      
      {/* HEADER */}
      <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #e0e0e0', py: 2, mb: 4, position: 'sticky', top: 0, zIndex: 100 }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center">
             <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ textTransform: 'none', fontWeight: 600, color: '#333' }}>
                Back to Store
             </Button>

             <Box display="flex" alignItems="center" gap={1}>
                <Tooltip title="View Cart">
                  <IconButton onClick={() => navigate('/cart')}>
                    <Badge badgeContent={cartItems.length} color="error"><CartIcon color="action" /></Badge>
                  </IconButton>
                </Tooltip>
                <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: 'center' }} />
                <Tooltip title="Logout">
                  <IconButton onClick={handleLogout}><LogoutIcon color="action" /></IconButton>
                </Tooltip>
             </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg"> 
        
        {/* STEPPER */}
        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'center' }}>
           <Paper elevation={0} sx={{ p: 2, borderRadius: 3, width: '100%', maxWidth: '800px', bgcolor: 'transparent' }}>
              <Stepper activeStep={0} alternativeLabel sx={{
                  '& .MuiStepLabel-label': { fontWeight: 600, mt: 1 },
                  '& .MuiStepIcon-root': { fontSize: 28 },
                  '& .MuiStepIcon-root.Mui-active': { color: '#1976d2' },
                  '& .MuiStepIcon-root.Mui-completed': { color: '#2e7d32' },
              }}>
                {steps.map((label) => (
                  <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
              </Stepper>
           </Paper>
        </Box>

        <Grid container spacing={4}>
          
          {/* LEFT COLUMN: SHIPPING ADDRESSES */}
          <Grid item xs={12} md={7}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }} variant="rounded"><ShippingIcon /></Avatar>
                <Typography variant="h5" fontWeight="800" color="#333">Select Address</Typography>
            </Box>

            {/* LOADING STATE */}
            {addressState.loading && <Box textAlign="center" py={4}><CircularProgress /></Box>}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr._id;
                  return (
                      <Paper
                          key={addr._id}
                          onClick={() => setSelectedAddressId(addr._id)}
                          elevation={isSelected ? 4 : 0}
                          sx={{
                              p: 3,
                              cursor: 'pointer',
                              borderRadius: 3,
                              border: isSelected ? '2px solid #1976d2' : '1px solid #E0E0E0',
                              bgcolor: '#fff',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'flex-start',
                              position: 'relative',
                              '&:hover': { borderColor: isSelected ? '#1976d2' : '#BDBDBD' }
                          }}
                      >
                          <Box sx={{ mt: 0.5, mr: 2 }}>
                              {isSelected ? <CheckCircleIcon color="primary" sx={{ fontSize: 28 }} /> : <RadioIcon sx={{ color: '#ccc', fontSize: 28 }} />}
                          </Box>

                          <Box sx={{ flex: 1 }}>
                              <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                                  <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>{addr.name || "My Address"}</Typography>
                                  {isSelected && <Box component="span" sx={{ bgcolor: '#e3f2fd', color: '#1976d2', px: 1, py: 0.2, borderRadius: 1, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Selected</Box>}
                              </Box>
                              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>{addr.address}, {addr.city}</Typography>
                              <Box display="flex" alignItems="center" gap={1}>
                                  <PhoneIcon sx={{ fontSize: 16, color: '#666' }} />
                                  <Typography variant="body2" fontWeight="600" color="text.primary">{addr.phoneNumber}</Typography>
                              </Box>
                          </Box>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                              <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={(e) => handleDelete(addr._id, e)} sx={{ textTransform: 'none', fontWeight: 600 }}>Remove</Button>
                          </Box>
                      </Paper>
                  );
              })}

              {/* Only show Add button if < 2 addresses */}
              {addresses.length < 2 && (
                  <Button onClick={handleOpenAdd} fullWidth startIcon={<AddIcon />} sx={{ py: 3, border: '2px dashed #cfd8dc', borderRadius: 3, color: '#607d8b', fontWeight: 700, textTransform: 'none', bgcolor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#1976d2', color: '#1976d2', bgcolor: '#fff' }}}>
                      Add New Address
                  </Button>
              )}
            </Box>
          </Grid>

          {/* RIGHT COLUMN: SUMMARY */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #E0E0E0' }}>
                 <Box sx={{ p: 3, bgcolor: '#FAFAFA', borderBottom: '1px solid #EEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">Order Summary</Typography>
                    <Badge badgeContent={cartItems.length} color="primary" showZero><CartIcon color="action" /></Badge>
                 </Box>
                 
                 <Box sx={{ p: 3, maxHeight: '400px', overflowY: 'auto' }}>
                     {cartItems.map((item, index) => {
                         const product = getProduct(item);
                         return (
                             <Box key={index} display="flex" alignItems="center" mb={2.5}>
                                 <Avatar src={product.image} variant="rounded" sx={{ width: 64, height: 64, mr: 2, bgcolor: '#fff', border: '1px solid #eee' }} />
                                 <Box flex={1}>
                                     <Typography variant="body2" fontWeight="700" sx={{ lineHeight: 1.3, mb: 0.5 }}>{product.name}</Typography>
                                     <Typography variant="caption" color="text.secondary">Qty: {product.qty}</Typography>
                                 </Box>
                                 <Typography variant="body1" fontWeight="700">₦{(product.price * product.qty).toLocaleString()}</Typography>
                             </Box>
                         )
                     })}
                     {cartItems.length === 0 && <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ py: 2 }}>Cart is empty.</Typography>}
                 </Box>
                 
                 <Divider />
                 <Box sx={{ p: 3.5, bgcolor: '#fff' }}>
                    <Box display="flex" justifyContent="space-between" mb={1.5}>
                        <Typography variant="body1" color="text.secondary">Subtotal</Typography>
                        <Typography variant="body1" fontWeight="600">₦{subtotal.toLocaleString()}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={2.5}>
                        <Typography variant="body1" color="text.secondary">Delivery Fee</Typography>
                        <Typography variant="body1" fontWeight="700" color="success.main">Free</Typography>
                    </Box>
                    <Divider sx={{ mb: 2.5, borderStyle: 'dashed' }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h6" fontWeight="bold">Total Amount</Typography>
                        <Typography variant="h4" fontWeight="800" color="primary">₦{total.toLocaleString()}</Typography>
                    </Box>
                    
                    <PaystackPayment totalAmount={total} email="test@test.com" />
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}><Typography variant="caption" color="text.disabled">🔒 Payment secured by Paystack</Typography></Box>
                 </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* POPUP FORM */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3, p: 1 }}}>
          <DialogTitle sx={{ fontWeight: 800 }}>{isEditing ? "Edit Details" : "New Address"}</DialogTitle>
          <DialogContent>
              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField label="Label (e.g. Home)" name="name" size="small" fullWidth value={formData.name} onChange={handleChange} />
                  <TextField label="Address" name="address" size="small" fullWidth multiline rows={2} value={formData.address} onChange={handleChange} />
                  <TextField label="City" name="city" size="small" fullWidth value={formData.city} onChange={handleChange} />
                  <TextField label="Phone" name="phoneNumber" size="small" fullWidth value={formData.phoneNumber} onChange={handleChange} />
                  <TextField label="Postal Code" name="postalCode" size="small" fullWidth value={formData.postalCode} onChange={handleChange} />
              </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
              <Button onClick={handleSave} variant="contained" disableElevation sx={{ fontWeight: 600, px: 4, borderRadius: 2 }}>Save</Button>
          </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Checkout;