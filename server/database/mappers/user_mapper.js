//사용자 관련 mapper
const { pool } = require("../DAO");
const userSql = require("../sql/user_sql");

const testSelect = async () => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [rows, meta] = await conn.query(userSql.testSelect);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

module.exports = {
  testSelect,
};
