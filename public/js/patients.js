// Reference: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Scope: File
// Date: 03 / 16 / 2024
// Originality: Adapted
// Purpose: Drive the functionality of the patients page


// Get the objects we need to modify
let addPatientForm = document.getElementById('addPatientForm');

// Modify the objects we need
addPatientForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let firstName = document.getElementById("firstName");
    let lastName = document.getElementById("lastName");
    let dateOfBirth = document.getElementById("dateOfBirth");
    let sex = document.getElementById("sex");
    let address = document.getElementById("address");
    let phoneNumber = document.getElementById("phoneNumber");
    let email = document.getElementById("email");

    // Get the values from the form fields
    let firstNameValue = firstName.value;
    let lastNameValue = lastName.value;
    let dateOfBirthValue = dateOfBirth.value;
    let patientSexValue = sex.value;
    let addressValue = address.value;
    let phoneNumberValue = phoneNumber.value;
    let emailValue = email.value;

    // Put our data we want to send in a javascript object
    let data = {
        firstName: firstNameValue,
        lastName: lastNameValue,
        dateOfBirth: dateOfBirthValue,
        patientSex: patientSexValue,
        address: addressValue,
        phoneNumber: phoneNumberValue,
        email: emailValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-patient", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            window.location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function deletePatient(patientID) {

    let data = {
        patientID: patientID
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-patient", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(patientID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(patientID) {
    let table = document.getElementById("patientList");
    for (let i = 0; i < table.rows.length; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("patient-id") == patientID) {
            table.deleteRow(i);
            break;
        }
    }
}
function changeDateFormat(dateOfBirth) {
    let date = new Date(dateOfBirth);
    MM = (date.getMonth() + 1).toString().padStart(2, "0");
    DD = date.getDate().toString().padStart(2, "0");
    YY = date.getFullYear();
    let new_date = `${YY}-${MM}-${DD}`;
    return new_date;
}
function editPatient(patientID) {
    // Update styling to draw user focus to appropriate form
    document.getElementById("patientUpdateFieldset").className = "fieldset-focus";

    // Get form fields we need to get data from
    let patientIDField = document.getElementById("patientIDUpdate");
    let firstName = document.getElementById("firstNameUpdate");
    let lastName = document.getElementById("lastNameUpdate");
    let dateOfBirth = document.getElementById("dateOfBirthUpdate");
    let sex = document.getElementById("sexUpdate");
    let address = document.getElementById("addressUpdate");
    let phoneNumber = document.getElementById("phoneNumberUpdate");
    let email = document.getElementById("emailUpdate");

    let table = document.getElementById("patientList");
    for (let i = 0; i < table.rows.length; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("patient-id") == patientID) {
            console.log("Found match", table.rows[i])
            let tr = table.rows[i]
            let tds = tr.cells;
            for (let j = 0; j < tds.length; j++) {
                patientIDField.value = tds[0].innerHTML
                firstName.value = tds[1].innerHTML
                lastName.value = tds[2].innerHTML
                dateOfBirth.value = changeDateFormat(tds[3].innerHTML)
                sex.value = tds[4].innerHTML
                phoneNumber.value = tds[5].innerHTML
                address.value = tds[6].innerHTML
                email.value = tds[7].innerHTML
            }
        }
    }
}

const updatePatientForm = document.getElementById('updatePatientForm');

// Modify the objects we need
updatePatientForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Reset styling upon form completion and submission
    document.getElementById("patientUpdateFieldset").className = "";

    // Get form fields we need to get data from
    const patientID = document.getElementById("patientIDUpdate");
    const firstName = document.getElementById("firstNameUpdate");
    const lastName = document.getElementById("lastNameUpdate");
    const dateOfBirth = document.getElementById("dateOfBirthUpdate");
    const sex = document.getElementById("sexUpdate");
    const address = document.getElementById("addressUpdate");
    const phoneNumber = document.getElementById("phoneNumberUpdate");
    const email = document.getElementById("emailUpdate");

    // Get the values from the form fields
    const patientIDValue = patientID.value;
    const firstNameValue = firstName.value;
    const lastNameValue = lastName.value;
    const dateOfBirthValue = dateOfBirth.value;
    const patientSexValue = sex.value;
    const addressValue = address.value;
    const phoneNumberValue = phoneNumber.value;
    const emailValue = email.value;

    // Put our data we want to send in a javascript object
    const updateData = {
        patientID: patientIDValue,
        firstName: firstNameValue,
        lastName: lastNameValue,
        dateOfBirth: dateOfBirthValue,
        patientSex: patientSexValue,
        address: addressValue,
        phoneNumber: phoneNumberValue,
        email: emailValue
    }
    console.log(updateData)


    // Setup our AJAX request
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-patient", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            window.location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(updateData));

})


const updateTableWithNewData = (response) => {
    const data = JSON.parse(response)
    const patientID = data.patientID
    const firstName = data.firstName
    const lastName = data.lastName
    const dateOfBirth = data.dateOfBirth
    const patientSex = data.patientSex
    const phoneNumber = data.phoneNumber
    const address = data.address
    const email = data.email

    let table = document.getElementById("patientList");
    for (let i = 0; i < table.rows.length; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("patient-id") === patientID) {
            let tr = table.rows[i]
            let tds = tr.cells;
            for (let j = 0; j < tds.length; j++) {
                tds[1].innerHTML = firstName
                tds[2].innerHTML = lastName
                tds[3].innerHTML = dateOfBirth
                tds[4].innerHTML = patientSex
                tds[5].innerHTML = phoneNumber
                tds[6].innerHTML = address
                tds[7].innerHTML = email
            }
        }
    }
}