<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import RoleHeader from "../components/RoleHeader.vue";

const waitUsers = ref([]);
const filterType = ref("all");

// 필터
const filteredWaitUsers = computed(() => {
  switch (filterType.value) {
    case "general":
      return waitUsers.value.filter((u) => u.type === "general");
    case "insti":
      return waitUsers.value.filter((u) => u.type === "insti");
    default:
      return waitUsers.value;
  }
});

// 👉 기관만 선택했을 때 파일 컬럼 숨김
const isOnlyInsti = computed(() => {
  return filterType.value === "insti";
});

// 파일명 표시용
const getDisplayFileName = (fileName) => {
  if (!fileName) return "-";
  return fileName.replace(/^\d+_/, "");
};

// 다운로드
const downloadUserFile = (fileName) => {
  if (!fileName) return;
  window.open(
    `/api/user/download/user/${encodeURIComponent(fileName)}`,
    "_blank",
  );
};

// 데이터 조회
const loadWaitUsers = async () => {
  try {
    const [generalRes, instiRes] = await Promise.all([
      axios.get("/api/user/wait-users"),
      axios.get("/api/user/wait-insti-users"),
    ]);

    waitUsers.value = [
      ...(generalRes.data.data || []).map((u) => ({ ...u, type: "general" })),
      ...(instiRes.data.data || []).map((u) => ({ ...u, type: "insti" })),
    ];
  } catch (err) {
    console.log(err);
  }
};

// 승인
const approveUser = async (user) => {
  if (!confirm("해당 사용자를 승인하시겠습니까?")) return;

  try {
    if (user.type === "general") {
      await axios.patch(`/api/user/approve/${user.G_UserId}`);
    } else {
      await axios.patch(`/api/user/approve-manager/${user.I_UserId}`);
    }

    alert("승인 완료");
    loadWaitUsers();
  } catch (err) {
    console.log(err);
  }
};

// 거절
const rejectUser = async (user) => {
  if (!confirm("해당 사용자를 거절하시겠습니까?")) return;

  try {
    if (user.type === "general") {
      await axios.patch(`/api/user/reject/${user.G_UserId}`);
    } else {
      await axios.patch(`/api/user/reject-manager/${user.I_UserId}`);
    }

    alert("거절 완료");
    loadWaitUsers();
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  loadWaitUsers();
});
</script>

<template>
  <RoleHeader />

  <div class="container card mt-5">
    <div class="card-header pb-0">
      <h6>사용자 가입 승인 관리</h6>
    </div>

    <div class="card-body px-0 pt-0 pb-2">
      <!-- 필터 버튼 -->
      <div class="d-flex justify-content-end mb-3 me-3">
        <div class="btn-group">
          <button
            class="btn btn-outline-primary btn-sm"
            :class="{ active: filterType === 'all' }"
            @click="filterType = 'all'"
          >
            전체
          </button>
          <button
            class="btn btn-outline-primary btn-sm"
            :class="{ active: filterType === 'general' }"
            @click="filterType = 'general'"
          >
            일반
          </button>
          <button
            class="btn btn-outline-primary btn-sm"
            :class="{ active: filterType === 'insti' }"
            @click="filterType = 'insti'"
          >
            기관
          </button>
        </div>
      </div>

      <!-- 테이블 -->
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-center text-xs">이름</th>
              <th class="text-center text-xs">아이디</th>
              <th class="text-center text-xs">연락처</th>
              <th class="text-center text-xs">구분</th>

              <!-- 🔥 기관만 선택하면 컬럼 숨김 -->
              <th v-if="!isOnlyInsti" class="text-center text-xs">첨부파일1</th>
              <th v-if="!isOnlyInsti" class="text-center text-xs">첨부파일2</th>

              <th class="text-center text-xs">승인</th>
            </tr>
          </thead>

          <tbody v-if="filteredWaitUsers.length > 0">
            <tr
              v-for="user in filteredWaitUsers"
              :key="user.type === 'general' ? user.G_UserId : user.I_UserId"
            >
              <td class="text-center">{{ user.name }}</td>
              <td class="text-center">{{ user.id }}</td>
              <td class="text-center">{{ user.tel }}</td>
              <td class="text-center">
                {{ user.type === "general" ? "일반" : "기관" }}
              </td>

              <!-- 파일1 -->
              <td v-if="!isOnlyInsti" class="text-center">
                <template v-if="user.type === 'general' && user.document1">
                  <div>{{ getDisplayFileName(user.document1) }}</div>
                  <button
                    class="btn btn-link btn-sm p-0"
                    @click="downloadUserFile(user.document1)"
                  >
                    다운로드
                  </button>
                </template>
                <template v-else>-</template>
              </td>

              <!-- 파일2 -->
              <td v-if="!isOnlyInsti" class="text-center">
                <template v-if="user.type === 'general' && user.document2">
                  <div>{{ getDisplayFileName(user.document2) }}</div>
                  <button
                    class="btn btn-link btn-sm p-0"
                    @click="downloadUserFile(user.document2)"
                  >
                    다운로드
                  </button>
                </template>
                <template v-else>-</template>
              </td>

              <!-- 승인 -->
              <td class="text-center">
                <button
                  class="btn btn-success btn-sm me-2"
                  @click="approveUser(user)"
                >
                  승인
                </button>
                <button class="btn btn-danger btn-sm" @click="rejectUser(user)">
                  거절
                </button>
              </td>
            </tr>
          </tbody>

          <!-- 데이터 없을 때 -->
          <tbody v-else>
            <tr>
              <td :colspan="isOnlyInsti ? 5 : 7" class="text-center">
                승인 대기 사용자가 없습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
