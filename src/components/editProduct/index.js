import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Box, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  MenuItem, 
  CircularProgress,
  IconButton,
  Divider
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Layout from "../../components/layout";
import { updateProduct, getProductDetails } from "../../actions/product.Action";

const categories = [
  'electronics', 'fashion', 'home', 'beauty', 'sports', 
  'toys', 'books', 'automotive', 'grocery', 'other'
];

const EditProduct = () => {
  const { id } = useParams(); // Get Product ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const product = useSelector((state) => state.product.productDetails);
  const loading = useSelector((state) => state.product.loading);

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  
  // Image State
  const [currentImages, setCurrentImages] = useState([]); // Images already in DB
  const [newImages, setNewImages] = useState([]);         // New files to upload
  const [newPreviews, setNewPreviews] = useState([]);     // Previews for new files

  // 1. Fetch Data on Mount
  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [id, dispatch]);

  // 2. Pre-fill Form when Product Data arrives
  useEffect(() => {
    if (product && product._id === id) {
      setName(product.name || "");
      setPrice(product.price || "");
      setDescription(product.description || "");
      setCategory(product.category || "other");
      setQuantity(product.quantity || "");
      
      // Handle array of images or single image fallback
      if (product.images && product.images.length > 0) {
        setCurrentImages(product.images);
      } else if (product.image) {
        setCurrentImages([{ img: product.image }]);
      }
    }
  }, [product, id]);

  // Handle New Image Selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    setNewImages([...newImages, ...files]);

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setNewPreviews([...newPreviews, ...newPreviewUrls]);
  };

  // Remove a NEW image (before upload)
  const removeNewImage = (index) => {
    const updatedFiles = [...newImages];
    const updatedPreviews = [...newPreviews];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setNewImages(updatedFiles);
    setNewPreviews(updatedPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", name);
    form.append("price", price);
    form.append("description", description);
    form.append("category", category);
    form.append("quantity", quantity);

    // Only append files if user selected new ones
    for (let pic of newImages) {
      form.append("productPicture", pic);
    }

    dispatch(updateProduct(id, form)).then(() => {
        // Navigate back to product details after update
        navigate(`/product/${id}`);
    });
  };

  if (!product) return <Layout><CircularProgress /></Layout>;

  return (
    <Layout>
      <Box sx={{ minHeight: "90vh", bgcolor: "#f1f1f1", py: 5 }}>
        <Container maxWidth="md">
            
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(`/product/${id}`)}
            sx={{ mb: 2, color: '#333' }}
          >
            Cancel
          </Button>

          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            
            <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center" sx={{ mb: 4 }}>
              Edit Product
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                
                {/* Product Name */}
                <Grid item xs={12}>
                  <TextField
                    label="Product Name"
                    fullWidth
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    InputLabelProps={{ shrink: true }} // Ensures label doesn't overlap pre-filled text
                  />
                </Grid>

                {/* Price & Quantity */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Price (₦)"
                    type="number"
                    fullWidth
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Quantity"
                    type="number"
                    fullWidth
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Category Select */}
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Category"
                    fullWidth
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* --- EXISTING IMAGES SECTION --- */}
                <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Current Images (Saved)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
                        {currentImages.map((imgObj, index) => (
                            <Box 
                                key={index} 
                                sx={{ 
                                    width: 80, 
                                    height: 80, 
                                    border: '1px solid #ddd', 
                                    borderRadius: 2, 
                                    overflow: 'hidden',
                                    opacity: 0.8
                                }}
                            >
                                <img src={imgObj.img || imgObj} alt="current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </Box>
                        ))}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                </Grid>

                {/* --- NEW IMAGE UPLOAD SECTION --- */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Add New Images
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      sx={{ color: '#6A1B1A', borderColor: '#6A1B1A' }}
                    >
                      Upload New
                      <input 
                        type="file" 
                        hidden 
                        multiple 
                        accept="image/*"
                        onChange={handleImageChange} 
                      />
                    </Button>
                    <Typography variant="caption" color="text.secondary">
                        {newImages.length} new files selected
                    </Typography>
                  </Box>

                  {/* New Image Previews */}
                  <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 1 }}>
                    {newPreviews.map((img, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                            position: 'relative', 
                            width: 80, 
                            height: 80, 
                            border: '2px dashed #6A1B1A', 
                            borderRadius: 2,
                            overflow: 'hidden' 
                        }}
                      >
                        <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <IconButton 
                            size="small" 
                            onClick={() => removeNewImage(index)}
                            sx={{ 
                                position: 'absolute', 
                                top: 0, 
                                right: 0, 
                                bgcolor: 'rgba(255,255,255,0.8)',
                                color: 'red',
                                padding: '2px',
                                '&:hover': { bgcolor: 'white' }
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Grid>

                {/* SUBMIT BUTTON */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{ 
                        bgcolor: "#6A1B1A", 
                        py: 1.5, 
                        fontWeight: "bold",
                        "&:hover": { bgcolor: "#8B2323" } 
                    }}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Update Product"}
                  </Button>
                </Grid>

              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default EditProduct;