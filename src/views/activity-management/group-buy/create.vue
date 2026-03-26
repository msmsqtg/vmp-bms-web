<template>
  <div class="group-buy-create">
    <el-card shadow="never" class="rr-view-ctx-card">
      <!-- 标签页导航 -->
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基础设置" name="basic"></el-tab-pane>
        <el-tab-pane label="拼团设置" name="group"></el-tab-pane>
        <el-tab-pane label="开团商品设置" name="product"></el-tab-pane>
        <el-tab-pane label="助力奖品设置" name="prize"></el-tab-pane>
      </el-tabs>

      <!-- 基本信息设置 -->
      <div v-show="activeTab === 'basic'" class="tab-content">
        <BasicSettings
          :form="form"
          :activityTimeRange="activityTimeRange"
          :isViewMode="isViewMode"
          @update:form="form = $event"
          @update:activityTimeRange="activityTimeRange = $event"
        />
        
        <!-- 按钮区域 -->
        <div class="button-area">
          <el-button @click="handleBack">返回列表</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </div>

      <!-- 拼团设置 -->
      <div v-show="activeTab === 'group'" class="tab-content">
        <GroupSettings
          :form="form.groupSettings"
          :isViewMode="isViewMode"
          @update:form="form.groupSettings = $event"
        />
        
        <!-- 按钮区域 -->
        <div class="button-area">
          <el-button @click="handleBack">返回列表</el-button>
          <el-button @click="handlePrev">上一步</el-button>
          <el-button type="primary" @click="handleSubmitDetail">提交</el-button>
        </div>
      </div>

      <!-- 开团商品设置 -->
      <div v-show="activeTab === 'product'" class="tab-content">
        <ProductSettings
          :form="form.products"
          :isViewMode="isViewMode"
          @update:form="form.products = $event"
        />
        
        <!-- 按钮区域 -->
        <div class="button-area">
          <el-button @click="handleBack">返回列表</el-button>
          <el-button @click="handlePrev" :disabled="isViewMode">上一步</el-button>
          <el-button type="primary" @click="handleSubmitProducts" :disabled="isViewMode">提交</el-button>
        </div>
      </div>

      <!-- 助力奖品设置 -->
      <div v-show="activeTab === 'prize'" class="tab-content">
        <PrizeSettings
          :form="form.prizeSettings"
          :isViewMode="isViewMode"
          @update:form="form.prizeSettings = $event"
        />
        
        <!-- 按钮区域 -->
        <div class="button-area">
          <el-button @click="handleBack">返回列表</el-button>
          <el-button @click="handlePrev" :disabled="isViewMode">上一步</el-button>
          <el-button type="primary" @click="handleSubmitPrizes" :disabled="isViewMode">提交</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import baseService from "@/service/baseService";
import BasicSettings from './components/BasicSettings.vue';
import GroupSettings from './components/GroupSettings.vue';
import ProductSettings from './components/ProductSettings.vue';
import PrizeSettings from './components/PrizeSettings.vue';

interface SubmitData {
  title: string;
  startTime: string;
  endTime: string;
  name: string;
  remark: string;
  style: number;
  key: string;
  secret: string;
  type: number;
}

interface ProductDetail {
  id?: number;
  impId: number;
  prizeType: number;
  productType: number;
  name: string;
  price: number;
  teamPrice: number;
  stock: number;
  validityPeriod: number;
  teamNum: number;
  isQuota: number;
  quotaNum: number;
  quoMsg: string;
  thumb: string;
  descrImage: string;
  descr: string;
}

