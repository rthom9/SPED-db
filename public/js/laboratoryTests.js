// Reference: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Scope: File
// Date: 03 / 16 / 2024
// Originality: Adapted
// Purpose: Drive the functionality of the laboratoryTests page.

// Get the objects we need to modify
let addLaboratoryTestForm = document.getElementById('addLaboratoryTestForm');

// Modify the objects we need
addLaboratoryTestForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let name = document.getElementById("name");
    let lowerLimit = document.getElementById("lowerLimit");
    let upperLimit = document.getElementById("upperLimit");
    let unit = document.getElementById("unit");
    let isActive = document.getElementById("isActive");
    let comment = document.getElementById("comment");

    // Get the values from the form fields
    let nameValue = name.value;
    let lowerLimitValue = lowerLimit.value;
    let upperLimitValue = upperLimit.value;
    let unitValue = unit.value;
    let isActiveValue = isActive.value;
    let commentValue = comment.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        lowerLimit: lowerLimitValue,
        upperLimit: upperLimitValue,
        unit: unitValue,
        isActive: isActiveValue,
        comment: commentValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-laboratoryTest", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            name.value = '';
            lowerLimit.value = '';
            upperLimit.value = '';
            unit.value = '';
            isActive.value = '';
            comment.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from
// the database, and adds it to the table on the page.
const addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("laboratoryTestList");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 9 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let lowerLimitCell = document.createElement("TD");
    let upperLimitCell = document.createElement("TD");
    let unitCell = document.createElement("TD");
    let isActiveCell = document.createElement("TD");
    let commentCell = document.createElement("TD");
    let editCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.laboratoryTestID;
    nameCell.innerText = newRow.name;
    lowerLimitCell.innerText = newRow.lowerLimit;
    upperLimitCell.innerText = newRow.upperLimit;
    unitCell.innerText = newRow.unit;
    isActiveCell.innerText = newRow.isActive;
    commentCell.innerText = newRow.comment;
    editCell.innerHTML = `<button onclick="editLaboratoryTest(${newRow.laboratoryTestID})">Edit</button>`;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(lowerLimitCell);
    row.appendChild(upperLimitCell);
    row.appendChild(unitCell);
    row.appendChild(isActiveCell);
    row.appendChild(commentCell);
    row.appendChild(editCell);
    row.setAttribute("laboratoryTest-id", newRow.laboratoryTestID);

    // Add the row to the table
    currentTable.appendChild(row);
}


function editLaboratoryTest(laboratoryTestID) {
    console.log("editLaboratoryTest called")

    // Update styling to draw user attention to appropriate form.
    document.getElementById("laboratoryTestUpdateFieldset").className = "fieldset-focus";

    // Get form fields we need to get data from
    let laboratoryTestIDField = document.getElementById("laboratoryTestIDUpdate");
    let name = document.getElementById("nameUpdate");
    let lowerLimit = document.getElementById("lowerLimitUpdate");
    let upperLimit = document.getElementById("upperLimitUpdate");
    let unit = document.getElementById("unitUpdate");
    let isActive = document.getElementById("isActiveUpdate");
    let comment = document.getElementById("commentUpdate");

    let table = document.getElementById("laboratoryTestList");
    for (let i = 0; i < table.rows.length; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("laboratoryTest-id") == laboratoryTestID) {
            console.log("Found match", table.rows[i])
            let tr = table.rows[i]
            let tds = tr.cells;
            for (let j = 0; j < tds.length; j++) {
                laboratoryTestIDField.value = tds[0].innerHTML
                name.value = tds[1].innerHTML
                lowerLimit.value = tds[2].innerHTML
                upperLimit.value = tds[3].innerHTML
                unit.value = tds[4].innerHTML
                isActive.value = tds[5].innerHTML
                comment.value = tds[6].innerHTML
            }
        }
    }
}

let updateLaboratoryTestForm = document.getElementById('updateLaboratoryTestForm');

// Modify the objects we need
updateLaboratoryTestForm.addEventListener("submit", function (e) {
    console.log("UpdateLaboratoryTestForm Event Listener")

    // Prevent the form from submitting
    e.preventDefault();

    // Reset styling if form completed and submitted
    document.getElementById("laboratoryTestUpdateFieldset").className = "";

    // Get form fields we need to get data from
    let laboratoryTestID = document.getElementById("laboratoryTestIDUpdate");
    let name = document.getElementById("nameUpdate");
    let lowerLimit = document.getElementById("lowerLimitUpdate");
    let upperLimit = document.getElementById("upperLimitUpdate");
    let unit = document.getElementById("unitUpdate");
    let isActive = document.getElementById("isActiveUpdate");
    let comment = document.getElementById("commentUpdate");

    // Get the values from the form fields
    let laboratoryTestIDValue = laboratoryTestID.value;
    let nameValue = name.value;
    let lowerLimitValue = lowerLimit.value;
    let upperLimitValue = upperLimit.value;
    let unitValue = unit.value;
    let isActiveValue = isActive.value;
    let commentValue = comment.value;

    // Put our data we want to send in a javascript object
    let data = {
        laboratoryTestID: laboratoryTestIDValue,
        name: nameValue,
        lowerLimit: lowerLimitValue,
        upperLimit: upperLimitValue,
        unit: unitValue,
        isActive: isActiveValue,
        comment: commentValue,
    }

    console.log(data)
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-laboratoryTest", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateTableWithNewData(xhttp.response);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


const updateTableWithNewData = (response) => {
    console.log("UpdateTableWithNewData called")
    const data = JSON.parse(response)
    const laboratoryTestID = data.laboratoryTestID
    const testName = data.name
    const lowerLimit = data.lowerLimit
    const upperLimit = data.upperLimit
    const unit = data.unit
    const isActive = data.isActive
    const comment = data.comment

    let table = document.getElementById("laboratoryTestList");
    for (let i = 0; i < table.rows.length; i++) {

        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("laboratoryTest-id") === laboratoryTestID) {

            let tr = table.rows[i]
            let tds = tr.cells;
            for (let j = 0; j < tds.length; j++) {
                tds[1].innerHTML = testName
                tds[2].innerHTML = lowerLimit
                tds[3].innerHTML = upperLimit
                tds[4].innerHTML = unit
                tds[5].innerHTML = isActive
                tds[6].innerHTML = comment
            }
        }
    }
}