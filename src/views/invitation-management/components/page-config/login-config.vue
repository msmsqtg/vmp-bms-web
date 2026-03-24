<template>
  <div class="login-config">
    <el-form :model="uiConfig" label-width="120px">
      <el-form-item label="登录设置">
        <div class="login-switch">
          <el-radio-group v-model="loginSwitch" :disabled="isViewMode" @change="handleLoginSwitchChange">
            <el-radio label="1">需要登录</el-radio>
            <el-radio label="2">无需登录</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      
      <el-form-item label="登录表单配置" required v-if="loginSwitch === '1'">
        <div class="login-form-config">
          <div class="form-header">
            <div class="form-checkbox">
              <el-checkbox v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
            </div>
            <div class="form-type">表单类型</div>
            <div class="form-title">标题文案</div>
            <div class="form-required">是否必填</div>
            <div class="form-unique">唯一ID标记</div>
            <div class="form-whitelist">是否需要白名单验证</div>
          </div>
          <div class="form-item" v-for="(item, index) in formItems" :key="index">
            <div class="form-checkbox">
              <el-checkbox v-model="item.choose_switch" :true-label="1" :false-label="2" :disabled="isViewMode" @change="handleFormChange"></el-checkbox>
            </div>
            <div class="form-type">{{ item.form_type_text }}</div>
            <div class="form-title">
              <el-input v-model="item.form_name" size="small" :disabled="isViewMode || item.choose_switch !== 1" @input="handleFormChange"></el-input>
            </div>
            <div class="form-required">
              <el-checkbox v-model="item.required_switch" :true-label="1" :false-label="2" :disabled="isViewMode || item.choose_switch !== 1" @change="handleFormChange">必填</el-checkbox>
            </div>
            <div class="form-unique" v-if="['phone_no', 'id_card_no', 'numeric_word'].includes(item.form_type)">
              <el-radio v-model="uniqueId" :label="item.params_name" :disabled="isViewMode || item.choose_switch !== 1" @change="handleFormChange">唯一ID</el-radio>
            </div>
            <div class="form-unique" v-else></div>
            <div class="form-whitelist" v-if="['name', 'phone_no', 'id_card_no', 'numeric_word'].includes(item.form_type)">
              <el-checkbox v-model="item.check_switch" :true-label="1" :false-label="2" :disabled="isViewMode || item.choose_switch !== 1" @change="handleFormChange">白名单验证</el-checkbox>
            </div>
            <div class="form-whitelist" v-else></div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="登录白名单">
        <div class="login-whitelist-switch">
          <el-radio-group v-model="loginWhitelistSwitch" :disabled="isViewMode" @change="handleLoginWhitelistSwitchChange">
            <el-radio label="1">开启</el-radio>
            <el-radio label="2">关闭</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item label="按钮样式/表单提交">
        <div class="upload-container">
          <div class="upload-row">
            <!-- 图片展示 -->
            <div v-if="localLoginSetting.login_btn_pic" class="image-preview-list">
              <div class="image-preview-item">
                <img :src="localLoginSetting.login_btn_pic" alt="按钮样式" class="preview-image btn-preview-image">
                <div class="button-container">
                  <el-button v-if="!isViewMode" type="danger" size="small" @click="removeShareImage('login_btn_pic')">删除</el-button>
                </div>
              </div>
            </div>
            <!-- 上传占位符 -->
            <div v-else class="upload-placeholder btn-upload-placeholder">
              <div class="placeholder-icon">!</div>
            </div>
            <!-- 上传按钮，仅在非查看模式时显示且未上传图片时显示 -->
            <div v-if="!isViewMode && !localLoginSetting.login_btn_pic" class="upload-button btn-upload-button">
              <el-button type="primary" plain :disabled="isViewMode" @click="uploadShareImage('login_btn_pic')">+</el-button>
            </div>
          </div>
          <div class="upload-tip">建议图片尺寸：178*48</div>
        </div>
      </el-form-item>
      <el-form-item label="邀约人提交资料">
        <div class="login-switch">
          <el-radio-group v-model="dataSwitch" :disabled="isViewMode" @change="handleDataSwitchChange">
            <el-radio label="1">开启</el-radio>
            <el-radio label="2">关闭</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item label="表单配置" required v-if="dataSwitch === '1'">
        <div class="login-form-config">
          <div class="form-header">
            <div class="form-checkbox">
              <el-checkbox v-model="selectAllSubmit" @change="handleSelectAllSubmit">全选</el-checkbox>
            </div>
            <div class="form-type">表单类型</div>
            <div class="form-title">标题文案</div>
            <div class="form-required">是否必填</div>
            <div class="form-unique">操作</div>
            <div class="form-whitelist">特殊规则配置</div>
          </div>
          <!-- 固定第一行 -->
          <div class="form-item">
            <div class="form-checkbox">
              <el-checkbox v-model="firstSubmitItem.choose_switch" :true-label="1" :false-label="2" :disabled="isViewMode" @change="handleSubmitFormChange"></el-checkbox>
            </div>
            <div class="form-type">
              <el-select v-model="firstSubmitItem.form_type" size="small" :disabled="isViewMode || firstSubmitItem.choose_switch !== 1" @change="handleSubmitFormChange">
                <el-option v-for="option in formTypeOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
              </el-select>
            </div>
            <div class="form-title">
              <el-input v-model="firstSubmitItem.form_name" size="small" :disabled="isViewMode || firstSubmitItem.choose_switch !== 1" @input="handleSubmitFormChange"></el-input>
            </div>
            <div class="form-required">
              <el-checkbox v-model="firstSubmitItem.required_switch" :true-label="1" :false-label="2" :disabled="isViewMode || firstSubmitItem.choose_switch !== 1" @change="handleSubmitFormChange">必填</el-checkbox>
            </div>
            <div class="form-unique">
              <el-button type="text" size="small" :disabled="isViewMode || firstSubmitItem.choose_switch !== 1" @click="removeSubmitFormItem(0)">删除</el-button>
            </div>
            <div class="form-whitelist">
              <el-checkbox v-model="firstSubmitItem.check_switch" :true-label="1" :false-label="2" :disabled="isViewMode || firstSubmitItem.choose_switch !== 1" @change="handleSubmitFormChange">特殊规则</el-checkbox>
            </div>
          </div>
          <!-- 动态表单行 -->
          <div class="form-item" v-for="(item, index) in dynamicSubmitFormItems" :key="index">
            <div class="form-checkbox">
              <el-checkbox v-model="item.choose_switch" :true-label="1" :false-label="2" :disabled="isViewMode" @change="handleSubmitFormChange"></el-checkbox>
            </div>
            <div class="form-type">
              <el-select v-model="item.form_type" size="small" :disabled="isViewMode || item.choose_switch !== 1" @change="handleSubmitFormChange">
                <el-option v-for="option in formTypeOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
              </el-select>
            </div>
            <div class="form-title">
              <el-input v-model="item.form_name" size="small" :disabled="isViewMode || item.choose_switch !== 1" @input="handleSubmitFormChange"></el-input>
            </div>
            <div class="form-required">
              <el-checkbox v-model="item.required_switch" :true-label="1" :false-label="2" :disabled="isViewMode || item.choose_switch !== 1" @change="handleSubmitFormChange">必填</el-checkbox>
            </div>
            <div class="form-unique">
              <el-button type="text" size="small" :disabled="isViewMode || item.choose_switch !== 1" @click="removeSubmitFormItem(index + 1)">删除</el-button>
            </div>
            <div class="form-whitelist">
              <el-checkbox v-model="item.check_switch" :true-label="1" :false-label="2" :disabled="isViewMode || item.choose_switch !== 1" @change="handleSubmitFormChange">特殊规则</el-checkbox>
            </div>
          </div>
          <!-- 新增按钮 -->
          <div class="add-form-item">
            <el-button type="primary" size="small" @click="addSubmitFormItem">新增新表单</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="提交资料按钮样式" v-if="dataSwitch === '1'">
        <div class="upload-container">
          <div class="upload-row">
            <!-- 图片展示 -->
            <div v-if="localDataSetting.data_btn_pic" class="image-preview-list">
              <div class="image-preview-item">
                <img :src="localDataSetting.data_btn_pic" alt="按钮样式" class="preview-image btn-preview-image">
                <div class="button-container">
                  <el-button v-if="!isViewMode" type="danger" size="small" @click="removeShareImage('data_btn_pic')">删除</el-button>
                </div>
              </div>
            </div>
            <!-- 上传占位符 -->
            <div v-else class="upload-placeholder btn-upload-placeholder">
              <div class="placeholder-icon">!</div>
            </div>
            <!-- 上传按钮，仅在非查看模式时显示且未上传图片时显示 -->
            <div v-if="!isViewMode && !localDataSetting.data_btn_pic" class="upload-button btn-upload-button">
              <el-button type="primary" plain :disabled="isViewMode" @click="uploadShareImage('data_btn_pic')">+</el-button>
            </div>
          </div>
          <div class="upload-tip">建议图片尺寸：178*48</div>
        </div>
      </el-form-item>

      <!-- C端客户资料提交 -->
      <el-form-item label="C端客户资料提交">
        <div class="login-switch">
          <el-radio-group v-model="cDataSwitch" :disabled="isViewMode" @change="handleCDataSwitchChange">
            <el-radio label="1">开启</el-radio>
            <el-radio label="2">关闭</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item label="C端表单配置" required v-if="cDataSwitch === '1'">
        <div class="login-form-config">
          <div class="form-header">
            <div class="form-checkbox">
              <el-checkbox v-model="selectAllCDataSubmit" @change="handleSelectAllCDataSubmit">全选</el-checkbox>
            </div>
            <div class="form-type">表单类型</div>
            <div class="form-title">标题文案</div>
            <div class="form-required">是否必填</div>
            <div class="form-unique">操作</div>
            <div class="form-whitelist">特殊规则配置</div>
          </div>
          <!-- 固定第一行 -->
          <div class="form-item">
            <div class="form-checkbox">
              <el-checkbox v-model="firstCDataSubmitItem.choose_switch" :true-label="1" :false-label="2" :disabled="isViewMode" @change="handleCDataSubmitFormChange"></el-checkbox>
            </div>
            <div class="form-type">
              <el-select v-model="firstCDataSubmitItem.form_type" size="small" :disabled="isViewMode || firstCDataSubmitItem.choose_switch !== 1" @change="handleCDataSubmitFormChange">
                <el-option v-for="option in formTypeOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
              </el-select>
            </div>
            <div class="form-title">
              <el-input v-model="firstCDataSubmitItem.form_name" size="small" :disabled="isViewMode || firstCDataSubmitItem.choose_switch !== 1" @input="handleCDataSubmitFormChange"></el-input>
            </div>
            <div class="form-required">
              <el-checkbox v-model="firstCDataSubmitItem.required_switch" :true-label="1" :false-label="2" :disabled="isViewMode || firstCDataSubmitItem.choose_switch !== 1" @change="handleCDataSubmitFormChange">必填</el-checkbox>
            </div>
            <div class="form-unique">
              <el-button type="text" size="small" :disabled="isViewMode || firstCDataSubmitItem.choose_switch !== 1" @click="removeCDataSubmitFormItem(0)">删除</el-button>
            </div>
            <div class="form-whitelist">
              <el-checkbox v-model="firstCDataSubmitItem.check_switch" :true-label="1" :false-label="2" :disabled="isViewMode || firstCDataSubmitItem.choose_switch !== 1" @change="handleCDataSubmitFormChange">特殊规则</el-checkbox>
            </div>
          </div>
          <!-- 动态表单行 -->
          <div class="form-item" v-for="(item, index) in dynamicCDataSubmitFormItems" :key="index">
            <div class="form-checkbox">
              <el-checkbox v-model="item.choose_switch" :true-label="1" :false-label="2" :disabled="isViewMode" @change="handleCDataSubmitFormChange"></el-checkbox>
            </div>
            <div class="form-type">
              <el-select v-model="item.form_type" size="small" :disabled="isViewMode || item.choose_switch !== 1" @change="handleCDataSubmitFormChange">
                <el-option v-for="option in formTypeOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
              </el-select>
            </div>
            <div class="form-title">
              <el-input v-model="item.form_name" size="small" :disabled="isViewMode || item.choose_switch !== 1" @input="handleCDataSubmitFormChange"></el-input>
            </div>
            <div class="form-required">
              <el-checkbox v-model="item.required_switch" :true-label="1" :false-label="2" :disabled="isViewMode || item.choose_switch !== 1" @change="handleCDataSubmitFormChange">必填</el-checkbox>
            </div>
            <div class="form-unique">
              <el-button type="text" size="small" :disabled="isViewMode || item.choose_switch !== 1" @click="removeCDataSubmitFormItem(index + 1)">删除</el-button>
            </div>
            <div class="form-whitelist">
              <el-checkbox v-model="item.check_switch" :true-label="1" :false-label="2" :disabled="isViewMode || item.choose_switch !== 1" @change="handleCDataSubmitFormChange">特殊规则</el-checkbox>
            </div>
          </div>
          <!-- 新增按钮 -->
          <div class="add-form-item">
            <el-button type="primary" size="small" @click="addCDataSubmitFormItem">新增新表单</el-button>
          </div>
        </div>
      </el-form-item>
       <el-form-item label="C端表单背景图片" v-if="cDataSwitch === '1'">
        <div class="upload-container">
          <div class="upload-row">
            <!-- 背景图片 -->
            <div v-if="localCDataSetting.bg_pic" class="image-preview-list">
              <div class="image-preview-item">
                <img :src="localCDataSetting.bg_pic" alt="背景图片" class="preview-image bg-preview-image">
                <div class="button-container">
                  <el-button v-if="!isViewMode" type="danger" size="small" @click="removeCDataImage('bg_pic')">删除</el-button>
                </div>
              </div>
            </div>
            <div v-else class="upload-placeholder bg-upload-placeholder">
              <div class="placeholder-icon">!</div>
            </div>
            <div v-if="!isViewMode && !localCDataSetting.bg_pic" class="upload-button bg-upload-button">
              <el-button type="primary" plain :disabled="isViewMode" @click="uploadCDataImage('bg_pic')">+</el-button>
            </div>
          </div>
          <div class="upload-tip">背景图片 - 建议尺寸：根据实际需求调整</div>
        </div>
      </el-form-item>
      <el-form-item label="C端提交资料按钮样式" v-if="cDataSwitch === '1'">
        <div class="upload-container">
          <div class="upload-row">
            <!-- 按钮图片 -->
            <div v-if="localCDataSetting.btn_pic" class="image-preview-list">
              <div class="image-preview-item">
                <img :src="localCDataSetting.btn_pic" alt="按钮样式" class="preview-image btn-preview-image">
                <div class="button-container">
                  <el-button v-if="!isViewMode" type="danger" size="small" @click="removeCDataImage('btn_pic')">删除</el-button>
                </div>
              </div>
            </div>
            <div v-else class="upload-placeholder btn-upload-placeholder">
              <div class="placeholder-icon">!</div>
            </div>
            <div v-if="!isViewMode && !localCDataSetting.btn_pic" class="upload-button btn-upload-button">
              <el-button type="primary" plain :disabled="isViewMode" @click="uploadCDataImage('btn_pic')">+</el-button>
            </div>
          </div>
          <div class="upload-tip">按钮图片 - 建议尺寸：178*48</div>
        </div>
      </el-form-item>
      <el-form-item label="C端提交完成按钮样式" v-if="cDataSwitch === '1'">
        <div class="upload-container">
          <div class="upload-row">
            <!-- 完成按钮图片 -->
            <div v-if="localCDataSetting.complete_btn_pic" class="image-preview-list">
              <div class="image-preview-item">
                <img :src="localCDataSetting.complete_btn_pic" alt="完成按钮样式" class="preview-image btn-preview-image">
                <div class="button-container">
                  <el-button v-if="!isViewMode" type="danger" size="small" @click="removeCDataImage('complete_btn_pic')">删除</el-button>
                </div>
              </div>
            </div>
            <div v-else class="upload-placeholder btn-upload-placeholder">
              <div class="placeholder-icon">!</div>
            </div>
            <div v-if="!isViewMode && !localCDataSetting.complete_btn_pic" class="upload-button btn-upload-button">
              <el-button type="primary" plain :disabled="isViewMode" @click="uploadCDataImage('complete_btn_pic')">+</el-button>
            </div>
          </div>
          <div class="upload-tip">完成按钮图片 - 建议尺寸：178*48</div>
        </div>
      </el-form-item>
      <el-form-item label="C端提交完成样式" v-if="cDataSwitch === '1'">
        <div class="upload-container">
          <div class="upload-row">
            <!-- 完成样式图片 -->
            <div v-if="localCDataSetting.complete_style_pic" class="image-preview-list">
              <div class="image-preview-item">
                <img :src="localCDataSetting.complete_style_pic" alt="完成样式" class="preview-image btn-preview-image">
                <div class="button-container">
                  <el-button v-if="!isViewMode" type="danger" size="small" @click="removeCDataImage('complete_style_pic')">删除</el-button>
                </div>
              </div>
            </div>
            <div v-else class="upload-placeholder btn-upload-placeholder">
              <div class="placeholder-icon">!</div>
            </div>
            <div v-if="!isViewMode && !localCDataSetting.complete_style_pic" class="upload-button btn-upload-button">
              <el-button type="primary" plain :disabled="isViewMode" @click="uploadCDataImage('complete_style_pic')">+</el-button>
            </div>
          </div>
          <div class="upload-tip">完成样式图片 - 建议尺寸：根据实际需求调整</div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import baseService from "@/service/baseService";

