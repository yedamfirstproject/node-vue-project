<!-- D:\node-vue-project\client\src\views\components\GeneralResultList.vue -->
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import GeneralResultCardList from "@/views/components/GeneralResultCardList.vue";
import { Modal } from "bootstrap";
import RoleHeader from "./RoleHeader.vue";

const route = useRoute();
const router = useRouter();

const resultList = ref([]);
const searchFilters = ref({
  managerName: "",
  guardianName: "",
  supportName: "",
});
let searchModalInstance = null;

// 🌟 1. 세션에서 꺼낼 진짜 이름과 역할 바구니
const currentUserName = ref("");
const actualUserRole = ref(""); // "USER", "MANAGER", "GENERAL" 중 하나가 됨

// 🌟 2. 세션 확인 (진짜 신분 확인)
const checkSession = async () => {
  try {
    const response = await axios.get("/api/user/auth/me");
    if (response.data.isLogin) {
      currentUserName.value = response.data.user.name;

      if (response.data.userType === "USER") {
        actualUserRole.value = "USER"; // 일반 이용자
      } else {
        // 기관 사용자일 경우 role에 따라 담당자/관리자 구분
        const role = response.data.user.role || response.data.user.roll;
        actualUserRole.value = role === "a003" ? "MANAGER" : "GENERAL";
      }
    }
  } catch (error) {
    console.error("세션 확인 실패:", error);
  }
};

// 💡 3. 타이틀도 세션 권한에 따라 동적으로!
// const pageTitle = computed(() => {
//   if (actualUserRole.value === "USER") return "내 지원결과서 내역";
//   if (actualUserRole.value === "MANAGER") return "내 지원결과서 조회";
//   return "기관 전체 지원결과서 조회";
// });

// 💡 4. 목록 불러오기 API 호출 (API 주소 갈라치기!)
const fetchResults = async () => {
  try {
    // 🌟 권한에 따라 찌를 API 주소 결정!
    const apiUrl =
      actualUserRole.value === "USER"
        ? "/api/user/result/list" // 🚨 일반 이용자용 백엔드 라우터 (하단 설명 참고!)
        : "/api/result/plan/general-list"; // 기관 이용자용 백엔드 라우터

    const response = await axios.get(apiUrl, {
      params: {
        page: 1,
        limit: 1000,
        // 🚨 role: userRole.value 👈 백엔드가 알아서 하니까 지워버림!
        surveyId: route.query.surveyId,
        ...searchFilters.value,
      },
    });
    resultList.value = response.data.data ? response.data.data : response.data;
  } catch (error) {
    console.error("결과서 목록 로딩 실패:", error);
  }
};

// 검색 로직
const showSearchModal = () => {
  if (searchModalInstance) searchModalInstance.show();
};
const applySearch = () => {
  fetchResults();
  if (searchModalInstance) searchModalInstance.hide();
};
const resetSearch = () => {
  searchFilters.value = { managerName: "", guardianName: "", supportName: "" };
  fetchResults();
  if (searchModalInstance) searchModalInstance.hide();
};

onMounted(async () => {
  // 🌟 5. 무조건 세션부터 확인하고 -> 데이터 불러오기
  await checkSession();
  fetchResults();

  const searchEl = document.getElementById("searchModal");
  if (searchEl) searchModalInstance = new Modal(searchEl);
});

// 🌟 1. 팀장님 스타일: 필터 탭 상태 관리
const filterType = ref("all"); // all / approved / rejected / pending

// 🌟 2. 탭 클릭 시 목록 필터링 (상태 코드가 g001, g002, g003이라고 가정)
const filteredResultList = computed(() => {
  switch (filterType.value) {
    case "approved":
      return resultList.value.filter((item) => item.state === "g001");
    case "rejected":
      return resultList.value.filter((item) => item.state === "g002");
    case "pending":
      return resultList.value.filter((item) => item.state === "g003");
    default:
      return resultList.value; // 전체
  }
});

// 🌟 3. 탭 버튼 데이터 및 개수(Count) 자동 계산
const filterTabs = computed(() => [
  { key: "all", label: "전체", count: resultList.value.length },
  {
    key: "approved",
    label: "승인",
    count: resultList.value.filter((item) => item.state === "g001").length,
  },
  {
    key: "rejected",
    label: "반려",
    count: resultList.value.filter((item) => item.state === "g002").length,
  },
  {
    key: "pending",
    label: "미정",
    count: resultList.value.filter((item) => item.state === "g003").length,
  },
]);

