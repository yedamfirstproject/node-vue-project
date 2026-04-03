<!-- D:\node-vue-project\client\src\views\components\ApprovalResultList.vue -->
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import ApprovalResultCardList from "@/views/components/ApprovalResultCardList.vue";
import { Modal } from "bootstrap";
import RoleHeader from "./RoleHeader.vue";

const resultList = ref([]);
const searchFilters = ref({
  managerName: "",
  guardianName: "",
  supportName: "",
});

// 🌟 헤더용 이름 바구니
const currentUserName = ref("");

let searchModalInstance = null;
let rejectModalInstance = null;

const targetResultId = ref("");
const rejectReasonText = ref("");

// 🌟 세션 확인 (이름 가져오기)
const checkSession = async () => {
  try {
    const response = await axios.get("/api/user/auth/me");
    if (response.data.isLogin) {
      currentUserName.value = response.data.user.name;
    }
  } catch (error) {
    console.error("세션 확인 실패:", error);
  }
};

// 💡 1. 대기 목록 불러오기 (프록시 적용)
const fetchPendingResults = async () => {
  try {
    const response = await axios.get(
      "/api/approval/result/list", // 👈 /api 적용
      {
        params: { page: 1, limit: 10, ...searchFilters.value },
      },
    );
    resultList.value = response.data.data ? response.data.data : response.data;
  } catch (error) {
    console.error("결과서 대기 목록 로딩 실패:", error);
  }
};

// 💡 2. 승인 처리 로직 (프록시 적용)
const handleApprove = async (resultId) => {
  if (!confirm("이 지원결과서를 승인하시겠습니까?")) return;

  try {
    await axios.put(`/api/approval/result/approve/${resultId}`); // 👈 /api 적용
    alert("승인이 완료되었습니다.");
    fetchPendingResults();
  } catch (error) {
    alert("승인 처리 중 오류가 발생했습니다.");
    console.error(error);
  }
};

// 3. 반려 모달 띄우기
const openRejectModal = (resultId) => {
  targetResultId.value = resultId;
  rejectReasonText.value = "";
  if (rejectModalInstance) rejectModalInstance.show();
};

// 💡 4. 반려 처리 로직 (프록시 적용)
const submitReject = async () => {
  if (!rejectReasonText.value.trim()) {
    alert("반려 사유를 입력해주세요.");
    return;
  }

  try {
    await axios.put(
      `/api/approval/result/reject/${targetResultId.value}`, // 👈 /api 적용
      { rejectReason: rejectReasonText.value },
    );
    alert("반려 처리가 완료되었습니다.");
    if (rejectModalInstance) rejectModalInstance.hide();
    fetchPendingResults();
  } catch (error) {
    alert("반려 처리 중 오류가 발생했습니다.");
    console.error(error);
  }
};

// 검색 로직 (기존과 동일)
const showSearchModal = () => {
  if (searchModalInstance) searchModalInstance.show();
};
const applySearch = () => {
  fetchPendingResults();
  if (searchModalInstance) searchModalInstance.hide();
};
const resetSearch = () => {
  searchFilters.value = { managerName: "", guardianName: "", supportName: "" };
  fetchPendingResults();
  if (searchModalInstance) searchModalInstance.hide();
};

onMounted(async () => {
  // 🌟 세션부터 확인하고 리스트 불러오기
  await checkSession();
  fetchPendingResults();

  const searchEl = document.getElementById("searchModal");
  if (searchEl) searchModalInstance = new Modal(searchEl);
  const rejectEl = document.getElementById("rejectModal");
  if (rejectEl) rejectModalInstance = new Modal(rejectEl);
});
</script>

<template>
  <div class="container-fluid py-4">
    <RoleHeader />

    <div class="mt-4 px-2 px-md-3">
      <h5 class="mt-4 mb-0">지원결과서 승인</h5>
      <div
        class="d-flex justify-content-end align-items-center flex-wrap gap-3 mb-4"
      >
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <button
            class="search-action-btn btn btn-sm mb-0"
            @click="showSearchModal"
          >
            <i class="fas fa-search me-2"></i>상세 검색
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <ApprovalResultCardList
            :resultList="resultList"
            @onApprove="handleApprove"
            @onRejectClick="openRejectModal"
          />
        </div>
      </div>
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

  <div class="modal fade" id="rejectModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow">
        <div class="modal-header">
          <h5 class="modal-title text-danger">지원결과서 반려</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label text-sm font-weight-bold"
              >반려 사유 작성</label
            >
            <textarea
              class="form-control"
              rows="5"
              placeholder="반려 사유를 상세히 적어주세요."
              v-model="rejectReasonText"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary mb-0"
            data-bs-dismiss="modal"
          >
            취소
          </button>
          <button
            type="button"
            class="btn btn-danger mb-0"
            @click="submitReject"
          >
            반려 등록
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 🌟 상세 검색 버튼 스타일 통일 */
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
</style>
