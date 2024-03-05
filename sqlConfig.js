require('dotenv').config();

//module.exports = {
//    server: 'localhost\\SQLEXPRESS',
//    database: 'pine_bos',
//    port: 1433,
//    user: 'hansolo',
//    password: 'DubeInBangkok2024',
//    trustServerCertificate: true,
//};

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