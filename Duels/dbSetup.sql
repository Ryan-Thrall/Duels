-- Active: 1673901019517@@SG-PersonalProjects-6940-mysql-master.servers.mongodirector.com@3306@Duels

-- Accounts SQL

CREATE TABLE
    IF NOT EXISTS accounts(
        id VARCHAR(255) NOT NULL primary key COMMENT 'primary key',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Time Created',
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last Update',
        name varchar(255) COMMENT 'User Name',
        email varchar(255) COMMENT 'User Email',
        picture varchar(255) COMMENT 'User Picture'
    ) default charset utf8 COMMENT '';

SELECT * FROM accounts;

-- Games SQL

CREATE TABLE
    IF NOT EXISTS games(
        id INT NOT NULL AUTO_INCREMENT primary key COMMENT 'primary key',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Time Created',
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last Update',
        creatorId VARCHAR(255),
        title VARCHAR(255),
        playerCount INT DEFAULT 0,
        playerLimit INT NOT NULL,
        isPrivate TINYINT NOT NULL,
        isRanked TINYINT NOT NULL,
        password VARCHAR(255),
        mapId INT NOT NULL,
        status VARCHAR(255),
        winnerId INT,
        Foreign Key (creatorId) REFERENCES accounts(id),
        Foreign Key (winnerId) REFERENCES players(id) -- Foreign Key (mapId) REFERENCES maps(id)
    ) default charset utf8 COMMENT '';

SELECT * FROM games;

-- Player SQL

CREATE TABLE
    IF NOT EXISTS players(
        id INT NOT NULL AUTO_INCREMENT primary key COMMENT 'primary key',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Time Created',
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last Update',
        creatorId VARCHAR(255),
        faction VARCHAR(255),
        playerNum INT NOT NULL DEFAULT 0,
        gameId INT NOT NULL,
        status VARCHAR(255),
        Foreign Key (creatorId) REFERENCES accounts(id),
        Foreign Key (gameId) REFERENCES games(id)
    ) default charset utf8 COMMENT '';

SELECT * FROM players;

SELECT
    p.*,
    g.id AS gid,
    a.id as aid
FROM players p
    JOIN accounts a on a.id = p.creatorId
    LEFT JOIN games g on g.id = p.gameId
WHERE p.gameId = 2
GROUP BY p.id;