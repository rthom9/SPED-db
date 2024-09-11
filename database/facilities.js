// Reference: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Scope: File
// Date: 03 / 16 / 2024
// Originality: Adapted
// Purpose: This file is used to execute queries.

const { executeQuery } = require('./db-connector');

async function getAllFacilities(req, res) {
    try {
        let query = `
        SELECT
        Facilities.facilityID,
        Facilities.name as facilityName,
        Facilities.address,
        Facilities.isActive,
        LaboratoryTests.laboratoryTestID,
        LaboratoryTests.name as testName
        FROM Facilities
        LEFT JOIN FacilityHasTests ON Facilities.facilityID = FacilityHasTests.facilityID
        LEFT JOIN LaboratoryTests on FacilityHasTests.laboratoryTestID = LaboratoryTests.laboratoryTestID
        ORDER BY Facilities.name ASC; `;
        const { rows, fields } = await executeQuery(query);

        const offeredTests = {}
        rows.forEach(row => {
            if (offeredTests[row.facilityID]) {
                offeredTests[row.facilityID].push(`${row.laboratoryTestID}-${row.testName}`)
            }
            else {
                if (row.laboratoryTestID) {
                    offeredTests[row.facilityID] = [`${row.laboratoryTestID}-${row.testName}`]
                }
                else {
                    offeredTests[row.facilityID] = []

                }
            }
        }
        );

        rows.forEach(row => {
            row.testsOffered = offeredTests[row.facilityID].join(", ");
        });

        // Remove duplicate rows
        uniqueRows = []
        processedFacilityIDs = []
        rows.forEach(row => {
            if (!processedFacilityIDs.includes(row.facilityID)) {
                uniqueRows.push(row)
                processedFacilityIDs.push(row.facilityID)
            }
        });

        // Get laboratory test name
        const laboratoryTestNamesQuery = "SELECT laboratoryTestID,name FROM LaboratoryTests;"
        const { rows: laboratoryTestNames } = await executeQuery(laboratoryTestNamesQuery);
        res.render('facilities', { data: uniqueRows, testsOffered: laboratoryTestNames }); // Render the index.hbs file, and also send the renderer
    } catch (error) {
        console.error("Error fetching facilities:", error);
        res.status(400).send("Error fetching facilities");
    }
}

async function addFacility(req, res) {
    try {
        const payload = req.body;

        let name = payload.name;
        let address = payload.address;
        let isActive = payload.isActive;
        let testsOffered = payload.testsOffered;

        insert_statement = `INSERT INTO Facilities ( name, address, isActive) VALUES('${name}', '${address}', '${isActive}')`;
        await executeQuery(insert_statement);

        // get facility id
        let facilityIDQuery = `SELECT facilityID FROM Facilities WHERE name = '${name}'`;
        const facilityIDQueryResult = await executeQuery(facilityIDQuery);
        let facilityID = facilityIDQueryResult.rows[0].facilityID;
        console.log(facilityID)

        // loop through testsOffered array, complete insert into FacilityHasTests for each
        for (let i = 0; i < testsOffered.length; i++) {
            let testName = testsOffered[i];
            let laboratoryTestIDQuery = `SELECT laboratoryTestID FROM LaboratoryTests WHERE name ='${testName}'`;
            let laboratoryTestIDQueryResult = await executeQuery(laboratoryTestIDQuery);
            let testID = laboratoryTestIDQueryResult.rows[0].laboratoryTestID;
            console.log(testID);

            FacilityHasTests_insert_statement = `INSERT INTO FacilityHasTests (laboratoryTestID, facilityID) VALUES ('${testID}', '${facilityID}')`;
            await executeQuery(FacilityHasTests_insert_statement);
        }

        let query = "SELECT Facilities.facilityID, Facilities.name, Facilities.address, Facilities.isActive, LaboratoryTests.laboratoryTestID, LaboratoryTests.name FROM Facilities JOIN FacilityHasTests ON Facilities.facilityID = FacilityHasTests.facilityID JOIN LaboratoryTests on FacilityHasTests.laboratoryTestID = LaboratoryTests.laboratoryTestID ORDER BY Facilities.facilityID ASC;"; // Define our query
        const { rows, fields } = await executeQuery(query);
        res.status(200).send(rows);
    }
    catch (error) {
        console.error("Error adding facility:", error);
        res.status(400).send("Error adding facility");
    }
}

async function updateFacility(req, res) {
    try {

        const payload = req.body;
        console.log(payload);
        let facilityID = payload.facilityID;
        let nameUpdate = payload.nameUpdate;
        let addressUpdate = payload.addressUpdate;
        let isActiveUpdate = payload.isActiveUpdate;
        let testsOfferedUpdate = payload.testsOfferedUpdate;

        // update name, address, isActive
        const update_statement = `UPDATE Facilities SET name = '${nameUpdate}', address = '${addressUpdate}', isActive = '${isActiveUpdate}' WHERE facilityID = '${facilityID}';`
        await executeQuery(update_statement);

        // Delete all facility associated facilityHasTests rows
        const delete_statement = `DELETE FROM FacilityHasTests WHERE facilityID = '${facilityID}';`
        await executeQuery(delete_statement);

        // Loop through testsOfferedUpdate array, complete insert into FacilityHasTests for each
        for (let i = 0; i < testsOfferedUpdate.length; i++) {
            let testID = testsOfferedUpdate[i];
            console.log(testID);
            FacilityHasTests_insert_statement = `INSERT INTO FacilityHasTests (laboratoryTestID, facilityID) VALUES ('${testID}', '${facilityID}')`;
            await executeQuery(FacilityHasTests_insert_statement);
        }

        let query = "SELECT Facilities.facilityID, Facilities.name, Facilities.address, Facilities.isActive, LaboratoryTests.laboratoryTestID, LaboratoryTests.name FROM Facilities JOIN FacilityHasTests ON Facilities.facilityID = FacilityHasTests.facilityID JOIN LaboratoryTests on FacilityHasTests.laboratoryTestID = LaboratoryTests.laboratoryTestID ORDER BY Facilities.facilityID ASC;"; // Define our query
        const { rows, fields } = await executeQuery(query);
        res.status(200).send(rows);
    }
    catch (error) {
        console.error("Error updating facility:", error);
        res.status(400).send("Error updating facility");
    }
}

async function deleteFacility(req, res) {
    const facilityID = req.body.facilityID;
    try {
        let delete_statement = `DELETE FROM Facilities WHERE facilityID = ${facilityID}`;
        await executeQuery(delete_statement);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting facility:", error);
        res.status(400).send("Error deleting facility");
    }
}

exports.addFacility = addFacility;
exports.getAllFacilities = getAllFacilities;
exports.deleteFacility = deleteFacility;
exports.updateFacility = updateFacility;