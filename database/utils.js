
//  Utilized mozilla docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
// to create the function changeDateFormat and changeCollectionDateTimestamp
function changeDateFormat(dateOfBirth) {
    const date = new Date(dateOfBirth);
    const MM = date.getMonth() + 1;
    const DD = date.getDate();
    const YY = date.getFullYear();
    const new_date = `${MM}/${DD}/${YY}`;
    return new_date;
}

function changeCollectionDateTimestamp(collectionDate) {
    const date = new Date(collectionDate);
    const MM = date.getMonth() + 1;
    const DD = date.getDate();
    const YY = date.getFullYear();
    let hh = date.getHours()
    const HH = hh > 12 ? hh - 12 : hh;
    const ampm = hh >= 12 ? 'PM' : 'AM';
    const mm = date.getMinutes().toString().padStart(2, '0');
    let new_date = `${YY}/${MM}/${DD} ${HH}:${mm} ${ampm}`;
    return new_date;
}

exports.changeCollectionDateTimestamp = changeCollectionDateTimestamp;
exports.changeDateFormat = changeDateFormat;