// 🌟 4. '결과서 작성' 버튼 클릭 시 이동 함수
// const goWriteResult = () => {
//   // router가 선언되어 있어야 합니다! (const router = useRouter();)
//   router.push("/manager/result/write");
// };
</script>

<template>
  <div class="container-fluid py-4">
    <RoleHeader />

    <div class="mt-4 px-2 px-md-3">
      <div
        class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4"
      >
        <div class="filter-pill-wrap d-flex align-items-center gap-2 flex-wrap">
          <button
            v-for="tab in filterTabs"
            :key="tab.key"
            type="button"
            class="filter-pill-btn"
            :class="{ active: filterType === tab.key }"
            @click="filterType = tab.key"
          >
            <span>{{ tab.label }}</span>
            <span class="filter-count">{{ tab.count }}</span>
          </button>
        </div>

        <div class="d-flex align-items-center gap-2 flex-wrap">
          <button
            v-if="actualUserRole === 'MANAGER'"
            class="write-action-btn btn btn-sm mb-0"
            @click="router.push('/manager/result/write')"
          >
            <i class="fas fa-pen me-2"></i>결과서 작성
          </button>

          <button
            v-else-if="actualUserRole === 'GENERAL'"
            class="approve-action-btn btn btn-sm mb-0"
            @click="router.push('/general/approval/result')"
          >
            <i class="fas fa-check-circle me-2"></i>결과서 승인
          </button>

          <button
            class="search-action-btn btn btn-sm mb-0"
            @click="showSearchModal"
          >
            <i class="fas fa-search me-2"></i>상세 검색
          </button>
        </div>
      </div>

      <GeneralResultCardList :resultList="filteredResultList" />
    </div>
  </div>
  <div class="modal fade" id="searchModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">상세 검색</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label text-sm font-weight-bold"
              >담당자 이름</label
            >
            <input
              type="text"
              class="form-control"
              v-model="searchFilters.managerName"
            />
          </div>
          <div class="mb-3">
            <label class="form-label text-sm font-weight-bold"
              >보호자 이름</label
            >
            <input
              type="text"
              class="form-control"
              v-model="searchFilters.guardianName"
            />
          </div>
          <div class="mb-3">
            <label class="form-label text-sm font-weight-bold"
              >지원대상자 이름</label
            >
            <input
              type="text"
              class="form-control"
              v-model="searchFilters.supportName"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary mb-0"
            @click="resetSearch"
          >
            초기화
          </button>
          <button
            type="button"
            class="btn btn-primary mb-0"
            @click="applySearch"
          >
            검색
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 🌟 팀장님 디자인 완벽 이식 */
.filter-pill-wrap {
  padding: 0.4rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(6px);
}

.filter-pill-btn {
  border: none;
  background: transparent;
  color: #495057;
  border-radius: 999px;
  padding: 0.5rem 1rem;
  font-size: 0.88rem;
  font-weight: 700;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.filter-pill-btn:hover {
  background: rgba(255, 255, 255, 0.65);
  color: #212529;
}

.filter-pill-btn.active {
  background: #ffffff;
  color: #212529;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.filter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.08);
  font-size: 0.75rem;
  font-weight: 700;
}

.filter-pill-btn.active .filter-count {
  background: rgba(0, 0, 0, 0.12);
  color: #212529;
}

.search-action-btn,
.write-action-btn {
  border-radius: 999px;
  padding: 0.55rem 1rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
}

.search-action-btn {
  background: #ffffff;
  color: #344767;
  border: 1px solid rgba(52, 71, 103, 0.18);
}

.search-action-btn:hover {
  background: #344767;
  color: #ffffff;
  border-color: #344767;
  transform: translateY(-1px);
}

.write-action-btn {
  background: #5e72e4;
  color: #ffffff;
  border: 1px solid #5e72e4;
}

.write-action-btn:hover {
  background: #324cdd;
  color: #ffffff;
  border-color: #324cdd;
  transform: translateY(-1px);
}

.approve-action-btn {
  background: #344767;
  color: #ffffff;
  border: 1px solid #344767;
  border-radius: 999px;
  padding: 0.55rem 1rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(52, 71, 103, 0.2);
  transition: all 0.2s ease;
}

.approve-action-btn:hover {
  background: #212e46; /* 마우스 올리면 더 진해짐 */
  color: #ffffff;
  border-color: #212e46;
  transform: translateY(-1px);
}
</style>
