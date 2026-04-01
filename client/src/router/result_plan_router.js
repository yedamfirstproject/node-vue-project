// 지원결과서 작성
export default [
  // 담당자 - 지원결과서 작성
  {
    path: "/manager/result/write",
    name: "ManagerResultPlanWrite",
    component: () => import("../views/components/ResultPlanWrite.vue"),
  },
  // 담당자 - 본인 지원결과서 조회
  {
    path: "/manager/result/list",
    name: "ManagerGeneralResult",
    component: () => import("../views/components/GeneralResultList.vue"),
  },
  // 관리자 - 기관 전체 지원결과서 조회
  {
    path: "/general/result/list",
    name: "GeneralAdminResult",
    component: () => import("../views/components/GeneralResultList.vue"),
  },
];
