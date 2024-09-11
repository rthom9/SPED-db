// Reference: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Scope: File
// Date: 03 / 16 / 2024
// Originality: Adapted
// Purpose: This file is used to execute queries.
const { executeQuery } = require('./db-connector');

async function getAllLaboratoryTests(req, res) {
    try {
        const query = "SELECT * FROM LaboratoryTests ORDER BY name ASC;"; // Define our query
        const { rows, fields } = await executeQuery(query);
        res.render('laboratorytests', { data: rows }); // Render the index.hbs file, and also send the renderer
    } catch (error) {
        console.error("Error fetching laboratoryTests:", error);
        res.status(400).send("Error fetching laboratoryTests");
    }
}


async function addLaboratoryTest(req, res) {
    try {
        const payload = req.body;

        let name = payload.name;
        let lowerLimit = payload.lowerLimit;
        let upperLimit = payload.upperLimit;
        let unit = payload.unit;
        let isActive = payload.isActive;
        let comment = payload.comment;

        insert_statement = `INSERT INTO LaboratoryTests ( name, lowerLimit, upperLimit, unit, isActive, comment) VALUES('${name}', '${lowerLimit}', '${upperLimit}', '${unit}', '${isActive}', '${comment}')`;
        await executeQuery(insert_statement);
        let query = "SELECT * FROM LaboratoryTests;"; // Define our query
        const { rows, fields } = await executeQuery(query);
        res.status(200).send(rows);
        }
    catch (error) {
        console.error("Error adding laboratoryTest:", error);
        res.status(400).send("Error adding laboratoryTest");
    }
}


async function updateLaboratoryTest(req, res) {
    console.log("Update laboratoryTest request received.")
    const laboratoryTestID = req.body.laboratoryTestID;
    const name = req.body.name;
    const lowerLimit = req.body.lowerLimit;
    const upperLimit = req.body.upperLimit;
    const unit = req.body.unit;
    const isActive = req.body.isActive;
    const comment = req.body.comment;

    console.log(name)
    console.log(lowerLimit)

    try {
        const update_statement = `UPDATE LaboratoryTests SET name = '${name}', lowerLimit = '${lowerLimit}', upperLimit = '${upperLimit}', unit = '${unit}', isActive = '${isActive}', comment = '${comment}' WHERE laboratoryTestID = ${laboratoryTestID}`;
        await executeQuery(update_statement);
        res.status(200).send({
            laboratoryTestID: laboratoryTestID,
            name: name,
            lowerLimit: lowerLimit,
            upperLimit: upperLimit,
            unit: unit,
            isActive: isActive,
            comment: comment
        });
    } catch (error) {
        console.error("Error updating laboratoryTest:", error);
        res.status(400).send("Error updating laboratoryTest");
    }
}


exports.addLaboratoryTest = addLaboratoryTest;
exports.getAllLaboratoryTests = getAllLaboratoryTests;
exports.updateLaboratoryTest = updateLaboratoryTest;
