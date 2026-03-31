//상담기록 관련 sql문

//전체조회
const consultList = `
SELECT
  counsult_id
  J_ID
  I_UserId
  support_id
  counsult_date
  write_date
  counsult_loc
  counsult_startTime
  counsult_endTime
  counsult_content
  updated_at
  counsult_method
FROM ConsultRecord_Tbl
ORDER BY counsult_id;
`;

module.exports = { consultList };
