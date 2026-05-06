import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    // stops background polling
    reconnectStrategy: false, 
    // Quick timeout so background attempts don't linger too long
    connectTimeout: 1000 
  },

  /*socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.log(
          "Redis reconnect stopped after 5 attempts"
        );
        return new Error("Redis unavailable");
      }

      return Math.min(retries * 100, 3000);
    },
  },*/
});

// redisClient.on("connect", () => {
//     console.log("redis connected successfully");
// });


// redisClient.on("error", (err) => {
//     console.error("Redis Error:", err);
// });


//redisClient.connect().catch((error) => { console.error("first redis connection failed",error.message);});

export default redisClient;