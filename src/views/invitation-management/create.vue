<template>
  <div class="invitation-create">
    <el-card shadow="never" class="rr-view-ctx-card">
      <!-- 标签页导航 -->
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基础设置" name="basic"></el-tab-pane>
        <el-tab-pane label="分享设置" name="share"></el-tab-pane>
        <el-tab-pane label="登录页面" name="login"></el-tab-pane>
        <el-tab-pane label="模块配置" name="module"></el-tab-pane>
      </el-tabs>

      <!-- 基础设置 -->
      <div v-show="activeTab === 'basic'" class="tab-content">
        <BasicConfig
          :form="form"
          :isViewMode="isViewMode"
          @update:form="form = $event"
          @save-success="handleSaveSuccess"
        />
        
        <!-- 按钮区域 -->
        <div class="button-area">
          <el-button @click="handleBack">返回列表</el-button>
          <el-button type="primary" @click="handleSubmit" :disabled="isViewMode">提交</el-button>
        </div>
      </div>

      <!-- 分享设置 -->
      <div v-show="activeTab === 'share'" class="tab-content">
        <ShareConfig
          :form="form"
          :isViewMode="isViewMode"
          @update:form="form = $event"
          @save-success="handleSaveSuccess"
        />
        
        <!-- 按钮区域 -->
        <div class="button-area">
          <el-button @click="handleBack">返回列表</el-button>
          <el-button @click="handlePrevToBasic" :disabled="isViewMode">上一步</el-button>
          <el-button type="primary" @click="handleSubmitShare" :disabled="isViewMode">提交</el-button>
        </div>
      </div>

      <!-- 登录页面 -->
      <div v-show="activeTab === 'login'" class="tab-content">
        <LoginConfig
          :form="form"
          :ui-config="uiConfig"
          :invitation-id="form.id"
          :isViewMode="isViewMode"
          @update:form="form = $event"
          @update:ui-config="uiConfig = $event"
        />
        
        <!-- 按钮区域 -->
        <div class="button-area">
          <el-button @click="handleBack">返回列表</el-button>
          <el-button @click="handlePrevToShare" :disabled="isViewMode">上一步</el-button>
          <el-button type="primary" @click="handleSubmitLogin" :disabled="isViewMode">提交</el-button>
        </div>
      </div>

      <!-- 模块配置 -->
      <div v-show="activeTab === 'module'" class="tab-content">
        <ModuleConfig
          :form="form"
          :isViewMode="isViewMode"
          @update:form="form = $event"
          @save-success="handleSaveSuccess"
        />
        
        <!-- 按钮区域 -->
        <div class="button-area">
          <el-button @click="handleBack">返回列表</el-button>
          <el-button @click="handlePrevToLogin" :disabled="isViewMode">上一步</el-button>
          <el-button type="primary" @click="handleSubmitModule" :disabled="isViewMode">提交</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import baseService from "@/service/baseService";
import BasicConfig from './components/page-config/basic-config.vue';
import ShareConfig from './components/page-config/share-config.vue';
import LoginConfig from './components/page-config/login-config.vue';
import ModuleConfig from './components/page-config/module-config.vue';
import emits from "@/utils/emits";
import { EMitt } from "@/constants/enum";
import { useAppStore } from "@/store";

