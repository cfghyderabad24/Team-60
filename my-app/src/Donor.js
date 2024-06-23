import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function Donor() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSector, setSelectedSector] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/filtered_result.xlsx'); // Adjust path as necessary
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet);
        // Remove duplicate organizations initially
        const uniqueProjects = excelData.filter((project, index, self) =>
          index === self.findIndex((p) => p.Org === project.Org)
        );
        setProjects(uniqueProjects);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching and parsing the Excel file:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProjects = projects
    .filter(project => {
      if (!selectedSector) return true; // If no sector selected, show all projects
      return project['Development Sector(s)'].toLowerCase().includes(selectedSector.toLowerCase());
    })
    .filter((project, index, self) =>
      index === self.findIndex((p) => p.Org === project.Org)
    );

  const handleSectorChange = (event) => {
    setSelectedSector(event.target.value);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', border: '5px solid #ccc' }}>
      <h1 style={{ textAlign: 'center' }}>Interest-Based Donor Finder</h1>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="sector-select">Filter by Development Sector:</label>
        <select id="sector-select" onChange={handleSectorChange} value={selectedSector}>
          <option value="">All Sectors</option>
          <option value="Safe drinking water">Safe drinking water</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Hygiene">Hygiene</option>
          <option value="">Others</option>
          
          {/* Add more options as needed */}
        </select>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ background: '#f2f2f2' }}>
              <th style={styles.tableHeader}>S.No</th>
              <th style={styles.tableHeader}>Organisations</th>
              <th style={styles.tableHeader}>Development Sector(s)</th>
              <th style={styles.tableHeader}>State</th>
              <th style={styles.tableHeader}>District</th>
              <th style={styles.tableHeader}>Amount Spent (INR Cr.)</th>
              <th style={styles.tableHeader}>Mode of Implementation</th>
              
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{project['S.No']}</td>
                <td style={styles.tableCell}>{project['Org']}</td>
                <td style={styles.tableCell}>{project['Development Sector(s)']}</td>
                <td style={styles.tableCell}>{project['State']}</td>
                <td style={styles.tableCell}>{project['District']}</td>
                <td style={styles.tableCell}>{project['Amount Spent (INR Cr.)']}</td>
                <td style={styles.tableCell}>{project['Mode of Implementation']}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  tableHeader: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    background: '#f2f2f2',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
};

export default Donor;