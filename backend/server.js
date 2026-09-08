import "dotenv/config";
import createApp from "./src/app.js";
import dbConnect from "./src/database/dbConnect.js";

const PORT = Number(process.env.PORT) || 3000;

console.log("MONGO URI LOADED:", !!process.env.MONGODB_URI);

dbConnect();

createApp().listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});