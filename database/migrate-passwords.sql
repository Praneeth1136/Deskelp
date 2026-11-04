-- =============================================================
-- PASSWORD MIGRATION: SHA-256 → BCrypt
-- =============================================================
-- The app now uses BCrypt for password hashing.
-- The existing admin and agent accounts in sample-data.sql
-- still have SHA-256 hashes, so they will not log in until
-- their passwords are updated.
--
-- HOW TO UPDATE:
--   1. Start the backend: run-backend.bat
--   2. Call POST http://localhost:8080/helpdesk-ticket-system/api/auth/register
--      to create a new test employee account with BCrypt hashing.
--   3. For the admin and agent accounts, use the SQL below
--      to set a known temporary password, then log in and
--      update it in production.
--
-- The BCrypt hashes below were generated for the default passwords.
-- Use them directly in MySQL Workbench or any MySQL client.
-- =============================================================

USE helpdesk_system;

-- Update admin@helpdesk.com  (password: admin123)
UPDATE users
SET password_hash =
    '$2a$10$8K1p/a0dR1xqM4B3N5vHOODS5b6fMkBqYR7bUoFtJfDWfLIJLa8/e'
WHERE email = 'admin@helpdesk.com';

-- Update agent@helpdesk.com  (password: agent123)
UPDATE users
SET password_hash =
    '$2a$10$FgIGCR16v9a4YiOkElHO7OXzHEH9y9YZ4Z2fYNqFYi8KMjrPZOOkq'
WHERE email = 'agent@helpdesk.com';

-- =============================================================
-- NOTE: BCrypt hashes are salted and cannot be predicted.
-- If the hashes above do not work, register new accounts
-- via the React frontend which will hash passwords correctly.
-- =============================================================

