export default [
  {
    // 💡 기관관리자(GENERAL) 지원계획서 리스트 Router
    path: "/general/plan",
    name: "generalPlanList",
    // 파일 경로가 views/general 폴더 안에 있다고 가정했어. 실제 저장한 경로에 맞게 맞춰줘!
    component: () => import("../views/components/GeneralPlanListMain.vue"),
  },
];
