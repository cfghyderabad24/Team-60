const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR);

// Middleware
app.use(bodyParser.json());

app.post('/process', async (req, res) => {
  try {
    // Ensure 'uploads' directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const dataFilePath = process.env.DATA_FILE_PATH;
    const companiesFilePath = process.env.COMPANIES_FILE_PATH;

    // Check if files exist
    if (!fs.existsSync(dataFilePath) || !fs.existsSync(companiesFilePath)) {
      return res.status(400).send('One or both Excel files not found.');
    }

    // Read Excel files
    const dataWorkbook = xlsx.readFile(dataFilePath);
    const companiesWorkbook = xlsx.readFile(companiesFilePath);

    // Convert sheets to JSON
    const dataSheet = dataWorkbook.Sheets[dataWorkbook.SheetNames[0]];
    const companiesSheet = companiesWorkbook.Sheets[companiesWorkbook.SheetNames[0]];

    const data = xlsx.utils.sheet_to_json(dataSheet);
    const companies = xlsx.utils.sheet_to_json(companiesSheet);

    // Join data based on company number
    const companyMap = companies.reduce((map, item) => {
      map[item.Number] = item.Name;
      return map;
    }, {});

    const joinedData = data.map(item => {
      return {
        ...item,
        CompanyName: companyMap[item.Number]
      };
    });

    // Remove duplicates and sum amounts company-wise
    const result = {};

    joinedData.forEach(item => {
      const companyName = item.CompanyName;
      if (!result[companyName]) {
        result[companyName] = {
          CompanyName: companyName,
          TotalAmount: 0
        };
      }
      result[companyName].TotalAmount += item.Amount;
    });

    // Prepare the final result array
    const finalResult = Object.values(result);

    // Create a new workbook and add the result data to a single worksheet
    const newWorkbook = xlsx.utils.book_new();
    const newWorksheet = xlsx.utils.json_to_sheet(finalResult);

    // Add the worksheet to the workbook
    xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'Final Results');

    // Write to a new Excel file
    const resultFilePath = path.join(uploadDir, 'final_results.xlsx');
    xlsx.writeFile(newWorkbook, resultFilePath);

    res.send(`Filtered results have been written to ${resultFilePath}`);
  } catch (err) {
    console.error('Error processing files:', err);
    res.status(500).send('Server error');
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
