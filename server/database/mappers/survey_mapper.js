//조사서 관련 mapper
const { pool } = require("../DAO");
const surveySql = require("../sql/survey_sql");

//조사지 전체조회 <김민지, 디비에 있는 데이터 가져와서 전체조회>
const selectSurveyAll = async () => {
  let conn = null;
  conn = await pool.getConnection();
  try {
    let [rows] = await conn.query(surveySql.selectSurveyAll);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

//조사지 건별조회 <김민지, 디비에 있는 데이터 가져와서 건별조회>
const selectSurveyById = async (no) => {
  let conn = null;
  conn = await pool.getConnection();
  try {
    let rows = await conn.query(surveySql.selectSurveyById, [no]);
    return rows[0];
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { selectSurveyAll, selectSurveyById };
