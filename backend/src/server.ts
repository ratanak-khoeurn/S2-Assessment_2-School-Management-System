import dotenv from "dotenv";
import { createApp } from "./app.js";
import { testDatabaseConnection, sequelize } from "./config/database.js";
import "./models/index.js";

dotenv.config();

const app = createApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 API Server is running on http://localhost:${PORT}`);
  console.log(`📡 Health endpoint available at http://localhost:${PORT}/api/health`);
  
  // Test MySQL connection
  await testDatabaseConnection();
  
  // Automatically synchronize Sequelize models with MySQL if tables do not exist
  try {
    await sequelize.sync({ alter: false });
    console.log("📦 Sequelize models synchronized with MySQL database.");
  } catch (err) {
    console.warn("⚠️ Database sync skipped or database not yet created:", (err as Error).message);
  }
});
