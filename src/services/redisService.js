//import * as noteRepository from "../repositories/notesRepository.js";
//import AppError from "../utils/AppError.js";
//import { analyzeContentFromNote } from "./geminiService.js";

import redisClient from "../config/redis.js";

var isConnected = false;
const RETRYDURATION = 60;

//establishing connection and setting the custom made flag isConnected to track connection status
redisClient.on("connect", () => {
    isConnected = true;
    console.log("Redis connected successfully");
});

//handling redis connecition error and setting timeout to retry for connection in specific interval
redisClient.on("error", (err) => {
    isConnected = false;
    console.error("Redis Error:", err);
    console.log("Retrying Redis connection after " + RETRYDURATION + " sec...");
    setTimeout(() => {
        connectToRedis();
    }, RETRYDURATION * 1000);



});



//fucntion to establish connection to redis

export const connectToRedis = async () => {
    if (!isConnected) {
        try {
            await redisClient.connect();
            console.log("Redis connection established successfully.");
        } catch (error) {
            console.error("Redis connection failed:", error.message);




        }
    }
};

//get cache data funcntion, checks connection before performing operation

export const getCache = async (key) => {
    if (!isConnected) {
        console.log("Redis is offline; cannot get cache.");
        return null;
    }

    try {
        const value = await redisClient.get(key);
        return value;
    } catch (error) {
        console.error("Failed to get cache from Redis:", error.message);
        return null;
    }

};

//set cache function, checks connection before performing operation

export const setCache = async (key, value, expirationInSeconds) => {
    if (!isConnected) {
        console.log("Redis is offline; cannot set cache.");
        return;
    }

    try {
        await redisClient.set(key, value, {
            EX: expirationInSeconds,
        });
    } catch (error) {
        console.error("Failed to set cache in Redis:", error.message);
    }
};

//delete cache function

export const deleteCache = async (key) => {
    if (!isConnected) {
        console.log("Redis is offline; cannot delete cache.");
        return;
    }

    try {
        await redisClient.del(key);
    } catch (error) {
        console.error("Failed to delete cache from Redis:", error.message);
    }
};

//increment cache count
export const incrementCache = async (key, expirationInSeconds) => {
    if (!isConnected) {
        return null;
    }

    try {
        //built in redis INCR to count increment
        const count = await redisClient.incr(key);

        // setting expiration time at first increment
        if (count === 1) {
            await redisClient.expire(key, expirationInSeconds);
        }
        return count;
    } catch (error) {
        console.error("Failed to increment cache:", error.message);
        return null;
    }
};