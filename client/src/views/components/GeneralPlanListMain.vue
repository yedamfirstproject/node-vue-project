<!-- D:\node-vue-project\client\src\views\components\GeneralPlanListMain.vue -->
<!-- <script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GeneralPlanCardList from "@/views/components/GeneralPlanCardList.vue";
import { Modal } from "bootstrap";
import RoleHeader from "./RoleHeader.vue";

const route = useRoute();
const currentSurveyId = route.params.surveyId || route.query.surveyId || "";

// 🌟 1. 진짜 정보 바구니 준비 (하드코딩 제거!)
const userRole = ref("");
const currentUserName = ref("");
const planList = ref([]);

// 검색 필터 상태 변수
const searchFilters = ref({
  managerName: "",
  guardianName: "",
  supportName: "",
  surveyId: currentSurveyId,
});

let searchModalInstance = null;

// 🌟 2. 세션 확인 함수 추가 (진짜 신분 확인)
const checkSession = async () => {
  try {
    const response = await axios.get("/api/user/auth/me");
    if (response.data.isLogin) {
      currentUserName.value = response.data.user.name;

      // 세션에서 주는 userType("USER" 또는 "INST")에 따라 역할 세팅
      if (response.data.userType === "USER") {
        userRole.value = "USER";
      } else {
        userRole.value = "GENERAL"; // 기관 관리자
      }
    }
  } catch (error) {
    console.error("세션 확인 실패:", error);
  }
};

// 💡 3. 데이터 불러오기 함수 (프록시 적용 및 하드코딩 파라미터 삭제)
const fetchPlans = async () => {
  try {
    // 프록시 적용된 API 주소
    const apiUrl =
      userRole.value === "USER"
        ? "/api/user/plan/list" // 유저용 API (추후 구현될 부분)
        : "/api/general/plan/list"; // 관리자용 API (방금 수술 완료한 곳!)

    const response = await axios.get(apiUrl, {
      params: {
        // 🚨 instiId: instiId.value 👈 백엔드가 세션에서 알아서 꺼내므로 삭제!
        page: 1,
        limit: 10,
        managerName: searchFilters.value.managerName,
        guardianName: searchFilters.value.guardianName,
        supportName: searchFilters.value.supportName,
        surveyId: searchFilters.value.surveyId,
      },
    });
    planList.value = response.data.data ? response.data.data : response.data;
  } catch (error) {
    console.error("계획서 목록 로딩 실패:", error);
  }
};

const showSearchModal = () => {
  if (searchModalInstance) searchModalInstance.show();
};

const applySearch = () => {
  fetchPlans();
  if (searchModalInstance) searchModalInstance.hide();
};

const resetSearch = () => {
  searchFilters.value = {
    managerName: "",
    guardianName: "",
    supportName: "",
    surveyId: currentSurveyId,
  };
  fetchPlans();
  if (searchModalInstance) searchModalInstance.hide();
};

onMounted(async () => {
  // 🌟 4. 무조건 세션부터 확인하고 -> 리스트를 불러오는 순서 맞추기!
  await checkSession();
  fetchPlans();

  const modalElement = document.getElementById("searchModal");
  if (modalElement) {
    searchModalInstance = new Modal(modalElement);
  }
});
</script>

<template>
  <div class="container-fluid py-4">
    <RoleHeader />
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">지원계획서 목록</h5>

          <button
            class="btn btn-outline-primary btn-sm mb-0"
            @click="showSearchModal"
          >
            <i class="fas fa-search me-2"></i>상세 검색
          </button>
        </div>

        <GeneralPlanCardList :planList="planList" :userRole="userRole" />
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="searchModal"
    tabindex="-1"
    aria-labelledby="searchModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="searchModalLabel">상세 검색</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
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
              placeholder="담당자 이름 입력 (예: 이설화)"
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
              placeholder="보호자 이름 입력 (예: 이미지)"
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
              placeholder="지원자 이름 입력 (예: 홍길동)"
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
</template> -->

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router"; // 🌟 useRouter 추가
import axios from "axios";
import GeneralPlanCardList from "@/views/components/GeneralPlanCardList.vue";
import { Modal } from "bootstrap";
import RoleHeader from "./RoleHeader.vue";

const route = useRoute();
const router = useRouter(); // 🌟 router 인스턴스 생성
const currentSurveyId = route.params.surveyId || route.query.surveyId || "";

const userRole = ref("");
const currentUserName = ref("");
const planList = ref([]);

const searchFilters = ref({
  managerName: "",
  guardianName: "",
  supportName: "",
  surveyId: currentSurveyId,
});

