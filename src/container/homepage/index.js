import { Box, Card, Typography, Button } from "@mui/material"; 
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAllProducts } from "../../actions/product.Action";
import Layout from "../../components/layout";
import { productConstants } from "../../actions/constants";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Homepage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productState = useSelector((state) => state.product);
  
  const allProducts = productState?.products || [];
  const searchResults = productState?.searchResults || [];
  const loading = productState?.loading || false;

  // Logic: Switch between Search Results and All Products
  const isSearching = searchResults.length > 0;
  const productsToDisplay = isSearching ? searchResults : allProducts;

  useEffect(() => {
    if (allProducts.length === 0) {
       dispatch(getAllProducts());
    }
  }, [dispatch, allProducts.length]);

  const clearSearch = () => {
    dispatch({ 
        type: productConstants.SEARCH_PRODUCT_SUCCESS, 
        payload: { products: [] } 
    });
    dispatch(getAllProducts());
  };

  return (
    <Layout> 
      <Box sx={{ borderRadius: 4, height: "100%" }}>
        
        {/* Loading State with your Cursive Font */}
        {loading && (
          <Typography style={{ textAlign: "center", fontFamily: "cursive", fontSize: "20px" }}>
            Loading products...
          </Typography>
        )}

        {/* ✅ Simple "Back" Button (Only shows when searching) */}
        {isSearching && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Button 
                    variant="outlined" 
                    color="error" 
                    startIcon={<ArrowBackIcon />}
                    onClick={clearSearch}
                    sx={{ fontFamily: "cursive", fontWeight: "bold" }}
                >
                    Back to All Products
                </Button>
            </Box>
        )}

        {/* ✅ RESTORED: Your original Flexbox Layout & Card Styles */}
        {productsToDisplay && productsToDisplay.length > 0 ? (
          <Box style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
            {productsToDisplay.map((productItem) => (
              <Box
                key={productItem._id}
                style={{ flex: "0 0 calc(20% - 20px)", minWidth: "200px", marginBottom: "25px" }}
              >
                <Card
                  sx={{
                    padding: 2,
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "0.3s",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    // ✅ Restored your specific hover effect
                    "&:hover": { transform: "scale(1.03)", boxShadow: "0 6px 18px rgba(0,0,0,0.15)" },
                  }}
                  onClick={() => navigate(`/product/${productItem._id}`)}
                >
                    <Box style={{ width: "100%", height: 150, overflow: "hidden", borderRadius: 3, marginBottom: 16 }}>
                      {/* Image Logic */}
                      <img
                        src={
                            productItem.image || 
                            (productItem.productPictures && productItem.productPictures.length > 0 ? productItem.productPictures[0].img : "") || 
                            "https://via.placeholder.com/150"
                        }
                        alt={productItem.name}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </Box>
                    <Typography variant="h6" style={{ fontWeight: "bold", marginBottom: 1, fontSize: '1rem' }}>
                      {productItem.name}
                    </Typography>
                    {/* ✅ Restored Green Price */}
                    <Typography variant="body1" style={{ marginBottom: 1, color: "green", fontWeight: "bold" }}>
                      ₦{productItem.price.toLocaleString()}
                    </Typography>
                </Card>
              </Box>
            ))}
          </Box>
        ) : (
          !loading && (
            <Box sx={{ textAlign: "center", p: 4 }}>
                <Typography sx={{ fontFamily: "cursive", fontSize: "20px", fontWeight: "bolder" }}>
                  No Products Found
                </Typography>
                {isSearching && (
                    <Button onClick={clearSearch} sx={{ mt: 2 }}>View All</Button>
                )}
            </Box>
          )
        )}
      </Box>
    </Layout>
  );
};

export default Homepage;