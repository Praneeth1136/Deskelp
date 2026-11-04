package com.dinesh.helpdesk.util;

import org.mindrot.jbcrypt.BCrypt;

/**
 * PasswordUtil provides BCrypt password hashing.
 *
 * hashPassword()  hashes a plain-text password before storing it.
 * checkPassword() verifies a plain-text password against its hash.
 *
 * BCrypt is safer than SHA-256 because it is intentionally slow
 * and uses a unique random salt for every hash.
 */
public class PasswordUtil
{
    // Cost factor: higher = slower = harder to brute-force
    private static final int BCRYPT_ROUNDS = 10;

    // ----------------------------------------------------------------
    // Hash a plain-text password
    // ----------------------------------------------------------------

    public static String hashPassword(String password)
    {
        return BCrypt.hashpw(
                password,
                BCrypt.gensalt(BCRYPT_ROUNDS));
    }

    // ----------------------------------------------------------------
    // Verify a plain-text password against a BCrypt hash
    // ----------------------------------------------------------------

    public static boolean checkPassword(String plainPassword,
                                        String hashedPassword)
    {
        return BCrypt.checkpw(plainPassword, hashedPassword);
    }
}
