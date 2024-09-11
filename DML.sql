-- Data Manipulation Queries
-- All database CRUD operations are listed and grouped for each file (patients.js, specimens.js, facilities.js, laboratoryTests.js and results.js)
-- ALL operations are listed in the order in which they appear in respective js file

-------------------------- CRUD Operations for patients.js -------------------------------------
-- READ to obtain all Patients entries
SELECT 
    * 
FROM 
    Patients
ORDER BY 
    lastName ASC;

-- CREATE Patient
INSERT INTO
    Patients (
        firstName,
        lastName,
        dateOfBirth,
        sex,
        phoneNumber,
        address,
        email
    )
VALUES
    (
        :patient_firstName_from_ui,
        :patient_lastName_from_ui,
        :patient_dateOfBirth_from_ui,
        :patient_sex_from_ui,
        :patient_phoneNumber_from_ui,
        :patient_address_from_ui,
        :patient_email_from_ui
    );

-- DELETE Patient
DELETE FROM
    Patients
WHERE
    patientID = :patientID_passed_from_ui;

-- UPDATE Patient
UPDATE
    Patients
SET
    firstName = :patient_firstName_from_ui,
    lastName = :patient_lastName_from_ui,
    dateOfBirth = :patient_dateOfBirth_from_ui,
    sex = :patient_sex_from_ui,
    email = :patient_email_from_ui,
    phoneNumber = :patient_phoneNumber_from_ui,
    address = :patient_address_from_ui,
WHERE
    patientID = :patientID_passed_from_ui;


---------------------- CRUD Operations for Specimens.js ----------------------------------------
-- READ Specimen Data to populate specimen page
SELECT
    specimenID,
    Patients.firstName,
    Patients.lastName,
    collectionDate
FROM
    Specimens
    JOIN Patients ON Specimens.patientID = Patients.patientID
ORDER BY 
    Patients.lastName ASC;

-- READ for patients drop-down selection
SELECT 
    patientID, firstName, lastName 
FROM 
    Patients;

-- CREATE Specimen
INSERT INTO
    Specimens (patientID, collectionDate,)
VALUES
    (
        :patientID_passed_from_ui,
        :collectionDate_from_ui
    );

-- DELETE Specimen
DELETE FROM
    Specimens
WHERE
    specimenID = :specimenID_passed_from_ui;

-- UPDATE Specimen
UPDATE
    Specimens
SET
    patientID = :patientID_passed_from_ui,
    collectionDate = :collectionDate_from_ui
WHERE
    specimenID = :specimenID_passed_from_ui;


---------------------- CRUD Operations for Facilities.js -----------------------------------------
-- READ Facility Data to populate facility list page
SELECT
    Facilities.facilityID,
    Facilities.name as facilityName,
    Facilities.address,
    Facilities.isActive,
    laboratorytests.laboratoryTestID,
    laboratorytests.name as testName
FROM
    Facilities
LEFT JOIN FacilityHastests ON Facilities.facilityID = FacilityHastests.facilityID
LEFT JOIN LaboratoryTests on FacilityHasTests.laboratoryTestID = LaboratoryTests.laboratoryTestID
ORDER BY Facilities.facilityName ASC

-- READ to obtain laboratoryTest name
SELECT 
    laboratoryTestID, 
    name 
FROM LaboratoryTests;

-- CREATE Facility
INSERT INTO
    Facilities (name, address, isActive)
VALUES
    (:facility_name_from_ui,
    :facility_address_from_ui,
    :facility_isActive_from_ui);

-- READ to obtain facilityID from facility name
SELECT 
    facilityID 
FROM 
    Facilities 
WHERE 
    name = :name_from_ui

-- READ to obtain laboratoryTestID from test name
SELECT 
    laboratoryTestID 
FROM 
    LaboratoryTests 
WHERE 
    name = :testName_from_ui

-- CREATE to insert appropriate entry into FacilityHasTests
INSERT INTO 
    FacilityHasTests (laboratoryTestID, facilityID) 
VALUES 
    (:testID_from_UI, 
    :facilityID_from_UI)

-- Update Facility name, address, active status
UPDATE 
    Facilities 
