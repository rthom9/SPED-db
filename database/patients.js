// Reference: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Scope: File
// Date: 03 / 16 / 2024
// Originality: Adapted
// Purpose: This file is used to execute queries.
const { changeDateFormat } = require('./utils');
const { executeQuery } = require('./db-connector');

async function getAllPatients(req, res) {
    try {
        let query = "SELECT * FROM Patients ORDER BY lastName ASC;"; // Define our query
        const { rows, fields } = await executeQuery(query);
        rows.forEach(row => {
            row.dateOfBirth = changeDateFormat(row.dateOfBirth);
        });
        res.render('patients', { data: rows }); // Render the index.hbs file, and also send the renderer
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(400).send("Error fetching patients");
    }
}

async function addPatient(req, res) {
    try {
        const payload = req.body;
        const firstName = payload.firstName;
        const lastName = payload.lastName;
        const dateOfBirth = payload.dateOfBirth;
        const patientSex = payload.patientSex
        const address = payload.address;
        const phoneNumber = payload.phoneNumber;
        const email = payload.email;

        console.log(dateOfBirth)
        insert_statement = `
        INSERT INTO Patients
        (firstName, lastName, dateOfBirth, sex, phoneNumber, address, email)
        VALUES('${firstName}', '${lastName}', '${dateOfBirth}', '${patientSex}', '${phoneNumber}', '${address}','${email}')`;
        await executeQuery(insert_statement);
        const query = "SELECT * FROM Patients;"; // Define our query
        const { rows, fields } = await executeQuery(query);
        rows.forEach(row => {
            row.dateOfBirth = changeDateFormat(row.dateOfBirth);
        });
        res.status(200).send(rows);
    }
    catch (error) {
        console.error("Error adding patient:", error);
        res.status(400).send("Error adding patient");
    }
}

async function deletePatient(req, res) {
    const patientID = req.body.patientID;
    try {
        let delete_statement = `DELETE FROM Patients WHERE patientID = ${patientID}`;
        await executeQuery(delete_statement);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting patient:", error);
        res.status(400).send("Error deleting patient");
    }
}

async function updatePatient(req, res) {
    console.log("Update patient request received.")
    console.log(req.body);
    const patientID = req.body.patientID;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const sex = req.body.patientSex;
    const dateOfBirth = req.body.dateOfBirth;
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;
    const email = req.body.email;

    try {
        const update_statement = `
        UPDATE Patients SET
        firstName = '${firstName}',
        lastName = '${lastName}',
        dateOfBirth = '${dateOfBirth}',
        sex = '${sex}',
        email = '${email}',
        phoneNumber = '${phoneNumber}',
        address = '${address}'
        WHERE patientID = '${patientID}';
        `;
        await executeQuery(update_statement);
        res.status(200).send("Updated patient successfully.");
    } catch (error) {
        console.error("Error updating patient:", error);
        res.status(400).send("Error updating patient");
    }
}


exports.addPatient = addPatient;
exports.getAllPatients = getAllPatients;
exports.deletePatient = deletePatient;
exports.updatePatient = updatePatient;
