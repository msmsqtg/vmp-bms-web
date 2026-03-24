<template>
  <div class="friend-config">
    <div class="preview-section">
      <div class="preview-content">
        <div class="friend-modal">
          <!-- 标题 -->
          <div class="modal-title">助力好友抢</div>
          <!-- 弹窗内容 -->
          <div class="modal-content">
            <div class="modal-card">
              <!-- 头像 -->
              <div class="modal-avatar">
                <div class="avatar-circle">头像</div>
              </div>
              <!-- 尾号 -->
              <div class="modal-phone">尾号****</div>
              <!-- 提示文字 -->
              <div class="modal-text">帮ta助力，惊喜奖励等着你！</div>
              <!-- 助力按钮 -->
        <div class="modal-btn" v-if="form.friendEnterBtn">
          <img :src="form.friendEnterBtn" alt="点击帮ta助力">
        </div>
        <div class="modal-btn-default" v-else>点击帮ta助力</div>
            </div>
          </div>
          <!-- 关闭按钮 -->
          <div class="modal-close">
            <div class="close-icon">×</div>
          </div>
        </div>
      </div>
    </div>

    <div class="form-section">
      <el-form :model="form" label-width="140px" v-loading="loading">
        <!-- 好友进入弹窗 -->
        <el-form-item label="好友进入弹窗:">
          <div class="upload-wrapper">
            <div class="image-preview popup-preview" v-if="form.friendEnterBg">
              <img :src="form.friendEnterBg" alt="好友进入弹窗">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.friendEnterBg = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box popup-upload" v-else @click="uploadImage('friendEnterBg')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽570 高630px，格式为jpg/bmp/png/gif</div>
        </el-form-item>

        <!-- 助力按钮 -->
        <el-form-item label="助力按钮:">
          <div class="upload-wrapper">
            <div class="image-preview btn-preview" v-if="form.friendEnterBtn">
              <img :src="form.friendEnterBtn" alt="助力按钮">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.friendEnterBtn = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box btn-upload" v-else @click="uploadImage('friendEnterBtn')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽570 高630px，格式为jpg/bmp/png/gif</div>
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
  name: 'FriendConfig',
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
.friend-config {
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
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: auto;
  padding: 40px 20px;
  width: 375px;
  height: 667px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.friend-modal {
  width: 280px;
  text-align: center;
}

.modal-title {
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.modal-content {
  position: relative;
}

.modal-card {
  background: linear-gradient(180deg, #fff8e7 0%, #ffe4b5 100%);
  border-radius: 15px;
  padding: 30px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-avatar {
  margin-bottom: 10px;
}

.avatar-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f0f0f0;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
}

.modal-phone {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.modal-text {
  font-size: 14px;
  color: #ff6b35;
  font-weight: bold;
  margin-bottom: 20px;
}

.modal-btn {
  width: 200px;
  height: 50px;
  margin: 0 auto;
  border-radius: 25px;
  overflow: hidden;
}

.modal-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-btn-default {
  width: 200px;
  height: 50px;
  margin: 0 auto;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: #fff;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
}

.modal-close {
  margin-top: 30px;
}

.close-icon {
  width: 36px;
  height: 36px;
  border: 2px solid #fff;
  border-radius: 50%;
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  cursor: pointer;
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

.popup-preview {
  width: 150px;
  height: 166px;
}

.btn-preview {
  width: 150px;
  height: 50px;
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

.popup-upload {
  width: 150px;
  height: 166px;
}

.btn-upload {
  width: 150px;
  height: 50px;
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