SET 
    name = :name_from_ui, 
    address = :address_from_is, 
    isActive = :active_from_ui 
WHERE 
    facilityID = :facilityID_from_ui;

-- DELETE all Facility associated FacilityHasTests entries
DELETE FROM 
    FacilityHasTests 
WHERE 
    facilityID = :facilityID_from_ui;

-- CREATE FacilityHasTests entry
INSERT INTO 
    FacilityHasTests (laboratoryTestID, facilityID) 
VALUES (:testID_from_UI, :facilityID_from_UI)

-- DELETE Facility record
DELETE FROM
    Facilities
WHERE
    facilityID = :facility_ID_passed_from_ui;


------------------------ CRUD Operations for LaboratoryTests.js -----------------------------------
-- READ to obtain all LaboratoryTests entries
SELECT 
    * 
FROM 
    LaboratoryTests
ORDER BY 
    name ASC;

-- CREATE Laboratory Test
INSERT INTO
    LaboratoryTests (
        name,
        lowerLimit,
        upperLimit,
        unit,
        isActive,
        comment
    )
VALUES
    (
        :laboratory_test_name_from_ui,
        :laboratory_test_lowerLimit_from_ui,
        :laboratory_test_upperLimit_from_ui,
        :laboratory_test_unit_from_ui,
        :laboratory_test_isActive_from_ui,
        :laboratory_test_comment_from_ui
    );

-- UPDATE Laboratory Test
UPDATE
    LaboratoryTests
SET
    name = :laboratory_test_name_from_ui,
    lowerLimit = :laboratory_test_lowerLimit_from_ui,
    upperLimit = :laboratory_test_upperLimit_from_ui,
    unit = :laboratory_test_unit_from_ui,
    isActive = :laboratory_test_isActive_from_ui,
    comment = :laboratory_test_comment_from_ui
WHERE
    labTestID = :labTestID_passed_from_ui;


----------------------------- CRUD Operations for Results.js ---------------------------------------
-- READ to obtain all Specimens and Results data to be used to create drop-down selections
SELECT
    resultID,
    Patients.firstName,
    Patients.lastName,
    Results.specimenID,
    LaboratoryTests.name as testName,
    Facilities.name as facilityName,
    reportedDate,
    value,
    isSpoiled
FROM 
    Results
    JOIN Specimens ON Results.specimenID = Specimens.specimenID
    JOIN Patients ON Specimens.patientID = Patients.patientID
    JOIN LaboratoryTests ON Results.laboratoryTestID = LaboratoryTests.laboratoryTestID
    JOIN Facilities ON Results.facilityID = Facilities.facilityID
ORDER BY Patients.lastName ASC;

-- READ to obtain Patient data from Specimens to populate drop-down selection
SELECT 
    Specimens.specimenID, 
    Patients.patientID, 
    Patients.firstName, 
    Patients.lastName
FROM 
    Specimens
    LEFT JOIN Patients ON Specimens.patientID = Patients.patientID
WHERE 
    Patients.patientID is not null;

-- READ to obtain Laboratory Test name
SELECT 
    laboratoryTestID, 
    name 
FROM 
    LaboratoryTests;

-- READ to obtain Facility name
SELECT 
    facilityID, 
    name as facilityName 
FROM 
    Facilities;

-- CREATE to add Result entry
INSERT INTO Results
    (specimenID,
    laboratoryTestID,
    facilityID,
    reportedDate,
    value,
    isSpoiled)
VALUES
    (:patientSpecimenID_from_UI,
    :laboratoryTestID_from_UI,
    :facilityID_from_UI,
    :reportedDate_from_UI,
    :resultValue_from_UI,
    :isSpoiled_from_UI);

-- DELETE from Results
DELETE FROM 
    Results 
WHERE 
    resultID = :resultID_from_UI

-- UPDATE Result
UPDATE 
    Results 
SET 
    specimenID = :patientSpecimenID_from_UI, 
    laboratoryTestID = :laboratoryTestID_from_UI, 
    facilityID = :facilityID_from_UI, 
    reportedDate = :reportedDateTime_from_UI, 
    value = :resultValue_from_UI, 
    isSpoiled = :isSpoiled_from_UI 
WHERE 
    resultID = :resultID_from_UI

