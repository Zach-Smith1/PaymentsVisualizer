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
  console.log(`getSpendingTotals is parsing file...`);
  let check = true;
  let [mids, open, positive] = Array(3).fill(0);
  let midIncome = {};
  let midExpense = {};
  let allRows = file.split('\n')
  let colRow = 0;

  while (allRows[colRow] && !allRows[colRow].split(',').includes('Merchant Name')) {
    colRow++
  }

  const columnNames = allRows[colRow].split(',')

  const relevantColumns = ['MID', 'Merchant Number', 'Merchant ID', 'Merchant Name', 'Status', 'Income', 'Revenue', 'Expense', 'Residual', 'BC Sales Amount', 'BC Credits Amount', 'BC Auth Expense', 'Debit Expense', 'Other Expense', 'Batch Expense', 'Chargeback Expense', 'AVS Expense', 'Total Stmt Expense', 'Total IC Expense', 'BC Auth Income', 'Debit Income', 'Other Income', 'Batch Income', 'Chargeback Income', 'AVS Income', 'Total Stmt Income', 'Total Discount Income']

  check = columnNames.some(c => relevantColumns.includes(c));
  if (check === false) {
    return false // exit if no relevant columns found
  }

  let relColsNums = [];
  relevantColumns.forEach((col) => {
    relColsNums.push(columnNames.indexOf(col))
  })

  allRows = allRows.slice(colRow + 1);
  const totals = {};
  let totalsCsv = '';
  let allMids = [];

  allRows.forEach((row) => {
    let rowArr = row.split(',');
    if (!rowArr[0]) return

    let rowObj = {};

    for (let i = Math.min(...relColsNums); i <= Math.max(...relColsNums); i++) {
      if (relColsNums.includes(i)) {
        rowObj[columnNames[i]] = rowArr[i];
      }
    }

    /* each row of is represented as key value pair in the final object, the key is the item number, the value
     is an object of column names (keys) and values */
    let name = rowObj['Merchant Name'];
    if (!name) return
    name = name.toUpperCase();
    let merchant = rowObj['Merchant Name'];
    if (rowObj['Residual']) allMids.push([name,rowObj['Residual']]);
    midIncome[merchant] = [name, Number(rowObj['Income'])]
    midExpense[merchant] = [name, Number(rowObj['Expense'])]
      for (let col in rowObj) {
        let num = Number(rowObj[col])
      if (col === 'BC Sales Amount' && num > 0) positive ++
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

  for (let name in totals) {
    // round totals to next highest cent
    let rows = `${name}, ${Number(totals[name].toFixed(2))}\n`;
    if (name === 'MID') {
      continue
    }
    // store as csv formatted string
    totalsCsv += rows;
  }

  allMids.sort((a, b) => {
    const merchantA = Number(a[1]);
    const merchantB = Number(b[1]);
    if (merchantA < merchantB) {
      return 1;
    }
    if (merchantA > merchantB) {
      return -1;
    }
    return 0;
  });

  allMids =  "Merchant, Payable\n" + allMids.map(x => x.join(',')).join('\n');

  let countObj = {'mids': mids, 'open': open, 'positive': positive};

  return ["Category, Total\n" + totalsCsv, totals, midIncome, midExpense, countObj, allMids]
}
