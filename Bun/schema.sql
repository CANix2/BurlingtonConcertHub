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

CREATE TABLE IF NOT EXISTS venues (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  venue       VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS artists (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  artist      VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS venueposts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  venue       VARCHAR(50) NOT NULL,
  title       TEXT NOT NULL,
  content     TEXT
);

CREATE TABLE IF NOT EXISTS artistposts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  artist      VARCHAR(100) NOT NULL,
  title       TEXT NOT NULL,
  content     TEXT
);

CREATE TABLE IF NOT EXISTS accounts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(100) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  name        VARCHAR(50) NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO venueposts (venue, title, content)
SELECT * FROM (VALUES
  ROW('Higher Ground', 'Half Priced Beers At Concerts This Weekend', 'From one hour before the set starts to one hour after the end of the show, all beers will be half priced'),
  ROW('Monkey House', 'Sparkomatik', 'Join us Saturday, April 18th at 8 PM for Sparkomatik'),
  ROW('Radio Bean', 'Open Mic Night Two-for-One Wine', 'Every Thursday during May, all house wines are buy one get one from 7 PM until the last performer wraps up.'),
  ROW('Shelburne Museum', 'Lake Street Dive', 'August 11th and 12th Lake Street Dive will be performing at the Museum Concert Field'),
  ROW('Higher Ground', 'May 3rd julie & Fleshwater', 'On May 3rd julie & Fleshwater will be performing at Higher Ground with Midrift opening. Tickets running low.'),
  ROW('Monkey House', 'April Trivia', 'Join us every Monday in April for trivia starting at 7 PM')
) AS tmp (venue, title, content)
WHERE NOT EXISTS (SELECT 1 FROM venueposts LIMIT 1);

INSERT INTO artistposts (artist, title, content)
SELECT * FROM (VALUES
  ROW('Fleshwater', 'Tickets Running Low', 'Tickets are running low for our concert at Higher Ground on May 3rd. Buy soon before they run out'),
  ROW('Vermont Jazz Ensemble', 'Upcoming show at Higher Ground', 'Join us for our 50th anniversary concert at the Higher Ground Showcase Lounge on April 25th at 7:30 PM'),
  ROW('Sparkomatik', 'Monkey House, April 18th', 'We will be performing at Monkey House on April 18th, 21+, Tickets at door $10 before 10pm, $15 after.'),
  ROW('Roost.World', 'Radio Bean, May 9th', "I'll be playing a set from 11pm to 2am")
) AS tmp (artist, title, content)
WHERE NOT EXISTS (SELECT 1 FROM artistposts LIMIT 1);