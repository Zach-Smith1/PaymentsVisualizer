import React from "react";

const MoreInfo = ({ file, merchant }) => {
  const data = file.split('\n');
  const columns = data[0].split(',');
  let row = 0;
  let merchantNameColumn = 3 // need to change this to be calculated based on input file
  while (data[row].split(',')[merchantNameColumn].toUpperCase() !== merchant) {
    row++
  }
  const formattedNumber = (num) => {
    return num.toLocaleString('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  };
  let found = data[row].split(',');
  let mid = found[columns.indexOf('MID')];
  let volume = formattedNumber(Number(found[columns.indexOf('BC Sales Amount')]));
  let paid = formattedNumber(Number(found[columns.indexOf('Income')]));
  let expense = formattedNumber(Number(found[columns.indexOf('Expense')]));
  let profit = formattedNumber(Number(found[columns.indexOf('Residual')]));

  return (
    <div className='MoreInfo' >
      <h1>Merchant Info:</h1>
      <span><strong>MID: </strong>{mid}</span>
      <span><strong>DBA: </strong>{merchant}</span>
      <span><strong>Volume: </strong>${volume}</span>
      <span><strong>Income: </strong>${paid}</span>
      <span><strong>Expense: </strong>${expense}</span>
      <span id='green'><strong>Payable: </strong>${profit}</span>
    </div>
  );
}

export default MoreInfo;
