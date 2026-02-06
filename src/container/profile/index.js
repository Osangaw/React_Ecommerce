import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAddress, addAddress, deleteAddress } from "../../actions/address.Action";
import { getOrders } from "../../actions/order.Action"; 
import Layout from "../../components/layout";
import { 
  Box, Typography, Paper, Grid, TextField, Button, 
  Avatar, Divider, Chip, IconButton, CircularProgress, Container 
} from "@mui/material";
import { 
    Person, LocationOn, Add, Delete, Home, Work, Phone, 
    LocalPostOffice, ShoppingBag, ChevronRight, LocalShipping 
} from "@mui/icons-material";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  
  const auth = useSelector((state) => state.auth);
  const userAddress = useSelector((state) => state.address);
  const orderState = useSelector((state) => state.order); 
  
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [locality, setLocality] = useState("");
  const [address, setAddress] = useState("");
  const [cityDistrictTown, setCityDistrictTown] = useState("");
  const [state, setState] = useState("");
  const [landmark, setLandmark] = useState("");
  const [addressType, setAddressType] = useState("home");


  useEffect(() => {
    if(auth.authenticate){
        dispatch(getAddress());
        dispatch(getOrders()); 
    }
  }, [auth.authenticate, dispatch]);

  const onAddressSubmit = () => {
    const payload = {
      address: {
        name, mobileNumber, pinCode, locality, address, 
        cityDistrictTown, state, landmark, addressType,
      },
    };
    dispatch(addAddress(payload));
    setShowAddressForm(false);
    setName(""); setMobileNumber(""); setPinCode(""); setLocality(""); 
    setAddress(""); setCityDistrictTown(""); setState(""); setLandmark("");
  };

  const handleDelete = (addressId) => {
      const payload = { addressId };
      dispatch(deleteAddress(payload));
  };

  const renderAddressForm = () => (
    <Paper elevation={0} sx={{ p: 4, mb: 4, border: '1px solid #e0e0e0', borderRadius: 3, bgcolor: '#fff' }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#6A1B1A' }}>
          Add New Delivery Address
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField label="Full Name" fullWidth variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Mobile Number" fullWidth variant="outlined" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Pincode" fullWidth variant="outlined" value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Locality" fullWidth variant="outlined" value={locality} onChange={(e) => setLocality(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Address (Area and Street)" fullWidth multiline rows={3} variant="outlined" value={address} onChange={(e) => setAddress(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField label="City/District/Town" fullWidth variant="outlined" value={cityDistrictTown} onChange={(e) => setCityDistrictTown(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField label="State" fullWidth variant="outlined" value={state} onChange={(e) => setState(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField label="Landmark (Optional)" fullWidth variant="outlined" value={landmark} onChange={(e) => setLandmark(e.target.value)} />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#555' }}>Address Type</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip 
                icon={<Home fontSize="small" />}
                label="Home" 
                clickable
                color={addressType === 'home' ? "primary" : "default"} 
                onClick={() => setAddressType('home')} 
                sx={{ px: 1 }}
            />
            <Chip 
                icon={<Work fontSize="small" />}
                label="Work" 
                clickable
                color={addressType === 'work' ? "primary" : "default"} 
                onClick={() => setAddressType('work')} 
                sx={{ px: 1 }}
            />
        </Box>
      </Box>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button 
            variant="contained" 
            size="large"
            onClick={onAddressSubmit} 
            sx={{ bgcolor: '#6A1B1A', px: 4, borderRadius: 2 }}
        >
            Save Address
        </Button>
        <Button 
            variant="text" 
            size="large"
            color="inherit" 
            onClick={() => setShowAddressForm(false)}
        >
            Cancel
        </Button>
      </Box>
    </Paper>
  );

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        
        {/* --- 1. PROFILE HEADER CARD --- */}
        <Paper 
            elevation={0} 
            sx={{ 
                borderRadius: 4, 
                overflow: 'hidden', 
                border: '1px solid #e0e0e0',
                mb: 4 
            }}
        >
            <Box sx={{ 
                height: 120, 
                background: 'linear-gradient(90deg, #6A1B1A 0%, #a04040 100%)' 
            }} />
            
            <Box sx={{ px: 4, pb: 4, mt: -6, display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
                <Avatar 
                    sx={{ 
                        width: 120, 
                        height: 120, 
                        border: '4px solid white',
                        bgcolor: "#333",
                        fontSize: 50,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                    }}
                >
                    {auth.user?.name ? auth.user.name.charAt(0).toUpperCase() : <Person />}
                </Avatar>
                
                <Box sx={{ flex: 1, mb: 1 }}>
                    <Typography variant="h4" fontWeight="800" sx={{ color: '#222' }}>
                        {auth.user?.name || "Guest User"}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, mt: 1, color: 'text.secondary' }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocalPostOffice fontSize="small" /> {auth.user?.email}
                        </Typography>
                        <Chip 
                            label={auth.user?.role?.toUpperCase() || "USER"} 
                            size="small" 
                            color="primary" 
                            variant="filled" 
                            sx={{ height: 20, fontSize: '0.7rem', fontWeight: 'bold' }}
                        />
                    </Box>
                </Box>
            </Box>
        </Paper>

        {/* --- 2. ORDERS SUMMARY (CLICKABLE) --- */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
                <Paper 
                    elevation={0}
                    onClick={() => navigate("/orders")} // ✅ Navigate on Click
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border: '1px solid #e0e0e0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s',
                        background: 'linear-gradient(135deg, #fff 0%, #f9f9f9 100%)',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                            borderColor: '#6A1B1A'
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                            width: 50, height: 50, 
                            borderRadius: '50%', 
                            bgcolor: '#E3F2FD', 
                            color: '#1565C0',
                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                        }}>
                            <ShoppingBag />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">My Orders</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {orderState.orders ? `${orderState.orders.length} orders placed` : "Check order status"}
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#6A1B1A' }}>
                         <Typography variant="button" fontWeight="bold" sx={{ mr: 1, display: {xs: 'none', sm: 'block'} }}>
                             View All
                         </Typography>
                         <ChevronRight />
                    </Box>
                </Paper>
            </Grid>
        </Grid>

        {/* --- 3. ADDRESS SECTION --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#333' }}>
                Saved Addresses
            </Typography>
            {!showAddressForm && (
                <Button 
                    startIcon={<Add />} 
                    variant="contained" 
                    onClick={() => setShowAddressForm(true)}
                    sx={{ bgcolor: '#6A1B1A', borderRadius: 2, textTransform: 'none' }}
                >
                    Add New Address
                </Button>
            )}
        </Box>

        {showAddressForm ? (
            renderAddressForm()
        ) : (
            <Grid container spacing={3}>
                {userAddress.loading ? (
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress sx={{ color: '#6A1B1A' }} />
                    </Grid>
                ) : (
                    userAddress.address && userAddress.address.length > 0 ? (
                        userAddress.address.map((adr, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Paper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        height: '100%',
                                        borderRadius: 3, 
                                        border: '1px solid #e0e0e0',
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
                                            borderColor: '#6A1B1A'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Chip 
                                            icon={adr.addressType === 'home' ? <Home fontSize="small"/> : <Work fontSize="small"/>}
                                            label={adr.addressType} 
                                            size="small" 
                                            sx={{ 
                                                textTransform: 'capitalize', 
                                                bgcolor: adr.addressType === 'home' ? '#E3F2FD' : '#F3E5F5',
                                                color: adr.addressType === 'home' ? '#1976D2' : '#7B1FA2',
                                                fontWeight: 'bold' 
                                            }} 
                                        />
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleDelete(adr._id)}
                                            sx={{ 
                                                color: '#e0e0e0', 
                                                '&:hover': { color: '#d32f2f', bgcolor: '#ffebee' } 
                                            }}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Box>

                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                                        {adr.name}
                                    </Typography>
                                    <Typography variant="body2" fontWeight="500" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#555' }}>
                                        <Phone fontSize="inherit" /> {adr.mobileNumber}
                                    </Typography>

                                    <Divider sx={{ mb: 2 }} />

                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                        {adr.address}, {adr.locality} <br />
                                        {adr.cityDistrictTown}, {adr.state} - <strong>{adr.pinCode}</strong>
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Paper 
                                elevation={0} 
                                sx={{ 
                                    py: 8, 
                                    textAlign: 'center', 
                                    borderRadius: 3, 
                                    border: '2px dashed #e0e0e0',
                                    bgcolor: '#fafafa' 
                                }}
                            >
                                <LocationOn sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No Addresses Found
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Add a new address to speed up your checkout process.
                                </Typography>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => setShowAddressForm(true)}
                                    color="inherit"
                                >
                                    Add Address Now
                                </Button>
                            </Paper>
                        </Grid>
                    )
                )}
            </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default Profile;