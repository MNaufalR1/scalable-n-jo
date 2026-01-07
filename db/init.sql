CREATE TABLE IF NOT EXISTS visits (
    id SERIAL PRIMARY KEY,
    user_agent VARCHAR(255),
    ip_address VARCHAR(45),
    visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_visit_time ON visits(visit_time DESC);

INSERT INTO visits (user_agent, ip_address) VALUES
('Mozilla/5.0', '192.168.1.1'),
('Chrome/120.0', '192.168.1.2'),
('Safari/17.0', '192.168.1.3');
