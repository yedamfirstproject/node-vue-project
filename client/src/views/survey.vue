<template>
  <div class="survey-page">
    <Sidebar />
    <div class="main-content">
      <RoleHeader />
      <SurveyCard />
    </div>
  </div>
</template>

<script setup>
import RoleHeader from "./components/RoleHeader.vue";
import SurveyCard from "./components/surveyCard.vue";
import Sidebar from "../examples/Sidenav/SidenavList.vue";
</script>
