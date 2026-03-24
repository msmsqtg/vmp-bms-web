<template>
  <div class="page-config">
    <!-- 顶部 Tab 导航 -->
    <div class="top-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-item', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 下方内容区域 -->
    <div class="content-area">
      <!-- 基础设置 -->
      <basic-config 
        v-if="activeTab === 'basic'" 
        :form="form" 
        :is-view-mode="isViewMode"
        @update:form="(value: typeof form) => form = value"
        @save-success="handleSaveSuccess"
      />

      <!-- 分享设置 -->
      <share-config 
        v-if="activeTab === 'share'" 
        :form="form" 
        :is-view-mode="isViewMode"
        @update:form="(value: typeof form) => form = value"
        @save-success="handleSaveSuccess"
      />

      <!-- 登录页面 -->
      <login-config 
        v-if="activeTab === 'login'" 
        :form="form" 
        :ui-config="uiConfig" 
        :invitation-id="form.id"
        :is-view-mode="isViewMode"
        @update:form="(value: typeof form) => form = value"
        @update:ui-config="(value: typeof uiConfig) => uiConfig = value"
      />

      <!-- 模块配置 -->
      <module-config 
        v-if="activeTab === 'module'" 
        :form="form" 
        :is-view-mode="isViewMode"
        @update:form="(value: typeof form) => form = value"
        @save-success="handleSaveSuccess"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import baseService from "@/service/baseService";
import { ElMessage } from 'element-plus';
import BasicConfig from './page-config/basic-config.vue';
import ShareConfig from './page-config/share-config.vue';
import LoginConfig from './page-config/login-config.vue';
import ModuleConfig from './page-config/module-config.vue';

