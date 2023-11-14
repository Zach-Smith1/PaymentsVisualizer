export function getColumns(allColumns) {
  let [dateCol, desCol, catCol, numCol] = Array(4).fill(0);
  while (allColumns[dateCol] !== 'Transaction Date' && allColumns[dateCol] !== '"Posted Transactions"' && allColumns[dateCol] !== 'Date' && allColumns[dateCol] !== '"Transaction Date"' && dateCol < 14) {
    dateCol++
  }
  while (allColumns[desCol] !== 'Description' && allColumns[desCol] !== '"Description"' && desCol < 14) {
    desCol++
  }
  while (allColumns[catCol] !== 'Category' && allColumns[catCol] !== '"Category"' && catCol < 14) {
    catCol++
  }
  while (allColumns[numCol] !== 'Amount' && allColumns[numCol] !== '"Amount"' && allColumns[numCol] !== 'Debit' && allColumns[numCol] !== 'Amount (USD)' && numCol < 14) {
    numCol++
  }
  return [dateCol, desCol, catCol, numCol]
}

export function getSpendingTotals(file, category) {
  console.log(`getSpendingTotals is parsing csv file...`);
  let [mids, open, positive] = Array(3).fill(0);
  let midIncome = {};
  let midExpense = {};
  let allRows = file.split('\n')
  let colRow = 0;
  while (!allRows[colRow].split(',').includes('MID') && !allRows[colRow].split(',').includes('Agent Name')) {
    colRow++
  }
  const columnNames = allRows[colRow].split(',')

  // Relevant Columns
  const relevantColumns = ['MID', 'Merchant Name', 'Status', 'Income', 'Expense', 'Residual', 'BC Sales Amount', 'BC Credits Amount', 'BC Auth Expense', 'Debit Expense', 'Other Expense', 'Batch Expense', 'Chargeback Expense', 'AVS Expense', 'Total Stmt Expense', 'Total IC Expense', 'BC Auth Income', 'Debit Income', 'Other Income', 'Batch Income', 'Chargeback Income', 'AVS Income', 'Total Stmt Income', 'Total Discount Income']
  let relColsNums = [];
  relevantColumns.forEach((col) => {
    relColsNums.push(columnNames.indexOf(col))
  })

  allRows = allRows.slice(colRow + 1);
  const totals = {};
  let head = true; // boolean variable to keep track of adding column names to output file
  let finalCsv = '';

  allRows.forEach((row) => {
    let rowArr = row.split(',');
    if (!rowArr[0]) return
    // if there's a credit change it to a negative debit (for Capital One)
    let rowObj = {};

    for (let i = Math.min(...relColsNums); i <= Math.max(...relColsNums); i++) {
      // logs relevant data for category in question
      // if (category && rowArr[i] === category) {
      //   if (head === true) {
      //     finalCsv = `${relevantColumns}\n`;
      //     head = false
      //   }
      //   finalCsv += `${rowArr[dateCol]},${rowArr[desCol]},${number},${rowArr[catCol]}\n`;
      // }
      if (relColsNums.includes(i)) {
        rowObj[columnNames[i]] = rowArr[i];
      }
    }


    /* each row of is represented as key value pair in the final object, the key is the item number, the value
     is an object of column names (keys) and values */

     let name = rowObj['Merchant Name'].toUpperCase();
      // below code is for combining MID's with same name together
    //  if (midIncome. midExpense,hasOwnProperty(name)) {
    //    midIncome[ midExpense,name] += Number(rowObj['Income'])
    //   } else if (rowObj['Income'] !== undefined) {
    //     midIncome[ midExpense,name] = Number(rowObj['Income'])
    //   }
    let merchant = rowObj['Merchant Name'];
    midIncome[merchant] = [name, Number(rowObj['Income'])]
    midExpense[merchant] = [name, Number(rowObj['Expense'])]
      for (let col in rowObj) {
        let num = Number(rowObj[col])
      if (col === 'Income' && num > 0) positive ++
      if (col === 'MID') {
        num = 1
        mids ++
      }
      if (col === 'Status') {
        if (rowObj[col] === 'Open') open ++
      }
      if (col === 'Expense') num *= -1
      if (rowObj[col] && col !== 'Merchant Name' && col !== 'Status') {
        if (totals.hasOwnProperty(col)) {
          totals[col] += num
        } else {
          totals[col] = num
        }
      }
    }
  })


  // if getting specific category breakdown return (only spending from that category)
  if (category) {
    return finalCsv
  }
  for (let name in totals) {
    // round totals to next highest cent
    let rows = `${name}, ${Number(totals[name].toFixed(2))}\n`;
    // store as csv formatted string
    finalCsv += rows;
  }

  //return totals as csv with header added and as an object (to use keys for category selector wheel)
  let countObj = {'mids': mids, 'open': open, 'positive': positive};
  return ["Category, Total\n" + finalCsv, totals, midIncome, midExpense, countObj]
}
