import 'dotenv/config';
import app from "./src/app.js";
import redisClient from "./src/config/redis.js";
import { connectToRedis } from "./src/services/redisService.js";

/*try {
  redisClient.connect();
  console.log("initial redis connection established successfully.");
} catch (error) {
  console.error(" initial redis connection failed:", error.message);
}*/
await connectToRedis();
 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

