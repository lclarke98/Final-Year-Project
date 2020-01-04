CREATE DATABASE if not exists nas;

CREATE TABLE if not exists nas.user(
  user_name VARCHAR(64) NOT NULL PRIMARY KEY,
  user_password VARCHAR(64) NOT NULL
);

CREATE TABLE if not exists nas.permissions(
  permission_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  addedDrive_name VARCHAR(64) NOT NULL,
  user_name VARCHAR(64) NOT NULL,
  permission_read BOOLEAN NOT NULL,
  permission_write BOOLEAN NOT NULL
);

CREATE TABLE if not exists nas.raid(
  raid_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  raid_target_drive VARCHAR(64) NOT NULL,
  raid_dest_drive VARCHAR(64) NOT NULL
);

CREATE TABLE if not exists nas.addedDrive(
  addedDrive_name VARCHAR(64) NOT NULL PRIMARY KEY,
  addedDrive_path VARCHAR(200) NOT NULL,
  addedDrive_raid BOOLEAN NOT NULL,
  addedDrive_raidTarget VARCHAR(75)
);

CREATE TABLE if not exists nas.unaddedDrive(
  unaddedDrive_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  unaddedDrive_name VARCHAR(64) NOT NULL,
  unaddedDrive_path VARCHAR(200) NOT NULL,
  unaddedDrive_added BOOLEAN NOT NULL
);

use nas

insert into user (user_name, user_password) values ('admin', 'admin');
insert into user (user_name, user_password) values ('root', 'root');
insert into user (user_name, user_password) values ('lclarke', 'lclarke');