import React, { useState, useEffect } from "react";
const XLSX = require('xlsx');
import { getSpendingTotals } from './breakdownFns.js';
import ExpensePie from "./ExpensePie.js";
import IncomeDonut from "./IncomeDonut.js";
import KeyData from './KeyData.js';
import Modal from './Modal.js';
import MoreInfo from './MoreInfo.js';
import MyChart from './MyChart.js';
import MyDonut from "./myDonut.js";
import Table from './table.js';


function App(props) {
  const [active, setActive] = useState(null);
  const [allMids, setAllMids] = useState('');
  const [count, setCount] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [download, setDownload] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setName] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [sheets, setSheets] = useState([]);
  const [mainSheet, setMainSheet] = useState(null)
  const [mids, setMids] = useState({});
  const [merchant, setMerchant] = useState(null);
  const [object, setObject] = useState({});
  const [top, setTop] = useState(10);
  const [workbook, setWorkbook] = useState(null);

  // Effect to handle state changes and side-effects
  useEffect(() => {
    if (file !== null) {
      let totals = getSpendingTotals(file);
      setDownload(totals[0]); // string
      setObject(totals[1]);
      setMids(totals[2]); // object
      setCount(totals[4]);
      setActive(totals[4].mids);
      setAllMids(totals[5]);
      console.log('file change');
    }
    if (mainSheet !== null) {
      const sheetName = workbook.SheetNames[mainSheet]; // 3rd sheet is relevant one in sample data
      const sheet = workbook.Sheets[sheetName];
      const obj = XLSX.utils.sheet_to_json(sheet, { raw: true });
      const csv = sheetObjectToCSV(obj);
      setFile(csv);
      // setName(file.name);
    }
  }, [file, mainSheet]);

  const dragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  }

  const dragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const dragOver = (e) => {
    e.preventDefault();
  };

  const sheetObjectToCSV = (obj) => { // handmade to convert amex xlsx to csv
    let csv = '';
    for (const row in obj) {
      let csvRow = '';
      for (const col in obj[row]) {
        let data = obj[row][col]
        if (typeof data !== 'number') {
          data = data.replace(/\n/g, '')
          data = data.replace(/\r/g, '')
          data = data.replace(/,/g, ' ')
          data = data.replace(/&/g, '+') // fixes issue where amex data & --> &amp
        }
        csvRow += data + ','
      }
      csv += csvRow.slice(0, -1) + '\n'
    }
    return csv
  }

  const dragDrop = async (e) => {
    e.preventDefault();
    setDragging(true);
    let files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.slice(-4).toLowerCase() === 'xlsx') {
        const workbook = await readFileAsync(file);
        if (workbook) {
          setSheets(workbook.SheetNames);
          setWorkbook(workbook);
          openModal();
          // const sheetName = workbook.SheetNames[mainSheet];
          // const sheet = workbook.Sheets[sheetName];
          // const obj = XLSX.utils.sheet_to_json(sheet);
          // const csv = sheetObjectToCSV(obj);
          // setFile(csv);
          setName(file.name);
          return
        } else {
          alert('Oops, error reading workbook')
        }
      } else if (file.name.slice(-3).toLowerCase() !== 'csv') {
        alert('Only .csv and .xlsx files are currently supported');
      } else {
        this.fileReaderCode(files);
      }
    }
  };

  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target.result;
          const workbook = XLSX.read(arrayBuffer);
          resolve(workbook);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const removeLineBreaksInQuotes = (input) => {
    input = input.replace(/&/g, '+').replace(/\r/g, '') // fixes carriage returns and issue where amex data & --> &amp
    return input.replace(/"([^"]*)"/g, (match, content) => {
      content = content.replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/,/g, '');
      return `"${content}"`;
    });
  };

  const fileReaderCode = (input) => {
    let files = input;
    let file, name;
    let readerFiles = '';
    const readFile = (f) => {
      if (!(f instanceof Blob)) {
        alert('Something went wrong, please try again')
        return
      }
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          readerFiles += reader.result;
          readerFiles = removeLineBreaksInQuotes(readerFiles);
          setFile(readerFiles);
          setName(name)
        }
        reader.onerror = (event) => {
          reject(event.target.error);
        };
        reader.readAsText(f);
      });
    };
    if (files[1] !== undefined) {
      for (const file of files) {
        const handleFileChange = async (f) => {
          try {
            await readFile(f);
          } catch (error) {
            console.log('Error reading file:', error);
          }
        };
        handleFileChange(file)
      }
      name = 'Multiple Files'
    } else {
      file = files[0]
      name = file.name;
      readFile(file)
    }
  }

  const handleDownloadCSV = (e) => {
    e.preventDefault();
    const blob = new Blob([download], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    let name = fileName;
    if (name.slice(-3) !== "csv") {
      name += '.csv'
    }
    link.download = name;
    link.click();
  };

  const importFile = async (e) => {
    let files = e.target.files;
    let file = files[0]
    if (files[0].name.slice(-4).toLowerCase() === 'xlsx') {
      const workbook = await readFileAsync(file);
      if (workbook) {
        setSheets(workbook.SheetNames);
        setWorkbook(workbook);
        openModal();
        // const sheetName = workbook.SheetNames[2]; // relevant sheet in sample data
        // const sheet = workbook.Sheets[sheetName];
        // const obj = XLSX.utils.sheet_to_json(sheet);
        // const csv = sheetObjectToCSV(obj);
        // setFile(csv);
        setName(file.name);
        return
      }
    } else if (e.target.files[0].name.slice(-3).toLowerCase() === 'csv') {
      fileReaderCode(files)
    } else {
      alert('Only .csv and .xlsx files currently supported')
    }
  }

  const nameChange = (e) => {
    e.preventDefault();
    let val = e.target.value;
    if (val === '') val = ' '
    setName(val);
  }

  const selectMid = (val) => {
    setMerchant(val);
  }

  const changeActive = (e) => {
    let val = e.target.value
    setActive(val);
  }

  const changeRadio = (e) => {
    let val = e.target.value
    setTop(val);
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const openModal = () => {
    setModalOpen(true)
  }

  const selectSheet = (e) => {
    let val = e.target.value;
    closeModal()
    setMainSheet(val)
  }

  const handleLogout = async () => {
    try {
      // Make a request to the /logout endpoint
      const response = await fetch('http://localhost:3000/login', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check the response status and handle accordingly
      if (response.status === 200) {
        // Successful logout, you might want to redirect the user or update the UI
        console.log('Logout successful');
      } else {
        // Handle unsuccessful logout
        console.log('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  let inputMessage;
  if (window.screen.width < 768) {
    inputMessage = "Tap to Upload File"
  } else {
    inputMessage = <><strong>Drag and Drop Payments Info</strong><br /> or Click to Upload</>
  }
  let [allSheets, name, downloadButton, table, merchantTable, midPie, expensePie, incomeDonut, baseChart, keyTakes, moreInfo, totalCount, radio] = Array(13).fill(null);
  if (download) {
    moreInfo = <h1 className='MoreInfo'>Click Chart for Merchant Info</h1>
    name = <div>
      Generated From:<br />
      <input className='nameInput' name='name' type='text' placeholder='a' value={fileName} onChange={nameChange} />
    </div>
    radio = <form className='radio'>
      Show Top
      {[10, 20, 30].map((option) => (
        <label key={option}>
          <input
            type="radio"
            value={option}
            checked={top == option.toString()}
            onChange={changeRadio}
          />
          {option}
        </label>
      ))}
    </form>
    totalCount = <div className='merchants'>
      Data from <strong>{active}</strong> Merchants<br />
      <span>Show&thinsp;
        <select id='selector' onChange={changeActive} value={undefined}>
          <option key='all' value={count.mids}>All</option>
          <option key='open' value={count.open}>Open</option>
          <option key='positive' value={count.positive}>Active</option>
        </select>
        &thinsp;Accounts</span>
    </div>
    expensePie = <div className="expensePie">
      <ExpensePie totals={object} />
    </div>
    incomeDonut = <div className="incomeDonut">
      <IncomeDonut totals={object} />
    </div>
    midPie = <div className='midDonut'>
      <MyDonut totals={mids} change={selectMid} top={top} />
    </div>
    baseChart = <div className='baseChart'>
      <MyChart totals={object} active={active} />
    </div>
    keyTakes = <KeyData data={object} active={active} />
    // download button = button to download the table displayed on screen as a csv file to local device
    downloadButton = <button onClick={handleDownloadCSV}>Download {fileName}<br />Table</button>
    table = <div className='table' id='table'>
      <Table className="tableDiv" csv={download} />
    </div>
    merchantTable = <div className='merchantTable' id='merchantTable'>
      <Table className="tableDiv" csv={allMids} />
    </div>
  }
  if (merchant) {
    moreInfo = <MoreInfo file={file} merchant={merchant} />
  }
  if (sheets) {
    allSheets = sheets.map((s, i) => {
      const sheetName = workbook.SheetNames[i];
      const sheet = workbook.Sheets[sheetName];
      sheet['!rows'] = undefined
      const obj = XLSX.utils.sheet_to_json(sheet, {raw: true});
      console.log(obj)
      const csv = sheetObjectToCSV(obj);
      if (getSpendingTotals(csv)) {
        return <button key={i} value={i} onClick={selectSheet}>{s}</button>
      } else {
        return <button key={i} className='deadButton' value={i}>{s}</button>
      }
    })
  }

  return (
    <div className='grid'>
      <h1 id="nav">Payments Visualizer<button onClick={handleLogout}>Login</button></h1>
      <div className={`drag-drop-input ${dragging ? 'dragging' : ''}`} onDragEnter={dragEnter} onDragLeave={dragLeave} onDragOver={dragOver} onDrop={dragDrop}>
        <div className='dragMessage' id='d&d'>{inputMessage}</div>
        <input className='inputButton' type='file' name='file' onChange={importFile} multiple />
        <label htmlFor='file'></label>
      </div>
      <div className='name'>{name}</div>

      {totalCount}

      {baseChart}
      {moreInfo}
      {keyTakes}
      {midPie}
      {radio}
      {expensePie}
      {incomeDonut}
      {merchantTable}
      <div className='tableBox'>
        {table}
        <span className='downloadButton'>{downloadButton}</span>
      </div>
      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <h2>Which Sheet do you want to Inspect?</h2>
        <br />
        <span>
          {allSheets}
        </span>
      </Modal>
    </div>
  );
}


export default App;
