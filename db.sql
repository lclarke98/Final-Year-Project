CREATE DATABASE if not exists nas;

CREATE TABLE if not exists nas.user(
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_name VARCHAR(64) NOT NULL,
  user_password VARCHAR(88) NOT NULL,
  CONSTRAINT user_unique UNIQUE (user_name)
);

CREATE TABLE if not exists nas.unaddedDrive(
  unaddedDrive_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  unaddedDrive_name VARCHAR(64) NOT NULL,
  unaddedDrive_path VARCHAR(200) NOT NULL,
  unaddedDrive_added BOOLEAN NOT NULL,
  CONSTRAINT unaddedDrive_unique UNIQUE (unaddedDrive_path)
);

CREATE TABLE if not exists nas.addedDrive(
  addedDrive_name VARCHAR(64) NOT NULL PRIMARY KEY,
  addedDrive_path VARCHAR(200) NOT NULL
);

CREATE TABLE if not exists nas.permissions(
  permission_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  addedDrive_name VARCHAR(64) NOT NULL,
  user_id INT NOT NULL,
  permission_read BOOLEAN NOT NULL,
  permission_write BOOLEAN NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (addedDrive_name) REFERENCES addedDrive(addedDrive_name) ON DELETE CASCADE
);

use nas

insert into user (user_name, user_password) values ('admin', 'sha1$e1dd8d92$1$3fb49fc188c65cc2eae99f2c587e52160ea0fbe2');
insert into user (user_name, user_password) values ('root', 'root');
insert into user (user_name, user_password) values ('lclarke', 'lclarke');

