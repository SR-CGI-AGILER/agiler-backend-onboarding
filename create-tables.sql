DROP DATABASE `agiler`;
CREATE SCHEMA `agiler` ;
CREATE TABLE `agiler`.`user` (
  `id` VARCHAR(100) NOT NULL,
  `name` VARCHAR(100) NULL,
  `email` VARCHAR(100) NULL,
  `profilePicUrl` VARCHAR(345) NULL,
  PRIMARY KEY (`id`));
CREATE TABLE `agiler`.`team` (
  `teamId` VARCHAR(100) NOT NULL,
  `teamName` VARCHAR(100) NULL,
  `memberId` VARCHAR(100) NOT NULL,
  `projectId` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`teamId`, `memberId`, `projectId`));
create table `agiler`.`session`(`id` VARCHAR(300) NOT NULL, `jwtToken` VARCHAR(745) NULL, PRIMARY KEY(`id`));
