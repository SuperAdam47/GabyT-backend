DROP TABLE IF EXISTS `gPrompts`;
CREATE TABLE `gPrompts` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `promptName` varchar(255) NOT NULL,
  `persona` varchar(10000) NOT NULL,
  `prompt` text NOT NULL,
  `referencelink` varchar(500) NOT NULL,
  `public` int(11) NOT NULL,
  `active` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
);

DROP TABLE IF EXISTS `transaction`;
CREATE TABLE `transaction` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(255) NOT NULL,
  `action` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
);

DROP TABLE IF EXISTS `uploadedFiles`;
CREATE TABLE `uploadedFiles` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `fileType` varchar(10) NOT NULL,
  `filePath` varchar(1000) NOT NULL,
  `ref` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
);

DROP TABLE IF EXISTS `userProfile`;
CREATE TABLE `userProfile` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `firstName` varchar(256) NOT NULL,
  `lastName` varchar(256) NOT NULL,
  `title` varchar(96) NOT NULL,
  `avatar` varchar(256) NOT NULL,
  `companyName` varchar(96) NOT NULL,
  `role` varchar(24) NOT NULL,
  `address` varchar(256) NOT NULL,
  `city` varchar(256) NOT NULL,
  `state` varchar(11) NOT NULL,
  `zip` varchar(11) NOT NULL,
  `country` varchar(11) NOT NULL,
  `telnumber` varchar(11) NOT NULL,
  `about` text NOT NULL,
  `notif_optin` int(11) NOT NULL,
  `plan` varchar(10) NOT NULL,
  PRIMARY KEY (`ID`)
);

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(96) NOT NULL,
  `email` varchar(96) NOT NULL,
  `password` varchar(128) NOT NULL,
  `2FATempPwd` varchar(6) NOT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `LastLogin` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `blacklist` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
);