export default defineComponent({
  name: "LoginConfig",
  props: {
    form: {
      type: Object as () => {
        login_form: string;
        [key: string]: any;
      },
      default: () => ({
        login_form: ''
      })
    },
    uiConfig: {
      type: Object as () => {
        id?: string;
        login_setting: string;
        [key: string]: any;
      },
      default: () => ({
        id: '',
        login_setting: ''
      })
    },
    invitationId: {
      type: String,
      default: ''
    },
    isViewMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:form', 'update:uiConfig'],
  setup(props, { emit }) {
    // 定义固定的表单字段类型
    const formItems = ref([
      {
        form_name: '姓名',
        form_type: 'name',
        form_type_text: '姓名',
        only_switch: 0,
        params_name: 'name',
        check_switch: 1,
        choose_switch: 1,
        required_switch: 1
      },
      {
        form_name: '手机号码',
        form_type: 'phone_no',
        form_type_text: '手机号码',
        only_switch: 1,
        params_name: 'phone_no',
        check_switch: 1,
        choose_switch: 1,
        required_switch: 1
      },
      {
        form_name: '验证码',
        form_type: 'verification_code',
        form_type_text: '验证码',
        only_switch: 0,
        params_name: 'verification_code',
        check_switch: 0,
        choose_switch: 2,
        required_switch: 2
      },
      {
        form_name: '身份证号码',
        form_type: 'id_card_no',
        form_type_text: '身份证号码',
        only_switch: 0,
        params_name: 'id_card_no',
        check_switch: 2,
        choose_switch: 2,
        required_switch: 2
      },
      {
        form_name: '工号',
        form_type: 'numeric_word',
        form_type_text: '数字编号',
        only_switch: 0,
        params_name: 'numeric_word',
        check_switch: 1,
        choose_switch: 1,
        required_switch: 1
      },
      {
        form_name: '字符串',
        form_type: 'string_word',
        form_type_text: '字符串',
        only_switch: 0,
        params_name: 'string_word',
        check_switch: 0,
        choose_switch: 2,
        required_switch: 2
      },
      {
        form_name: '机构名称',
        form_type: 'organization_name',
        form_type_text: '机构名称',
        only_switch: 0,
        params_name: 'organization_name',
        check_switch: 0,
        choose_switch: 2,
        required_switch: 2
      }
    ]);

    const uniqueId = ref('phone_no'); // 默认唯一ID为手机号码
    const loginSwitch = ref('1'); // 默认需要登录
    const loginWhitelistSwitch = ref('2'); // 默认关闭登录白名单
    const localLoginSetting = ref({ login_btn_pic: '' }); // 登录设置
    const localDataSetting = ref({ data_btn_pic: '' }); // 提交资料设置
    const dataSwitch = ref('2'); // 默认关闭提交资料
    const cDataSwitch = ref('2'); // 默认关闭C端客户资料提交
    const localCDataSetting = ref({ btn_pic: '', complete_btn_pic: '', complete_style_pic: '', bg_pic: '' }); // C端提交资料设置

    // 表单类型选项
    const formTypeOptions = ref([
      { label: '姓名', value: 'name' },
      { label: '手机号码', value: 'phone_no' },
      { label: '验证码', value: 'verification_code' },
      { label: '身份证号码', value: 'id_card_no' },
      { label: '数字编号', value: 'numeric_word' },
      { label: '字符串', value: 'string_word' },
      { label: '省市区', value: 'region' },
      { label: '机构名称', value: 'organization_name' },
      { label: '性别', value: 'gender' },
      { label: '抽奖次数', value: 'lottery_count' },
      { label: '图片文本域', value: 'image_text' }
    ]);

    // 固定第一行表单数据
    const firstSubmitItem = ref<FormItem>({
      form_name: '姓名',
      form_type: 'name',
      form_type_text: '姓名',
      only_switch: 0,
      params_name: 'name',
      check_switch: 0,
      choose_switch: 1,
      required_switch: 1
    });

    // 动态表单数据
    interface FormItem {
      form_name: string;
      form_type: string;
      form_type_text: string;
      only_switch: number;
      params_name: string;
      check_switch: number;
      choose_switch: number;
      required_switch: number;
    }
    const dynamicSubmitFormItems = ref<FormItem[]>([]);

    // 全选状态
    const selectAllSubmit = computed({
      get: () => {
        return firstSubmitItem.value.choose_switch === 1 && dynamicSubmitFormItems.value.every(item => item.choose_switch === 1);
      },
      set: (value) => {
        firstSubmitItem.value.choose_switch = value ? 1 : 2;
        dynamicSubmitFormItems.value.forEach(item => {
          item.choose_switch = value ? 1 : 2;
        });
        handleSubmitFormChange();
      }
    });

    // C端客户资料提交 - 固定第一行表单数据
    const firstCDataSubmitItem = ref<FormItem>({
      form_name: '姓名',
      form_type: 'name',
      form_type_text: '姓名',
      only_switch: 0,
      params_name: 'name',
      check_switch: 0,
      choose_switch: 1,
      required_switch: 1
    });

    // C端客户资料提交 - 动态表单数据
    const dynamicCDataSubmitFormItems = ref<FormItem[]>([]);

    // C端客户资料提交 - 全选状态
    const selectAllCDataSubmit = computed({
      get: () => {
        return firstCDataSubmitItem.value.choose_switch === 1 && dynamicCDataSubmitFormItems.value.every(item => item.choose_switch === 1);
      },
      set: (value) => {
        firstCDataSubmitItem.value.choose_switch = value ? 1 : 2;
        dynamicCDataSubmitFormItems.value.forEach(item => {
          item.choose_switch = value ? 1 : 2;
        });
        handleCDataSubmitFormChange();
      }
    });

    // 处理登录表单变化
    const handleFormChange = () => {
      // 确保 only_switch 正确设置（唯一ID）
      formItems.value.forEach(item => {
        // 只有当字段被勾选（choose_switch === 1）且是唯一ID时，only_switch 才为 1
        item.only_switch = item.choose_switch === 1 && item.params_name === uniqueId.value ? 1 : 0;
      });
      
      // 构建登录表单数据
      const loginFormData = formItems.value.map(item => ({
        form_name: item.form_name,
        form_type: item.form_type,
        only_switch: item.only_switch,
        params_name: item.params_name,
        check_switch: item.check_switch,
        choose_switch: item.choose_switch,
        required_switch: item.required_switch
      }));
      
      emit('update:form', {
        ...props.form,
        login_switch: loginSwitch.value,
        login_whitelist_switch: loginWhitelistSwitch.value,
        login_form: JSON.stringify(loginFormData),
        login_setting: JSON.stringify(localLoginSetting.value)
      });
    };

    // 处理邀约人提交资料表单变化
    const handleSubmitFormChange = () => {
      // 构建邀约人提交资料表单数据
      const submitFormItems = [firstSubmitItem.value, ...dynamicSubmitFormItems.value];
      const submitFormData = submitFormItems.map(item => ({
        form_name: item.form_name,
        form_type: item.form_type,
        only_switch: item.only_switch,
        params_name: item.form_type,
        check_switch: item.check_switch,
        choose_switch: item.choose_switch,
        required_switch: item.required_switch
      }));
      
      emit('update:form', {
        ...props.form,
        data_switch: dataSwitch.value,
        data_form: JSON.stringify(submitFormData),
        data_setting: JSON.stringify(localDataSetting.value)
      });
    };

    // 处理全选
    const handleSelectAllSubmit = (value: boolean) => {
      firstSubmitItem.value.choose_switch = value ? 1 : 2;
      dynamicSubmitFormItems.value.forEach(item => {
        item.choose_switch = value ? 1 : 2;
      });
      handleSubmitFormChange();
    };

    // 处理C端客户资料提交全选
    const handleSelectAllCDataSubmit = (value: boolean) => {
      firstCDataSubmitItem.value.choose_switch = value ? 1 : 2;
      dynamicCDataSubmitFormItems.value.forEach(item => {
        item.choose_switch = value ? 1 : 2;
      });
      handleCDataSubmitFormChange();
    };

    // 添加新表单字段
    const addSubmitFormItem = () => {
      const newFormType = firstSubmitItem.value.form_type;
      
      dynamicSubmitFormItems.value.push({
        form_name: firstSubmitItem.value.form_name,
        form_type: newFormType,
        form_type_text: formTypeOptions.value.find(opt => opt.value === newFormType)?.label || '',
        only_switch: firstSubmitItem.value.only_switch,
        params_name: newFormType,
        check_switch: firstSubmitItem.value.check_switch,
        choose_switch: firstSubmitItem.value.choose_switch,
        required_switch: firstSubmitItem.value.required_switch
      });
      handleSubmitFormChange();
    };

    // 删除表单字段
    const removeSubmitFormItem = (index: number) => {
      if (index === 0) {
        // 重置第一行
        firstSubmitItem.value = {
          form_name: '姓名',
          form_type: 'name',
          form_type_text: '姓名',
          only_switch: 0,
          params_name: 'name',
          check_switch: 0,
          choose_switch: 1,
          required_switch: 1
        };
      } else {
        dynamicSubmitFormItems.value.splice(index - 1, 1);
      }
      handleSubmitFormChange();
    };

    // 处理登录开关变化
    const handleLoginSwitchChange = () => {
      handleFormChange();
    };

    // 处理登录白名单开关变化
    const handleLoginWhitelistSwitchChange = () => {
      handleFormChange();
    };

    // 处理提交资料开关变化
    const handleDataSwitchChange = () => {
      handleSubmitFormChange();
    };

    // 上传登录按钮图片
    const uploadShareImage = async (type: string) => {
      // 创建文件输入元素
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      // 监听文件选择事件
      input.onchange = async (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          const file = target.files[0];
          
          // 文件大小和类型验证
          if (file.size > 5 * 1024 * 1024) { // 限制5MB
            ElMessage.error('图片大小不能超过5MB');
            return;
          }
          
          // 创建FormData对象
          const formData = new FormData();
          formData.append('file', file);
          
          try {
            // 调用上传接口
            const uploadUrl = `${import.meta.env.VITE_APP_API}/common/upload/image`;
            const res: any = await baseService.post(uploadUrl, formData);
            if (res.code === '00000' && res.data?.url) {
              // 更新本地状态
              if (type === 'login_btn_pic') {
                localLoginSetting.value.login_btn_pic = res.data.url;
                handleFormChange();
                ElMessage.success('图片上传成功');
              } else if (type === 'data_btn_pic') {
                localDataSetting.value.data_btn_pic = res.data.url;
                handleSubmitFormChange();
                ElMessage.success('图片上传成功');
              }
            } else {
              ElMessage.error('上传失败：' + (res.msg || '未知错误'));
            }
          } catch (error) {
            console.error('上传失败:', error);
            ElMessage.error('上传失败，请重试');
          }
        }
      };
      
      // 触发文件选择
      input.click();
    };

    // 删除按钮图片
    const removeShareImage = (type: string) => {
      if (type === 'login_btn_pic') {
        localLoginSetting.value.login_btn_pic = '';
        handleFormChange();
      } else if (type === 'data_btn_pic') {
        localDataSetting.value.data_btn_pic = '';
        handleSubmitFormChange();
      }
    };

    // 处理C端客户资料提交表单变化
    const handleCDataSubmitFormChange = () => {
      // 构建C端客户资料提交表单数据
      const cDataSubmitFormItems = [firstCDataSubmitItem.value, ...dynamicCDataSubmitFormItems.value];
      const cDataSubmitFormData = cDataSubmitFormItems.map(item => ({
        form_name: item.form_name,
        form_type: item.form_type,
        only_switch: item.only_switch,
        params_name: item.form_type,
        check_switch: item.check_switch,
        choose_switch: item.choose_switch,
        required_switch: item.required_switch
      }));
      
      emit('update:form', {
        ...props.form,
        c_data_switch: cDataSwitch.value,
        c_data_form: JSON.stringify(cDataSubmitFormData),
        c_data_setting: JSON.stringify(localCDataSetting.value)
      });
    };

    // 处理C端客户资料提交开关变化
    const handleCDataSwitchChange = () => {
      handleCDataSubmitFormChange();
    };

    // 添加C端客户资料提交表单字段
    const addCDataSubmitFormItem = () => {
      const newFormType = firstCDataSubmitItem.value.form_type;
      
      dynamicCDataSubmitFormItems.value.push({
        form_name: firstCDataSubmitItem.value.form_name,
        form_type: newFormType,
        form_type_text: formTypeOptions.value.find(opt => opt.value === newFormType)?.label || '',
        only_switch: firstCDataSubmitItem.value.only_switch,
        params_name: newFormType,
        check_switch: firstCDataSubmitItem.value.check_switch,
        choose_switch: firstCDataSubmitItem.value.choose_switch,
        required_switch: firstCDataSubmitItem.value.required_switch
      });
      handleCDataSubmitFormChange();
    };

    // 删除C端客户资料提交表单字段
    const removeCDataSubmitFormItem = (index: number) => {
      if (index === 0) {
        // 重置第一行
        firstCDataSubmitItem.value = {
          form_name: '姓名',
          form_type: 'name',
          form_type_text: '姓名',
          only_switch: 0,
          params_name: 'name',
          check_switch: 0,
          choose_switch: 1,
          required_switch: 1
        };
      } else {
        dynamicCDataSubmitFormItems.value.splice(index - 1, 1);
      }
      handleCDataSubmitFormChange();
    };

    // 上传C端客户资料提交图片
    const uploadCDataImage = async (type: string) => {
      // 创建文件输入元素
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      // 监听文件选择事件
      input.onchange = async (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          const file = target.files[0];
          
          // 文件大小和类型验证
          if (file.size > 5 * 1024 * 1024) { // 限制5MB
            ElMessage.error('图片大小不能超过5MB');
            return;
          }
          
          // 创建FormData对象
          const formData = new FormData();
          formData.append('file', file);
          
          try {
            // 调用上传接口
            const uploadUrl = `${import.meta.env.VITE_APP_API}/common/upload/image`;
            const res: any = await baseService.post(uploadUrl, formData);
            if (res.code === '00000' && res.data?.url) {
              // 更新本地状态
              if (type === 'btn_pic') {
                localCDataSetting.value.btn_pic = res.data.url;
                handleCDataSubmitFormChange();
                ElMessage.success('图片上传成功');
              } else if (type === 'complete_btn_pic') {
                localCDataSetting.value.complete_btn_pic = res.data.url;
                handleCDataSubmitFormChange();
                ElMessage.success('图片上传成功');
              } else if (type === 'complete_style_pic') {
                localCDataSetting.value.complete_style_pic = res.data.url;
                handleCDataSubmitFormChange();
                ElMessage.success('图片上传成功');
              } else if (type === 'bg_pic') {
                localCDataSetting.value.bg_pic = res.data.url;
                handleCDataSubmitFormChange();
                ElMessage.success('图片上传成功');
              }
            } else {
              ElMessage.error('上传失败：' + (res.msg || '未知错误'));
            }
          } catch (error) {
            console.error('上传失败:', error);
            ElMessage.error('上传失败，请重试');
          }
        }
      };
      
      // 触发文件选择
      input.click();
    };

    // 删除C端客户资料提交图片
    const removeCDataImage = (type: string) => {
      if (type === 'btn_pic') {
        localCDataSetting.value.btn_pic = '';
      } else if (type === 'complete_btn_pic') {
        localCDataSetting.value.complete_btn_pic = '';
      } else if (type === 'complete_style_pic') {
        localCDataSetting.value.complete_style_pic = '';
      } else if (type === 'bg_pic') {
        localCDataSetting.value.bg_pic = '';
      }
      handleCDataSubmitFormChange();
    };

    // 从 props.form 中解析数据
    watch(() => props.form, (newVal) => {
      if (newVal) {
        // 解析登录开关
        const loginSwitchValue = newVal.loginSwitch || newVal.login_switch;
        if (loginSwitchValue !== undefined) {
          loginSwitch.value = String(loginSwitchValue);
        }
        
        // 解析登录白名单开关
        const loginWhitelistSwitchValue = newVal.loginWhitelistSwitch || newVal.login_whitelist_switch;
        if (loginWhitelistSwitchValue !== undefined) {
          loginWhitelistSwitch.value = String(loginWhitelistSwitchValue);
        }
        
        // 解析登录表单数据
        const loginFormValue = newVal.loginForm || newVal.login_form;
        if (loginFormValue) {
          try {
            const loginFormData = JSON.parse(loginFormValue);
            if (Array.isArray(loginFormData)) {
              loginFormData.forEach((item: any) => {
                const formItem = formItems.value.find(fi => fi.form_type === item.form_type);
                if (formItem) {
                  formItem.form_name = item.form_name;
                  formItem.only_switch = item.only_switch;
                  formItem.check_switch = item.check_switch;
                  formItem.choose_switch = item.choose_switch;
                  formItem.required_switch = item.required_switch;
                  if (item.only_switch === 1) {
                    uniqueId.value = item.params_name;
                  }
                }
              });
              // 解析完成后，更新 only_switch 字段，确保唯一ID标记正确
              formItems.value.forEach(item => {
                item.only_switch = item.choose_switch === 1 && item.params_name === uniqueId.value ? 1 : 0;
              });
              // 触发 Vue 的响应式更新
              formItems.value = [...formItems.value];
            }
          } catch (error) {
            console.error('解析登录表单数据失败:', error);
          }
        }
        
        // 解析登录设置
        const loginSettingValue = newVal.loginSetting || newVal.login_setting;
        if (loginSettingValue) {
          try {
            const parsedSetting = typeof loginSettingValue === 'string' ? JSON.parse(loginSettingValue) : loginSettingValue;
            // 只有当解析出的对象确实含有图片字段时，才更新本地状态，避免被空对象覆盖
            if (parsedSetting && parsedSetting.login_btn_pic) {
              localLoginSetting.value.login_btn_pic = parsedSetting.login_btn_pic;
            }
          } catch (error) {
            console.error('解析登录设置失败:', error);
          }
        }
        
        // 解析提交资料开关
        const dataSwitchValue = newVal.dataSwitch || newVal.data_switch;
        if (dataSwitchValue !== undefined) {
          dataSwitch.value = String(dataSwitchValue);
        }
        
        // 解析提交资料表单数据
        const dataFormValue = newVal.dataForm || newVal.data_form;
        if (dataFormValue) {
          try {
            const dataFormData = JSON.parse(dataFormValue);
            if (Array.isArray(dataFormData) && dataFormData.length > 0) {
              // 解析第一行数据
              if (dataFormData[0]) {
                firstSubmitItem.value = {
                  form_name: dataFormData[0].form_name || '姓名',
                  form_type: dataFormData[0].form_type || 'name',
                  form_type_text: formTypeOptions.value.find(opt => opt.value === dataFormData[0].form_type)?.label || '',
                  only_switch: dataFormData[0].only_switch || 0,
                  params_name: dataFormData[0].params_name || 'name',
                  check_switch: dataFormData[0].check_switch || 0,
                  choose_switch: dataFormData[0].choose_switch || 1,
                  required_switch: dataFormData[0].required_switch || 1
                };
              }
              // 解析动态行数据
              if (dataFormData.length > 1) {
                dynamicSubmitFormItems.value = dataFormData.slice(1).map((item: any) => ({
                  form_name: item.form_name || '新字段',
                  form_type: item.form_type || 'string_word',
                  form_type_text: formTypeOptions.value.find(opt => opt.value === item.form_type)?.label || '',
                  only_switch: item.only_switch || 0,
                  params_name: item.params_name || item.form_type,
                  check_switch: item.check_switch || 0,
                  choose_switch: item.choose_switch || 1,
                  required_switch: item.required_switch || 0
                }));
              }
            }
          } catch (error) {
            console.error('解析提交资料表单数据失败:', error);
          }
        }
        
        // 解析提交资料设置
        const dataSettingValue = newVal.dataSetting || newVal.data_setting;
        if (dataSettingValue) {
          try {
            const parsedSetting = typeof dataSettingValue === 'string' ? JSON.parse(dataSettingValue) : dataSettingValue;
            // 只有当解析出的对象确实含有图片字段时，才更新本地状态，避免被空对象覆盖
            if (parsedSetting && parsedSetting.data_btn_pic) {
              localDataSetting.value.data_btn_pic = parsedSetting.data_btn_pic;
              console.log('提交资料图片解析成功:', localDataSetting.value.data_btn_pic);
            }
          } catch (error) {
            console.error('解析提交资料设置失败:', error);
          }
        }
        
        // 解析C端客户资料提交开关
        const cDataSwitchValue = newVal.cDataSwitch || newVal.c_data_switch;
        if (cDataSwitchValue !== undefined) {
          cDataSwitch.value = String(cDataSwitchValue);
        }
        
        // 解析C端客户资料提交表单数据
        const cDataFormValue = newVal.cDataForm || newVal.c_data_form;
        if (cDataFormValue) {
          try {
            const cDataFormData = JSON.parse(cDataFormValue);
            if (Array.isArray(cDataFormData) && cDataFormData.length > 0) {
              // 解析第一行数据
              if (cDataFormData[0]) {
                firstCDataSubmitItem.value = {
                  form_name: cDataFormData[0].form_name || '姓名',
                  form_type: cDataFormData[0].form_type || 'name',
                  form_type_text: formTypeOptions.value.find(opt => opt.value === cDataFormData[0].form_type)?.label || '',
                  only_switch: cDataFormData[0].only_switch || 0,
                  params_name: cDataFormData[0].params_name || 'name',
                  check_switch: cDataFormData[0].check_switch || 0,
                  choose_switch: cDataFormData[0].choose_switch || 1,
                  required_switch: cDataFormData[0].required_switch || 1
                };
              }
              // 解析动态行数据
              if (cDataFormData.length > 1) {
                dynamicCDataSubmitFormItems.value = cDataFormData.slice(1).map((item: any) => ({
                  form_name: item.form_name || '新字段',
                  form_type: item.form_type || 'string_word',
                  form_type_text: formTypeOptions.value.find(opt => opt.value === item.form_type)?.label || '',
                  only_switch: item.only_switch || 0,
                  params_name: item.params_name || item.form_type,
                  check_switch: item.check_switch || 0,
                  choose_switch: item.choose_switch || 1,
                  required_switch: item.required_switch || 0
                }));
              }
            }
          } catch (error) {
            console.error('解析C端客户资料提交表单数据失败:', error);
          }
        }
        
        // 解析C端客户资料提交设置
        const cDataSettingValue = newVal.cDataSetting || newVal.c_data_setting;
        if (cDataSettingValue) {
          try {
            const parsedSetting = typeof cDataSettingValue === 'string' ? JSON.parse(cDataSettingValue) : cDataSettingValue;
            // 只有当解析出的对象确实含有图片字段时，才更新本地状态，避免被空对象覆盖
            if (parsedSetting) {
              if (parsedSetting.btn_pic) {
                localCDataSetting.value.btn_pic = parsedSetting.btn_pic;
              }
              if (parsedSetting.complete_btn_pic) {
                localCDataSetting.value.complete_btn_pic = parsedSetting.complete_btn_pic;
              }
              if (parsedSetting.complete_style_pic) {
                localCDataSetting.value.complete_style_pic = parsedSetting.complete_style_pic;
              }
              if (parsedSetting.bg_pic) {
                localCDataSetting.value.bg_pic = parsedSetting.bg_pic;
              }
              console.log('C端客户资料提交设置解析成功:', localCDataSetting.value);
            }
          } catch (error) {
            console.error('解析C端客户资料提交设置失败:', error);
          }
        }
      }
    }, { immediate: true, deep: true });



    // 全选/取消全选
    const selectAll = computed({
      get: () => {
        return formItems.value.every(item => item.choose_switch === 1);
      },
      set: (value) => {
        formItems.value.forEach(item => {
          item.choose_switch = value ? 1 : 2;
        });
        handleFormChange();
      }
    });

    // 处理全选
    const handleSelectAll = (value: boolean) => {
      formItems.value.forEach(item => {
        item.choose_switch = value ? 1 : 2;
      });
      handleFormChange();
    };

    return {
      formItems,
      uniqueId,
      loginSwitch,
      loginWhitelistSwitch,
      localLoginSetting,
      localDataSetting,
      selectAll,
      handleSelectAll,
      handleLoginSwitchChange,
      handleLoginWhitelistSwitchChange,
      handleFormChange,
      uploadShareImage,
      removeShareImage,
      // 邀约人提交资料表单相关
      dataSwitch,
      handleDataSwitchChange,
      formTypeOptions,
      firstSubmitItem,
      dynamicSubmitFormItems,
      selectAllSubmit,
      handleSelectAllSubmit,
      handleSubmitFormChange,
      addSubmitFormItem,
      removeSubmitFormItem,
      handleSelectAllCDataSubmit,
      // C端客户资料提交表单相关
      cDataSwitch,
      handleCDataSwitchChange,
      firstCDataSubmitItem,
      dynamicCDataSubmitFormItems,
      selectAllCDataSubmit,
      handleCDataSubmitFormChange,
      addCDataSubmitFormItem,
      removeCDataSubmitFormItem,
      uploadCDataImage,
      removeCDataImage,
      localCDataSetting
    };
  }
});
</script>

