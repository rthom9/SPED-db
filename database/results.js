// Reference: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Scope: File
// Date: 03 / 16 / 2024
// Originality: Adapted
// Purpose: This file is used to execute queries.
const { executeQuery } = require('./db-connector');
const { changeCollectionDateTimestamp } = require('./utils');

async function getAllResults(req, res) {
    try {
        let allSpecimensQuery = `
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
        FROM Results
        JOIN Specimens ON Results.specimenID = Specimens.specimenID
        JOIN Patients ON Specimens.patientID = Patients.patientID
        JOIN LaboratoryTests ON Results.laboratoryTestID = LaboratoryTests.laboratoryTestID
        JOIN Facilities ON Results.facilityID = Facilities.facilityID
        ORDER BY Patients.lastName ASC;`;
        const { rows, fields } = await executeQuery(allSpecimensQuery);
        rows.forEach(row => {
            row.reportedDate = changeCollectionDateTimestamp(row.reportedDate);
        });

        let patientQuery = `
        SELECT Specimens.specimenID, Patients.patientID, Patients.firstName, Patients.lastName
        FROM Specimens
        LEFT JOIN Patients ON  Specimens.patientID = Patients.patientID
        WHERE Patients.patientID is not null;
`; // Define our query
        const { rows: patientData } = await executeQuery(patientQuery);
        console.log(patientData)
        const patientSpecimenNewDropDown = patientData.map((row) => ({
            "value": row.specimenID,
            "displayValue": `${row.specimenID}-${row.firstName} ${row.lastName}`
        }));

        // Get patient specimen from the rows data to populate the dropdown
        const patientSpecimenEditDropDown = rows.map((row) => ({
            "value": row.specimenID,
            "displayValue": `${row.resultID}-${row.firstName} ${row.lastName}-${row.specimenID}`
        }));

        // Get laboratory test name
        const laboratoryTestNameQuery = "SELECT laboratoryTestID,name FROM LaboratoryTests;"
        const { rows: laboratoryTestName } = await executeQuery(laboratoryTestNameQuery);

        // Get facility name
        const facilityNameQuery = "SELECT facilityID, name as facilityName FROM Facilities;"
        const { rows: facilityName } = await executeQuery(facilityNameQuery);

        res.render('results', { data: rows, patientSpecimenNewDropDown: patientSpecimenNewDropDown, patientSpecimenEditDropDown: patientSpecimenEditDropDown, laboratoryTestName: laboratoryTestName, facilityName: facilityName });
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(400).send("Error fetching results");
    }
}

async function addResult(req, res) {
    try {
        const payload = req.body;
        console.log(payload)

        let patientSpecimenID = parseInt(payload.patientSpecimenID);
        let laboratoryTestID = parseInt(payload.laboratoryTestID);
        let facilityID = parseInt(payload.facilityID);
        let reportedDateTime = payload.reportedDateTime;
        let resultValue = payload.resultValue;
        let isSpoiled = payload.isSpoiled;

        let addResultQuery = `
        INSERT INTO Results
        (
        specimenID,
        laboratoryTestID,
        facilityID,
        reportedDate,
        value,
        isSpoiled
        )
        VALUES
        (
        '${patientSpecimenID}',
        '${laboratoryTestID}',
        '${facilityID}',
        '${reportedDateTime}',
        '${resultValue}',
        '${isSpoiled}');`;
        await executeQuery(addResultQuery);
        res.status(200).send("Added Result");
    } catch (error) {
        console.error("Error adding result:", error);
        res.status(400).send("Error adding result");
    }
}

async function deleteResult(req, res) {
    const resultID = req.body.resultID;
    try {
        let delete_statement = `DELETE FROM Results WHERE resultID = ${resultID}`;
        await executeQuery(delete_statement);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting result:", error);
        res.status(400).send("Error deleting result");
    }
}

async function updateResult(req, res) {
    const data = req.body;
    console.log(data)

    const resultID = parseInt(data.resultID);
    const patientSpecimenID = parseInt(data.patientSpecimenID);
    const laboratoryTestID = parseInt(data.laboratoryTestID);
    const facilityID = parseInt(data.facilityID);
    const reportedDateTime = data.reportedDateTime;
    const resultValue = data.resultValue;
    const isSpoiled = data.isSpoiled;

    try {
        let update_statement = `UPDATE Results SET specimenID = ${patientSpecimenID}, laboratoryTestID = ${laboratoryTestID}, facilityID = ${facilityID}, reportedDate = '${reportedDateTime}', value = '${resultValue}', isSpoiled = ${isSpoiled} WHERE resultID = ${resultID}`;
        await executeQuery(update_statement);
        res.status(200).send("Updated Result");
    }

    catch (error) {
        console.error("Error updating result:", error);
        res.status(400).send("Error updating result");

    }
}


exports.getAllResults = getAllResults;
exports.addResult = addResult;
exports.deleteResult = deleteResult;
exports.updateResult = updateResult;