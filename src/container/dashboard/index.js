import React, { useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, Grid, 
  CircularProgress, MenuItem, Select, FormControl, Divider 
} from "@mui/material";
import { 
  AttachMoney, 
  ShoppingCart, 
  LocalShipping, 
  SentimentDissatisfied,
  Person,
  Inventory
} from "@mui/icons-material"; 
import { useDispatch, useSelector } from "react-redux"; 
import Layout from "../../components/layout"; 
import { getAllOrders, updateOrderStatus } from "../../actions/order.Action";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  
  const orderState = useSelector((state) => state.order);
  const auth = useSelector((state) => state.auth);
  const { adminOrders, totalSales, loading } = orderState;

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
    // 1. Check for 'cancelled' first
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

  if (loading) {
      return (
          <Layout>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                  <CircularProgress size={60} sx={{ color: '#6A1B1A' }} />
              </Box>
          </Layout>
      );
  }

  return (
    <Layout>
      <Box sx={{ bgcolor: "#F4F6F8", minHeight: "100vh", pt: { xs: 2, md: 4 }, pb: 8, px: { xs: 2, md: 4 } }}>
        
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h4" fontWeight="800" sx={{ color: '#2c3e50', letterSpacing: '-0.5px', fontSize: { xs: '1.5rem', md: '2.1rem' } }}>
              Dashboard Overview
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {new Date().toDateString()}
            </Typography>
        </Box>

        {/* --- STATS CARDS (Maintained Original Layout) --- */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
            {/* Revenue Card */}
            <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    background: 'linear-gradient(135deg, #6A1B1A 0%, #8E2E2E 100%)', 
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0px 10px 20px rgba(106, 27, 26, 0.2)'
                }}>
                    <Box>
                        <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: 600 }}>TOTAL REVENUE</Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>
                             ₦{(totalSales || 0).toLocaleString()} 
                        </Typography>
                    </Box>
                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1.5, borderRadius: '50%' }}>
                        <AttachMoney sx={{ fontSize: 40 }} />
                    </Box>
                </Paper>
            </Grid>

            {/* Total Orders Card */}
            <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0px 10px 20px rgba(25, 118, 210, 0.2)'
                }}>
                     <Box>
                        <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: 600 }}>TOTAL ORDERS</Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>
                            {adminOrders ? adminOrders.length : 0}
                        </Typography>
                    </Box>
                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1.5, borderRadius: '50%' }}>
                        <ShoppingCart sx={{ fontSize: 40 }} />
                    </Box>
                </Paper>
            </Grid>
            
             {/* Pending Shipment Card */}
             <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    background: 'linear-gradient(135deg, #F57C00 0%, #FFB74D 100%)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0px 10px 20px rgba(245, 124, 0, 0.2)'
                }}>
                     <Box>
                        <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: 600 }}>PENDING SHIPMENT</Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ mt: 1 }}>
                            {adminOrders ? adminOrders.filter(o => {
                                const st = getCurrentStatus(o.orderStatus);
                                return st !== 'delivered' && st !== 'cancelled';
                            }).length : 0}
                        </Typography>
                    </Box>
                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1.5, borderRadius: '50%' }}>
                        <LocalShipping sx={{ fontSize: 40 }} />
                    </Box>
                </Paper>
            </Grid>
        </Grid>

        <Typography variant="h6" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>Recent Orders</Typography>

        {/* ========================================================= */}
        {/* 1. DESKTOP VIEW (TABLE) - Hidden on XS, Visible on MD+   */}
        {/* ========================================================= */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #E0E0E0', boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {['Order ID', 'Customer', 'Items', 'Total Price', 'Payment', 'Status', 'Action'].map((head) => (
                                    <TableCell key={head} sx={{ bgcolor: '#F8F9FA', fontWeight: 'bold', color: '#444', py: 2 }}>
                                        {head}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {adminOrders && adminOrders.length > 0 ? (
                                adminOrders.map((order) => {
                                    const currentStatus = getCurrentStatus(order.orderStatus);
                                    const isCancelled = currentStatus === 'cancelled';

                                    return (
                                        <TableRow key={order._id} hover>
                                            <TableCell sx={{ fontFamily: 'monospace', color: '#1976D2', fontWeight: 600 }}>
                                                #{order._id.substring(0, 8)}
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        {order.user ? order.user.name || "Guest" : "Unknown"}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {order.user ? order.user.email : ""}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 200 }}>
                                                {order.items.slice(0, 2).map((item, i) => (
                                                    <Typography key={i} variant="body2" fontSize="0.85rem" noWrap>
                                                        • <b>{item.purchasedQty}x</b> {item.productId ? item.productId.name : "Unavailable"}
                                                    </Typography>
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                <Typography fontWeight="bold" color="#2E7D32">
                                                    ₦{order.totalAmount.toLocaleString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={(isCancelled ? 'Cancelled' : (order.paymentStatus || "pending")).toUpperCase()} 
                                                    size="small" variant="outlined" 
                                                    color={isCancelled ? 'error' : (order.paymentStatus === 'completed' ? 'success' : 'warning')}
                                                    sx={{ fontWeight: 'bold', borderRadius: 1 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={currentStatus.toUpperCase()}
                                                    color={statusColors[currentStatus] || 'default'}
                                                    size="small"
                                                    sx={{ fontWeight: 'bold', borderRadius: 1 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <FormControl size="small" fullWidth disabled={isCancelled}>
                                                    <Select
                                                        value={isCancelled ? 'cancelled' : currentStatus}
                                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                        sx={{ fontSize: '0.8rem', height: 35, bgcolor: '#F8F9FA' }}
                                                    >
                                                        {isCancelled ? (
                                                            <MenuItem value="cancelled">Cancelled</MenuItem>
                                                        ) : (
                                                            ['ordered', 'packed', 'shipped', 'delivered'].map((status) => (
                                                                <MenuItem key={status} value={status} disabled={status === 'ordered'}>
                                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                </MenuItem>
                                                            ))
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                        <SentimentDissatisfied sx={{ fontSize: 60, color: '#ddd', mb: 2 }} />
                                        <Typography variant="h6" color="text.secondary">No orders found.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>

        {/* ========================================================= */}
        {/* 2. MOBILE VIEW (CARDS) - Visible on Mobile (xs)          */}
        {/* ========================================================= */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Grid container spacing={4}>
                {adminOrders && adminOrders.length > 0 ? (
                    adminOrders.map((order) => {
                        const currentStatus = getCurrentStatus(order.orderStatus);
                        const isCancelled = currentStatus === 'cancelled';

                        return (
                            // ✅ CHANGED: xs={12} ensures 1 card per row/column on mobile
                            <Grid item xs={12} key={order._id}>
                                <Paper 
                                    elevation={0}
                                    sx={{ 
                                        p: 2, 
                                        borderRadius: 3, 
                                        border: '1px solid #E0E0E0',
                                        bgcolor: 'white',
                                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                        height: '100%'
                                    }}
                                >
                                    {/* Header */}
                                    <Box sx={{ mb: 1.5 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', color: '#1976D2', fontWeight: 600 }}>
                                                #{order._id.substring(0, 8)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Person sx={{ fontSize: 16, color: '#888' }} />
                                            <Typography variant="body2" fontWeight="bold">
                                                {order.user ? order.user.name : "Guest User"}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 1, borderStyle: 'dashed' }} />

                                    {/* Items & Status */}
                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Inventory sx={{ fontSize: 16, color: '#666' }} />
                                            <Typography variant="caption" fontWeight="bold">{order.items.length} Items</Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Chip 
                                                label={currentStatus.toUpperCase()}
                                                color={statusColors[currentStatus] || 'default'}
                                                size="small"
                                                sx={{ fontWeight: 'bold', fontSize: '0.65rem', height: 24, borderRadius: 1 }}
                                            />
                                            <Typography variant="subtitle1" fontWeight="800" color="#2E7D32">
                                                ₦{order.totalAmount.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Action - Compact Dropdown */}
                                    <FormControl size="small" fullWidth disabled={isCancelled}>
                                        <Select
                                            value={isCancelled ? 'cancelled' : currentStatus}
                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                            sx={{ fontSize: '0.8rem', height: 36, bgcolor: '#F8F9FA' }}
                                        >
                                            {isCancelled ? (
                                                <MenuItem value="cancelled">Cancelled</MenuItem>
                                            ) : (
                                                ['ordered', 'packed', 'shipped', 'delivered'].map((status) => (
                                                    <MenuItem key={status} value={status} disabled={status === 'ordered'}>
                                                        Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </MenuItem>
                                                ))
                                            )}
                                        </Select>
                                    </FormControl>
                                </Paper>
                            </Grid>
                        );
                    })
                ) : (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 5, color: '#999', bgcolor: 'white', borderRadius: 3 }}>
                            <SentimentDissatisfied sx={{ fontSize: 50, mb: 1 }} />
                            <Typography>No orders found.</Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>

      </Box>
    </Layout>
  );
};

export default AdminDashboard;