require('dotenv').config();

module.exports = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: 1433,
  database: 'pine_bos',
  options: {
    encrypt: true, // If you're using Azure, set this to true
    trustServerCertificate: true,
  }
};