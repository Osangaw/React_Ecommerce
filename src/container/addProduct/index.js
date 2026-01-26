import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  IconButton
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import Layout from "../../components/layout";
import { addProduct } from "../../actions/product.Action";

const categories = [
  'electronics', 'fashion', 'home', 'beauty', 'sports', 
  'toys', 'books', 'automotive', 'grocery', 'other'
];

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.product.loading);

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [quantity, setQuantity] = useState("");
  
  // ✅ RENAMED: Consistent state name "images"
  const [images, setImages] = useState([]); 
  const [previewImages, setPreviewImages] = useState([]);

  // Handle Image Selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // 1. Update File List for backend
    setImages([...images, ...files]);

    // 2. Generate Preview URLs for UI
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviews]);
  };

  // Remove an image from the list
  const removeImage = (index) => {
    const updatedFiles = [...images];
    const updatedPreviews = [...previewImages];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setImages(updatedFiles);
    setPreviewImages(updatedPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", name);
    form.append("price", price);
    form.append("description", description);
    form.append("category", category);
    form.append("quantity", quantity);

    // ✅ FIXED: Using "images" key to match your Backend Route change
    for (let pic of images) {
      form.append("images", pic);
    }

    dispatch(addProduct(form)).then(() => {
        navigate('/'); 
    });
  };

  return (
    <Layout>
      <Box sx={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f1f1f1", py: 5 }}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            
            <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center" sx={{ mb: 4 }}>
              Add New Product
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
                  />
                </Grid>

                {/* IMAGE UPLOAD SECTION */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Product Images
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      sx={{ color: '#6A1B1A', borderColor: '#6A1B1A' }}
                    >
                      Upload Images
                      <input 
                        type="file" 
                        hidden 
                        multiple 
                        accept="image/*"
                        onChange={handleImageChange} 
                      />
                    </Button>
                    <Typography variant="caption" color="text.secondary">
                        {images.length} files selected
                    </Typography>
                  </Box>

                  {/* Image Previews */}
                  <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 1 }}>
                    {previewImages.map((img, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                            position: 'relative', 
                            width: 100, 
                            height: 100, 
                            border: '1px solid #ddd', 
                            borderRadius: 2,
                            overflow: 'hidden' 
                        }}
                      >
                        <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <IconButton 
                            size="small" 
                            onClick={() => removeImage(index)}
                            sx={{ 
                                position: 'absolute', 
                                top: 0, 
                                right: 0, 
                                bgcolor: 'rgba(255,255,255,0.8)',
                                color: 'red',
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
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Create Product"}
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

export default AddProduct;