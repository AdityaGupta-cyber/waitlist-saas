import {createClient} from "redis";

const redisClient = createClient({
    url: "redis://127.0.0.1:6000",
})

export const connectToRedis = async () => {
    return await redisClient.connect();
}


export const getRedisClient = () => {
    return redisClient;
}


