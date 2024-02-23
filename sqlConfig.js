//module.exports = {
//    server: 'localhost\\SQLEXPRESS',
//    database: 'pine_bos',
//    port: 1433,
//    user: 'hansolo',
//    password: 'DubeInBangkok2024',
//    trustServerCertificate: true,
//    options: {
//        cryptoCredentialsDetails: {
//            trustServerCertificate: true,
//        }
//    }
//};

module.exports = {
    user: '',
    password: '',
    server: 'sql-db-pine-solution.public.f2b01b7c78ad.database.windows.net',
    port: 3342,
    database: 'pine_bos',
    options: {
      encrypt: true, // If you're using Azure, set this to true
    },
};