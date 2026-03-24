<template>
  <div class="activity-management">
    <el-card shadow="never" class="rr-view-ctx-card">
      <div class="activity-grid">
        <div class="activity-card blue">
          <h3 class="activity-title">邀约工具</h3>
          <p class="activity-desc">邀请客户建立联系</p>
          <el-button type="primary" plain class="enter-btn group-buy-btn">点击进入</el-button>
        </div>
        <div class="activity-card blue">
          <h3 class="activity-title">组团活动</h3>
          <p class="activity-desc">成团即享抽奖权，100%有礼！</p>
          <el-button type="primary" plain class="enter-btn group-buy-btn">点击进入</el-button>
        </div>
        <div class="activity-card blue">
          <h3 class="activity-title">拼团活动</h3>
          <p class="activity-desc">成团即享抽奖权，100%有礼！</p>
          <el-button type="primary" plain class="enter-btn group-buy-btn" @click="goToGroupBuy">点击进入</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: "ActivityManagement",
  methods: {
    goToGroupBuy() {
      this.$router.push({
        path: "/activity-management/group-buy/index"
      });
    }
  }
};
</script>

<style scoped>
.activity-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.activity-card {
  padding: 20px;
  border-radius: 8px;
  color: white;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.activity-card.blue {
  background-color: #17B3A3;
}

.activity-card.purple {
  background-color: #7B1FA2;
}

.activity-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.activity-desc {
  font-size: 14px;
  margin-bottom: 20px;
  flex-grow: 1;
}

.enter-btn {
  align-self: flex-start;
  color: white;
  border-color: white;
}

.enter-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: white;
  color: white;
}

@media screen and (max-width: 1200px) {
  .activity-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media screen and (max-width: 992px) {
  .activity-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .activity-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 576px) {
  .activity-grid {
    grid-template-columns: 1fr;
  }
}

/* 拼团活动卡片样式 */
.group-buy-title {
  background-color: #17B3A3;
  padding: 5px 10px;
  border-radius: 4px;
  display: inline-block;
}

.group-buy-desc {
  background-color: white;
  color: #17B3A3;
  padding: 5px 10px;
  border-radius: 4px;
}

/* 拼团活动按钮样式 */
.group-buy-btn {
  background-color: white;
  color: #17B3A3;
  border-color: #17B3A3;
}

.group-buy-btn:hover {
  background-color: #17B3A3;
  color: white;
  border-color: white;
}
</style>
