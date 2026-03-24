<template>
  <div class="module-config">
    <h3>邀约代理人页面模块配置（B端）</h3>
    
    <!-- 我的客户 -->
        <div class="module-item">
          <div class="module-header">
            <span class="module-label">我的客户：</span>
            <el-radio-group v-model="localForm.customer_switch" @change="handleFormChange">
              <el-radio label="1">开启</el-radio>
              <el-radio label="2">关闭</el-radio>
            </el-radio-group>
          </div>
          <div v-if="localForm.customer_switch === '1'" class="module-content">
            <!-- 页面背景图设置 -->
            <div class="sub-section">
              <h4>页面背景图设置</h4>
              <el-form-item label="头图设置：" required>
                <div class="upload-container">
                  <div class="upload-row">
                    <div v-if="getCustomerSetting().customer_top_pic" class="image-preview-list">
                      <div class="image-preview-item">
                        <img :src="String(getCustomerSetting().customer_top_pic).trim()" alt="头图" class="preview-image-large">
                        <el-button v-if="!isViewMode" type="danger" size="small" @click="removeImage('my_customer_header_pic')">删除</el-button>
                      </div>
                    </div>
                    <div v-else class="upload-placeholder-large">
                      <div class="placeholder-icon">!</div>
                    </div>
                    <div v-if="!isViewMode && !getCustomerSetting().customer_top_pic" class="upload-button-large">
                      <el-button type="primary" plain :disabled="isViewMode" @click="uploadImage('my_customer_header_pic')">+</el-button>
                    </div>
                  </div>
                  <div class="upload-tip">备注：图片建议尺寸750px宽，高度自适应</div>
                </div>
              </el-form-item>
              <el-form-item label="背景颜色：">
                <div class="color-picker-container">
                  <el-color-picker 
                    v-model="getCustomerSetting().customer_top_color" 
                    :disabled="isViewMode" 
                    @change="(value: string) => { const setting = getCustomerSetting(); setting.customer_top_color = value; setCustomerSetting(setting); }"
                    class="color-picker-btn"
                  ></el-color-picker>
                  <el-input 
                    v-model="getCustomerSetting().customer_top_color" 
                    :disabled="isViewMode" 
                    @input="(value: string) => { const setting = getCustomerSetting(); setting.customer_top_color = value; setCustomerSetting(setting); }"
                    placeholder="请输入颜色代码"
                    class="color-input"
                  ></el-input>
                </div>
              </el-form-item>
            </div>
            
            <!-- 浮层icon设置 -->
            <div class="sub-section">
              <h4>浮层icon设置</h4>
              <el-form-item label="浮层icon设置：" required>
                <div class="upload-container">
                  <div class="upload-row">
                    <div v-if="getCustomerSetting().customer_icon_pic" class="image-preview-list">
                      <div class="image-preview-item">
                        <img :src="String(getCustomerSetting().customer_icon_pic).trim()" alt="我的客户icon" class="preview-image">
                        <el-button v-if="!isViewMode" type="danger" size="small" @click="removeImage('customer_icon_pic')">删除</el-button>
                      </div>
                    </div>
                    <div v-else class="upload-placeholder">
                      <div class="placeholder-icon">!</div>
                    </div>
                    <div v-if="!isViewMode && !getCustomerSetting().customer_icon_pic" class="upload-button">
                      <el-button type="primary" plain :disabled="isViewMode" @click="uploadImage('customer_icon_pic')">+</el-button>
                    </div>
                  </div>
                  <div class="upload-tip">备注：图片建议尺寸144×130px</div>
                </div>
              </el-form-item>
            </div>
            
            <!-- 活动规则设置 -->
            <div class="sub-section">
              <h4>活动规则设置</h4>
              <el-form-item label="活动规则：">
                <el-radio-group v-model="localForm.invitationRuleSwitch" @change="handleFormChange">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="2">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
              <div v-if="localForm.invitationRuleSwitch === 1">
                <el-form-item label="icon图片：" required>
                  <div class="upload-container">
                    <div class="upload-row">
                      <div v-if="getInvitationRuleSetting().invitation_rule_icon" class="image-preview-list">
                        <div class="image-preview-item">
                          <img :src="String(getInvitationRuleSetting().invitation_rule_icon).trim()" alt="活动规则icon" class="preview-image-large">
                          <el-button v-if="!isViewMode" type="danger" size="small" @click="removeImage('invitation_rule_icon')">删除</el-button>
                        </div>
                      </div>
                      <div v-else class="upload-placeholder-large">
                        <div class="placeholder-icon">!</div>
                      </div>
                      <div v-if="!isViewMode && !getInvitationRuleSetting().invitation_rule_icon" class="upload-button-large">
                        <el-button type="primary" plain :disabled="isViewMode" @click="uploadImage('invitation_rule_icon')">+</el-button>
                      </div>
                    </div>
                    <div class="upload-tip">备注：图片建议尺寸750px宽，高度自适应</div>
                  </div>
                </el-form-item>
                <el-form-item label="规则内容图片：" required>
                  <div class="upload-container">
                    <div class="upload-row">
                      <div v-if="getInvitationRuleSetting().invitation_rule_content" class="image-preview-list">
                        <div class="image-preview-item">
                          <img :src="String(getInvitationRuleSetting().invitation_rule_content).trim()" alt="规则内容图片" class="preview-image-large">
                          <el-button v-if="!isViewMode" type="danger" size="small" @click="removeImage('invitation_rule_content')">删除</el-button>
                        </div>
                      </div>
                      <div v-else class="upload-placeholder-large">
                        <div class="placeholder-icon">!</div>
                      </div>
                      <div v-if="!isViewMode && !getInvitationRuleSetting().invitation_rule_content" class="upload-button-large">
                        <el-button type="primary" plain :disabled="isViewMode" @click="uploadImage('invitation_rule_content')">+</el-button>
                      </div>
                    </div>
                    <div class="upload-tip">备注：图片建议尺寸750px宽，高度自适应</div>
                  </div>
                </el-form-item>
              </div>
            </div>
            
            <!-- 我的二维码设置 -->
            <div class="sub-section">
              <h4>我的二维码设置</h4>
              <el-form-item label="我的二维码：">
                <el-radio-group v-model="localForm.my_customer_qr_switch" @change="handleFormChange">
                  <el-radio label="1">开启</el-radio>
                  <el-radio label="2">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
        </div>
    
    <!-- 照片审核 -->
    <div class="module-item">
      <div class="module-header">
        <span class="module-label">照片审核：</span>
        <el-radio-group v-model="localForm.third_vote_verify" @change="handleFormChange">
          <el-radio :label="2">开启</el-radio>
          <el-radio :label="1">关闭</el-radio>
        </el-radio-group>
      </div>
      <div v-if="localForm.third_vote_verify === 2" class="module-content">
        <el-form-item label="icon图片：" required>
          <div class="upload-container">
            <div class="upload-row">
              <div v-if="localForm.third_vote_icon" class="image-preview-list">
                <div class="image-preview-item">
                  <img :src="String(localForm.third_vote_icon).trim()" alt="照片审核icon" class="preview-image">
                  <el-button v-if="!isViewMode" type="danger" size="small" @click="removeImage('third_vote_icon')">删除</el-button>
                </div>
              </div>
              <div v-else class="upload-placeholder">
                <div class="placeholder-icon">!</div>
              </div>
              <div v-if="!isViewMode && !localForm.third_vote_icon" class="upload-button">
                <el-button type="primary" plain :disabled="isViewMode" @click="uploadImage('third_vote_icon')">+</el-button>
              </div>
            </div>
            <div class="upload-tip">备注：图片建议尺寸144×130px</div>
          </div>
        </el-form-item>
        <el-form-item label="投票活动编码：" required>
          <el-input v-model="localForm.third_vote_activity_no" placeholder="请输入投票活动编码" :disabled="isViewMode" @input="handleFormChange"></el-input>
        </el-form-item>
      </div>
    </div>
    
    <!-- 组团列表 -->
    <div class="module-item">
      <div class="module-header">
        <span class="module-label">组团列表：</span>
        <el-radio-group v-model="localForm.team_up_switch" @change="handleFormChange">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="2">关闭</el-radio>
        </el-radio-group>
      </div>
      <div v-if="localForm.team_up_switch === 1" class="module-content">
        <el-form-item label="icon图片：" required>
          <div class="upload-container">
            <div class="upload-row">
              <div v-if="localForm.team_up_icon" class="image-preview-list">
                <div class="image-preview-item">
                  <img :src="String(localForm.team_up_icon).trim()" alt="组团列表icon" class="preview-image">
                  <el-button v-if="!isViewMode" type="danger" size="small" @click="removeImage('team_up_icon')">删除</el-button>
                </div>
              </div>
              <div v-else class="upload-placeholder">
                <div class="placeholder-icon">!</div>
              </div>
              <div v-if="!isViewMode && !localForm.team_up_icon" class="upload-button">
                <el-button type="primary" plain :disabled="isViewMode" @click="uploadImage('team_up_icon')">+</el-button>
              </div>
            </div>
            <div class="upload-tip">备注：图片建议尺寸144×130px</div>
          </div>
        </el-form-item>
        <el-form-item label="组团活动Id：" required>
          <el-input v-model="localForm.team_up_id" placeholder="请输入组团活动Id" :disabled="isViewMode" @input="handleFormChange"></el-input>
        </el-form-item>
      </div>
    </div>
    
    <!-- 成团情况 -->
    <div class="module-item">
      <div class="module-header">
        <span class="module-label">成团情况：</span>
        <el-radio-group v-model="localForm.team_purchase_switch" @change="handleFormChange">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="2">关闭</el-radio>
        </el-radio-group>
      </div>
      <div v-if="localForm.team_purchase_switch === 1" class="module-content">
        <el-form-item label="icon图片：" required>
          <div class="upload-container">
            <div class="upload-row">
              <div v-if="localForm.team_purchase_icon" class="image-preview-list">
                <div class="image-preview-item">
                  <img :src="String(localForm.team_purchase_icon).trim()" alt="成团情况icon" class="preview-image">
                  <el-button v-if="!isViewMode" type="danger" size="small" @click="removeImage('team_purchase_icon')">删除</el-button>
                </div>
              </div>
              <div v-else class="upload-placeholder">
                <div class="placeholder-icon">!</div>
              </div>
              <div v-if="!isViewMode && !localForm.team_purchase_icon" class="upload-button">
                <el-button type="primary" plain :disabled="isViewMode" @click="uploadImage('team_purchase_icon')">+</el-button>
              </div>
            </div>
            <div class="upload-tip">备注：图片建议尺寸144×130px</div>
          </div>
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import baseService from "@/service/baseService";
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: "ModuleConfig",
  props: {
    form: {
      type: Object,
      default: () => ({
        // 模块配置字段
        customer_switch: '2',
        customer_setting: '{"customer_top_pic": "", "customer_icon_pic": "", "customer_top_color": "#D9001B", "wx_qr_code_switch": 1, "customer_lucky_kind_switch": 1, "customer_lucky_fictitious_switch": 1, "customer_xbox_whitelist_switch": 2, "customer_xbox_whitelist_type": 1}',
        invitationRuleSwitch: 2,
        invitationRuleSetting: '{"invitation_rule_icon": "", "invitation_rule_content": ""}',
        my_customer_activity_code: '',
        my_customer_qr_switch: '2',
        third_vote_verify: 1,
        third_vote_icon: '',
        third_vote_activity_no: '',
        team_up_switch: 2,
        team_up_icon: '',
        team_up_id: '',
        team_purchase_switch: 2,
        team_purchase_icon: ''
      })
    },
    isViewMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:form', 'save-success'],
  setup(props, { emit }) {
    const localForm = ref({ ...props.form });

    // 解析customer_setting JSON
    const parseCustomerSetting = () => {
      try {
        return JSON.parse(localForm.value.customer_setting || '{}');
      } catch (e) {
        return {};
      }
    };

    // 序列化customer_setting
    const serializeCustomerSetting = (setting: any) => {
      localForm.value.customer_setting = JSON.stringify(setting);
    };

    // 获取customer_setting对象
    const getCustomerSetting = () => {
      return parseCustomerSetting();
    };

    // 设置customer_setting对象
    const setCustomerSetting = (setting: any) => {
      serializeCustomerSetting(setting);
      handleFormChange();
    };

    // 解析invitationRuleSetting JSON
    const parseInvitationRuleSetting = () => {
      try {
        return JSON.parse(localForm.value.invitationRuleSetting || '{}');
      } catch (e) {
        return {};
      }
    };

    // 序列化invitationRuleSetting
    const serializeInvitationRuleSetting = (setting: any) => {
      localForm.value.invitationRuleSetting = JSON.stringify(setting);
    };

    // 获取invitationRuleSetting对象
    const getInvitationRuleSetting = () => {
      return parseInvitationRuleSetting();
    };

    // 设置invitationRuleSetting对象
    const setInvitationRuleSetting = (setting: any) => {
      serializeInvitationRuleSetting(setting);
      handleFormChange();
    };

    // 监听外部 form 变化
    watch(
      () => props.form,
      (newForm) => {
        localForm.value = { ...newForm };
      },
      { deep: true }
    );

    // 表单变化处理函数
    const handleFormChange = () => {
      emit('update:form', localForm.value);
    };

    // 上传图片函数
    const uploadImage = (field: string) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          try {
            const uploadUrl = `${import.meta.env.VITE_APP_API}/common/upload/image`;
            const res: any = await baseService.post(uploadUrl, formData);
            if (res.code === '00000' && res.data?.url) {
              if (field === 'my_customer_header_pic') {
                const setting = getCustomerSetting();
                setting.customer_top_pic = res.data.url;
                setCustomerSetting(setting);
              } else if (field === 'customer_icon_pic') {
                const setting = getCustomerSetting();
                setting.customer_icon_pic = res.data.url;
                setCustomerSetting(setting);
              } else if (field === 'invitation_rule_icon') {
                const setting = getInvitationRuleSetting();
                setting.invitation_rule_icon = res.data.url;
                setInvitationRuleSetting(setting);
              } else if (field === 'invitation_rule_content') {
                const setting = getInvitationRuleSetting();
                setting.invitation_rule_content = res.data.url;
                setInvitationRuleSetting(setting);
              } else {
                (localForm.value as any)[field] = res.data.url;
                handleFormChange();
              }
              ElMessage.success('上传成功');
            }
          } catch (error) {
            console.error('上传失败:', error);
            ElMessage.error('上传失败');
          }
        }
      };
      input.click();
    };

    // 删除图片函数
    const removeImage = (field: string) => {
      if (field === 'my_customer_header_pic') {
        const setting = getCustomerSetting();
        setting.customer_top_pic = '';
        setCustomerSetting(setting);
      } else if (field === 'customer_icon_pic') {
        const setting = getCustomerSetting();
        setting.customer_icon_pic = '';
        setCustomerSetting(setting);
      } else if (field === 'invitation_rule_icon') {
        const setting = getInvitationRuleSetting();
        setting.invitation_rule_icon = '';
        setInvitationRuleSetting(setting);
      } else if (field === 'invitation_rule_content') {
        const setting = getInvitationRuleSetting();
        setting.invitation_rule_content = '';
        setInvitationRuleSetting(setting);
      } else {
        (localForm.value as any)[field] = '';
        handleFormChange();
      }
      ElMessage.success('删除成功');
    };

    return {
      localForm,
      isViewMode: props.isViewMode,
      handleFormChange,
      uploadImage,
      removeImage,
      getCustomerSetting,
      setCustomerSetting,
      getInvitationRuleSetting,
      setInvitationRuleSetting
    };
  }
});
</script>

