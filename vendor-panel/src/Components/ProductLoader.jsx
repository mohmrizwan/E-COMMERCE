import { Box, CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <Box
      className="flex min-h-[60vh] w-full items-center justify-center"
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