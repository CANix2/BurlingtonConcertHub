CREATE DATABASE IF NOT EXISTS concerts_db;
USE concerts_db;

CREATE TABLE IF NOT EXISTS posts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  artist_name VARCHAR(100) NOT NULL,
  venue       VARCHAR(50),
  rating      TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content     TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);