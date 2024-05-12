const sql = require('mssql');
const sqlConfig = require('../../sqlConfig');

module.exports = async function runDashboard(UserData) {
  try {
    const pool = await sql.connect(sqlConfig);
    let query = `
      SELECT *
      FROM users
      WHERE 1=1
    `;

    const result = await pool.request().query(query);
    return result.recordset;
    
  } catch (error) {
    console.error('Error during search:', error);
    throw error;

  } finally {
    await sql.close();
  }
}