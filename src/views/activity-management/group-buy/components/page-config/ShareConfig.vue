<template>
  <div class="share-config">
    <div class="preview-section">
      <div class="preview-content">
        <div class="share-preview">
          <!-- 微信分享卡片 -->
        <div class="wechat-share-card">
          <div class="share-card-header">
            <div class="share-card-icon">📱</div>
            <div class="share-card-title">微信分享预览</div>
          </div>
          <div class="share-card-content">
            <div class="share-card-image" v-if="form.shareBackgroundImage">
              <img :src="form.shareBackgroundImage" alt="分享图片">
            </div>
            <div class="share-card-image-placeholder" v-else>
              <div class="placeholder-icon">🖼️</div>
              <div class="placeholder-text">分享图片</div>
            </div>
            <div class="share-card-info">
              <div class="share-card-text">{{ form.shareContent || '分享文案' }}</div>
              <div class="share-card-desc">{{ form.shareDesc || '分享说明' }}</div>
            </div>
          </div>
        </div>

        <!-- 朋友圈分享预览 -->
        <div class="moments-preview">
          <div class="moments-header">
            <div class="moments-avatar"></div>
            <div class="moments-name">用户昵称</div>
          </div>
          <div class="moments-content">
            <div class="moments-text">{{ form.shareContent || '分享文案' }}</div>
            <div class="moments-image" v-if="form.shareBackgroundImage">
              <img :src="form.shareBackgroundImage" alt="分享图片">
            </div>
            <div class="moments-image-placeholder" v-else>
              <div class="placeholder-icon">🖼️</div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>

    <div class="form-section">
      <el-form :model="form" label-width="100px" v-loading="loading">
        <!-- 分享图片 -->
        <el-form-item label="分享图片:" required>
          <div class="upload-wrapper">
            <div class="image-preview share-preview-box" v-if="form.shareBackgroundImage">
              <img :src="form.shareBackgroundImage" alt="分享图片">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.shareBackgroundImage = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box share-upload" v-else @click="uploadImage('shareBackgroundImage')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽400px 高400px，格式为jpg/bmp/png/gif</div>
        </el-form-item>

        <!-- 分享文案 -->
        <el-form-item label="分享文案:" required>
          <el-input
            v-model="form.shareContent"
            type="textarea"
            :rows="3"
            placeholder="请输入分享文案"
          ></el-input>
        </el-form-item>

        <!-- 分享说明 -->
        <el-form-item label="分享说明:" required>
          <el-input
            v-model="form.shareDesc"
            type="textarea"
            :rows="3"
            placeholder="请输入分享说明"
          ></el-input>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="save" :loading="loading">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { Plus, Delete } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import baseService from "@/service/baseService";

