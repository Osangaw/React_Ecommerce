import { Box, Card, Typography } from "@mui/material"; 
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAllProducts } from "../../actions/product.Action";
import Layout from "../../components/layout";
 

const Homepage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productState = useSelector((state) => state.product);
  const products = productState?.products || [];
  const loading = productState?.loading || false;

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  return (
    <Layout> 
      <Box sx={{ borderRadius: 4, height: "100%" }}>
        {loading && (
          <Typography style={{ textAlign: "center", fontFamily: "cursive", fontSize: "20px" }}>
            Loading products...
          </Typography>
        )}

        {products && products.length > 0 ? (
          <Box style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
            {products.map((productItem) => (
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
                    "&:hover": { transform: "scale(1.03)", boxShadow: "0 6px 18px rgba(0,0,0,0.15)" },
                  }}
                  onClick={() => navigate(`/product/${productItem._id}`)}
                >
                    <Box style={{ width: "100%", height: 150, overflow: "hidden", borderRadius: 3, marginBottom: 16 }}>
                      {/* ✅ USING 'productItem.image' DIRECTLY */}
                      <img
                        src={productItem.image || "https://via.placeholder.com/150"}
                        alt={productItem.name}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </Box>
                    <Typography variant="h6" style={{ fontWeight: "bold", marginBottom: 1, fontSize: '1rem' }}>
                      {productItem.name}
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: 1, color: "green", fontWeight: "bold" }}>
                      ₦{productItem.price}
                    </Typography>
                </Card>
              </Box>
            ))}
          </Box>
        ) : (
          !loading && (
            <Typography sx={{ fontFamily: "cursive", fontSize: "20px", fontWeight: "bolder", textAlign: "center", p: 4 }}>
              No Products Available
            </Typography>
          )
        )}
      </Box>
    </Layout>
  );
};

export default Homepage;