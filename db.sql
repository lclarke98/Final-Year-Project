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

CREATE TABLE if not exists nas.addedDrive(
  addedDrive_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  addedDrive_name VARCHAR(64) NOT NULL,
  addedDrive_path VARCHAR(75) NOT NULL,
  addedDrive_raid BOOLEAN NOT NULL
);,

CREATE TABLE if not exists nas.unaddedDrive(
  unaddedDrive_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  unaddedDrive_name VARCHAR(64) NOT NULL,
  unaddedDrive_path VARCHAR(75) NOT NULL,
  unaddedDrive_added BOOLEAN NOT NULL
);,

use nas

insert into user (user_name, user_password) values ('admin', 'admin');