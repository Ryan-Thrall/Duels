-- Active: 1673901019517@@SG-PersonalProjects-6940-mysql-master.servers.mongodirector.com@3306@Duels

CREATE TABLE
    IF NOT EXISTS accounts(
        id VARCHAR(255) NOT NULL primary key COMMENT 'primary key',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Time Created',
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last Update',
        name varchar(255) COMMENT 'User Name',
        email varchar(255) COMMENT 'User Email',
        picture varchar(255) COMMENT 'User Picture'
    ) default charset utf8 COMMENT '';

CREATE TABLE
    IF NOT EXISTS games(
        id VARCHAR(255) NOT NULL primary key COMMENT 'primary key',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Time Created',
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last Update',
        creatorId VARCHAR(255),
        title VARCHAR(255),
        playerCount MEDIUMINT,
        playerLimit INT NOT NULL,
        isPrivate TINYINT NOT NULL,
        password VARCHAR(255),
        mapId INT NOT NULL,
        status VARCHAR(255),
        winnerId INT,
        Foreign Key (creatorId) REFERENCES accounts(id) -- Foreign Key (winnerId) REFERENCES players(id)
        -- Foreign Key (mapId) REFERENCES maps(id)
    ) default charset utf8 COMMENT '';