export default defineComponent({
  name: 'ShareConfig',
  components: {
    Plus,
    Delete
  },
  props: {
    impId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const form = ref({
      id: null as number | null,
      impId: props.impId,
      headerImage: '',
      backgroundImage: '',
      homeSwitch: 1,
      homeIcon: '',
      goodsBg: '',
      teamUpInviteBtn: '',
      backgroundImageOfButton: '',
      bottomImage: '',
      teamBuySuccessBtn: '',
      teamBuyFailBtn: '',
      friendEnterBg: '',
      friendEnterBtn: '',
      friendHelpBg: '',
      friendHelpBtn: '',
      friendHelpTextColor: '',
      shareBackgroundImage: '',
      shareContent: '',
      shareDesc: ''
    });

    const loading = ref(false);

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
              (form.value as any)[field] = res.data.url;
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

    const loadConfig = async () => {
      try {
        loading.value = true;
        const requestUrl = `${import.meta.env.VITE_APP_API}/team/buy/h5/detail/info`;
        const params = { impId: props.impId };
        const res: any = await baseService.get(requestUrl, params);
        if (res.code === '00000' && res.data) {
          const data = res.data;
          form.value.id = data.id || null;
          form.value.headerImage = data.headerImage || '';
          form.value.backgroundImage = data.backgroundImage || '';
          form.value.homeSwitch = data.homeSwitch ?? 1;
          form.value.homeIcon = data.homeIcon || '';
          form.value.goodsBg = data.goodsBg || '';
          form.value.teamUpInviteBtn = data.teamUpInviteBtn || '';
          form.value.backgroundImageOfButton = data.backgroundImageOfButton || '';
          form.value.bottomImage = data.bottomImage || '';
          form.value.teamBuySuccessBtn = data.teamBuySuccessBtn || '';
          form.value.teamBuyFailBtn = data.teamBuyFailBtn || '';
          form.value.friendEnterBg = data.friendEnterBg || '';
          form.value.friendEnterBtn = data.friendEnterBtn || '';
          form.value.friendHelpBg = data.friendHelpBg || '';
          form.value.friendHelpBtn = data.friendHelpBtn || '';
          form.value.friendHelpTextColor = data.friendHelpTextColor || '';
          form.value.shareBackgroundImage = data.shareBackgroundImage || '';
          form.value.shareContent = data.shareContent || '';
          form.value.shareDesc = data.shareDesc || '';
        }
      } catch (error) {
        console.error('获取配置数据失败:', error);
      } finally {
        loading.value = false;
      }
    };

    const save = async () => {
      try {
        loading.value = true;
        const requestUrl = `${import.meta.env.VITE_APP_API}/team/buy/h5/detail/add`;
        const params = {
          impId: form.value.impId,
          headerImage: form.value.headerImage,
          backgroundImage: form.value.backgroundImage,
          homeSwitch: form.value.homeSwitch,
          homeIcon: form.value.homeIcon,
          goodsBg: form.value.goodsBg,
          teamUpInviteBtn: form.value.teamUpInviteBtn,
          backgroundImageOfButton: form.value.backgroundImageOfButton,
          bottomImage: form.value.bottomImage,
          teamBuySuccessBtn: form.value.teamBuySuccessBtn,
          teamBuyFailBtn: form.value.teamBuyFailBtn,
          friendEnterBg: form.value.friendEnterBg,
          friendEnterBtn: form.value.friendEnterBtn,
          friendHelpBg: form.value.friendHelpBg,
          friendHelpBtn: form.value.friendHelpBtn,
          friendHelpTextColor: form.value.friendHelpTextColor,
          shareBackgroundImage: form.value.shareBackgroundImage,
          shareContent: form.value.shareContent,
          shareDesc: form.value.shareDesc,
          id: form.value.id
        };
        const res: any = await baseService.post(requestUrl, params);
        if (res.code === '00000') {
          ElMessage.success('保存成功');
          loadConfig();
        } else {
          ElMessage.error(res.msg || '保存失败');
        }
      } catch (error) {
        console.error('保存失败:', error);
        ElMessage.error('保存失败');
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadConfig();
    });

    // 监听 impId 变化，重新加载配置
    watch(() => props.impId, (newImpId) => {
      form.value.impId = newImpId;
      loadConfig();
    });

    return {
      form,
      loading,
      uploadImage,
      save
    };
  }
});
</script>

<style scoped>
.share-config {
  display: flex;
  gap: 20px;
}

.preview-section {
  flex: 1;
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.preview-section h4 {
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;
}

.preview-content {
  background: #fff;
  border-radius: 10px;
  overflow: auto;
  padding: 20px;
  width: 375px;
  height: 667px;
}

.share-preview {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 微信分享卡片 */
.wechat-share-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #e4e7ed;
}

.share-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.share-card-icon {
  font-size: 20px;
}

.share-card-title {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

.share-card-content {
  display: flex;
  gap: 12px;
  background: #fff;
  padding: 10px;
  border-radius: 6px;
}

.share-card-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.share-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.share-card-image-placeholder {
  width: 80px;
  height: 80px;
  background: #f0f0f0;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.placeholder-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.placeholder-text {
  font-size: 11px;
  color: #999;
}

.share-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.share-card-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
  line-height: 1.4;
}

.share-card-desc {
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}

/* 朋友圈预览 */
.moments-preview {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #e4e7ed;
}

.moments-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.moments-avatar {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: #07c160;
}

.moments-name {
  font-size: 14px;
  color: #576b95;
  font-weight: bold;
}

.moments-content {
  padding-left: 50px;
}

.moments-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.5;
}

.moments-image {
  width: 120px;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
}

.moments-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.moments-image-placeholder {
  width: 120px;
  height: 120px;
  background: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-section {
  width: 350px;
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  overflow-y: auto;
  max-height: calc(100vh - 40px);
}

.upload-wrapper {
  display: flex;
  flex-direction: column;
}

.image-preview {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
}

.share-preview-box {
  width: 120px;
  height: 120px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  top: 5px;
  right: 5px;
}

.upload-box {
  border: 2px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.share-upload {
  width: 120px;
  height: 120px;
}

.upload-box:hover {
  border-color: #409eff;
}

.upload-box .el-icon {
  font-size: 24px;
  color: #8c939d;
}

.upload-tip {
  margin-top: 8px;
  color: #909399;
  font-size: 12px;
}
</style>
