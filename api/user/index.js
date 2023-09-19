// Import necessary dependencies
const fs = require('fs');
const csvParser = require('csv-parser');

// Path to your CSV file
const userFilePath = 'userdata.csv';

// Function to read CSV file and return user data
async function getUserData(cin) {
  return new Promise((resolve, reject) => {
    const certificates = {};
    fs.createReadStream(userFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        const normalizedCin = row.cin.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        certificates[normalizedCin] = row;
      })
      .on('end', () => {
        if (certificates[cin]) {
          resolve(certificates[cin]);
        } else {
          reject({ message: 'User not found' });
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Export the serverless function
module.exports = async (req, res) => {
  try {
    const cin = req.query.cin;
    if (!cin) {
      return res.status(400).json({ message: 'CIN parameter is required' });
    }

    const userData = await getUserData(cin);

    if (userData) {
      return res.json(userData);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
