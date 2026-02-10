import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, Grid, 
  CircularProgress, MenuItem, Select, FormControl, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, 
  Avatar
} from "@mui/material";
import { 
  AttachMoney, ShoppingCart, LocalShipping, SentimentDissatisfied,
  Person, Inventory, Close, LocationOn, Receipt, Phone
} from "@mui/icons-material"; 
import { useDispatch, useSelector } from "react-redux"; 
import Layout from "../../components/layout"; 
// ✅ Import new action
import { getAllOrders, updateOrderStatus, getOrderDetails } from "../../actions/order.Action";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  
  const orderState = useSelector((state) => state.order);
  const auth = useSelector((state) => state.auth);
  // ✅ Get 'orderDetails' from Redux
  const { adminOrders, totalSales, loading, orderDetails } = orderState;

  // Use local state ONLY for modal visibility
  const [openDetails, setOpenDetails] = useState(false);

  useEffect(() => {
    if (auth.authenticate) {
        dispatch(getAllOrders());
    }
  }, [auth.authenticate, dispatch]);

  const handleStatusUpdate = (orderId, nextStatus) => {
     const payload = { orderId, type: nextStatus };
     dispatch(updateOrderStatus(payload));
  };

  const getCurrentStatus = (statusArray) => {
    if(!statusArray) return "";
    const isCancelled = statusArray.find(s => s.type === 'cancelled' && s.isCompleted);
    if (isCancelled) return 'cancelled';

    let currentStep = "ordered";
    for (let step of statusArray) {
        if (step.isCompleted) {
            currentStep = step.type;
        }
    }
    return currentStep;
  };

  const statusColors = {
      ordered: "warning",
      packed: "info",
      shipped: "primary",
      delivered: "success",
      cancelled: "error"
  };

  // ✅ Updated Handlers
  const handleOpenOrder = (orderId) => {
      dispatch(getOrderDetails({ orderId })); // Fetch fresh data
      setOpenDetails(true);
  };

  const handleCloseOrder = () => {
      setOpenDetails(false);
  };

  // Only show full page loader if initial list is loading and modal is closed
  if (loading && !openDetails && adminOrders.length === 0) {
      return (
          <Layout>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                  <CircularProgress size={60} sx={{ color: '#6A1B1A' }} />
              </Box>
          </Layout>
      );
  }

  // ✅ Use orderDetails for the popup content
  const activeOrder = orderDetails && orderDetails._id ? orderDetails : null;

  return (
    <Layout>
      <Box sx={{ bgcolor: "#F4F6F8", minHeight: "100vh", pt: { xs: 2, md: 4 }, pb: 8, px: { xs: 2, md: 4 } }}>
        
        {/* HEADER */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h4" fontWeight="800" sx={{ color: '#2c3e50', letterSpacing: '-0.5px', fontSize: { xs: '1.5rem', md: '2.1rem' } }}>
              Dashboard Overview
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {new Date().toDateString()}
            </Typography>
        </Box>

        {/* STATS CARDS */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(135deg, #6A1B1A 0%, #8E2E2E 100%)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 16px rgba(106, 27, 26, 0.2)' }}>
                    <Box>
                        <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>TOTAL REVENUE</Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>₦{(totalSales || 0).toLocaleString()}</Typography>
                    </Box>
                    <AttachMoney sx={{ fontSize: 40, opacity: 0.8 }} />
                </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)' }}>
                     <Box>
                        <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>TOTAL ORDERS</Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>{adminOrders ? adminOrders.length : 0}</Typography>
                    </Box>
                    <ShoppingCart sx={{ fontSize: 40, opacity: 0.8 }} />
                </Paper>
            </Grid>
             <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(135deg, #F57C00 0%, #FFB74D 100%)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 16px rgba(245, 124, 0, 0.2)' }}>
                     <Box>
                        <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>PENDING SHIPMENT</Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>
                            {adminOrders ? adminOrders.filter(o => {
                                const st = getCurrentStatus(o.orderStatus);
                                return st !== 'delivered' && st !== 'cancelled';
                            }).length : 0}
                        </Typography>
                    </Box>
                    <LocalShipping sx={{ fontSize: 40, opacity: 0.8 }} />
                </Paper>
            </Grid>
        </Grid>

        <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>Recent Orders</Typography>

        {/* 1. DESKTOP TABLE */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #E0E0E0' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {['Order ID', 'Customer', 'Items', 'Total Price', 'Payment', 'Status', 'Action'].map((head) => (
                                    <TableCell key={head} sx={{ bgcolor: '#F8F9FA', fontWeight: 'bold', color: '#444', py: 2 }}>{head}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {adminOrders && adminOrders.map((order) => {
                                const currentStatus = getCurrentStatus(order.orderStatus);
                                const isCancelled = currentStatus === 'cancelled';
                                return (
                                    <TableRow 
                                        key={order._id} 
                                        hover 
                                        onClick={() => handleOpenOrder(order._id)} // ✅ Pass ID only
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell sx={{ fontFamily: 'monospace', color: '#1976D2', fontWeight: 600 }}>#{order._id.substring(0, 8)}</TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight="bold">{order.user ? order.user.name || "Guest" : "Unknown"}</Typography>
                                            <Typography variant="caption" color="text.secondary">{order.user ? order.user.email : ""}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 200 }}>
                                            {order.items.slice(0, 2).map((item, i) => (
                                                <Typography key={i} variant="body2" fontSize="0.85rem" noWrap>• <b>{item.purchasedQty}x</b> {item.productId?.name}</Typography>
                                            ))}
                                            {order.items.length > 2 && <Typography variant="caption" color="primary">+{order.items.length - 2} more...</Typography>}
                                        </TableCell>
                                        <TableCell><Typography fontWeight="bold" color="#2E7D32">₦{order.totalAmount.toLocaleString()}</Typography></TableCell>
                                        <TableCell>
                                            <Chip label={(order.paymentStatus || "pending").toUpperCase()} size="small" variant="outlined" color={order.paymentStatus === 'completed' ? 'success' : 'warning'} sx={{ fontWeight: 'bold', borderRadius: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={(isCancelled ? 'Cancelled' : (order.paymentStatus || "pending")).toUpperCase()} size="small" variant="outlined" color={isCancelled ? 'error' : (order.paymentStatus === 'completed' ? 'success' : 'warning')} sx={{ fontWeight: 'bold', borderRadius: 1 }} />
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <FormControl size="small" fullWidth disabled={isCancelled}>
                                                <Select value={isCancelled ? 'cancelled' : currentStatus} onChange={(e) => handleStatusUpdate(order._id, e.target.value)} sx={{ fontSize: '0.8rem', height: 35, bgcolor: '#F8F9FA' }}>
                                                    {isCancelled ? <MenuItem value="cancelled">Cancelled</MenuItem> : ['ordered', 'packed', 'shipped', 'delivered'].map((status) => <MenuItem key={status} value={status} disabled={status === 'ordered'}>{status.charAt(0).toUpperCase() + status.slice(1)}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>

        {/* 2. MOBILE CARD LIST */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Grid container spacing={2}>
                {adminOrders && adminOrders.map((order) => {
                    const currentStatus = getCurrentStatus(order.orderStatus);
                    const isCancelled = currentStatus === 'cancelled';
                    return (
                        <Grid item xs={12} key={order._id}>
                            <Paper 
                                elevation={0}
                                onClick={() => handleOpenOrder(order._id)} // ✅ Pass ID only
                                sx={{ p: 2, borderRadius: 3, border: '1px solid #E0E0E0', bgcolor: 'white', cursor: 'pointer' }}
                            >
                                <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', color: '#1976D2', fontWeight: 600 }}>#{order._id.substring(0, 8)}</Typography>
                                    <Typography variant="caption" color="text.secondary">{new Date(order.createdAt).toLocaleDateString()}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Person sx={{ fontSize: 16, color: '#888' }} />
                                    <Typography variant="body2" fontWeight="bold">{order.user ? order.user.name : "Guest User"}</Typography>
                                </Box>
                                <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
                                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Inventory sx={{ fontSize: 16, color: '#666' }} />
                                        <Typography variant="caption" fontWeight="bold">{order.items.length} Items</Typography>
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight="800" color="#2E7D32">₦{order.totalAmount.toLocaleString()}</Typography>
                                </Box>
                                <Box onClick={(e) => e.stopPropagation()}>
                                    <FormControl size="small" fullWidth disabled={isCancelled}>
                                        <Select value={isCancelled ? 'cancelled' : currentStatus} onChange={(e) => handleStatusUpdate(order._id, e.target.value)} sx={{ fontSize: '0.8rem', height: 36, bgcolor: '#F8F9FA' }}>
                                            {isCancelled ? <MenuItem value="cancelled">Cancelled</MenuItem> : ['ordered', 'packed', 'shipped', 'delivered'].map((status) => <MenuItem key={status} value={status} disabled={status === 'ordered'}>{status.charAt(0).toUpperCase() + status.slice(1)}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>

        {/* ✅ ORDER DETAILS POPUP (DIALOG) */}
        <Dialog open={openDetails} onClose={handleCloseOrder} maxWidth="sm" fullWidth>
            {activeOrder ? (
                <>
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">Order Details</Typography>
                            <Typography variant="caption" color="text.secondary">ID: #{activeOrder._id}</Typography>
                        </Box>
                        <IconButton onClick={handleCloseOrder}><Close /></IconButton>
                    </DialogTitle>
                    
                    <DialogContent dividers>
                        {/* Status Row */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">ORDER DATE</Typography>
                                <Typography variant="body2" fontWeight="bold">{new Date(activeOrder.createdAt).toLocaleString()}</Typography>
                            </Box>
                            <Box textAlign="right">
                                <Typography variant="caption" color="text.secondary">STATUS</Typography>
                                <Chip 
                                    label={getCurrentStatus(activeOrder.orderStatus).toUpperCase()} 
                                    color={statusColors[getCurrentStatus(activeOrder.orderStatus)] || 'default'} 
                                    size="small" 
                                    sx={{ display: 'flex', fontWeight: 'bold' }} 
                                />
                            </Box>
                        </Box>

                        {/* Address & Phone Section */}
                        <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                            {/* Customer */}
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <Person fontSize="small" color="action" />
                                <Typography variant="body2" fontWeight="bold">{activeOrder.user?.name || "Guest"}</Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 3.5, mb: 1.5 }}>{activeOrder.user?.email}</Typography>
                            
                            <Divider sx={{ my: 1.5 }} />

                            {/* Phone Number */}
                            <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                                <Phone fontSize="small" color="action" />
                                <Typography variant="body2" fontWeight="bold">
                                    {/* ✅ Uses fresh data from Redux */}
                                    {activeOrder.addressId?.phoneNumber || activeOrder.addressId?.mobileNumber || "No Phone Provided"}
                                </Typography>
                            </Box>

                            {/* Delivery Address */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <LocationOn fontSize="small" color="action" />
                                <Typography variant="body2">
                                    {activeOrder.addressId ? (
                                        <>
                                            {activeOrder.addressId.address}<br />
                                            {activeOrder.addressId.city}, {activeOrder.addressId.country} {activeOrder.addressId.postalCode}
                                        </>
                                    ) : (
                                        "Shipping address not available"
                                    )}
                                </Typography>
                            </Box>
                        </Paper>

                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Items ({activeOrder.items.length})</Typography>
                        <Divider sx={{ mb: 2 }} />

                        {/* Items List */}
                        {activeOrder.items.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar src={item.productId?.image} variant="rounded" sx={{ width: 50, height: 50, bgcolor: '#eee' }}>
                                        <Inventory />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">{item.productId?.name || "Product Info Unavailable"}</Typography>
                                        <Typography variant="caption" color="text.secondary">Qty: {item.purchasedQty}</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" fontWeight="bold">₦{item.payablePrice.toLocaleString()}</Typography>
                            </Box>
                        ))}

                        <Divider sx={{ my: 2 }} />

                        {/* Totals */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Receipt color="action" />
                                <Box>
                                    <Typography variant="caption" display="block" color="text.secondary">PAYMENT</Typography>
                                    <Typography variant="body2" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
                                        {activeOrder.paymentType} ({activeOrder.paymentStatus})
                                    </Typography>
                                </Box>
                            </Box>
                            <Box textAlign="right">
                                <Typography variant="caption" display="block" color="text.secondary">TOTAL AMOUNT</Typography>
                                <Typography variant="h5" fontWeight="800" color="#2E7D32">₦{activeOrder.totalAmount.toLocaleString()}</Typography>
                            </Box>
                        </Box>
                    </DialogContent>
                    
                    <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                        <Button onClick={handleCloseOrder} color="inherit">Close</Button>
                    </DialogActions>
                </>
            ) : (
                <Box sx={{ p: 5, textAlign: 'center' }}>
                    <CircularProgress />
                </Box>
            )}
        </Dialog>

      </Box>
    </Layout>
  );
};

export default AdminDashboard;