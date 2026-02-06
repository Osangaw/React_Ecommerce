import React, { useEffect } from "react";
import { 
  Box, Typography, Container, Card, CardContent, 
  Chip, Divider, Button, Stepper, Step, StepLabel, CircularProgress 
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getOrders, cancelOrder } from "../../actions/order.Action"; // ✅ Import cancelOrder
import Layout from "../../components/layout";
import { useNavigate } from "react-router-dom";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';

const OrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get Data from Redux
  const orderState = useSelector((state) => state.order);
  const { orders, loading } = orderState;

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

  // ✅ Helper: Check if cancellable
  const canCancel = (statusArray) => {
    const isShipped = statusArray.find(s => (s.type === 'shipped' || s.type === 'delivered') && s.isCompleted);
    const isCancelled = statusArray.find(s => s.type === 'cancelled' && s.isCompleted);
    return !isShipped && !isCancelled;
  };

  // ✅ Handler: Cancel Order
  const onCancelOrder = (orderId) => {
      if(window.confirm("Are you sure you want to cancel this order?")){
          dispatch(cancelOrder({ orderId }));
      }
  };

  const steps = ['Ordered', 'Packed', 'Shipped', 'Delivered'];

  const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
          year: 'numeric', month: 'long', day: 'numeric'
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
                const activeStep = getActiveStep(order.orderStatus);
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
                            
                            {/* Status Chip */}
                            <Chip 
                                label={isCancelled ? "CANCELLED" : order.paymentStatus.toUpperCase()} 
                                color={isCancelled ? "error" : (order.paymentStatus === 'completed' ? 'success' : 'warning')} 
                                variant="filled"
                                size="small"
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        {/* ITEMS LIST */}
                        <Box sx={{ mb: 3 }}>
                            {order.items.map((item, index) => (
                                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                                    {/* Image Thumbnail */}
                                    <Box sx={{ 
                                        width: 60, height: 60, 
                                        borderRadius: 2, 
                                        bgcolor: '#f9f9f9', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '1px solid #eee'
                                    }}>
                                        <img 
                                            src={item.productId?.image || "https://via.placeholder.com/50"} 
                                            alt={item.productId?.name}
                                            style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
                                        />
                                    </Box>
                                    
                                    {/* Item Details */}
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body1" fontWeight="600">
                                            {item.productId ? item.productId.name : "Product Name Unavailable"}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Qty: {item.purchasedQty} x ₦{item.payablePrice.toLocaleString()}
                                        </Typography>
                                    </Box>

                                    <Typography fontWeight="bold">
                                        ₦{(item.payablePrice * item.purchasedQty).toLocaleString()}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* TRACKING STEPPER (Hide if Cancelled) */}
                        {!isCancelled && (
                            <Box sx={{ width: '100%', mb: 3, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
                                <Stepper activeStep={activeStep - 1} alternativeLabel>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel StepIconProps={{
                                                sx: { 
                                                    '&.Mui-active': { color: '#6A1B1A' }, 
                                                    '&.Mui-completed': { color: '#2E7D32' } 
                                                }
                                            }}>
                                                {label}
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Box>
                        )}
                        
                        {/* FOOTER: Total & Actions */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px dashed #eee' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocalShippingIcon fontSize="small" color="disabled" />
                                <Typography variant="body2" color="text.secondary">
                                    {order.paymentType === 'cod' ? 'Cash On Delivery' : 'Online Card'}
                                </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box textAlign="right">
                                    <Typography variant="caption" color="text.secondary" display="block">Total Amount</Typography>
                                    <Typography variant="h5" fontWeight="800" color="#6A1B1A">
                                        ₦{order.totalAmount.toLocaleString()}
                                    </Typography>
                                </Box>

                                {/* ✅ CANCEL BUTTON (Visible only if cancellable) */}
                                {canCancel(order.orderStatus) && (
                                    <Button 
                                        variant="outlined" 
                                        color="error" 
                                        size="small"
                                        startIcon={<CancelIcon />}
                                        onClick={() => onCancelOrder(order._id)}
                                        sx={{ height: 40, borderRadius: 2 }}
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
      </Box>
    </Layout>
  );
};

export default OrderPage;