export default defineComponent({
  name: "InvitationCreate",
  components: {
    BasicConfig,
    ShareConfig,
    LoginConfig,
    ModuleConfig
  },
  data() {
    return {
      activeTab: 'basic',
      invitationId: '',
      form: {
        id: '',
        store_id: 0,
        name: '',
        title: '',
        activity_no: '',
        activity_type: '',
        activity_id: '',
        start_time: '',
        end_time: '',
        carrier_type: '3',
        login_switch: '1',
        login_whitelist_switch: '2',
        data_switch: '2',
        c_data_switch: '2',
        customer_switch: '2',
        customer_setting: '{"customer_top_pic": "", "customer_icon_pic": "", "customer_top_color": "#D9001B", "wx_qr_code_switch": 1, "customer_lucky_kind_switch": 1, "customer_lucky_fictitious_switch": 1, "customer_xbox_whitelist_switch": 2, "customer_xbox_whitelist_type": 1}',
        invitationRuleSwitch: 2,
        invitationRuleSetting: '{"invitation_rule_icon": "", "invitation_rule_content": ""}',
        sign_in_status: '0',
        login_form: '',
        data_form: '',
        c_data_form: '',
        share_mode: '1',
        share_bg_setting: '{"share_style": "1", "share_bg_pic": "", "wx_share_pic": "", "share_btn_pic": "", "share_id_type": 1, "wx_share_desc": "", "wx_share_title": ""}',
        share_bg_url: '',
        activity_switch: 1,
        top_dept_id: '',
        is_del: 0,
        tenant_id: 1,
        home_bg_pic: [] as any[],
        has_related_activity: false,
        related_activity_1: '',
        related_activity_2: '',
        related_organization: '',
        // 确保包含所有其他可能的字段
        whitelist_qty_switch: 2,
        whitelist_qty_switch_msg: '',
        invitation_code_switch: 2,
        invitation_code_switch_msg: '',
        invitation_code_num: 1,
        // 添加提交资料设置和登录设置
        data_setting: '',
        login_setting: '',
        c_data_setting: '',
        // 组团列表和成团情况设置
        team_up_switch: 2,
        team_up_icon: '',
        team_up_id: '',
        team_purchase_switch: 2,
        team_purchase_icon: '',
        // 照片审核设置
        third_vote_verify: 1,
        third_vote_icon: '',
        third_vote_activity_no: ''
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
      }
    };
  },
  computed: {
    isViewMode() {
      return this.$route.query.mode === 'view';
    },
    isEditMode() {
      return !!this.$route.query.id;
    }
  },
  watch: {
    // 监听路由变化
    $route: {
      handler(route) {
        console.log('=== 路由变化 ===');
        console.log('route.query:', route.query);
        if (route.query.id) {
          this.invitationId = route.query.id as string;
          console.log('通过路由变化设置 invitationId:', this.invitationId);
        }
        if (route.query.impId) {
          console.log('通过路由变化获取 impId:', route.query.impId);
        }

        // 延迟更新标签页标题，确保在路由拦截器之后执行
        setTimeout(() => {
          this.updateTabTitle();
        }, 100);
      },
      immediate: true
    },
    activeTab(newVal, oldVal) {
      console.log('activeTab 变化:', oldVal, '->', newVal);
      // 如果切换到分享设置或登录页面 tab，并且有 invitationId，则获取活动数据
      if ((newVal === 'share' || newVal === 'login') && this.invitationId) {
        this.loadInvitationData(this.invitationId);
      }
    },
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
  onMounted() {
    console.log('=== create.vue onMounted ===');
    console.log('$route.query:', this.$route.query);
    console.log('isEditMode:', this.isEditMode);
    console.log('isViewMode:', this.isViewMode);
    // 直接从路由参数中获取 id，不管是编辑还是查看模式
    if (this.$route.query.id) {
      this.invitationId = this.$route.query.id as string;
      console.log('设置 invitationId:', this.invitationId);
    }

    // 延迟更新标签页标题，确保在路由拦截器之后执行
    setTimeout(() => {
      this.updateTabTitle();
    }, 100);
  },
  methods: {
    updateTabTitle() {
      const store = useAppStore();
      let title = '新增邀约活动';
      if (this.isViewMode) {
        title = '查看邀约活动';
      } else if (this.isEditMode) {
        title = '编辑邀约活动';
      }

      console.log('=== 更新标签页标题 ===');
      console.log('当前路由:', this.$route.fullPath);
      console.log('新标题:', title);

      // 直接修改store中的tabs状态
      const tabs = [...store.state.tabs];
      const currentTabIndex = tabs.findIndex(tab => tab.value === this.$route.fullPath);

      if (currentTabIndex !== -1) {
        // 更新现有标签页的标题
        tabs[currentTabIndex].label = title;
        store.updateState({ tabs });
        console.log('更新现有标签页标题成功');
      } else {
        // 添加新的标签页
        emits.emit(EMitt.OnPushMenuToTabs, {
          label: title,
          value: this.$route.fullPath,
          mete: {}
        });
        console.log('添加新标签页成功');
      }
    },
    handleBack() {
      this.$router.push('/invitation-management/index');
    },
    handlePrevToBasic() {
      this.activeTab = 'basic';
    },
    handlePrevToShare() {
      this.activeTab = 'share';
    },
    
    // 上一步（回到登录页面）
    handlePrevToLogin() {
      this.activeTab = 'login';
    },
    handleSaveSuccess() {
      console.log('基础设置保存成功');
    },
    async loadInvitationData(id: string) {
      try {
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
          // 处理homeBgPic字段，从字符串解析为数组
          let homeBgPicArray = [];
          if (activityData.homeBgPic) {
            try {
              // 尝试解析JSON字符串
              homeBgPicArray = JSON.parse(activityData.homeBgPic);
              // 确保解析结果是数组
              if (!Array.isArray(homeBgPicArray)) {
                homeBgPicArray = [];
              }
            } catch (error) {
              // 解析失败，使用空数组
              homeBgPicArray = [];
            }
          }

          // 转换数据格式，适配表单结构
          this.form = {
            id: activityData.id,
            store_id: activityData.storeId,
            name: activityData.name,
            title: activityData.name, // 使用name作为title
            activity_no: activityData.activityNo || '',
            activity_type: activityData.activityType,
            activity_id: activityData.activityId,
            activity_switch: Number(activityData.activitySwitch) || 1,
            top_dept_id: activityData.topDeptId || '',
            start_time: activityData.startTime,
            end_time: activityData.endTime,
            carrier_type: String(activityData.carrierType), // 转换为字符串类型
            login_switch: String(activityData.loginSwitch),
            login_whitelist_switch: String(activityData.loginWhitelistSwitch),
            data_switch: String(activityData.dataSwitch),
            c_data_switch: String(activityData.cdataSwitch || '2'),
            customer_switch: String(activityData.customerSwitch),
            sign_in_status: String(activityData.signInStatus),
            login_form: activityData.loginForm,
            data_form: activityData.dataForm,
            c_data_form: activityData.cdataForm,
            share_mode: String(activityData.shareMode),
            share_bg_setting: activityData.shareBgSetting || '{"share_style": 1, "share_bg_pic": "", "wx_share_pic": "", "share_btn_pic": "", "share_id_type": 1, "wx_share_desc": "", "wx_share_title": ""}',
            share_bg_url: activityData.shareBgUrl || '',
            is_del: activityData.isDel,
            tenant_id: activityData.tenantId,
            home_bg_pic: homeBgPicArray,
            has_related_activity: activityData.has_related_activity || false,
            related_activity_1: activityData.related_activity_1 || '',
            related_activity_2: activityData.related_activity_2 || '',
            related_organization: activityData.related_organization || '',
            // 确保包含所有其他可能的字段
            whitelist_qty_switch: activityData.whitelist_qty_switch || 2,
            whitelist_qty_switch_msg: activityData.whitelist_qty_switch_msg || '',
            invitation_code_switch: activityData.invitation_code_switch || 2,
            invitation_code_switch_msg: activityData.invitation_code_switch_msg || '',
            invitation_code_num: activityData.invitation_code_num || 1,
            // 添加提交资料设置
            data_setting: activityData.dataSetting,
            login_setting: activityData.loginSetting,
            // 添加C端客户资料提交设置
            c_data_setting: activityData.cdataSetting,
            // 添加我的客户页面设置
            customer_setting: activityData.customerSetting || '{"customer_top_pic": "", "customer_icon_pic": "", "customer_top_color": "#D9001B", "wx_qr_code_switch": 1, "customer_lucky_kind_switch": 1, "customer_lucky_fictitious_switch": 1, "customer_xbox_whitelist_switch": 2, "customer_xbox_whitelist_type": 1}',
            // 添加活动规则设置
            invitationRuleSwitch: activityData.invitationRuleSwitch || 2,
            invitationRuleSetting: activityData.invitationRuleSetting || '{"invitation_rule_icon": "", "invitation_rule_content": ""}',
            // 添加组团列表和成团情况设置
            team_up_switch: activityData.teamUpSwitch || 2,
            team_up_icon: activityData.teamUpIcon || '',
            team_up_id: activityData.teamUpId || '',
            team_purchase_switch: activityData.teamPurchaseSwitch || 2,
            team_purchase_icon: activityData.teamPurchaseIcon || '',
            // 添加照片审核设置
            third_vote_verify: activityData.thirdVoteVerify || 1,
            third_vote_icon: activityData.thirdVoteIcon || '',
            third_vote_activity_no: activityData.thirdVoteActivityNo || ''
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
      }
    },
    async handleSubmit() {
      try {
        const url = `${import.meta.env.VITE_APP_API}/api/invitation/activity/save`;
        
        // 将前端驼峰字段转换为后端下划线字段
        const submitData = { ...this.form } as any;
        
        // 活动规则相关字段转换
        if (submitData.invitationRuleSwitch !== undefined) {
          submitData.invitation_rule_switch = submitData.invitationRuleSwitch;
          delete submitData.invitationRuleSwitch;
        }
        if (submitData.invitationRuleSetting !== undefined) {
          submitData.invitation_rule_setting = submitData.invitationRuleSetting;
          delete submitData.invitationRuleSetting;
        }
        
        // 将home_bg_pic数组转换为JSON字符串，与login_form处理方式一致
        if (submitData.home_bg_pic !== undefined) {
          submitData.home_bg_pic = JSON.stringify(submitData.home_bg_pic);
        }
        
        const res: any = await baseService.post(url, submitData);
        if (res.code === '00000') {
          ElMessage.success('基础设置保存成功');
          if (res.data && res.data.id) {
            this.form.id = res.data.id;
          }
          this.handleSaveSuccess();
        } else {
          ElMessage.error('保存失败：' + res.msg);
        }
      } catch (error) {
        console.error('保存失败:', error);
        ElMessage.error('保存失败，请重试');
      }
    },
    async handleSubmitShare() {
      try {
        const url = `${import.meta.env.VITE_APP_API}/api/invitation/activity/save`;
        
        // 将前端驼峰字段转换为后端下划线字段
        const submitData = { ...this.form } as any;
        
        // 活动规则相关字段转换
        if (submitData.invitationRuleSwitch !== undefined) {
          submitData.invitation_rule_switch = submitData.invitationRuleSwitch;
          delete submitData.invitationRuleSwitch;
        }
        if (submitData.invitationRuleSetting !== undefined) {
          submitData.invitation_rule_setting = submitData.invitationRuleSetting;
          delete submitData.invitationRuleSetting;
        }
        
        // 将home_bg_pic数组转换为JSON字符串，与login_form处理方式一致
        if (submitData.home_bg_pic !== undefined) {
          submitData.home_bg_pic = JSON.stringify(submitData.home_bg_pic);
        }
        
        const res: any = await baseService.post(url, submitData);
        if (res.code === '00000') {
          ElMessage.success('分享设置保存成功');
          if (res.data && res.data.id) {
            this.form.id = res.data.id;
          }
          this.handleSaveSuccess();
        } else {
          ElMessage.error('保存失败：' + res.msg);
        }
      } catch (error) {
        console.error('保存失败:', error);
        ElMessage.error('保存失败，请重试');
      }
    },
    async handleSubmitLogin() {
      try {
        // 校验登录设置中的表单类型是否重复
        if (this.form.login_setting) {
          try {
            const loginSetting = JSON.parse(this.form.login_setting);
            if (loginSetting.form_items) {
              const formTypes = loginSetting.form_items.map((item: any) => item.form_type);
              const uniqueTypes = new Set(formTypes);
              if (formTypes.length !== uniqueTypes.size) {
                ElMessage.error('表单类型不能重复');
                return;
              }
            }
          } catch (e) {
            console.error('解析登录设置失败:', e);
          }
        }

        // 校验C端客户资料提交设置中的表单类型是否重复
        if (this.form.c_data_form) {
          try {
            const cDataForm = JSON.parse(this.form.c_data_form);
            if (cDataForm.form_items) {
              const formTypes = cDataForm.form_items.map((item: any) => item.form_type);
              const uniqueTypes = new Set(formTypes);
              if (formTypes.length !== uniqueTypes.size) {
                ElMessage.error('C端表单类型不能重复');
                return;
              }
            }
          } catch (e) {
            console.error('解析C端客户资料提交设置失败:', e);
          }
        }

        const url = `${import.meta.env.VITE_APP_API}/api/invitation/activity/save`;
        
        // 将前端驼峰字段转换为后端下划线字段
        const submitData = { ...this.form } as any;
        
        // 活动规则相关字段转换
        if (submitData.invitationRuleSwitch !== undefined) {
          submitData.invitation_rule_switch = submitData.invitationRuleSwitch;
          delete submitData.invitationRuleSwitch;
        }
        if (submitData.invitationRuleSetting !== undefined) {
          submitData.invitation_rule_setting = submitData.invitationRuleSetting;
          delete submitData.invitationRuleSetting;
        }
        
        // 将home_bg_pic数组转换为JSON字符串，与login_form处理方式一致
        if (submitData.home_bg_pic !== undefined) {
          submitData.home_bg_pic = JSON.stringify(submitData.home_bg_pic);
        }
        
        const res: any = await baseService.post(url, submitData);
        if (res.code === '00000') {
          ElMessage.success('登录页面设置保存成功');
          if (res.data && res.data.id) {
            this.form.id = res.data.id;
          }
          this.handleSaveSuccess();
        } else {
          ElMessage.error('保存失败：' + res.msg);
        }
      } catch (error) {
        console.error('保存失败:', error);
        ElMessage.error('保存失败，请重试');
      }
    },
    
    // 提交模块配置
    async handleSubmitModule() {
      try {
        const url = `${import.meta.env.VITE_APP_API}/api/invitation/activity/save`;
        
        // 将前端驼峰字段转换为后端下划线字段
        const submitData = { ...this.form } as any;
        
        // 活动规则相关字段转换
        if (submitData.invitationRuleSwitch !== undefined) {
          submitData.invitation_rule_switch = submitData.invitationRuleSwitch;
          delete submitData.invitationRuleSwitch;
        }
        if (submitData.invitationRuleSetting !== undefined) {
          submitData.invitation_rule_setting = submitData.invitationRuleSetting;
          delete submitData.invitationRuleSetting;
        }
        
        // 将home_bg_pic数组转换为JSON字符串，与login_form处理方式一致
        if (submitData.home_bg_pic !== undefined) {
          submitData.home_bg_pic = JSON.stringify(submitData.home_bg_pic);
        }
        
        const res: any = await baseService.post(url, submitData);
        if (res.code === '00000') {
          ElMessage.success('模块配置保存成功');
          if (res.data && res.data.id) {
            this.form.id = res.data.id;
          }
          this.handleSaveSuccess();
        } else {
          ElMessage.error('保存失败：' + res.msg);
        }
      } catch (error) {
        console.error('保存失败:', error);
        ElMessage.error('保存失败，请重试');
      }
    }
  }
});
</script>

<style scoped>
.invitation-create {
  padding: 20px;
  min-height: calc(100vh - 80px);
  overflow-y: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tab-content {
  margin-top: 20px;
}

.button-area {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}

.button-area .el-button {
  margin-left: 10px;
}
</style>