<style scoped>
.module-config {
  padding: 20px;
}

.module-config h3 {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.module-item {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fafafa;
}

.module-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.module-label {
  font-size: 14px;
  color: #606266;
  margin-right: 12px;
}

.module-content {
  padding-left: 80px;
}

.sub-section {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #ffffff;
}

.sub-section h4 {
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.module-section {
  margin-top: 32px;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fafafa;
}

.module-section h4 {
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.control-section {
  margin-bottom: 20px;
}

.control-section h5 {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #606266;
}

/* 上传容器样式 */
.upload-container {
  width: 100%;
}

.upload-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: 10px;
  width: 100%;
}

.upload-placeholder {
  width: 180px;
  height: 180px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  margin-right: 10px;
  margin-bottom: 10px;
}

.upload-placeholder-large {
  width: 180px;
  height: 180px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  margin-right: 10px;
  margin-bottom: 10px;
}

.placeholder-icon {
  font-size: 24px;
  color: #999;
}

.upload-button {
  margin-right: 10px;
  margin-bottom: 10px;
}

.upload-button .el-button {
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  padding: 0;
}

.upload-button-large .el-button {
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  padding: 0;
}

.image-preview-list {
  display: flex;
  flex-wrap: wrap;
  margin-right: 10px;
  margin-bottom: 10px;
}

.image-preview-item {
  margin: 0 10px 10px 0;
  position: relative;
}

.preview-image {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.preview-image-large {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.image-preview-item .el-button {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  border-radius: 0 0 4px 4px;
}

.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  width: 100%;
}

.color-picker-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-picker-btn {
  width: 40px;
  height: 40px;
}

.color-input {
  flex: 1;
  max-width: 200px;
}
</style>