export default defineComponent({
  name: "GroupBuyCreate",
  components: {
    BasicSettings,
    GroupSettings,
    ProductSettings,
    PrizeSettings
  },
  data() {
    return {
      activeTab: 'basic',
      activityTimeRange: [] as string[],
      createdImpId: null as number | null, // 存储创建成功的活动ID
      isViewMode: false, // 是否为查看模式
      groupSettingsLoaded: false, // 拼团设置数据是否已加载
      productsLoaded: false, // 开团商品数据是否已加载
      prizesLoaded: false, // 助力商品数据是否已加载
      form: {
        title: '',
        startTime: '',
        endTime: '',
        name: '',
        remark: '',
        style: '1',
        key: 'wxb6d6b65bd5ed9965',
        secret: '76a825b93a7dd93f2b504658e2a3b460',
        type: 2,
        groupSettings: {
          teamType: '2',
          whitelistType: '1',
          nonDesignateCustomerMsg: '开团失败，您不是当前活动受邀用户！',
          multipleTimesSwitch: '2',
          multipleTimesMsg: '开团失败，每位用户仅可成功开团一次！',
          multipleHelpSwitch: '2',
          multipleHelpMsg: '助力失败，每位用户仅可为除自己外一名用户助力一次！',
          rules: {
            up: {
              nendInfo: 1,
              title: '请填写相关信息以完成开团',
              content: '请如实填写信息，以便我们及时与您联系',
              formData: [
                { name: '姓名', type: 'name', title: '姓名', input_name: 'name', selected: 0, check: 0 },
                { name: '身份证后四位', type: 'idcard', title: '身份证后四位', input_name: 'idcard', selected: 0, check: 0 }
              ]
            },
            help: {
              nendInfo: 1,
              title: '请填写相关信息以完成助力',
              content: '请如实填写信息，以便我们及时与您联系',
              formData: [
                { name: '姓名', type: 'name', title: '姓名', input_name: 'name', selected: 0, check: 0 }
              ],
              checkName: 2
            }
          },
          validityPeriod: '',
          participationNum: '',
          blacklistSwitch: '1',
          blacklistMsg: '',
          teamUpLimitSwitch: '1',
          teamUpLimitMax: '',
          teamUpLimitMsg: '',
          wxOpenidSwitch: '2',
          wxOpenidMsg: '',
          userPhoneSwitch: '2',
          userPhoneMsg: ''
        },
        products: [
          {
            id: undefined,
            type: 'physical',
            name: '',
            price: '',
            stock: '',
            groupPrice: '',
            groupSize: '',
            overLimit: 'allow',
            limit: '',
            specStock: '',
            detail: '',
            descrImage: '',
            thumb: ''
          }
        ],
        prizeSettings: [
          {
            id: undefined,
            enable: 'no',
            name: '',
            price: '',
            stock: '',
            detail: '',
            descrImage: '',
            thumb: ''
          }
        ]
      }
    };
  },
  created() {
    // 页面初始化逻辑
    this.initPage();
  },
  watch: {
    activeTab(newVal, oldVal) {
      console.log('activeTab 变化:', oldVal, '->', newVal);
      // 如果切换到拼团设置 tab，并且有 impId，则获取拼团设置数据
      if (newVal === 'group' && this.createdImpId && !this.groupSettingsLoaded) {
        this.getGroupSettingsDetail(this.createdImpId);
      }
      // 如果切换到开团商品设置 tab，并且有 impId，则获取开团商品数据
      if (newVal === 'product' && this.createdImpId) {
        this.getProductsDetail(this.createdImpId);
      }
      // 如果切换到助力奖品设置 tab，并且有 impId，则获取助力商品数据
      if (newVal === 'prize' && this.createdImpId) {
        this.getPrizesDetail(this.createdImpId);
      }
    }
  },
  methods: {
    initPage() {
      // 获取 URL 参数
      const impId = this.$route.query.impId;
      const tab = this.$route.query.tab;
      const mode = this.$route.query.mode;
      console.log('impId:', impId);
      console.log('tab:', tab);
      console.log('mode:', mode);
      // 切换到指定的 tab
      if (tab) {
        const tabValue = Array.isArray(tab) ? tab[0] : tab;
        if (typeof tabValue === 'string') {
          this.activeTab = tabValue;
        }
      }
      
      // 设置查看模式
      if (mode === 'view') {
        this.isViewMode = true;
      } else {
        this.isViewMode = false;
      }
      
      console.log('isViewMode:', this.isViewMode);
      console.log('mode:', mode);
      
      // 如果有 impId，获取活动详情
      if (impId) {
        const impIdValue = Array.isArray(impId) ? impId[0] : impId;
        if (typeof impIdValue === 'string') {
          this.getActivityDetail(impIdValue);
        }
      }
    },
    
    // 获取活动详情
    getActivityDetail(impId: string) {
      const userId = 4440;
      const requestUrl = `${import.meta.env.VITE_APP_API}/team/up/main/info`;
      const params = { impId };
      const headers = { createUserId: userId };

      console.log('=== 获取活动详情接口调用开始 ===');
      console.log('请求时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
      console.log('用户ID:', userId);
      console.log('请求URL:', requestUrl);
      console.log('请求参数:', JSON.stringify(params, null, 2));
      console.log('请求头:', JSON.stringify(headers, null, 2));

      const startTime = Date.now();

      // 获取基础设置数据
      baseService.get(requestUrl, params, headers)
        .then((res: any) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          console.log('=== 获取活动详情接口调用成功 ===');
          console.log('响应时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
          console.log('请求耗时:', duration + 'ms');
          console.log('响应数据:', JSON.stringify(res, null, 2));

          if (res.code === '00000') {
            this.createdImpId = res.data.id;
            this.fillFormData(res.data);
            
            // 如果当前 tab 是助力奖品设置，则获取助力商品数据
            if (this.activeTab === 'prize' && this.createdImpId) {
              this.getPrizesDetail(this.createdImpId);
            }
            // 如果当前 tab 是开团商品设置，则获取开团商品数据
            if (this.activeTab === 'product' && this.createdImpId) {
              this.getProductsDetail(this.createdImpId);
            }
          } else {
            (this as any).$message.error('获取活动详情失败：' + res.msg);
          }
        })
        .catch(error => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          console.log('=== 获取活动详情接口调用失败 ===');
          console.log('响应时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
          console.log('请求耗时:', duration + 'ms');
          console.error('错误信息:', error);
          (this as any).$message.error('获取活动详情失败，请重试');
        });
    },
    
    // 获取拼团设置数据
    getGroupSettingsDetail(impId: number) {
      const userId = 4440;
      const requestUrl = `${import.meta.env.VITE_APP_API}/team/up/detail/info`;
      const params = { impId };
      const headers = { createUserId: userId };

      console.log('=== 获取拼团设置接口调用开始 ===');
      console.log('请求时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
      console.log('用户ID:', userId);
      console.log('请求URL:', requestUrl);
      console.log('请求参数:', JSON.stringify(params, null, 2));
      console.log('请求头:', JSON.stringify(headers, null, 2));

      const startTime = Date.now();

      baseService.get(requestUrl, params, headers)
        .then((res: any) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          console.log('=== 获取拼团设置接口调用成功 ===');
          console.log('响应时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
          console.log('请求耗时:', duration + 'ms');
          console.log('响应数据:', JSON.stringify(res, null, 2));

          if (res.code === '00000') {
            this.fillGroupSettingsData(res.data);
            this.groupSettingsLoaded = true;
          } else {
            (this as any).$message.error('获取拼团设置失败：' + res.msg);
          }
        })
        .catch(error => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          console.log('=== 获取拼团设置接口调用失败 ===');
          console.log('响应时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
          console.log('请求耗时:', duration + 'ms');
          console.error('错误信息:', error);
          (this as any).$message.error('获取拼团设置失败，请重试');
        });
    },
    
    // 填充表单数据
    fillFormData(data: any) {
      // 填充基础设置
      this.form.title = data.title;
      this.form.name = data.name;
      // 确保 remark 是字符串类型
      this.form.remark = typeof data.remark === 'string' ? data.remark : '';
      this.form.style = String(data.style);
      this.form.key = data.key;
      this.form.secret = data.secret;
      this.form.type = data.type;
      
      // 填充活动时间
      if (data.startTime && data.endTime) {
        this.activityTimeRange = [data.startTime, data.endTime];
        this.form.startTime = data.startTime;
        this.form.endTime = data.endTime;
      }
      
      console.log('表单数据填充完成');
    },
    
    // 获取开团商品数据
    getProductsDetail(impId: number) {
      const userId = 4440;
      const requestUrl = `${import.meta.env.VITE_APP_API}/team/buy/detail/prize/list`;
      const params = { impId };
      const headers = { createUserId: userId };

      console.log('=== 获取开团商品接口调用开始 ===');
      console.log('请求时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
      console.log('用户ID:', userId);
      console.log('请求URL:', requestUrl);
      console.log('请求参数:', JSON.stringify(params, null, 2));
      console.log('请求头:', JSON.stringify(headers, null, 2));

      const startTime = Date.now();

      baseService.get(requestUrl, params, headers)
        .then((res: any) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          console.log('=== 获取开团商品接口调用成功 ===');
          console.log('响应时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
          console.log('请求耗时:', duration + 'ms');
          console.log('响应数据:', JSON.stringify(res, null, 2));

          if (res.code === '00000') {
            this.fillProductsData(res.data.data);
            // 移除 productsLoaded 标记，确保每次切换到开团商品设置 tab 时都会重新获取数据
          } else {
            (this as any).$message.error('获取开团商品失败：' + res.msg);
          }
        })
        .catch(error => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          console.log('=== 获取开团商品接口调用失败 ===');
          console.log('响应时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
          console.log('请求耗时:', duration + 'ms');
          console.error('错误信息:', error);
          (this as any).$message.error('获取开团商品失败，请重试');
        });
    },
    
    // 获取助力商品数据
    getPrizesDetail(impId: number) {
      const userId = 4440;
      const requestUrl = `${import.meta.env.VITE_APP_API}/team/buy/detail/prize/list`;
      const params = { impId };
      const headers = { createUserId: userId };

      console.log('=== 获取助力商品接口调用开始 ===');
      console.log('请求时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
      console.log('用户ID:', userId);
      console.log('请求URL:', requestUrl);
      console.log('请求参数:', JSON.stringify(params, null, 2));
      console.log('请求头:', JSON.stringify(headers, null, 2));

      const startTime = Date.now();

      baseService.get(requestUrl, params, headers)
        .then((res: any) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          console.log('=== 获取助力商品接口调用成功 ===');
          console.log('响应时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
          console.log('请求耗时:', duration + 'ms');
          console.log('响应数据:', JSON.stringify(res, null, 2));

          if (res.code === '00000') {
            this.fillPrizesData(res.data.data);
          } else {
            (this as any).$message.error('获取助力商品失败：' + res.msg);
          }
        })
        .catch(error => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          console.log('=== 获取助力商品接口调用失败 ===');
          console.log('响应时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
          console.log('请求耗时:', duration + 'ms');
          console.error('错误信息:', error);
          (this as any).$message.error('获取助力商品失败，请重试');
        });
    },
    
    // 填充助力商品数据
    fillPrizesData(data: any[]) {
      // 清空现有奖品数据
      this.form.prizeSettings = [];
      
      console.log('原始助力商品数据数量：', data.length);
      console.log('原始助力商品数据：', data);
      
      // 填充助力商品数据，只保留助力商品（prizeType: 2）
      data.forEach(item => {
        console.log('处理商品：', item.name, 'prizeType：', item.prizeType);
        if (item.prizeType === 2) {
          console.log('添加助力商品：', item.name);
          this.form.prizeSettings.push({
            id: item.id,
            enable: 'yes',
            name: item.name,
            price: String(item.price),
            stock: String(item.stock),
            detail: typeof item.descr === 'string' ? item.descr : '',
            descrImage: item.descrImage || '',
            thumb: item.thumb || ''
          });
        }
      });
      
      // 如果没有找到助力商品，添加一个默认的
      if (this.form.prizeSettings.length === 0) {
        console.log('未找到助力商品，添加默认数据');
        this.form.prizeSettings.push({
          id: undefined,
          enable: 'no',
          name: '',
          price: '',
          stock: '',
          detail: '',
          descrImage: '',
          thumb: ''
        });
      }
      
      console.log('助力商品数据填充完成，奖品数量：', this.form.prizeSettings.length);
      console.log('助力商品数据：', this.form.prizeSettings);
    },
    
    // 填充开团商品数据
    fillProductsData(data: any[]) {
      // 清空现有商品数据
      this.form.products = [];
      
      console.log('原始商品数据数量：', data.length);
      console.log('原始商品数据：', data);
      
      // 填充商品数据，只保留开团商品（prizeType: 1）
      data.forEach(item => {
        console.log('处理商品：', item.name, 'prizeType：', item.prizeType);
        if (item.prizeType === 1) {
          console.log('添加开团商品：', item.name);
          this.form.products.push({
            id: item.id,
            type: 'physical',
            name: item.name,
            price: String(item.price),
            stock: String(item.stock),
            groupPrice: String(item.teamPrice),
            groupSize: String(item.teamNum),
            overLimit: item.isQuota === 1 ? 'forbid' : 'allow',
            limit: String(item.quotaNum),
            specStock: '',
            detail: typeof item.descr === 'string' ? item.descr : '',
            descrImage: item.descrImage || '',
            thumb: item.thumb || ''
          });
        }
      });
      
      console.log('开团商品数据填充完成，商品数量：', this.form.products.length);
      console.log('开团商品数据：', this.form.products);
    },
    
    // 填充拼团设置数据
    fillGroupSettingsData(data: any) {
      // 填充拼团设置
      if (data.teamType) {
        this.form.groupSettings.teamType = String(data.teamType);
      }
      if (data.whitelistType) {
        this.form.groupSettings.whitelistType = String(data.whitelistType);
      }
      if (data.nonDesignateCustomerMsg) {
        this.form.groupSettings.nonDesignateCustomerMsg = data.nonDesignateCustomerMsg;
      }
      if (data.multipleTimesSwitch) {
        this.form.groupSettings.multipleTimesSwitch = String(data.multipleTimesSwitch);
      }
      if (data.multipleTimesMsg) {
        this.form.groupSettings.multipleTimesMsg = data.multipleTimesMsg;
      }
      if (data.multipleHelpSwitch) {
        this.form.groupSettings.multipleHelpSwitch = String(data.multipleHelpSwitch);
      }
      if (data.multipleHelpMsg) {
        this.form.groupSettings.multipleHelpMsg = data.multipleHelpMsg;
      }
      
      // 解析并填充 rules 字段
      if (data.rules) {
        try {
          const rules = typeof data.rules === 'string' ? JSON.parse(data.rules) : data.rules;
          if (rules.up) {
            this.form.groupSettings.rules.up.nendInfo = rules.up.nendInfo;
            this.form.groupSettings.rules.up.title = rules.up.title;
            this.form.groupSettings.rules.up.content = rules.up.content;
            if (rules.up.formData && rules.up.formData.length > 0) {
              this.form.groupSettings.rules.up.formData = rules.up.formData;
            }
          }
          if (rules.help) {
            this.form.groupSettings.rules.help.nendInfo = rules.help.nendInfo;
            this.form.groupSettings.rules.help.title = rules.help.title;
            this.form.groupSettings.rules.help.content = rules.help.content;
            if (rules.help.formData && rules.help.formData.length > 0) {
              this.form.groupSettings.rules.help.formData = rules.help.formData;
            }
            this.form.groupSettings.rules.help.checkName = rules.help.checkName;
          }
        } catch (error) {
          console.error('解析 rules 字段失败:', error);
        }
      }
      
      console.log('拼团设置数据填充完成');
    },
    
    handleTimeChange(value: any) {
      this.activityTimeRange = value;
      if (value && value.length === 2) {
        this.form.startTime = value[0];
        this.form.endTime = value[1];
      }
    },
    handleBack() {
      this.$router.push('/activity-management/group-buy/index');
    },
    handlePrev() {
      const tabs = ['basic', 'group', 'product', 'prize'];
      const currentIndex = tabs.indexOf(this.activeTab);
      if (currentIndex > 0) {
        this.activeTab = tabs[currentIndex - 1];
      }
    },
    handleSubmit() {
      // 查看模式下禁止提交
      if (this.isViewMode) {
        (this as any).$message.info('查看模式下不能提交数据');
        return;
      }
      
      const submitData: SubmitData & { id?: number } = {
        title: this.form.title,
        startTime: this.form.startTime,
        endTime: this.form.endTime,
        name: this.form.name,
        remark: this.form.remark,
        style: parseInt(this.form.style),
        key: this.form.key,
        secret: this.form.secret,
        type: this.form.type
      };

      // 如果有 createdImpId，添加到提交数据中（编辑模式）
      if (this.createdImpId) {
        submitData.id = this.createdImpId;
      }

      const userId = 4440;
      const requestUrl = `${import.meta.env.VITE_APP_API}/team/up/main/add`;
      const headers = { createUserId: userId };

      console.log('=== 接口调用开始 ===');
      console.log('请求时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
      console.log('用户ID:', userId);
      console.log('请求URL:', requestUrl);
      console.log('请求参数:', JSON.stringify(submitData, null, 2));
      console.log('请求头:', JSON.stringify(headers, null, 2));

      const startTime = Date.now();

      baseService.post(requestUrl, submitData, headers)
        .then((res: any) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          console.log('=== 接口调用成功 ===');
          console.log('响应时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
          console.log('请求耗时:', duration + 'ms');
          console.log('响应数据:', JSON.stringify(res, null, 2));

          if (res.code === '00000') {
            // 保存创建的活动ID
            this.createdImpId = res.data?.id || res.data;
            const isEditMode = !!this.createdImpId;
            (this as any).$message.success(isEditMode ? '活动编辑成功，正在切换到拼团设置...' : '活动创建成功，正在切换到拼团设置...');
            // 切换到拼团设置 tab
            this.activeTab = 'group';
          } else {
            const isEditMode = !!this.createdImpId;
            (this as any).$message.error(isEditMode ? '活动编辑失败：' + res.msg : '活动创建失败：' + res.msg);
          }
        })
        .catch(error => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          console.log('=== 接口调用失败 ===');
          console.log('响应时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
          console.log('请求耗时:', duration + 'ms');
          console.error('错误信息:', error);
          const isEditMode = !!this.createdImpId;
          (this as any).$message.error(isEditMode ? '活动编辑失败，请重试' : '活动创建失败，请重试');
        });
    },

    // 提交拼团设置
    handleSubmitDetail() {
      // 查看模式下禁止提交
      if (this.isViewMode) {
        (this as any).$message.info('查看模式下不能提交数据');
        return;
      }
      
      if (!this.createdImpId) {
        (this as any).$message.error('请先完成基础设置');
        return;
      }

      // 构建拼团设置数据
      const groupSettingsData = {
        impId: this.createdImpId!,
        teamType: parseInt(this.form.groupSettings.teamType),
        whitelistType: parseInt(this.form.groupSettings.whitelistType),
        nonDesignateCustomerMsg: this.form.groupSettings.nonDesignateCustomerMsg,
        multipleTimesSwitch: parseInt(this.form.groupSettings.multipleTimesSwitch),
        multipleTimesMsg: this.form.groupSettings.multipleTimesMsg,
        multipleHelpSwitch: parseInt(this.form.groupSettings.multipleHelpSwitch),
        multipleHelpMsg: this.form.groupSettings.multipleHelpMsg,
        rules: {
          up: {
            nendInfo: this.form.groupSettings.rules.up.nendInfo,
            title: this.form.groupSettings.rules.up.title,
            content: this.form.groupSettings.rules.up.content,
            formData: this.form.groupSettings.rules.up.formData.filter(item => item.selected === 1).map(item => ({ ...item, check: 1 }))
          },
          help: {
            nendInfo: this.form.groupSettings.rules.help.nendInfo,
            title: this.form.groupSettings.rules.help.title,
            content: this.form.groupSettings.rules.help.content,
            formData: this.form.groupSettings.rules.help.formData.filter(item => item.selected === 1).map(item => ({ ...item, check: 1 })),
            checkName: this.form.groupSettings.rules.help.checkName
          }
        },
        orderType: 0,
        teamUpLimitMsg: null,
        luckyLimitMax: 0,
        wxOpenidSwitch: 0,
        signRules: null,
        validityPeriod: 0,
        teamUpLimitSwitch: 0,
        userPhoneSwitch: 0,
        participationNum: 0,
        blacklistSwitch: 0,
        teamUpLimitMax: 0,
        blacklistMsg: null,
        orderOpenTime: null,
        designateCustomerType: 0,
        wxOpenidMsg: null,
        updateTime: new Date().toLocaleString('zh-CN'),
        prizeDrawMode: 0,
        userPhoneMsg: null,
        createTime: new Date().toLocaleString('zh-CN'),
        deleteTime: null,
        fuCardsSwitch: 0
      };

      const userId = 4440;
      const requestUrl = `${import.meta.env.VITE_APP_API}/team/buy/detail/add`;
      const headers = { createUserId: userId };

      console.log('=== 拼团设置接口调用开始 ===');
      console.log('请求时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
      console.log('用户ID:', userId);
      console.log('请求URL:', requestUrl);
      console.log('请求参数:', JSON.stringify(groupSettingsData, null, 2));
      console.log('请求头:', JSON.stringify(headers, null, 2));

      const startTime = Date.now();

      baseService.post(requestUrl, groupSettingsData, headers)
        .then((res: any) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          console.log('=== 拼团设置接口调用成功 ===');
          console.log('响应时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
          console.log('请求耗时:', duration + 'ms');
          console.log('响应数据:', JSON.stringify(res, null, 2));

          if (res.code === '00000') {
            (this as any).$message.success('拼团设置保存成功');
            // 切换到下一个 tab
            this.activeTab = 'product';
          } else {
            (this as any).$message.error('拼团设置保存失败：' + res.msg);
          }
        })
        .catch(error => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          console.log('=== 拼团设置接口调用失败 ===');
          console.log('响应时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
          console.log('请求耗时:', duration + 'ms');
          console.error('错误信息:', error);
          (this as any).$message.error('拼团设置保存失败，请重试');
        });
    },

    // 提交商品详情（同时提交助力奖品）
    async handleSubmitProducts() {
      // 查看模式下禁止提交
      if (this.isViewMode) {
        (this as any).$message.info('查看模式下不能提交数据');
        return;
      }
      
      if (!this.createdImpId) {
        (this as any).$message.error('请先完成基础设置');
        return;
      }

      // 构建开团商品数据数组
      const productsData: ProductDetail[] = this.form.products.map(product => ({
        id: product.id,
        impId: this.createdImpId!,
        prizeType: 1, // 开团奖品
        productType: 1,
        name: product.name,
        price: parseFloat(product.price) || 0,
        teamPrice: parseFloat(product.groupPrice) || 0,
        stock: parseInt(product.stock) || 0,
        validityPeriod: 111, // 默认值，可根据需求调整
        teamNum: parseInt(product.groupSize) || 0,
        isQuota: product.overLimit === 'forbid' ? 1 : 0,
        quotaNum: parseInt(product.limit) || 0,
        quoMsg: '您已达到该商品购买上限！',
        thumb: product.thumb || '',
        descrImage: product.descrImage || '',
        descr: product.detail
      }));

      // 构建助力奖品数据数组
      const prizesData: ProductDetail[] = this.form.prizeSettings.map(prize => ({
        id: prize.id,
        impId: this.createdImpId!,
        prizeType: 2, // 助力奖品
        productType: 1,
        name: prize.name,
        price: parseFloat(prize.price) || 0,
        teamPrice: 0, // 助力奖品不需要拼团价格
        stock: parseInt(prize.stock) || 0,
        validityPeriod: 111, // 默认值，可根据需求调整
        teamNum: 0, // 助力奖品不需要成团人数
        isQuota: 0, // 助力奖品不需要限购
        quotaNum: 0, // 助力奖品不需要限购数量
        quoMsg: '', // 助力奖品不需要限购提示
        thumb: prize.thumb || '',
        descrImage: prize.descrImage || '',
        descr: prize.detail
      }));

      // 合并开团商品和助力奖品数据
      const allData = [...productsData, ...prizesData];

      if (allData.length === 0) {
        (this as any).$message.info('没有数据需要提交');
        return;
      }

      const userId = 4440;
      const requestUrl = `${import.meta.env.VITE_APP_API}/team/buy/detail/prize/add`;
      const headers = { createUserId: userId };

      console.log('=== 商品详情接口调用开始 ===');
      console.log('请求时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
      console.log('用户ID:', userId);
      console.log('请求URL:', requestUrl);
      console.log('请求参数:', JSON.stringify(allData, null, 2));
      console.log('请求头:', JSON.stringify(headers, null, 2));

      try {
        const startTime = Date.now();
        const res: any = await baseService.post(requestUrl, allData, headers);
        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log('=== 商品详情接口调用成功 ===');
        console.log('响应时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
        console.log('请求耗时:', duration + 'ms');
        console.log('响应数据:', JSON.stringify(res, null, 2));

        if (res.code === '00000') {
          (this as any).$message.success('商品详情保存成功');
          // 切换到下一个 tab
          this.activeTab = 'prize';
        } else {
          (this as any).$message.error('商品详情保存失败：' + res.msg);
        }
      } catch (error) {
        console.error('商品详情提交失败:', error);
        (this as any).$message.error('商品详情保存失败，请重试');
      }
    },

    // 提交助力奖品（同时提交开团奖品）
    async handleSubmitPrizes() {
      // 查看模式下禁止提交
      if (this.isViewMode) {
        (this as any).$message.info('查看模式下不能提交数据');
        return;
      }
      
      if (!this.createdImpId) {
        (this as any).$message.error('请先完成基础设置');
        return;
      }

      // 构建开团商品数据数组
      const productsData: ProductDetail[] = this.form.products.map(product => ({
        id: product.id,
        impId: this.createdImpId!,
        prizeType: 1,
        productType: 1,
        name: product.name,
        price: parseFloat(product.price) || 0,
        teamPrice: parseFloat(product.groupPrice) || 0,
        stock: parseInt(product.stock) || 0,
        validityPeriod: 111, // 默认值，可根据需求调整
        teamNum: parseInt(product.groupSize) || 0,
        isQuota: product.overLimit === 'forbid' ? 1 : 0,
        quotaNum: parseInt(product.limit) || 0,
        quoMsg: '您已达到该商品购买上限！',
        thumb: product.thumb || '',
        descrImage: product.descrImage || '',
        descr: product.detail
      }));

      // 构建助力奖品数据数组
      const prizesData: ProductDetail[] = this.form.prizeSettings.map(prize => ({
        id: prize.id,
        impId: this.createdImpId!,
        prizeType: 2,
        productType: 1,
        name: prize.name,
        price: parseFloat(prize.price) || 0,
        teamPrice: 0, // 助力奖品不需要拼团价格
        stock: parseInt(prize.stock) || 0,
        validityPeriod: 111, // 默认值，可根据需求调整
        teamNum: 0, // 助力奖品不需要成团人数
        isQuota: 0, // 助力奖品不需要限购
        quotaNum: 0, // 助力奖品不需要限购数量
        quoMsg: '', // 助力奖品不需要限购提示
        thumb: prize.thumb || '',
        descrImage: prize.descrImage || '',
        descr: prize.detail
      }));

      // 合并开团商品和助力奖品数据
      const allData = [...productsData, ...prizesData];

      if (allData.length === 0) {
        (this as any).$message.info('没有数据需要提交');
        return;
      }

      const userId = 4440;
      const requestUrl = `${import.meta.env.VITE_APP_API}/team/buy/detail/prize/add`;
      const headers = { createUserId: userId };

      console.log('=== 助力奖品接口调用开始 ===');
      console.log('请求时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
      console.log('用户ID:', userId);
      console.log('请求URL:', requestUrl);
      console.log('请求参数:', JSON.stringify(allData, null, 2));
      console.log('请求头:', JSON.stringify(headers, null, 2));

      try {
        const startTime = Date.now();
        const res: any = await baseService.post(requestUrl, allData, headers);
        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log('=== 助力奖品接口调用成功 ===');
        console.log('响应时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
        console.log('请求耗时:', duration + 'ms');
        console.log('响应数据:', JSON.stringify(res, null, 2));

        if (res.code === '00000') {
          (this as any).$message.success('助力奖品保存成功');
          // 跳转到列表页
          (this as any).$router.push('/activity-management/group-buy/index');
        } else {
          (this as any).$message.error('助力奖品保存失败：' + res.msg);
        }
      } catch (error) {
        console.error('助力奖品提交失败:', error);
        (this as any).$message.error('助力奖品保存失败，请重试');
      }
    },

  }
});
</script>

<style scoped>
.group-buy-create {
  padding: 20px;
}

.tab-content {
  margin-top: 20px;
}

.tab-content h3 {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
}

.tab-content h4 {
  margin: 20px 0 10px 0;
  font-size: 14px;
  font-weight: bold;
}

.button-area {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}

.button-area el-button {
  margin-left: 10px;
}

.product-actions {
  margin-bottom: 20px;
}

.product-actions el-button {
  margin-right: 10px;
}

.product-item {
  border: 1px solid #e4e7ed;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
}

.upload-area {
  display: flex;
  align-items: center;
}

.upload-area el-button {
  margin-right: 20px;
}

.upload-tip {
  color: #909399;
  font-size: 12px;
}
</style>
