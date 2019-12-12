CREATE DATABASE if not exists nas;

CREATE TABLE if not exists nas.uswe(
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_name VARCHAR(64) NOT NULL,
  user_password VARCHAR(64) NOT NULL,
);

CREATE TABLE if not exists nas.permissions(
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_name VARCHAR(64) NOT NULL,
  user_password VARCHAR(64) NOT NULL,
);
