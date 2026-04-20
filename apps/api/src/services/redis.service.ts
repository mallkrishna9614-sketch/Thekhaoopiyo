import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
export const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('Redis connected successfully');
  }
}

export async function setOTP(phone: string, hash: string): Promise<void> {
  // 5-minute expiry (300 seconds)
  await redisClient.setEx(`otp:${phone}`, 300, hash);
}

export async function getOTP(phone: string): Promise<string | null> {
  return await redisClient.get(`otp:${phone}`);
}

export async function clearOTP(phone: string): Promise<void> {
  await redisClient.del(`otp:${phone}`);
}

export async function checkRateLimit(phone: string): Promise<boolean> {
  const key = `ratelimit:otp:${phone}`;
  const requests = await redisClient.incr(key);
  
  if (requests === 1) {
    // 10 minute window (600 seconds)
    await redisClient.expire(key, 600);
  }
  
  // Max 3 requests per 10 mins
  return requests <= 3;
}

export async function recordFailedAttempt(phone: string): Promise<boolean> {
  const key = `lockout:${phone}`;
  const attempts = await redisClient.incr(key);
  
  if (attempts === 1) {
    // Lockout attempt tracks for 10 minutes perhaps? Or permanent 30 min lock
    await redisClient.expire(key, 1800); // lock window
  }
  
  return attempts >= 5; // true if locked
}
