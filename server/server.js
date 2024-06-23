const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const uploadDir = path.join(__dirname, 'uploads'); // Use 'uploads' instead of 'uploads/'

// Middleware
app.use(bodyParser.json());

// Route to Process Excel Files
app.post('/process', async (req, res) => {
  const company = {
    1: "Reliance Industries Limited",
    2: "Hdfc Bank Limited",
    3: "Tata Consultancy Services Limited",
    4: "Oil And Natural Gas Corporation Limited",
    5: "Ntpc Limited",
    6: "Infosys Limited",
    7: "Itc Limited",
    8: "Nmdc Limited",
    9: "Indian Oil Corporation Limited",
    10: "Icici Bank Limited"
  };

  try {
    // Ensure 'uploads' directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const allFilteredData = [];

    // Loop through 1.xlsx to 10.xlsx (adjust the loop as needed)
    for (let i = 1; i <= 10; i++) {
      const filePath = `C:/Users/kruth/Documents/jaldhara/server/Downloads/${i}.xlsx`;

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.log(`File ${i}.xlsx not found.`);
        continue; // Skip to the next file if current file does not exist
      }

      // Read Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet);

      // Filter data based on the specified tags
      const filteredData = data.filter(item =>
        item['Development Sector(s)'] &&
        (item['Development Sector(s)'].includes('Safe Drinking Water') ||
         item['Development Sector(s)'].includes('Sanitation') ||
         item['Development Sector(s)'].includes('Hygiene'))
      );

      // Add file number and company name as columns
      filteredData.forEach(item => {
        item.FileNumber = i;
        item.CompanyName = company[i];
      });

      // Concatenate filtered data to the array
      allFilteredData.push(...filteredData);
    }

    //console.log(allFilteredData)
    function generateSummary(inputArray) {
      const result = {};
    
      inputArray.forEach(item => {
        const companyName = item.CompanyName;
        console.log(companyName)
        const amountSpent = parseFloat(item['Amount Spent (INR Cr.)']);
    
        if (result[companyName]) {
          result[companyName] += amountSpent;
        } else {
          result[companyName] = amountSpent;
        }
      });
    
      // Convert the result object to an array of objects
      const outputArray = Object.keys(result).map(companyName => ({
        CompanyName: companyName,
        TotalAmountSpent: result[companyName]
      }));
    
      return outputArray;
    }



    //console.log(generateSummary(allFilteredData))



    // If no data was found in any file, return an error response
    if (allFilteredData.length === 0) {
      return res.status(400).send('No matching data found in any Excel file.');
    }
    
    // Create a new workbook and add all filtered data to a single worksheet
    const newWorkbook = xlsx.utils.book_new();
    const newWorksheet = xlsx.utils.json_to_sheet(allFilteredData);

    // Add the worksheet to the workbook
    xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'Filtered Data');

    // Write to a new Excel file
    const resultFilePath = path.join(uploadDir, 'filtered_results.xlsx');
    xlsx.writeFile(newWorkbook, resultFilePath);

    res.send(generateSummary(allFilteredData));
    
  } catch (err) {
    console.error('Error processing files:', err);
    res.status(500).send('Server error');
  }
});

// Start Server
const PORT = process.env.PORT || 5009;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
