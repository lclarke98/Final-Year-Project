CREATE DATABASE if not exists nas;

CREATE TABLE if not exists nas.user(
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_name VARCHAR(64) NOT NULL,
  user_password VARCHAR(64) NOT NULL
);

CREATE TABLE if not exists nas.permissions(
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_name VARCHAR(64) NOT NULL,
  user_password VARCHAR(64) NOT NULL
);

CREATE TABLE if not exists nas.file(
  file_path VARCHAR(75) NOT NULL PRIMARY KEY,
  file_modified BIGINT NOT NULL
);

use nas

insert into user (user_name, user_password) values ('admin', 'admin');