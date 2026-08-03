import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Degrades gracefully rather than crashing: if Upstash isn't configured
// (e.g. local dev, or before that infra is provisioned), every request is
// allowed through instead of the app failing to build a rate limiter at
// all. In production, set UPSTASH_REDIS_REST_URL / _TOKEN and this becomes
// a real sliding-window limiter with no code change.
const isConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const limiter = isConfigured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
      prefix: "tradehub",
    })
  : null;

// Guards the public POST endpoints that create database rows from
// unauthenticated visitors — initiateDownload() (Module 13) and the Lead
// Form submission (Module 14). 5 requests per minute per identifier (IP)
// is generous for a real person, tight for a script.
export async function checkRateLimit(identifier: string): Promise<{ success: boolean }> {
  if (!limiter) return { success: true };
  const { success } = await limiter.limit(identifier);
  return { success };
}
