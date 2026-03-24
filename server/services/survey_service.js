//조사지 관련 service
const surveyMapper = require("../database/mappers/survey_mapper");

//조사지 전체조회 <김민지, mapper에 있는 함수 가져와서 라우터에 결과 전달>
const findAll = async () => {
  let list = await surveyMapper.selectSurveyAll();
  return list;
};

//조사지 건별조회 <김민지, mapper에 있는 함수 가져와서 라우터에 결과 전달>
const fineInfoByNo = async (surveyNo) => {
  let detail = await surveyMapper.selectSurveyById(surveyNo);
  return detail;
};

//조사지 등록 <김민지, 26.03.24 수정 (오류 잡기, PK증가로직 추가)>

const createInfo = async (surveyObj) => {
  //객체 구조분해
  const { Ver_Id, G_UserId, support_id, result, reason, updated_at } =
    surveyObj;

  const formattedDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    let J_ID;
    const lastJ_ID = await surveyMapper.getLastJ_ID();
    if (!lastJ_ID) {
      J_ID = "SUV0001";
    } else {
      const num = parseInt(lastJ_ID.J_ID.substring(3), 10);
      J_ID = "SUV" + String(num + 1).padStart(3, "0");
    }
    //구조분해한 객체를 배열로 생성
    let insertData = [
      J_ID,
      Ver_Id,
      G_UserId,
      support_id,
      result,
      reason,
      formattedDate,
      updated_at,
    ];
    console.log("INSERT DATA:", insertData);

    //mapper에서 함수 가져와서 실행
    let outcome = await surveyMapper.insertSurvey(insertData);
    //outcome : 결과

    //결과 처리
    let outObj = {
      status: outcome.affectedRows > 0 ? "success" : "fail", //성공하면 success, 실패하면 fail
      //insertId에서 affectedRows로 변경 (insertId는 AUTO_INCREMENT일때만 의미가 있어서 변경함)
      J_ID: J_ID, //등록할 때 넣은 값 (예: SUV0001)
    };
    return outObj;
  } catch (err) {
    if (err.code !== "ER_DUP_ENTRY") {
      //"ER_DUP_ENTRY" 중복 값에 대한 mariadb 에러코드
      return { status: "Failed", message: err.message };
    }
    if (retry == 2) {
      return { status: "Failed", message: "PK 중복으로 인한 등록 실패" };
    }
  }
};

module.exports = { findAll, fineInfoByNo, createInfo };
