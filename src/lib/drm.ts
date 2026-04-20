import crypto from "crypto";

/**
 * DRM Key Management
 *
 * Generates and manages encryption keys for video content.
 * Uses AES-128-CBC encryption (standard for ClearKey DRM).
 *
 * When upgrading to Widevine:
 * - Replace ClearKey with Widevine license server calls
 * - Keep the same key management for content encryption
 */

// Master key derived from app secret - used to generate per-video keys
const MASTER_KEY = process.env.NEXTAUTH_SECRET || "blokschool-drm-master-key-change-me";

/**
 * Generate a deterministic encryption key for a video based on its ID
 * This way the same video always gets the same key without storing keys in DB
 */
export function generateVideoKey(videoId: string): { keyId: string; key: string } {
  // Derive key ID from video ID
  const keyIdHash = crypto
    .createHmac("sha256", MASTER_KEY)
    .update(`keyid:${videoId}`)
    .digest();
  const keyId = keyIdHash.subarray(0, 16).toString("hex");

  // Derive encryption key from video ID
  const keyHash = crypto
    .createHmac("sha256", MASTER_KEY)
    .update(`key:${videoId}`)
    .digest();
  const key = keyHash.subarray(0, 16).toString("hex");

  return { keyId, key };
}

/**
 * Generate a signed streaming token for authenticated video access
 * Expires after a set duration to prevent sharing
 */
export function generateStreamToken(
  userId: string,
  videoId: string,
  expiresInMinutes: number = 60
): string {
  const payload = {
    userId,
    videoId,
    exp: Date.now() + expiresInMinutes * 60 * 1000,
    nonce: crypto.randomBytes(8).toString("hex"),
  };

  const data = JSON.stringify(payload);
  const signature = crypto
    .createHmac("sha256", MASTER_KEY)
    .update(data)
    .digest("hex");

  // Base64URL encode the token
  const token = Buffer.from(`${data}.${signature}`).toString("base64url");
  return token;
}

/**
 * Verify a streaming token
 */
export function verifyStreamToken(
  token: string
): { valid: boolean; userId?: string; videoId?: string } {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const lastDot = decoded.lastIndexOf(".");
    const data = decoded.substring(0, lastDot);
    const signature = decoded.substring(lastDot + 1);

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", MASTER_KEY)
      .update(data)
      .digest("hex");

    if (signature !== expectedSignature) {
      return { valid: false };
    }

    const payload = JSON.parse(data);

    // Check expiration
    if (payload.exp < Date.now()) {
      return { valid: false };
    }

    return {
      valid: true,
      userId: payload.userId,
      videoId: payload.videoId,
    };
  } catch {
    return { valid: false };
  }
}

/**
 * Convert hex key to base64url format (required by ClearKey spec)
 */
export function hexToBase64url(hex: string): string {
  const bytes = Buffer.from(hex, "hex");
  return bytes.toString("base64url");
}
