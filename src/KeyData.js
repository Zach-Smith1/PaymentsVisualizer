import React, { useEffect } from "react";

const KeyData = ({ data, active }) => {
  useEffect(() => {
      const elementsWithAverageId = document.querySelectorAll('#average');
      // Iterate through the NodeList of elements
      elementsWithAverageId.forEach((element) => {
        element.id = 'changed';
        setTimeout(() => element.id = 'average', 200)
      });
  }, [active]);

  let totalVolume = data['BC Sales Amount'];
  let totalFees = data['Income'];
  let totalPaid = data['Expense'] * -1;
  let payable = data['Residual'];
  let aveVolPer = totalVolume / active;
  let aveGrossPer = totalFees / active;
  let aveNetPer = (totalFees - totalPaid) / active;
  let effectiveRate = (totalFees / totalVolume);
  let markup = (totalFees - totalPaid) / totalFees

  const formattedNumber = (num, p) => {
    return num !== undefined && !isNaN(num) ? num.toLocaleString('en-US', {
      style: 'decimal',
      minimumFractionDigits: p || 2,
      maximumFractionDigits: p || 2,
    }) : ' No Data Found '
  };

  return (
    <div className='keyData' >
      <h1>Key Takeaways:</h1>
      <span className='keys' id='green'><strong>Payable: </strong>${formattedNumber(payable)}</span>
      <span className='keys'><strong>Volume Processed: </strong>${formattedNumber(totalVolume)}</span>
      <span className='keys' id='average'><strong>Volume/ MID: </strong>${formattedNumber(aveVolPer)}</span>
      <span className='keys'><strong>Fees Collected: </strong>${formattedNumber(totalFees)}</span>
      <span className='keys' id='average'><strong>Income/ MID: </strong>${formattedNumber(aveGrossPer)}</span>
      <span className='keys'><strong>Fees Paid: </strong>${formattedNumber(totalPaid)}</span>
      <span className='keys' id='average'><strong>Net Revenue/ MID: </strong>${formattedNumber(aveNetPer)}</span>
      <span className='keys'><strong>Effective Rate: </strong>{formattedNumber((effectiveRate * 100), 4)}%</span>
      <span className='keys'><strong>Markup: </strong>{formattedNumber((markup * 100), 4)}%</span>
    </div>
  );
}
/**
 Key Data Insights to List:
Total Payment to ISO- Is this by source or aggregated
 Overall Effective Rate Per MID (Total Fees Collected from MIDs / Total Volume Processed)  */

export default KeyData;