export default defineComponent({
  components: {
    BasicConfig,
    ShareConfig,
    LoginConfig,
    ModuleConfig
  },
  name: "InvitationPageConfig",
  props: {
    invitationId: {
      type: String,
      default: ''
    },
    isViewMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:invitationId'],
  data() {
    return {
      activeTab: 'basic',
      tabs: [
        { key: 'basic', label: '基础设置' },
        { key: 'share', label: '分享设置' },
        { key: 'login', label: '登录页面' },
        { key: 'module', label: '模块配置' }
      ],
      form: {
        id: '',
        store_id: 0,
        name: '',
        activity_no: '',
        activity_type: '',
        activity_id: '',
        start_time: '',
        end_time: '',
        carrier_type: 3,
        login_switch: 1,
        login_whitelist_switch: 2,
        data_switch: 2,
        c_data_switch: 2,
        customer_switch: 2,
        sign_in_status: 0,
        login_form: '',
        data_form: '',
        c_data_form: '',
        share_mode: 1,
        share_bg_setting: '{"share_style": "1", "share_bg_pic": "", "wx_share_pic": "", "share_btn_pic": "", "share_id_type": 1, "wx_share_desc": "", "wx_share_title": ""}',
        activity_switch: 1,
        top_dept_id: '',
        is_del: 0,
        tenant_id: 1
      },
      uiConfig: {
        id: '',
        store_id: 0,
        invitation_id: '',
        theme_bg_pic: '',
        home_bg_pic: '',
        module_bg_color: '',
        text_color: '',
        share_poster_pic: '',
        share_bg_setting: '',
        poster_pic_text: '',
        share_text: '',
        login_setting: '',
        data_setting: '',
        c_data_setting: '',
        customer_setting: '',
        sign_in_setting: '',
        invitation_rule_setting: '',
        third_link_address: ''
      },
      isLoading: false
    };
  },
  watch: {
    invitationId: {
      handler(newId) {
        console.log('=== invitationId 变化 ===');
        console.log('新的 invitationId:', newId);
        if (newId) {
          this.loadInvitationData(newId);
        }
      },
      immediate: true
    }
  },
  methods: {
    getActivityTypeText(type: number | string) {
      const typeMap: Record<number, string> = {
        1: '邀约',
        2: '积赞'
      };
      return typeMap[Number(type)] || type;
    },

    getCarrierTypeText(type: number | string) {
      const typeMap: Record<number, string> = {
        1: 'APP',
        2: '小程序',
        3: '公众号'
      };
      return typeMap[Number(type)] || type;
    },

    async loadInvitationData(id: string) {
      this.isLoading = true;
      try {
        // 加载活动数据
        const url = `${import.meta.env.VITE_APP_API}/api/invitation/activity/${id}`;
        console.log('=== 查看/编辑活动接口调用开始 ===');
        console.log('请求URL:', url);
        
        const startTime = Date.now();
        const res: any = await baseService.get(url);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log('=== 查看/编辑活动接口调用成功 ===');
        console.log('请求耗时:', duration + 'ms');
        console.log('响应数据:', JSON.stringify(res, null, 2));
        
        if (res.code === '00000') {
          const activityData = res.data.activity;
          // 转换数据格式，适配表单结构
          this.form = {
            id: activityData.id,
            store_id: activityData.storeId,
            name: activityData.name,
            activity_no: activityData.activityNo || '',
            activity_type: activityData.activityType,
            activity_id: activityData.activityId,
            start_time: activityData.startTime,
            end_time: activityData.endTime,
            carrier_type: activityData.carrierType,
            login_switch: activityData.loginSwitch,
            login_whitelist_switch: activityData.loginWhitelistSwitch,
            data_switch: activityData.dataSwitch,
            c_data_switch: activityData.cdataSwitch || 2,
            customer_switch: activityData.customerSwitch,
            sign_in_status: activityData.signInStatus,
            login_form: activityData.loginForm,
            data_form: activityData.dataForm,
            c_data_form: activityData.cdataForm,
            share_mode: activityData.shareMode,
            share_bg_setting: activityData.shareBgSetting || '{"share_style": "1", "share_bg_pic": "", "wx_share_pic": "", "share_btn_pic": "", "share_id_type": 1, "wx_share_desc": "", "wx_share_title": ""}',
            activity_switch: Number(activityData.activitySwitch) || 1,
            top_dept_id: activityData.topDeptId || '',
            is_del: activityData.isDel,
            tenant_id: activityData.tenantId
          };
          
          // 转换UI配置数据
          this.uiConfig = {
            id: activityData.uiId,
            store_id: activityData.uiStoreId,
            invitation_id: activityData.invitationId,
            theme_bg_pic: activityData.themeBgPic,
            home_bg_pic: activityData.homeBgPic,
            module_bg_color: activityData.moduleBgColor,
            text_color: activityData.textColor,
            share_poster_pic: activityData.sharePosterPic,
            share_bg_setting: activityData.shareBgSetting,
            poster_pic_text: activityData.posterPicText,
            share_text: activityData.shareText,
            login_setting: activityData.loginSetting,
            data_setting: activityData.dataSetting,
            c_data_setting: activityData.cdataSetting,
            customer_setting: activityData.customerSetting,
            sign_in_setting: activityData.signInSetting,
            invitation_rule_setting: activityData.invitationRuleSetting,
            third_link_address: activityData.thirdLinkAddress
          };
          
          console.log('数据转换完成，表单数据:', JSON.stringify(this.form, null, 2));
          console.log('UI配置数据:', JSON.stringify(this.uiConfig, null, 2));
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        ElMessage.error('加载数据失败，请重试');
      } finally {
        this.isLoading = false;
      }
    },

    handleSaveSuccess() {
      // 基础设置保存成功后的处理
      console.log('基础设置保存成功');
    }
  }
});
</script>

<style scoped>
.page-config {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 120px);
  overflow-y: auto;
}

/* 顶部 Tab 导航 */
.top-tabs {
  display: flex;
  background: #fff;
  width: 100%;
  border-bottom: 1px solid #e4e7ed;
}

.tab-item {
  padding: 15px 30px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  position: relative;
  color: #606266;
  font-size: 14px;
  font-weight: 500;
}

.tab-item:hover {
  color: #17B3A3;
}

.tab-item.active {
  color: #17B3A3;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #17B3A3;
  transition: all 0.3s;
}

/* 内容区域 */
.content-area {
  flex: 1;
  background: #fff;
  overflow-y: visible;
  min-height: auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
}


</style>