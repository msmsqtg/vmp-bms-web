<template>
  <div class="share-config">
    <el-form :model="localForm" label-width="120px">
      <h3>分享模式设置</h3>
      <el-form-item label="分享模式">
        <el-radio-group v-model="localForm.share_mode" :disabled="isViewMode" @change="handleFormChange" class="share-mode-group">
          <el-radio label="1">邀约海报</el-radio>
          <el-radio label="2">邀约海报加一键分享</el-radio>
          <el-radio label="3">邀约二维码</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <!-- 微信分享设置（模式2需要） -->
      <div v-if="localForm.share_mode === '2'">
        <el-form-item label="微信分享标题" required>
          <el-input v-model="localShareBgSetting.wx_share_title" placeholder="微信分享标题" :disabled="isViewMode" @input="handleShareBgSettingChange" maxlength="10" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="微信分享内容简介" required>
          <el-input v-model="localShareBgSetting.wx_share_desc" placeholder="微信分享内容简介" :disabled="isViewMode" @input="handleShareBgSettingChange" maxlength="30" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="微信分享缩略图片">
          <div class="upload-container">
            <div class="upload-row">
              <!-- 图片展示 -->
              <div v-if="localShareBgSetting.wx_share_pic" class="image-preview-list">
                <div class="image-preview-item">
                  <img :src="String(localShareBgSetting.wx_share_pic).trim()" alt="微信分享缩略图片" class="preview-image">
                  <el-button v-if="!isViewMode" type="danger" size="small" @click="removeShareImage('wx_share_pic')">删除</el-button>
                </div>
              </div>
              <!-- 上传占位符 -->
              <div v-else class="upload-placeholder">
                <div class="placeholder-icon">!</div>
              </div>
              <!-- 上传按钮，仅在非查看模式时显示 -->
              <div v-if="!isViewMode" class="upload-button">
                <el-button type="primary" plain :disabled="isViewMode" @click="uploadShareImage('wx_share_pic')">+</el-button>
              </div>
            </div>
            <div class="upload-tip">建议图片尺寸：640*962</div>
          </div>
        </el-form-item>
      </div>
      
      <!-- 邀约码有效期（仅模式3需要） -->
      <el-form-item label="邀约码有效期(秒)" required v-if="localForm.share_mode === '3'">
        <el-input-number v-model="localShareBgSetting.invitation_code_expire" :min="0" :max="86400" :disabled="isViewMode" @change="handleShareBgSettingChange"></el-input-number>
      </el-form-item>
      
      <!-- 通用分享海报设置 -->
      <el-form-item label="分享海报背景图">
        <div class="upload-container">
          <div class="upload-row">
            <!-- 图片展示 -->
            <div v-if="localShareBgSetting.share_bg_pic" class="image-preview-list">
              <div class="image-preview-item">
                <img :src="String(localShareBgSetting.share_bg_pic).trim()" alt="分享海报背景图" class="preview-image">
                <el-button v-if="!isViewMode" type="danger" size="small" @click="removeShareImage('share_bg_pic')">删除</el-button>
              </div>
            </div>
            <!-- 上传占位符 -->
            <div v-else class="upload-placeholder">
              <div class="placeholder-icon">!</div>
            </div>
            <!-- 上传按钮，仅在非查看模式时显示且未上传图片时显示 -->
            <div v-if="!isViewMode && !localShareBgSetting.share_bg_pic" class="upload-button">
              <el-button type="primary" plain :disabled="isViewMode" @click="uploadShareImage('share_bg_pic')">+</el-button>
            </div>
          </div>
          <div class="upload-tip">建议图片尺寸：640*962</div>
        </div>
      </el-form-item>
      
      <el-form-item label="按钮样式/生成邀约海报">
        <div class="upload-container">
          <div class="upload-row">
            <!-- 图片展示 -->
            <div v-if="localShareBgSetting.share_btn_pic" class="image-preview-list">
              <div class="image-preview-item">
                <img :src="String(localShareBgSetting.share_btn_pic).trim()" alt="按钮样式" class="preview-image btn-preview-image">
                <el-button v-if="!isViewMode" type="danger" size="small" @click="removeShareImage('share_btn_pic')">删除</el-button>
              </div>
            </div>
            <!-- 上传占位符 -->
            <div v-else class="upload-placeholder btn-upload-placeholder">
              <div class="placeholder-icon">!</div>
            </div>
            <!-- 上传按钮，仅在非查看模式时显示且未上传图片时显示 -->
            <div v-if="!isViewMode && !localShareBgSetting.share_btn_pic" class="upload-button btn-upload-button">
              <el-button type="primary" plain :disabled="isViewMode" @click="uploadShareImage('share_btn_pic')">+</el-button>
            </div>
          </div>
          <div class="upload-tip">建议图片尺寸：178*48</div>
        </div>
      </el-form-item>
      
      <el-form-item label="邀约代理人海报样式配置">
        <div class="style-config-container">
          <div class="style-option-group">
            <div class="style-option">
              <el-radio-group v-model="localShareBgSetting.share_style" :disabled="isViewMode" @change="handleShareBgSettingChange">
                <div class="style-item">
                  <el-radio label="1">样式一(带姓名)</el-radio>
                  <div class="style-preview-item">
                    <img src="https://test-integral-erp-web.sqqmall.com/img/activity_mode1.c61b3059.png" alt="样式一" class="style-preview">
                  </div>
                </div>
                <div class="style-item">
                  <el-radio label="2">样式二(不带姓名)</el-radio>
                  <div class="style-preview-item">
                    <img src="https://test-integral-erp-web.sqqmall.com/img/activity_mode2.b00b298a.png" alt="样式二(不带姓名)" class="style-preview">
                  </div>
                </div>
              </el-radio-group>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="B端邀约海报地址链接">
        <el-input v-model="localForm.share_bg_url" placeholder="请输入B端邀约海报地址链接" :disabled="isViewMode" @input="handleFormChange"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import baseService from "@/service/baseService";
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: "ShareConfig",
  props: {
    form: {
      type: Object,
      default: () => ({
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
        share_mode: '1',
        share_bg_setting: '{"share_style": 1, "share_bg_pic": "", "wx_share_pic": "", "share_btn_pic": "", "share_id_type": 1, "wx_share_desc": "", "wx_share_title": ""}',
        share_bg_url: '',
        is_del: 0,
        tenant_id: 1
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
    const localShareBgSetting = ref({
      share_style: '1',
      share_bg_pic: '',
      wx_share_pic: '',
      share_btn_pic: '',
      share_id_type: 1,
      wx_share_desc: '',
      wx_share_title: '',
      invitation_code_expire: 0
    });

    // 初始化时确保分享设置字段有正确的值
    if (localForm.value.share_mode === undefined) {
      localForm.value.share_mode = '1';
    }
    if (localForm.value.share_bg_setting === undefined) {
      localForm.value.share_bg_setting = '{"share_style": "1", "share_bg_pic": "", "wx_share_pic": "", "share_btn_pic": "", "share_id_type": 1, "wx_share_desc": "", "wx_share_title": ""}';
    }
    if (localForm.value.share_bg_url === undefined) {
      localForm.value.share_bg_url = '';
    }
    // 解析share_bg_setting
    try {
      const parsedSetting = JSON.parse(localForm.value.share_bg_setting);
      localShareBgSetting.value = {
        share_style: '1',
        share_bg_pic: '',
        wx_share_pic: '',
        share_btn_pic: '',
        share_id_type: 1,
        wx_share_desc: '',
        wx_share_title: '',
        invitation_code_expire: 0,
        ...parsedSetting
      };
      // 确保share_style是字符串类型
      if (localShareBgSetting.value.share_style !== undefined) {
        localShareBgSetting.value.share_style = String(localShareBgSetting.value.share_style);
      }
    } catch (error) {
      console.error('解析share_bg_setting失败:', error);
    }

    // 监听外部 form 变化
    watch(
      () => props.form,
      (newForm) => {
        // 确保完全复制所有字段，包括基础设置的字段
        localForm.value = { ...newForm };
        
        // 确保 share_mode 是字符串类型
        if (newForm.share_mode !== undefined) {
          localForm.value.share_mode = String(newForm.share_mode);
        }
        // 确保 share_bg_setting 是字符串类型并解析
        if (newForm.share_bg_setting !== undefined) {
          localForm.value.share_bg_setting = String(newForm.share_bg_setting);
          try {
            const parsedSetting = JSON.parse(localForm.value.share_bg_setting);
            localShareBgSetting.value = {
              share_style: '1',
              share_bg_pic: '',
              wx_share_pic: '',
              share_btn_pic: '',
              share_id_type: 1,
              wx_share_desc: '',
              wx_share_title: '',
              invitation_code_expire: 0,
              ...parsedSetting
            };
            // 确保share_style是字符串类型
            if (localShareBgSetting.value.share_style !== undefined) {
              localShareBgSetting.value.share_style = String(localShareBgSetting.value.share_style);
            }
          } catch (error) {
            console.error('解析share_bg_setting失败:', error);
          }
        }
      },
      { deep: true }
    );

    // 表单变化处理函数
    const handleFormChange = () => {
      emit('update:form', localForm.value);
    };

    // 分享设置变化处理函数
    const handleShareBgSettingChange = () => {
      localForm.value.share_bg_setting = JSON.stringify(localShareBgSetting.value);
      handleFormChange();
    };

    // 上传分享图片函数
    const uploadShareImage = (field: string) => {
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
              // 只对字符串类型的字段赋值
              if (field === 'share_bg_pic' || field === 'wx_share_pic' || field === 'share_btn_pic' || field === 'wx_share_title' || field === 'wx_share_desc') {
                (localShareBgSetting.value as any)[field] = res.data.url;
              }
              handleShareBgSettingChange();
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

    // 删除分享图片函数
    const removeShareImage = (field: string) => {
      // 只对字符串类型的字段赋值
      if (field === 'share_bg_pic' || field === 'wx_share_pic' || field === 'share_btn_pic' || field === 'wx_share_title' || field === 'wx_share_desc') {
        (localShareBgSetting.value as any)[field] = '';
      }
      handleShareBgSettingChange();
      ElMessage.success('删除成功');
    };

    return {
      localForm,
      localShareBgSetting,
      handleFormChange,
      handleShareBgSettingChange,
      uploadShareImage,
      removeShareImage
    };
  }
});
</script>

<style scoped>
.share-config {
  min-height: 100%;
  overflow-y: auto;
  padding: 20px;
}

/* 分享模式组样式 */
.share-mode-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.share-mode-group .el-radio {
  display: flex;
  align-items: center;
  margin-right: 0;
  margin-bottom: 0;
}

.share-mode-group .el-radio__input {
  margin-right: 5px;
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
  width: 150px;
  height: 150px;
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
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  padding: 0;
}

/* 按钮样式的上传按钮 */
.btn-upload-button .el-button {
  width: 178px;
  height: 48px;
  font-size: 16px;
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
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

/* 按钮样式的预览图片 */
.btn-preview-image {
  width: 178px;
  height: 48px;
  object-fit: cover;
}

/* 按钮样式的上传占位符 */
.btn-upload-placeholder {
  width: 178px;
  height: 48px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  margin-right: 10px;
  margin-bottom: 10px;
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

/* 样式配置容器 */
.style-config-container {
  width: 100%;
}

.style-option-group {
  width: 100%;
}

.style-option {
  width: 100%;
}

/* 确保radio组正确显示 */
:deep(.style-option .el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  width: 100%;
}

.style-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 20px;
  margin-bottom: 20px;
}

.style-preview-item {
  margin-top: 10px;
}

.style-preview {
  width: 200px;
  height: auto;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

/* 确保radio按钮和文字正确显示 */
:deep(.style-item .el-radio) {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

/* 调整radio-group布局 */
:deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
}

:deep(.el-radio) {
  margin-right: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

/* 确保radio标签正确显示 */
:deep(.el-radio__input) {
  margin-right: 5px;
  margin-bottom: 0;
  display: inline-block;
}

/* 确保内容编辑区域不被限制高度 */
.el-form {
  min-height: 100%;
}

/* 确保整个组件高度自适应 */
.share-config {
  min-height: 100%;
  overflow-y: auto;
  padding: 20px;
}
</style>