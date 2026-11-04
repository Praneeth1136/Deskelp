package com.dinesh.helpdesk.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Date;

/**
 * JwtUtil handles JWT token creation and validation.
 *
 * It reads the signing secret from the environment variable JWT_SECRET
 * if present, falling back to a default value for local development.
 *
 * generateToken() creates a signed token that stores the
 * user's ID, email and role. The token expires after 24 hours.
 *
 * validateToken() verifies the signature and expiry.
 * It returns the decoded token on success, or null on failure.
 */
public class JwtUtil
{
    private static final String DEFAULT_SECRET =
            "deskelp-jwt-default-secret-key-change-in-production";

    // Token lifetime: 24 hours in milliseconds
    private static final long EXPIRY_MS = 24L * 60L * 60L * 1000L;

    private static String getSecret()
    {
        String envSecret = System.getenv("JWT_SECRET");

        if(envSecret != null && !envSecret.trim().isEmpty())
        {
            return envSecret.trim();
        }

        return DEFAULT_SECRET;
    }

    // ----------------------------------------------------------------
    // Generate a signed JWT for a logged-in user
    // ----------------------------------------------------------------

    public static String generateToken(int userId,
                                       String email,
                                       String role)
    {
        Algorithm algorithm = Algorithm.HMAC256(getSecret());

        Date issuedAt = new Date();
        Date expiresAt = new Date(System.currentTimeMillis() + EXPIRY_MS);

        return JWT.create()
                  .withClaim("userId", userId)
                  .withClaim("email", email)
                  .withClaim("role", role)
                  .withIssuedAt(issuedAt)
                  .withExpiresAt(expiresAt)
                  .sign(algorithm);
    }

    // ----------------------------------------------------------------
    // Validate a JWT and return its decoded claims
    // Returns null if the token is invalid or expired
    // ----------------------------------------------------------------

    public static DecodedJWT validateToken(String token)
    {
        try
        {
            Algorithm algorithm = Algorithm.HMAC256(getSecret());

            return JWT.require(algorithm)
                      .build()
                      .verify(token);
        }
        catch(JWTVerificationException e)
        {
            return null;
        }
    }
}
