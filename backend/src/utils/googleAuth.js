import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleCredential = async (credential) => {
  if (!credential) {
    const error = new Error("Google credential is required");
    error.statusCode = 400;
    throw error;
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      const error = new Error("Google token did not contain a valid email");
      error.statusCode = 401;
      throw error;
    }

    if (payload.email_verified !== true) {
      const error = new Error("Google email is not verified");
      error.statusCode = 401;
      throw error;
    }

    return {
      googleId: payload.sub,
      name: payload.name || payload.email.split("@")[0],
      email: payload.email.toLowerCase(),
      picture: payload.picture || "",
      emailVerified: payload.email_verified === true,
    };
  } catch (error) {
    const finalError = new Error(
      error.message || "Google authentication failed",
    );
    finalError.statusCode = 401;
    throw finalError;
  }
};