let searchModalInstance = null;

const checkSession = async () => {
  try {
    const response = await axios.get("/api/user/auth/me");
    if (response.data.isLogin) {
      currentUserName.value = response.data.user.name;

      if (response.data.userType === "USER") {
        userRole.value = "USER";
      } else {
        userRole.value = "GENERAL";
      }
    }
  } catch (error) {
    console.error("세션 확인 실패:", error);
  }
};

const fetchPlans = async () => {
  try {
    const apiUrl =
      userRole.value === "USER"
        ? "/api/user/plan/list"
        : "/api/general/plan/list";

    const response = await axios.get(apiUrl, {
      params: {
        page: 1,
        limit: 1000,
        managerName: searchFilters.value.managerName,
        guardianName: searchFilters.value.guardianName,
        supportName: searchFilters.value.supportName,
        surveyId: searchFilters.value.surveyId,
      },
    });
    planList.value = response.data.data ? response.data.data : response.data;
  } catch (error) {
    console.error("계획서 목록 로딩 실패:", error);
  }
};

const showSearchModal = () => {
  if (searchModalInstance) searchModalInstance.show();
};

const applySearch = () => {
  fetchPlans();
  if (searchModalInstance) searchModalInstance.hide();
};

const resetSearch = () => {
  searchFilters.value = {
    managerName: "",
    guardianName: "",
    supportName: "",
    surveyId: currentSurveyId,
  };
  fetchPlans();
  if (searchModalInstance) searchModalInstance.hide();
};

// 🌟 1. 필터 탭 상태 관리 (화면 표시용)
const filterType = ref("all");

// 🌟 2. 탭 클릭 시 화면에 보여줄 데이터만 필터링 (원본 planList는 건드리지 않음!)
const filteredPlanList = computed(() => {
  switch (filterType.value) {
    case "approved":
      return planList.value.filter((item) => item.state === "g001");
    case "rejected":
      return planList.value.filter((item) => item.state === "g002");
    case "pending":
      return planList.value.filter((item) => item.state === "g003");
    default:
      return planList.value;
  }
});

// 🌟 3. 탭 버튼 데이터 세팅
const filterTabs = computed(() => [
  { key: "all", label: "전체", count: planList.value.length },
  {
    key: "approved",
    label: "승인",
    count: planList.value.filter((item) => item.state === "g001").length,
  },
  {
    key: "rejected",
    label: "반려",
    count: planList.value.filter((item) => item.state === "g002").length,
  },
  {
    key: "pending",
    label: "미정",
    count: planList.value.filter((item) => item.state === "g003").length,
  },
]);

// 🌟 4. 버튼 이동 로직 추가
const goApprovalPage = () => {
  router.push("/general/approval/plan"); // 스크린샷 경로에 맞춤
};

onMounted(async () => {
  await checkSession();
  fetchPlans();

  const modalElement = document.getElementById("searchModal");
  if (modalElement) {
    searchModalInstance = new Modal(modalElement);
  }
});
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
            v-if="userRole === 'GENERAL'"
            class="approve-action-btn btn btn-sm mb-0"
            @click="goApprovalPage"
          >
            <i class="fas fa-check-circle me-2"></i>계획서 승인
          </button>

          <button
            class="search-action-btn btn btn-sm mb-0"
            @click="showSearchModal"
          >
            <i class="fas fa-search me-2"></i>상세 검색
          </button>
        </div>
      </div>

      <GeneralPlanCardList :planList="filteredPlanList" :userRole="userRole" />
    </div>
  </div>

  <div class="modal fade" id="searchModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow">
        <div class="modal-header">
          <h5 class="modal-title" id="searchModalLabel">상세 검색</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
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
              placeholder="담당자 이름 입력 (예: 이설화)"
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
              placeholder="보호자 이름 입력 (예: 이미지)"
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
              placeholder="지원자 이름 입력 (예: 홍길동)"
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
/* 🌟 팀장님 디자인 CSS 완벽 복사 */
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

.search-action-btn {
  border-radius: 999px;
  padding: 0.55rem 1rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
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

/* 🌟 관리자 전용 승인 버튼 스타일 (다크블루) */
.approve-action-btn {
  border-radius: 999px;
  padding: 0.55rem 1rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(52, 71, 103, 0.2);
  transition: all 0.2s ease;
  background: #344767;
  color: #ffffff;
  border: 1px solid #344767;
}

.approve-action-btn:hover {
  background: #212e46;
  color: #ffffff;
  border-color: #212e46;
  transform: translateY(-1px);
}
</style>
