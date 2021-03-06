-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema fireworks
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `fireworks` ;

-- -----------------------------------------------------
-- Schema fireworks
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `fireworks` DEFAULT CHARACTER SET utf8 ;
USE `fireworks` ;

-- -----------------------------------------------------
-- Table `fireworks`.`company`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fireworks`.`company` (
  `companyID` INT NOT NULL AUTO_INCREMENT,
  `companyName` VARCHAR(45) NULL,
  `field` VARCHAR(45) NULL,
  `description` VARCHAR(255) NULL,
  PRIMARY KEY (`companyID`),
  UNIQUE INDEX `companyID_UNIQUE` (`companyID` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fireworks`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fireworks`.`user` (
  `userID` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NULL,
  `password` VARCHAR(45) NULL,
  `firstName` VARCHAR(45) NULL,
  `lastName` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  `userType` INT NULL,
  `mail` VARCHAR(45) NULL,
  `employerID` INT NULL,
  `picture` VARCHAR(500) NULL,
  `bio` VARCHAR(500) NULL,
  `title` VARCHAR(100) NULL,
  `location` VARCHAR(100) NULL,
  `companyName` VARCHAR(100) NULL,
  PRIMARY KEY (`userID`),
  UNIQUE INDEX `userID_UNIQUE` (`userID` ASC) VISIBLE,
  INDEX `employerID_idx` (`employerID` ASC) VISIBLE,
  CONSTRAINT `employerID`
    FOREIGN KEY (`employerID`)
    REFERENCES `fireworks`.`company` (`companyID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fireworks`.`meeting`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fireworks`.`meeting` (
  `meetingID` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(255) NULL,
  `startTime` TIME NULL,
  `endTime` TIME NULL,
  `meetingLink` VARCHAR(255) NULL,
  `hostCompanyID` INT NULL,
  `location` VARCHAR(45) NULL,
  `meetingType` INT NULL,
  `eventDate` DATE NULL,
  `title` VARCHAR(255) NULL,
  PRIMARY KEY (`meetingID`),
  UNIQUE INDEX `meetingID_UNIQUE` (`meetingID` ASC) VISIBLE,
  INDEX `hostCompanyID_idx` (`hostCompanyID` ASC) VISIBLE,
  CONSTRAINT `hostCompanyID`
    FOREIGN KEY (`hostCompanyID`)
    REFERENCES `fireworks`.`company` (`companyID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fireworks`.`meetingRSVP`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fireworks`.`meetingRSVP` (
  `meetingId` INT NOT NULL,
  `userId` INT NOT NULL,
  PRIMARY KEY (`meetingId`, `userId`),
  INDEX `meeting_idx` (`meetingId` ASC) VISIBLE,
  INDEX `user_idx` (`userId` ASC) VISIBLE,
  CONSTRAINT `meetingId`
    FOREIGN KEY (`meetingId`)
    REFERENCES `fireworks`.`meeting` (`meetingID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `userId`
    FOREIGN KEY (`userId`)
    REFERENCES `fireworks`.`user` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fireworks`.`post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fireworks`.`post` (
  `companyID` INT NOT NULL,
  `title` VARCHAR(45) NULL,
  `description` VARCHAR(255) NULL,
  `postID` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NULL,
  PRIMARY KEY (`postID`),
  INDEX `postID_idx` (`postID` ASC) VISIBLE,
  INDEX `companyID_idx` (`companyID` ASC) VISIBLE,
  CONSTRAINT `companyID`
    FOREIGN KEY (`companyID`)
    REFERENCES `fireworks`.`company` (`companyID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fireworks`.`friendInvites`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fireworks`.`friendInvites` (
  `addresseeID` INT NOT NULL,
  `senderID` INT NOT NULL,
  `dateSent` DATE NULL,
  `accepted` INT NOT NULL,
  `inviteID` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`inviteID`),
  UNIQUE INDEX `inviteID_UNIQUE` (`inviteID` ASC) VISIBLE,
  INDEX `addresseeID_idx` (`addresseeID` ASC) VISIBLE,
  INDEX `senderID_idx` (`senderID` ASC) VISIBLE,
  CONSTRAINT `addresseeID`
    FOREIGN KEY (`addresseeID`)
    REFERENCES `fireworks`.`user` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `senderID`
    FOREIGN KEY (`senderID`)
    REFERENCES `fireworks`.`user` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `fireworks`.`meetingInvites`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fireworks`.`meetingInvites` (
  `inviteID` INT NOT NULL AUTO_INCREMENT,
  `addresseeID` INT NOT NULL,
  `meetingID` INT NOT NULL,
  `dateSent` DATE NULL,
  `accepted` INT NULL,
  PRIMARY KEY (`inviteID`),
  UNIQUE INDEX `inviteID_UNIQUE` (`inviteID` ASC) VISIBLE,
  INDEX `recipientID_idx` (`addresseeID` ASC) VISIBLE,
  INDEX `meetingID_idx` (`meetingID` ASC) VISIBLE,
  CONSTRAINT `recipientID`
    FOREIGN KEY (`addresseeID`)
    REFERENCES `fireworks`.`user` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `meetingID`
    FOREIGN KEY (`meetingID`)
    REFERENCES `fireworks`.`meeting` (`meetingID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `fireworks`.`rating`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fireworks`.`rating` (
  `ratingID` INT NOT NULL AUTO_INCREMENT,
  `meeting` INT NOT NULL,
  `name` VARCHAR(100) NULL,
  `description` VARCHAR(255) NULL,
  `rating` INT(2) NULL,
  PRIMARY KEY (`ratingID`),
  UNIQUE INDEX `ratingID_UNIQUE` (`ratingID` ASC) VISIBLE,
  INDEX `meeting_idx` (`meeting` ASC) VISIBLE,
  CONSTRAINT `meeting`
    FOREIGN KEY (`meeting`)
    REFERENCES `fireworks`.`meeting` (`meetingID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `fireworks`.`company`
-- -----------------------------------------------------
START TRANSACTION;
USE `fireworks`;
INSERT INTO `fireworks`.`company` (`companyID`, `companyName`, `field`, `description`) VALUES (DEFAULT, 'Amazon', 'Distribution', 'Go online and shop for stuff and get it fast.');
INSERT INTO `fireworks`.`company` (`companyID`, `companyName`, `field`, `description`) VALUES (DEFAULT, 'UPS', 'Distribution', 'We send stuff to you.');
INSERT INTO `fireworks`.`company` (`companyID`, `companyName`, `field`, `description`) VALUES (DEFAULT, 'Walmart', 'Shopping', 'Buy food from us.');
INSERT INTO `fireworks`.`company` (`companyID`, `companyName`, `field`, `description`) VALUES (DEFAULT, 'Brooks Brothers', 'Clothing', 'Buy fancy clothes from us.');
INSERT INTO `fireworks`.`company` (`companyID`, `companyName`, `field`, `description`) VALUES (DEFAULT, 'TaylorMade', 'Sports Equipment', 'Top golf equipment from us.');

COMMIT;


-- -----------------------------------------------------
-- Data for table `fireworks`.`user`
-- -----------------------------------------------------
START TRANSACTION;
USE `fireworks`;
INSERT INTO `fireworks`.`user` (`userID`, `username`, `password`, `firstName`, `lastName`, `phone`, `userType`, `mail`, `employerID`, `picture`, `bio`, `title`, `location`, `companyName`) VALUES (DEFAULT, 'lawrimore', 'abc123', 'John', 'Lawrimore', '1234567000', 1, 'example.email@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `fireworks`.`user` (`userID`, `username`, `password`, `firstName`, `lastName`, `phone`, `userType`, `mail`, `employerID`, `picture`, `bio`, `title`, `location`, `companyName`) VALUES (DEFAULT, 'cannon', '1234', 'Kristina', 'Cannon', '8005882300', 2, 'example.email@gmail.com', 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `fireworks`.`user` (`userID`, `username`, `password`, `firstName`, `lastName`, `phone`, `userType`, `mail`, `employerID`, `picture`, `bio`, `title`, `location`, `companyName`) VALUES (DEFAULT, 'henry', '0000', 'Jordan', 'Spieth', '5436578000', 1, 'example.email@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `fireworks`.`user` (`userID`, `username`, `password`, `firstName`, `lastName`, `phone`, `userType`, `mail`, `employerID`, `picture`, `bio`, `title`, `location`, `companyName`) VALUES (DEFAULT, 'chan', 'password!', 'Will', 'Chan', '9054367854', 3, 'example.email@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `fireworks`.`user` (`userID`, `username`, `password`, `firstName`, `lastName`, `phone`, `userType`, `mail`, `employerID`, `picture`, `bio`, `title`, `location`, `companyName`) VALUES (DEFAULT, 'malhotra', 'helloworld', 'Naishur', 'Malhotra', '4569807600', 2, 'example.email@gmail.com', 4, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `fireworks`.`user` (`userID`, `username`, `password`, `firstName`, `lastName`, `phone`, `userType`, `mail`, `employerID`, `picture`, `bio`, `title`, `location`, `companyName`) VALUES (DEFAULT, 'walsh', 'password123', 'Sam', 'Walsh', '3451236578', 2, 'example.email@gmail.com', 5, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `fireworks`.`user` (`userID`, `username`, `password`, `firstName`, `lastName`, `phone`, `userType`, `mail`, `employerID`, `picture`, `bio`, `title`, `location`, `companyName`) VALUES (DEFAULT, 'rgalante', 'password', 'Riley', 'Galante', '1111110000', 1, 'example.email@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `fireworks`.`meeting`
-- -----------------------------------------------------
START TRANSACTION;
USE `fireworks`;
INSERT INTO `fireworks`.`meeting` (`meetingID`, `description`, `startTime`, `endTime`, `meetingLink`, `hostCompanyID`, `location`, `meetingType`, `eventDate`) VALUES (DEFAULT, 'Meet some of our executives, hear from current employees, and learn about how our business runs.', '12:00', '13:00', 'https://examplelink.com', 1, 'Seattle, WA', 1, '2021-04-29');
INSERT INTO `fireworks`.`meeting` (`meetingID`, `description`, `startTime`, `endTime`, `meetingLink`, `hostCompanyID`, `location`, `meetingType`, `eventDate`) VALUES (DEFAULT, 'Meet some of our executives, hear from current employees, and learn about how our business runs.', '10:00', '11:00', 'https://examplelink.com', 2, 'Dallas, TX', 1, '2021-05-13');
INSERT INTO `fireworks`.`meeting` (`meetingID`, `description`, `startTime`, `endTime`, `meetingLink`, `hostCompanyID`, `location`, `meetingType`, `eventDate`) VALUES (DEFAULT, 'Meet some of our executives, hear from current employees, and learn about how our business runs.', '09:15', '10:00', 'https://examplelink.com', 3, 'Dallas, TX', 0, '2021-05-19');
INSERT INTO `fireworks`.`meeting` (`meetingID`, `description`, `startTime`, `endTime`, `meetingLink`, `hostCompanyID`, `location`, `meetingType`, `eventDate`) VALUES (DEFAULT, 'Meet some of our executives, hear from current employees, and learn about how our business runs.', '15:00', '15:30', 'https://examplelink.com', 4, 'Dallas, TX', 0, '2021-06-10');
INSERT INTO `fireworks`.`meeting` (`meetingID`, `description`, `startTime`, `endTime`, `meetingLink`, `hostCompanyID`, `location`, `meetingType`, `eventDate`) VALUES (DEFAULT, 'Meet some of our executives, hear from current employees, and learn about how our business runs.', '08:00', '10:00', 'https://examplelink.com', 5, 'Dallas, TX', 1, '2021-07-05');

COMMIT;


-- -----------------------------------------------------
-- Data for table `fireworks`.`post`
-- -----------------------------------------------------
START TRANSACTION;
USE `fireworks`;
INSERT INTO `fireworks`.`post` (`companyID`, `title`, `description`, `postID`, `date`) VALUES (1, 'Job Opening', 'example description', NULL, DEFAULT);
INSERT INTO `fireworks`.`post` (`companyID`, `title`, `description`, `postID`, `date`) VALUES (2, 'New Virtual Meeting', 'example description', NULL, DEFAULT);
INSERT INTO `fireworks`.`post` (`companyID`, `title`, `description`, `postID`, `date`) VALUES (3, 'New Webinar', 'example description', NULL, DEFAULT);
INSERT INTO `fireworks`.`post` (`companyID`, `title`, `description`, `postID`, `date`) VALUES (4, 'January Webinar', 'example description', NULL, DEFAULT);
INSERT INTO `fireworks`.`post` (`companyID`, `title`, `description`, `postID`, `date`) VALUES (5, 'August Meeting', 'example description', NULL, DEFAULT);

COMMIT;


-- -----------------------------------------------------
-- Data for table `fireworks`.`rating`
-- -----------------------------------------------------
START TRANSACTION;
USE `fireworks`;
INSERT INTO `fireworks`.`rating` (`ratingID`, `meeting`, `name`, `description`, `rating`) VALUES (DEFAULT, 1, 'Jordan Spieth', 'Informative', '5');
INSERT INTO `fireworks`.`rating` (`ratingID`, `meeting`, `name`, `description`, `rating`) VALUES (DEFAULT, 1, 'Ricky Fowler', 'Too Lengthy', '2');
INSERT INTO `fireworks`.`rating` (`ratingID`, `meeting`, `name`, `description`, `rating`) VALUES (DEFAULT, 2, 'Tiger Woods', 'Did not have time to answer questions', '3');
INSERT INTO `fireworks`.`rating` (`ratingID`, `meeting`, `name`, `description`, `rating`) VALUES (DEFAULT, 4, 'Jordan Spieth', 'Interesting opportunity', '5');
INSERT INTO `fireworks`.`rating` (`ratingID`, `meeting`, `name`, `description`, `rating`) VALUES (DEFAULT, 4, 'Rory Mcilroy', 'Informative', '4');

COMMIT;


-- -----------------------------------------------------
-- Data for table `fireworks`.`friendInvites`
-- -----------------------------------------------------
START TRANSACTION;
USE `fireworks`;
INSERT INTO `fireworks`.`friendInvites` (`addresseeID`, `senderID`, `dateSent`, `accepted`) VALUES (6, 7,'2021-02-11', 0);
INSERT INTO `fireworks`.`friendInvites` (`addresseeID`, `senderID`, `dateSent`, `accepted`) VALUES (6, 5,'2021-02-11', 1);
INSERT INTO `fireworks`.`friendInvites` (`addresseeID`, `senderID`, `dateSent`, `accepted`) VALUES (6, 1,'2021-02-11', 0);
INSERT INTO `fireworks`.`friendInvites` (`addresseeID`, `senderID`, `dateSent`, `accepted`) VALUES (6, 2,'2021-02-11', 0);
INSERT INTO `fireworks`.`friendInvites` (`addresseeID`, `senderID`, `dateSent`, `accepted`) VALUES (6, 3,'2021-02-11', 0);
INSERT INTO `fireworks`.`friendInvites` (`addresseeID`, `senderID`, `dateSent`, `accepted`) VALUES (4, 6,'2021-02-11', 0);
INSERT INTO `fireworks`.`friendInvites` (`addresseeID`, `senderID`, `dateSent`, `accepted`) VALUES (7, 6,'2021-02-11', 1);
INSERT INTO `fireworks`.`friendInvites` (`addresseeID`, `senderID`, `dateSent`, `accepted`) VALUES (1, 7,'2021-02-11', 0);
INSERT INTO `fireworks`.`friendInvites` (`addresseeID`, `senderID`, `dateSent`, `accepted`) VALUES (2, 7,'2021-02-11', 1);
INSERT INTO `fireworks`.`friendInvites` (`addresseeID`, `senderID`, `dateSent`, `accepted`) VALUES (1, 5,'2021-02-11', 0);
INSERT INTO `fireworks`.`friendInvites` (`addresseeID`, `senderID`, `dateSent`, `accepted`) VALUES (2, 5,'2021-02-11', 1);
INSERT INTO `fireworks`.`friendInvites` (`addresseeID`, `senderID`, `dateSent`, `accepted`) VALUES (1, 3,'2021-02-11', 0);
INSERT INTO `fireworks`.`friendInvites` (`addresseeID`, `senderID`, `dateSent`, `accepted`) VALUES (1, 4,'2021-02-11', 1);


COMMIT;