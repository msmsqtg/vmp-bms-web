<template>
  <div class="page-config-wrapper">
    <el-card shadow="never" class="rr-view-ctx-card">
      <div class="page-header">
        <el-button @click="handleBack">返回列表</el-button>
        <span class="page-title">页面配置</span>
      </div>
      <PageConfig :impId="impId" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PageConfig from './components/PageConfig.vue';

export default defineComponent({
  name: 'GroupBuyPageConfig',
  components: {
    PageConfig
  },
  data() {
    return {
      impId: 0
    };
  },
  created() {
    this.updateImpId();
  },
  watch: {
    '$route.query.impId': {
      handler() {
        this.updateImpId();
      },
      immediate: true
    }
  },
  methods: {
    updateImpId() {
      const impId = this.$route.query.impId;
      if (impId) {
        this.impId = Number(impId);
      }
    },
    handleBack() {
      this.$router.push('/activity-management/group-buy/index');
    }
  }
});
</script>

<style scoped>
.page-config-wrapper {
  padding: 20px;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
}

.page-title {
  font-size: 16px;
  font-weight: bold;
}
</style>
