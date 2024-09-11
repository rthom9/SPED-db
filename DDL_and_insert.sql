SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;
-- -----------------------------------------------------
-- Schema lab_tests
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS lab_tests ;

-- -----------------------------------------------------
-- Schema lab_tests
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS lab_tests DEFAULT CHARACTER SET utf8 ;
USE lab_tests;

-- -----------------------------------------------------
-- Table Patients
-- -----------------------------------------------------
DROP TABLE IF EXISTS Patients;
CREATE TABLE IF NOT EXISTS Patients (
  patientID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(145) NOT NULL,
  lastName VARCHAR(145) NOT NULL,
  dateOfBirth DATE NOT NULL,
  sex VARCHAR(1) NULL,
  phoneNumber VARCHAR(15) NULL,
  address VARCHAR(200) NULL,
  email VARCHAR(45) NULL)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table Specimens
-- -----------------------------------------------------
DROP TABLE IF EXISTS Specimens;
CREATE TABLE Specimens (
  specimenID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  patientID INT,
  collectionDate DATETIME NOT NULL,
  FOREIGN KEY (patientID) REFERENCES Patients (patientID)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table LaboratoryTests
-- -----------------------------------------------------
DROP TABLE IF EXISTS LaboratoryTests;
CREATE TABLE LaboratoryTests (
  laboratoryTestID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(45) NOT NULL UNIQUE,
  lowerLimit FLOAT NOT NULL,
  upperLimit FLOAT NOT NULL,
  unit VARCHAR(45) NOT NULL,
  isActive TINYINT(1) NOT NULL DEFAULT 1,
  comment VARCHAR(245) NULL)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table Facilities
-- -----------------------------------------------------
DROP TABLE IF EXISTS Facilities;
CREATE TABLE Facilities (
  facilityID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(145) NOT NULL,
  address VARCHAR(245) NOT NULL,
  isActive TINYINT(1) NOT NULL DEFAULT 1)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table Results
-- -----------------------------------------------------
DROP TABLE IF EXISTS Results;
CREATE TABLE Results (
  resultID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  specimenID INT NOT NULL,
  laboratoryTestID INT NOT NULL,
  facilityID INT,
  reportedDate DATETIME NOT NULL,
  value FLOAT NOT NULL,
  isSpoiled TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (specimenID) REFERENCES Specimens (specimenID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
FOREIGN KEY (laboratoryTestID) REFERENCES LaboratoryTests (laboratoryTestID)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
FOREIGN KEY (facilityID) REFERENCES Facilities (facilityID)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table FacilityHasTests
-- -----------------------------------------------------
CREATE TABLE FacilityHasTests (
  FacilityHasTestID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  laboratoryTestID INT NOT NULL,
  facilityID INT,
  FOREIGN KEY (laboratoryTestID) REFERENCES LaboratoryTests (laboratoryTestID)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
FOREIGN KEY (facilityID) REFERENCES Facilities (facilityID)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;

SET FOREIGN_KEY_CHECKS=1;
COMMIT;

----------------------------------------------------------
-- SAMPLE DATA INSERT STATEMENTS
----------------------------------------------------------

INSERT INTO Patients ( firstName, lastName, dateOfBirth, sex, phoneNumber, address, email)
VALUES
    ('George', 'Foreman', '1960-05-02', 'M', '14085555343', '10600 W Edna Rr, Idaho, USA, 83705', 'george_foreman@gmail.com'),
    ('Donald', 'Duck', '1946-02-12', 'M', '14075553241', '12 Richard Street, Boise, Idaho, USA, 94823', 'donald_duck@gmail.com'),
    ('Randy', 'Marsh', '1968-07-16', 'M', '14085551234', '2001 N AppleBrook Way, Idaho, USA, 83706', 'randymarsh68@hotmail.com'),
    ('Cindy', 'Chan', '1989-05-13', 'F', '14085554364', '201 W California Way, Idaho, USA, 83707', 'cindychan89@aol.com');

INSERT INTO Specimens (patientID, collectionDate)
VALUES
    (1, '2023-04-27 10:30:12'),
    (2, '2023-06-21 14:13:45'),
    (3, '2023-07-02 23:12:45'),
    (3, '2023-08-03 12:15:05'),
    (4, '2024-01-04 05:16:32');

INSERT INTO LaboratoryTests (name, lowerLimit, upperLimit, unit, isActive, comment)
VALUES
    ('Hemoglobin', 120, 160, 'g/L', 1, 'Based on instrument vendor recommendation'),
    ('A1c', 4, 5.6, '%', 1, NULL),
    ('Sodium', 135, 145, 'mmol/Eq', 1, 'Provided by heart.org'),
    ('Prothrombin Time', 0.8, 1.1, 's', 1, NULL);
    
INSERT INTO Facilities (name, address, isActive)
VALUES
    ('DynaLife Meadows', '123 Pleasant Street, Boise, Idaho, 92562', 1),
    ('LifeLabs', '984 Bumpy Road, Boise, Idaho, 90432', 1),
    ('Diagnostic Centre', '15a Crumpet Way, Boise, Idaho, 14287', 1),
    ('Test’N’Go', '1423 Centre Street, Boise, Idaho, 52398', 1),
    ('Bloodtests ‘R Us', '42 Somerset Boulevard, Boise, Idaho, 94623', 1);

INSERT INTO FacilityHasTests (laboratoryTestID, facilityID)
VALUES
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 2),
    (4, 3),
    (1, 3);

INSERT INTO Results (specimenID, laboratoryTestID, facilityID, reportedDate, value, isSpoiled)
VALUES
    (1, 1, 1, '2023-04-28 12:31:16', 135, 0),
    (1, 2, 2, '2023-04-29 13:51:22', 6.2, 0),
    (2, 4, 3, '2023-06-22 10:26:42', 0.9, 0),
    (3, 2, 3, '2023-07-05 14:31:32', 5.2, 0),
    (3, 3, 3, '2023-07-04 15:22:12', 140, 1);
    
