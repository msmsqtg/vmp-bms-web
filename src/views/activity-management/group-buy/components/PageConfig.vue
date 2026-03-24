<template>
  <div class="page-config">
    <div class="config-container">
      <!-- 左侧 Tab 导航 -->
      <div class="left-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-item', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- 中间预览区域和右侧表单编辑区域 -->
      <div class="content-area">
        <!-- 内容区域 -->
        <HomeConfig v-if="activeTab === 'home'" :impId="impId" ref="homeConfigRef" />

        <!-- 拼团详情配置 -->
        <DetailConfig v-else-if="activeTab === 'detail'" :impId="impId" ref="detailConfigRef" />

        <!-- 好友进入配置 -->
        <FriendConfig v-else-if="activeTab === 'friend'" :impId="impId" ref="friendConfigRef" />

        <!-- 好友获奖配置 -->
        <PrizeConfig v-else-if="activeTab === 'prize'" :impId="impId" ref="prizeConfigRef" />

        <!-- 分享效果配置 -->
        <ShareConfig v-else-if="activeTab === 'share'" :impId="impId" ref="shareConfigRef" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import HomeConfig from './page-config/HomeConfig.vue';
import DetailConfig from './page-config/DetailConfig.vue';
import FriendConfig from './page-config/FriendConfig.vue';
import PrizeConfig from './page-config/PrizeConfig.vue';
import ShareConfig from './page-config/ShareConfig.vue';

export default defineComponent({
  name: 'PageConfig',
  components: {
    HomeConfig,
    DetailConfig,
    FriendConfig,
    PrizeConfig,
    ShareConfig
  },
  props: {
    impId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const activeTab = ref('home');
    const tabs = [
      { key: 'home', label: '首页' },
      { key: 'detail', label: '拼团详情' },
      { key: 'friend', label: '好友进入' },
      { key: 'prize', label: '好友获奖' },
      { key: 'share', label: '分享效果' }
    ];

    const currentTabLabel = computed(() => {
      const tab = tabs.find(t => t.key === activeTab.value);
      return tab ? tab.label : '';
    });

    // 组件引用
    const homeConfigRef = ref();
    const detailConfigRef = ref();
    const friendConfigRef = ref();
    const prizeConfigRef = ref();
    const shareConfigRef = ref();

    // 保存当前配置
    const saveCurrentConfig = async () => {
      const configRefs: any = {
        home: homeConfigRef,
        detail: detailConfigRef,
        friend: friendConfigRef,
        prize: prizeConfigRef,
        share: shareConfigRef
      };

      const currentRef = configRefs[activeTab.value];
      if (currentRef && currentRef.value && currentRef.value.save) {
        await currentRef.value.save();
      }
    };

    return {
      activeTab,
      tabs,
      currentTabLabel,
      homeConfigRef,
      detailConfigRef,
      friendConfigRef,
      prizeConfigRef,
      shareConfigRef,
      saveCurrentConfig
    };
  }
});
</script>

<style scoped>
.page-config {
  height: calc(100vh - 80px);
  overflow: hidden;
}

.config-container {
  display: flex;
  gap: 20px;
  height: 100%;
}

/* 左侧 Tab 导航 */
.left-tabs {
  width: 120px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  overflow-y: auto;
}

.tab-item {
  padding: 15px 20px;
  cursor: pointer;
  border-bottom: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.tab-item:last-child {
  border-bottom: none;
}

.tab-item:hover {
  background: #f5f7fa;
}

.tab-item.active {
  background: #409eff;
  color: #fff;
}

/* 内容区域 */
.content-area {
  flex: 1;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.form-header {
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.form-header h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.form-subtitle {
  font-size: 12px;
  color: #999;
}
</style>
