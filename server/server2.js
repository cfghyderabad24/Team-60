const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configure your PostgreSQL connection pool
const pool = new Pool({
  user: 'your-username',
  host: 'your-database-host',
  database: 'your-database-name',
  password: 'your-password',
  port: 5432, // Default PostgreSQL port
});

// Define a route to perform the join and remove duplicates
app.get('/join-and-remove-duplicates', async (req, res) => {
  try {
    const client = await pool.connect();

    const query = `
      -- Join table1 and table2 on the id column
      WITH joined_table AS (
        SELECT
          t1.id,
          t1.column1 AS t1_column1,
          t1.column2 AS t1_column2,
          t2.column1 AS t2_column1,
          t2.column2 AS t2_column2
        FROM
          table1 t1
        INNER JOIN
          table2 t2
        ON
          t1.id = t2.id
      )

      -- Remove duplicates based on the id column
      SELECT DISTINCT
        jt.id,
        jt.t1_column1,
        jt.t1_column2,
        jt.t2_column1,
        jt.t2_column2
      FROM
        joined_table jt
      ORDER BY
        jt.id;
    `;

    const result = await client.query(query);
    client.release();

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(Server is running on port ${port});
});