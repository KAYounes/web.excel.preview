'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import * as XLSX from 'xlsx';
import { readFile } from '@/utils/reading.files';
import react from 'react';

const parseExcelFile = (binaryData) => {
  const workbook = XLSX.read(binaryData, { type: 'binary' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  return jsonData; // Return the parsed Excel data as JSON
};

export default function Home() {
  const [excelData, setExcelData] = useState([]);
  const [file, setFile] = useState();
  console.log('excel data');
  console.log(excelData);
  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    try {
      const parsedData = await readFile(file, parseExcelFile);
      setExcelData(parsedData);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  // Handle cell editing
  const handleCellChange = (rowIndex, key, value) => {
    const updatedData = [...excelData]; // Create a copy of the data
    updatedData[rowIndex][key] = value; // Update the specific cell
    setExcelData(updatedData); // Set the updated data in state
  };

  async function saveExcel() {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    console.log('JSON to Excel');
    console.log(worksheet);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Exported');
    // XLSX.writeFile(workbook, 'new.xlsx');

    if (!file) {
      const file = await getFile();
      setFile(file);
      const bin = XLSX.write(workbook, {
        type: 'array',
        bookType: 'xlsx',
      });

      console.log('bin');
      console.log(bin);

      await file.write(bin);

      // close the file and write the contents to disk.
      // await file.close();
      return;
    }

    const bin = XLSX.write(workbook, {
      type: 'array',
      bookType: 'xlsx',
    });

    console.log('bin');
    console.log(bin);

    await file.write(bin);

    // close the file and write the contents to disk.
    // await file.close();
  }

  async function getFile() {
    console.log('getFile');
    // Open file picker and destructure the result the first handle
    const [fileHandle] = await window.showOpenFilePicker();
    const writableStream = await fileHandle.createWritable();
    console.log('writableStream');
    console.log(writableStream);
    return writableStream;
  }

  return (
    <div>
      <input
        type='file'
        onChange={handleFileUpload}
        accept='.xlsx, .xls'
      />
      <table border='1'>
        <thead>
          <tr>{excelData.length > 0 && Object.keys(excelData[0]).map((key) => <th key={key}>{key}</th>)}</tr>
        </thead>
        <tbody>
          {excelData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.keys(row).map((key, colIndex) => (
                <td key={colIndex}>
                  <input
                    type='text'
                    value={row[key] || ''}
                    onChange={(e) => handleCellChange(rowIndex, key, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={saveExcel}>Save to Excel</button>
    </div>
  );
}
