require('dotenv').config();

module.exports = {
    user: 'dev_pine',
    password: process.env.DB_PASSWORD,
    server: '4.194.103.19',
    port: 1433,
    database: 'pine_bos',
    options: {
      encrypt: true, // If you're using Azure, set this to true
      trustServerCertificate: true,
      }
};