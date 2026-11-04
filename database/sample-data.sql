USE helpdesk_system;

-- Sample Support Agent Account (Password: agent123)
INSERT INTO users
(
    full_name,
    email,
    password_hash,
    role
)
VALUES
(
    'Support Agent',
    'agent@helpdesk.com',
    '$2a$10$FUAMqFTRCDmmmLTZ0VCTF.j03xdoP0nKQjCPAnMOIzZsK9km6kvVO',
    'AGENT'
)
ON DUPLICATE KEY UPDATE
    full_name = VALUES(full_name),
    password_hash = VALUES(password_hash),
    role = VALUES(role);

-- Sample Administrator Account (Password: admin123)
INSERT INTO users
(
    full_name,
    email,
    password_hash,
    role
)
VALUES
(
    'System Administrator',
    'admin@helpdesk.com',
    '$2a$10$kqj8Pqc39KIRAh0LtLqLMeFQLNIYn1qqqYpe.HUwMAT/4kfwdoNki',
    'ADMIN'
)
ON DUPLICATE KEY UPDATE
    full_name = VALUES(full_name),
    password_hash = VALUES(password_hash),
    role = VALUES(role);
