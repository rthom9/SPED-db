// Reference: https://github.com/osu-cs340-ecampus/nodejs-starter-app
// Scope: File
// Date: 03 / 16 / 2024
// Originality: Adapted
// Purpose: Drive the functionality of the results page


let addResultForm = document.getElementById('addResultForm');

addResultForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const patientSpecimenID = document.getElementById('patientSpecimenID').value;
    const laboratoryTestID = document.getElementById('laboratoryTestID').value;
    const facilityID = document.getElementById('facilityID').value;
    const reportedDateTime = document.getElementById('reportedDateTime').value;
    const resultValue = document.getElementById('resultValue').value;
    const spoiledYes = document.getElementById('spoiledYes').checked;
    const spoiledNo = document.getElementById('spoiledNo').checked;
    const isSpoiled = spoiledYes ? 1 : 0;

    const data = {
        patientSpecimenID: patientSpecimenID,
        laboratoryTestID: laboratoryTestID,
        facilityID: facilityID,
        reportedDateTime: reportedDateTime,
        resultValue: resultValue,
        isSpoiled: isSpoiled
    }
    console.log("Data to send", data)
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/add-result', true);
    xhttp.setRequestHeader('Content-type', 'application/json');

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // refresh the page to show the new data because lot of
            // the data is dependent on the results table
            location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log('There was an error with the input.');
        }
    }
    xhttp.send(JSON.stringify(data));

})

function deleteResult(resultID) {
    const data = {
        resultID: resultID
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open('DELETE', '/delete-result', true);
    xhttp.setRequestHeader('Content-type', 'application/json');

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log('There was an error with the input.');
        }
    }
    xhttp.send(JSON.stringify(data));
}

function changeCollectionDateTimestampForEdit(collectionDate) {
    const date = new Date(collectionDate);
    const MM = (date.getMonth() + 1).toString().padStart(2, '0');
    const DD = date.getDate().toString().padStart(2, '0');
    const YY = date.getFullYear();
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    const new_date = `${YY}-${MM}-${DD}T${hh}:${mm}`;
    return new_date;
}
function editResult(resultID) {
    // Update styling to draw user focus to appropriate form
    document.getElementById("resultUpdateFieldset").className = "fieldset-focus";

    const resultIDUpdate = document.getElementById('resultIDUpdate');
    const patientSpecimenIDUpdate = document.getElementById('patientSpecimenIDUpdate');
    const laboratoryTestIDUpdate = document.getElementById('laboratoryTestIDUpdate');
    const facilityIDUpdate = document.getElementById('facilityIDUpdate');
    const reportedDateTimeUpdate = document.getElementById('reportedDateTimeUpdate');
    const resultValueUpdate = document.getElementById('resultValueUpdate');
    const spoiledYesUpdate = document.getElementById('spoiledYesUpdate');
    const spoiledNoUpdate = document.getElementById('spoiledNoUpdate');

    const table = document.getElementById("resultList");
    for (let i = 0; i < table.rows.length; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("result-id") == resultID) {
            console.log("Found match", table.rows[i]);
            let tr = table.rows[i];
            let tds = tr.cells;
            console.log("found tds", tds[0].innerHTML, tds[1].innerHTML, tds[2].innerHTML, tds[3].innerHTML);
            resultIDUpdate.value = tds[0].innerHTML;

            // set the patientSpecimenIDUpdate value
            const patientOptions = [...patientSpecimenIDUpdate.options];
            const optionString = `${tds[0].innerHTML}-${tds[1].innerHTML} ${tds[2].innerHTML}-${tds[3].innerHTML}`;
            const patientOption = patientOptions.findIndex(option => option.text === optionString);
            patientSpecimenIDUpdate.selectedIndex = patientOption;

            // set the laboratoryTestIDUpdate value
            const laboratoryTestOptions = [...laboratoryTestIDUpdate.options];
            const laboratoryTestOption = laboratoryTestOptions.findIndex(option => option.text === tds[4].innerHTML);
            laboratoryTestIDUpdate.selectedIndex = laboratoryTestOption;

            //set the facilityIDUpdate value
            const facilityOptions = [...facilityIDUpdate.options];
            const facilityOption = facilityOptions.findIndex(option => option.text === tds[5].innerHTML);
            facilityIDUpdate.selectedIndex = facilityOption;

            // set the reportedDateTimeUpdate value
            const formattedDate = changeCollectionDateTimestampForEdit(tds[6].innerHTML);
            reportedDateTimeUpdate.value = formattedDate;
            resultValueUpdate.value = tds[7].innerHTML;

            // set the spoiledYesUpdate or spoiledNoUpdate value
            if (tds[8].innerHTML === '1') {
                spoiledYesUpdate.checked = true;
            }
            else {
                spoiledNoUpdate.checked = true;
            }

        }
    }
}

const updateResultForm = document.getElementById('updateResultForm');

updateResultForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Reset styling upon completion and submission of form
    document.getElementById("resultUpdateFieldset").className = "";

    const resultID = document.getElementById('resultIDUpdate').value;
    const patientSpecimenID = document.getElementById('patientSpecimenIDUpdate').value;
    const laboratoryTestID = document.getElementById('laboratoryTestIDUpdate').value;
    const facilityID = document.getElementById('facilityIDUpdate').value;
    const reportedDateTime = document.getElementById('reportedDateTimeUpdate').value;
    const resultValue = document.getElementById('resultValueUpdate').value;
    const spoiledYes = document.getElementById('spoiledYesUpdate').checked;
    const spoiledNo = document.getElementById('spoiledNoUpdate').checked;
    const isSpoiled = spoiledYes ? 1 : 0;

    const data = {
        resultID: resultID,
        patientSpecimenID: patientSpecimenID,
        laboratoryTestID: laboratoryTestID,
        facilityID: facilityID,
        reportedDateTime: reportedDateTime,
        resultValue: resultValue,
        isSpoiled: isSpoiled
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open('PUT', '/update-result', true);
    xhttp.setRequestHeader('Content-type', 'application/json');

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log('There was an error with the input.');
        }
    }
    xhttp.send(JSON.stringify(data));
})

