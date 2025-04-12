import {createClient} from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

let isConnected = false;

export const connectToRedis = async () => {
    if (isConnected) {
        console.log("Redis already connected");
        return redisClient;
    }
    
    try {
        await redisClient.connect();
        isConnected = true;
        console.log("Redis connected");
        return redisClient;
    } catch (error) {
        console.log("Redis connection failed", error);
        return redisClient;
    }
}

export const getRedisClient = () => {
    if (!isConnected) {
        console.log("Warning: Redis not connected, trying to connect...");
        connectToRedis().catch(err => console.log("Failed to connect to Redis:", err));
    }
    return redisClient;
}


