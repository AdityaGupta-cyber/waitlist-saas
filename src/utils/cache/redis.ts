import {createClient} from "redis";

const redisClient = createClient({
    url: "redis://127.0.0.1:6000",
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
    return redisClient;
}


