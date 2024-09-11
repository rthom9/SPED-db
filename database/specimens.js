// Reference: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Scope: File
// Date: 03 / 16 / 2024
// Originality: Adapted
// Purpose: This file is used to execute queries.
const { executeQuery } = require('./db-connector');
const { changeCollectionDateTimestamp } = require('./utils');

async function getAllSpecimens(req, res) {
    try {
        let allSpecimensQuery = "SELECT specimenID, Patients.firstName, Patients.lastName, collectionDate FROM Specimens JOIN Patients ON Specimens.patientID = Patients.patientID ORDER BY Patients.lastName ASC;"; // Define our query
        const { rows, fields } = await executeQuery(allSpecimensQuery);
        rows.forEach(row => {
            row.collectionDate = changeCollectionDateTimestamp(row.collectionDate);
        });
        let patientsDropDownQuery = "SELECT patientID, firstName, lastName FROM Patients;"
        const { rows: patients, fields: fields2 } = await executeQuery(patientsDropDownQuery);
        res.render('specimens', { data: rows, patients: patients });
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(400).send("Error fetching patients");
    }
}

async function addSpecimen(req, res) {
    try {
        const data = req.body;
        const patientID = parseInt(data.patientId);
        const collectionDate = data.collectionDate;
        let addSpecimenQuery = `INSERT INTO Specimens (patientID, collectionDate) VALUES ('${patientID}', '${collectionDate}')`;
        await executeQuery(addSpecimenQuery);
        let allSpecimensQuery = "SELECT specimenID, Patients.firstName, Patients.lastName, collectionDate FROM Specimens JOIN Patients ON Specimens.patientID = Patients.patientID;"; // Define our query
        const { rows, fields } = await executeQuery(allSpecimensQuery);
        rows.forEach(row => {
            row.collectionDate = changeCollectionDateTimestamp(row.collectionDate);
        });
        res.status(200).send(rows);
    } catch (error) {
        console.error("Error adding specimen:", error);
        res.status(400).send("Error adding specimen");
    }
}
async function deleteSpecimen(req, res) {
    const specimenID = req.body.specimenID;
    try {
        let delete_statement = `DELETE FROM Specimens WHERE specimenID = ${specimenID}`;
        await executeQuery(delete_statement);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting specimen:", error);
        res.status(400).send("Error deleting specimen");
    }
}

async function updateSpecimen(req, res) {
    const data = req.body;
    console.log(data)
    const specimenID = parseInt(data.specimenID);
    const patientID = parseInt(data.patientName);
    const patientName = data.patientName.split(" - ")[1]
    console.log(patientName)
    const firstName = patientName.split(" ")[0];
    const lastName = patientName.split(" ")[1];
    const collectionDate = data.collectionDate;
    try {
        let update_statement = `UPDATE Specimens SET patientID = ${patientID}, collectionDate = '${collectionDate}' WHERE specimenID = ${specimenID}`;
        await executeQuery(update_statement);
        res.status(200).send(
            {
                specimenID: specimenID,
                firstName: firstName,
                lastName: lastName,
                collectionDate: changeCollectionDateTimestamp(collectionDate)
            }
        );
    } catch (error) {
        console.error("Error updating specimen:", error);
        res.status(400).send("Error updating specimen");
    }
}


exports.updateSpecimen = updateSpecimen;
exports.getAllSpecimens = getAllSpecimens;
exports.addSpecimen = addSpecimen;
exports.deleteSpecimen = deleteSpecimen;