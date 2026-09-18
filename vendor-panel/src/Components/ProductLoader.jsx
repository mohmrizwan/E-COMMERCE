import { Box, CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress
        size={40}
        thickness={4}
        sx={{ color: "#6C3BFF" }}
      />
    </Box>
  );
};

export default Loader;