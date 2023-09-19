const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csvParser = require('csv-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const userFilePath = 'userdata.csv'; // Path to your CSV file
const certificates = {};

fs.createReadStream(userFilePath)
  .pipe(csvParser())
  .on('data', (row) => {
    const cin = row.cin;
    certificates[cin] = row;
  })
  .on('end', () => {
    console.log('CSV file successfully parsed.');
  });

app.get('/api/user/:cin', (req, res) => {
  const cin = req.params.cin;

  // Normalize the cin by removing any non-alphanumeric characters and converting to uppercase
  const normalizedCin = cin.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  if (certificates[normalizedCin]) {
    res.json(certificates[normalizedCin]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
