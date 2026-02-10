import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Container, Card, CardContent, 
  Chip, Divider, Button, Stepper, Step, StepLabel, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, Paper
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getOrders, cancelOrder } from "../../actions/order.Action"; 
import Layout from "../../components/layout";
import { useNavigate } from "react-router-dom";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility'; // ✅ Icon for details
import LocationOnIcon from '@mui/icons-material/LocationOn';

const OrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get Data from Redux
  const orderState = useSelector((state) => state.order);
  const { orders, loading } = orderState;

  // ✅ Local State for Popup
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  // Helper: Active Step
  const getActiveStep = (statusArray) => {
    let activeStep = 0;
    statusArray.forEach((step, index) => {
        if (step.isCompleted) {
            activeStep = index + 1; 
        }
    });
    return activeStep;
  };

  // Helper: Check if cancellable
  const canCancel = (statusArray) => {
    const isShipped = statusArray.find(s => (s.type === 'shipped' || s.type === 'delivered') && s.isCompleted);
    const isCancelled = statusArray.find(s => s.type === 'cancelled' && s.isCompleted);
    return !isShipped && !isCancelled;
  };

  // Handler: Cancel Order
  const onCancelOrder = (orderId) => {
      if(window.confirm("Are you sure you want to cancel this order?")){
          dispatch(cancelOrder({ orderId }));
          setOpenDetails(false); // Close popup if open
      }
  };

  // ✅ Handler: Open Popup
  const handleOpenDetails = (order) => {
      setSelectedOrder(order);
      setOpenDetails(true);
  };

  const handleCloseDetails = () => {
      setOpenDetails(false);
      setSelectedOrder(null);
  };

  const steps = ['Ordered', 'Packed', 'Shipped', 'Delivered'];

  const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'
      });
  };

  if (loading) {
      return (
          <Layout>
             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                 <CircularProgress sx={{ color: '#6A1B1A' }} />
             </Box>
          </Layout>
      );
  }

  return (
    <Layout>
      <Box sx={{ bgcolor: "#f5f5f5", minHeight: "90vh", py: 4 }}>
        <Container maxWidth="md">
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
             <ShoppingBagIcon sx={{ fontSize: 30, color: '#6A1B1A' }} />
             <Typography variant="h4" fontWeight="bold" color="#333">My Orders</Typography>
          </Box>

          {/* EMPTY STATE */}
          {orders.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 8, p: 4, bgcolor: 'white', borderRadius: 4 }}>
                  <Typography variant="h6" color="text.secondary">You haven't placed any orders yet.</Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/')} 
                    sx={{ mt: 3, bgcolor: '#6A1B1A', fontWeight: 'bold' }}
                  >
                      Start Shopping
                  </Button>
              </Box>
          ) : (
            
            // ORDER LIST
            orders.map((order) => {
                const isCancelled = order.orderStatus.find(s => s.type === 'cancelled' && s.isCompleted);

                return (
                  <Card key={order._id} sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <CardContent>
                        
                        {/* HEADER: ID & Status */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
                                <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
                                    #{order._id.substring(0, 8).toUpperCase()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Placed on {formatDate(order.createdAt)}
                                </Typography>
                            </Box>
                            
                            <Chip 
                                label={isCancelled ? "CANCELLED" : order.paymentStatus.toUpperCase()} 
                                color={isCancelled ? "error" : (order.paymentStatus === 'completed' ? 'success' : 'warning')} 
                                variant="filled"
                                size="small"
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        {/* ITEMS PREVIEW (Only show first 2 items) */}
                        <Box sx={{ mb: 3 }}>
                            {order.items.slice(0, 2).map((item, index) => (
                                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                                    <Box sx={{ width: 60, height: 60, borderRadius: 2, bgcolor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eee' }}>
                                        <img src={item.productId?.image || "https://via.placeholder.com/50"} alt={item.productId?.name} style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body1" fontWeight="600">{item.productId ? item.productId.name : "Product Name Unavailable"}</Typography>
                                        <Typography variant="body2" color="text.secondary">Qty: {item.purchasedQty}</Typography>
                                    </Box>
                                    <Typography fontWeight="bold">₦{(item.payablePrice * item.purchasedQty).toLocaleString()}</Typography>
                                </Box>
                            ))}
                            {order.items.length > 2 && (
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 9 }}>
                                    + {order.items.length - 2} more items...
                                </Typography>
                            )}
                        </Box>

                        {/* FOOTER: Actions */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px dashed #eee' }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block">Total Amount</Typography>
                                <Typography variant="h6" fontWeight="800" color="#6A1B1A">₦{order.totalAmount.toLocaleString()}</Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {/* ✅ VIEW DETAILS BUTTON */}
                                <Button 
                                    variant="outlined" 
                                    size="small"
                                    startIcon={<VisibilityIcon />}
                                    onClick={() => handleOpenDetails(order)}
                                    sx={{ borderRadius: 2, borderColor: '#6A1B1A', color: '#6A1B1A' }}
                                >
                                    View Details
                                </Button>

                                {/* CANCEL BUTTON */}
                                {canCancel(order.orderStatus) && (
                                    <Button 
                                        variant="outlined" color="error" size="small"
                                        startIcon={<CancelIcon />}
                                        onClick={() => onCancelOrder(order._id)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </Box>
                        </Box>

                    </CardContent>
                  </Card>
                );
            })
          )}
        </Container>

        {/* ✅ POPUP DIALOG FOR ORDER DETAILS */}
        <Dialog open={openDetails} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
            {selectedOrder && (
                <>
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">Order Details</Typography>
                            <Typography variant="caption" color="text.secondary">#{selectedOrder._id}</Typography>
                        </Box>
                        <Chip label={selectedOrder.paymentStatus.toUpperCase()} color={selectedOrder.paymentStatus === 'completed' ? 'success' : 'warning'} size="small" />
                    </DialogTitle>
                    
                    <DialogContent dividers>
                        
                        {/* 1. SHIPPING ADDRESS */}
                        {selectedOrder.addressId && (
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, mb: 3 }}>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1, color: '#555' }}>
                                    <LocationOnIcon fontSize="small" />
                                    <Typography variant="subtitle2" fontWeight="bold">Shipping Address</Typography>
                                </Box>
                                <Typography variant="body2">{selectedOrder.addressId.name}</Typography>
                                <Typography variant="body2">{selectedOrder.addressId.address}, {selectedOrder.addressId.city}</Typography>
                                <Typography variant="body2">{selectedOrder.addressId.postalCode}, {selectedOrder.addressId.country}</Typography>
                                <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>{selectedOrder.addressId.phoneNumber}</Typography>
                            </Paper>
                        )}

                        {/* 2. TRACKING STATUS */}
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>Order Status</Typography>
                        <Box sx={{ width: '100%', mb: 4 }}>
                            <Stepper activeStep={getActiveStep(selectedOrder.orderStatus) - 1} alternativeLabel>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel StepIconProps={{ sx: { '&.Mui-active': { color: '#6A1B1A' }, '&.Mui-completed': { color: '#2E7D32' } } }}>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>

                        {/* 3. FULL ITEMS LIST */}
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>Items ({selectedOrder.items.length})</Typography>
                        {selectedOrder.items.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', borderBottom: '1px solid #f0f0f0', pb: 1 }}>
                                <img src={item.productId?.image || "https://via.placeholder.com/50"} alt="product" style={{ width: 50, height: 50, objectFit: 'contain', borderRadius: 4, border: '1px solid #eee' }} />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" fontWeight="600">{item.productId?.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">Qty: {item.purchasedQty} x ₦{item.payablePrice.toLocaleString()}</Typography>
                                </Box>
                                <Typography variant="body2" fontWeight="bold">₦{(item.payablePrice * item.purchasedQty).toLocaleString()}</Typography>
                            </Box>
                        ))}
                        
                        {/* 4. PAYMENT INFO */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '2px dashed #eee' }}>
                            <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                            <Typography variant="body2" fontWeight="bold">{selectedOrder.paymentType === 'cod' ? 'Cash On Delivery' : 'Online Card'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="h6" fontWeight="bold">Total Paid</Typography>
                            <Typography variant="h6" fontWeight="bold" color="#6A1B1A">₦{selectedOrder.totalAmount.toLocaleString()}</Typography>
                        </Box>

                    </DialogContent>
                    
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={handleCloseDetails} color="inherit">Close</Button>
                        {canCancel(selectedOrder.orderStatus) && (
                            <Button onClick={() => onCancelOrder(selectedOrder._id)} variant="contained" color="error">Cancel Order</Button>
                        )}
                    </DialogActions>
                </>
            )}
        </Dialog>

      </Box>
    </Layout>
  );
};

export default OrderPage;