<style scoped>
.login-config {
  padding: 20px 0;
}

.login-form-config {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

.form-header {
  display: flex;
  background-color: #f5f7fa;
  padding: 10px;
  font-weight: 600;
  border-bottom: 1px solid #e4e7ed;
}

.form-item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #e4e7ed;
  align-items: center;
}

.form-item:last-child {
  border-bottom: none;
}

.form-checkbox {
  width: 80px;
}

.form-type {
  width: 100px;
}

.form-title {
  width: 150px;
}

.form-required {
  width: 100px;
}

.form-unique {
  width: 120px;
}

.form-whitelist {
  flex: 1;
}

.el-input {
  width: 120px;
}

/* 按钮样式预览图片尺寸 */
.btn-preview-image {
  width: 178px;
  height: 48px;
  object-fit: cover;
}

/* 图片预览项布局 */
.image-preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 按钮容器样式 */
.button-container {
  margin-top: 0;
  display: flex;
  justify-content: center;
}

/* 删除按钮样式 */
.button-container .el-button {
  width: 178px;
}

/* 上传容器样式 */
.upload-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* 上传行样式 */
.upload-row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
}

/* 图片预览列表样式 */
.image-preview-list {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

/* 上传占位符样式 */
.upload-placeholder {
  width: 178px;
  height: 48px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

/* 按钮上传占位符样式 */
.btn-upload-placeholder {
  width: 178px;
  height: 48px;
}

/* 上传按钮样式 */
.upload-button {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

/* 按钮上传按钮样式 */
.btn-upload-button {
  width: 178px;
  height: 48px;
}

/* 背景图片预览样式 */
.bg-preview-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

/* 背景图片占位符样式 */
.bg-upload-placeholder {
  width: 150px;
  height: 150px;
}

/* 背景图片上传按钮样式 */
.bg-upload-button {
  width: 150px;
  height: 150px;
}

/* 上传提示样式 */
.upload-tip {
  text-align: left;
  color: #909399;
  font-size: 12px;
}

/* 预览图片样式 */
.preview-image {
  display: block;
}
</style>