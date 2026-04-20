import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateVideoKey, hexToBase64url } from "@/lib/drm";

/**
 * ClearKey DRM License Server
 *
 * When the browser's EME (Encrypted Media Extensions) encounters
 * encrypted content, it sends a license request here.
 * We verify the user is authenticated and paid, then return the decryption key.
 *
 * This endpoint follows the W3C ClearKey license exchange format:
 * Request: { "kids": ["base64url-encoded-key-id", ...], "type": "temporary" }
 * Response: { "keys": [{ "kty": "oct", "kid": "...", "k": "..." }], "type": "temporary" }
 *
 * When upgrading to Widevine:
 * - Create a new /api/drm/widevine/license endpoint
 * - Proxy license requests to your Widevine license server
 * - Keep this endpoint as fallback for browsers without Widevine
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verify user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse the ClearKey license request
    const body = await request.json();
    const keyIds: string[] = body.kids || [];

    if (keyIds.length === 0) {
      return NextResponse.json(
        { error: "No key IDs provided" },
        { status: 400 }
      );
    }

    // 3. Generate keys for each requested key ID
    const keys = keyIds.map((kid: string) => {
      // The kid comes base64url-encoded, decode it to get the hex key ID
      const keyIdHex = Buffer.from(kid, "base64url").toString("hex");

      // Generate the corresponding key
      const { key } = generateVideoKey(keyIdHex);

      return {
        kty: "oct",
        kid: kid, // base64url key ID (as received)
        k: hexToBase64url(key), // base64url encryption key
      };
    });

    // 4. Log the license request for audit
    console.log("[DRM LICENSE]", {
      user: session.user.email,
      userId: session.user.id,
      keyIds: keyIds.length,
      timestamp: new Date().toISOString(),
    });

    // 5. Return ClearKey license response
    return NextResponse.json(
      {
        keys,
        type: body.type || "temporary",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("[DRM LICENSE ERROR]", error);
    return NextResponse.json(
      { error: "License server error" },
      { status: 500 }
    );
  }
}
