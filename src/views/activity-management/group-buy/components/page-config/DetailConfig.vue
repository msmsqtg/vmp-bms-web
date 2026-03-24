<template>
  <div class="detail-config">
    <div class="preview-section">
      <div class="preview-content">
        <!-- 页面头图 -->
        <div class="preview-header" v-if="form.headerImage">
          <img :src="form.headerImage" alt="页面头图">
        </div>
        <div class="preview-header-placeholder" v-else>
          <div class="placeholder-text">页面头图</div>
        </div>

        <!-- 商品信息卡片 -->
        <div class="product-card" :style="productAreaStyle">
          <div class="product-image">
            <img :src="previewProducts[0]?.thumb" v-if="previewProducts[0]?.thumb">
            <div class="product-placeholder" v-else>商品图</div>
          </div>
          <div class="product-info">
            <div class="product-title">{{ previewProducts[0]?.name || '我是标题标题' }}</div>
            <div class="product-time">开团时间：2025.4.3 15:20</div>
            <div class="product-price">
              <span class="price-label">成团价:</span>
              <span class="group-price">¥{{ previewProducts[0]?.teamPrice || '1000.00' }}</span>
              <span class="original-price">¥{{ previewProducts[0]?.price || '2.00' }}</span>
            </div>
          </div>
          <div class="product-count">x1</div>
        </div>

        <!-- 邀好友助力区域 -->
        <div class="help-section" :style="buttonAreaStyle">
          <div class="help-btn" v-if="form.teamUpInviteBtn">
            <img :src="form.teamUpInviteBtn" alt="邀好友助力">
          </div>
          <div class="help-btn-default" v-else>邀好友助力</div>
          <div class="help-text">再邀1人拼团成功</div>
          <div class="countdown">
            <span class="countdown-num">0</span>天
            <span class="countdown-num">00</span>:
            <span class="countdown-num">00</span>:
            <span class="countdown-num">00</span>后失效
          </div>
        </div>

        <!-- 拼团详情 -->
        <div class="group-detail">
          <div class="group-detail-title">拼团详情</div>
          <div class="member-list">
            <div class="member-item leader">
              <div class="member-avatar">头像</div>
              <div class="member-info">
                <div class="member-name">我是姓名</div>
                <div class="member-time">2024.10.01 08:29:28</div>
              </div>
              <div class="member-phone">188****8888</div>
              <div class="member-role leader-role">团长</div>
            </div>
            <div class="member-item">
              <div class="member-avatar">头像</div>
              <div class="member-info">
                <div class="member-name">我是姓名</div>
                <div class="member-time">2024.10.01 08:29:28</div>
              </div>
              <div class="member-phone">188****8888</div>
              <div class="member-role">团员</div>
            </div>
          </div>
        </div>

        <!-- 首页icon -->
        <div class="home-icon" v-if="form.homeSwitch === 1 && form.homeIcon">
          <img :src="form.homeIcon" alt="首页">
        </div>

        <!-- 定位图标 -->
        <div class="location-icon">
          <div class="location-marker"></div>
        </div>
      </div>
    </div>

    <div class="form-section">
      <el-form :model="form" label-width="140px" v-loading="loading">
        <!-- 页面头图 -->
        <el-form-item label="页面头图:">
          <div class="upload-wrapper">
            <div class="image-preview bg-preview" v-if="form.headerImage">
              <img :src="form.headerImage" alt="页面头图">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.headerImage = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box bg-upload" v-else @click="uploadImage('headerImage')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽750px，格式为jpg/png/gif</div>
        </el-form-item>

        <!-- 页面背景图 -->
        <el-form-item label="页面背景图:">
          <div class="upload-wrapper">
            <div class="image-preview bg-preview" v-if="form.backgroundImage">
              <img :src="form.backgroundImage" alt="页面背景图">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.backgroundImage = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box bg-upload" v-else @click="uploadImage('backgroundImage')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽750px，格式为jpg/png/gif</div>
        </el-form-item>

        <!-- 首页icon -->
        <el-form-item label="首页icon:">
          <el-radio-group v-model="form.homeSwitch">
            <el-radio :label="2">隐藏</el-radio>
            <el-radio :label="1">展示</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="首页Icon:" v-if="form.homeSwitch === 1">
          <div class="upload-wrapper">
            <div class="image-preview icon-preview" v-if="form.homeIcon">
              <img :src="form.homeIcon" alt="首页Icon">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.homeIcon = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box icon-upload" v-else @click="uploadImage('homeIcon')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽100px 高100px，格式为jpg/png/gif</div>
        </el-form-item>

        <!-- 商品区背景 -->
        <el-form-item label="商品区背景:">
          <div class="upload-wrapper">
            <div class="image-preview bg-block-preview" v-if="form.goodsBg">
              <img :src="form.goodsBg" alt="商品区背景">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.goodsBg = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box bg-block-upload" v-else @click="uploadImage('goodsBg')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽714px 高444px，格式为jpg/png/gif</div>
        </el-form-item>

        <!-- 邀请好友助力按钮 -->
        <el-form-item label="邀请好友助力按钮:">
          <div class="upload-wrapper">
            <div class="image-preview btn-preview" v-if="form.teamUpInviteBtn">
              <img :src="form.teamUpInviteBtn" alt="邀请好友助力按钮">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.teamUpInviteBtn = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box btn-upload" v-else @click="uploadImage('teamUpInviteBtn')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽100px 高100px，格式为jpg/png/gif</div>
        </el-form-item>

        <!-- 拼团成功按钮 -->
        <el-form-item label="拼团成功按钮:">
          <div class="upload-wrapper">
            <div class="image-preview btn-preview" v-if="form.teamBuySuccessBtn">
              <img :src="form.teamBuySuccessBtn" alt="拼团成功按钮">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.teamBuySuccessBtn = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box btn-upload" v-else @click="uploadImage('teamBuySuccessBtn')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽462px 高164px，格式为jpg/png/gif</div>
        </el-form-item>

        <!-- 拼团失败按钮 -->
        <el-form-item label="拼团失败按钮:">
          <div class="upload-wrapper">
            <div class="image-preview btn-preview" v-if="form.teamBuyFailBtn">
              <img :src="form.teamBuyFailBtn" alt="拼团失败按钮">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.teamBuyFailBtn = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box btn-upload" v-else @click="uploadImage('teamBuyFailBtn')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽462px 高164px，格式为jpg/png/gif</div>
        </el-form-item>

        <!-- 按钮区背景 -->
        <el-form-item label="按钮区背景:">
          <div class="upload-wrapper">
            <div class="image-preview btn-bg-preview" v-if="form.backgroundImageOfButton">
              <img :src="form.backgroundImageOfButton" alt="按钮区背景">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.backgroundImageOfButton = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box btn-bg-upload" v-else @click="uploadImage('backgroundImageOfButton')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽462px 高164px，格式为jpg/png/gif</div>
        </el-form-item>

        <!-- 活动底图 -->
        <el-form-item label="活动底图:">
          <div class="upload-wrapper">
            <div class="image-preview bg-preview" v-if="form.bottomImage">
              <img :src="form.bottomImage" alt="活动底图">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.bottomImage = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box bg-upload" v-else @click="uploadImage('bottomImage')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽750px，格式为jpg/png/gif</div>
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
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import { Plus, Delete } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import baseService from "@/service/baseService";

export default defineComponent({
  name: 'DetailConfig',
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

    const previewProducts = ref<any[]>([]);
    const loading = ref(false);

    const productAreaStyle = computed(() => {
      if (form.value.goodsBg) {
        return {
          backgroundImage: `url(${form.value.goodsBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };
      }
      return {};
    });

    const buttonAreaStyle = computed(() => {
      if (form.value.backgroundImageOfButton) {
        return {
          backgroundImage: `url(${form.value.backgroundImageOfButton})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };
      }
      return {};
    });

    const loadProducts = async () => {
      try {
        const requestUrl = `${import.meta.env.VITE_APP_API}/team/buy/detail/prize/list`;
        const params = { impId: props.impId };
        const headers = { createUserId: 4440 };

        const res: any = await baseService.get(requestUrl, params, headers);
        if (res.code === '00000') {
          previewProducts.value = res.data.data.filter((item: any) => item.prizeType === 1);
        }
      } catch (error) {
        console.error('获取商品数据失败:', error);
      }
    };

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
      loadProducts();
      loadConfig();
    });

    // 监听 impId 变化，重新加载配置
    watch(() => props.impId, (newImpId) => {
      form.value.impId = newImpId;
      loadConfig();
      loadProducts();
    });

    return {
      form,
      previewProducts,
      loading,
      productAreaStyle,
      buttonAreaStyle,
      uploadImage,
      save
    };
  }
});
</script>

<style scoped>
.detail-config {
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
  background: #e8f5e9;
  border-radius: 10px;
  overflow: auto;
  padding: 15px;
  position: relative;
  width: 375px;
  height: 667px;
}

/* 页面头图 */
.preview-header {
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 15px;
}

.preview-header img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-header-placeholder {
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-bottom: 15px;
}

.placeholder-text {
  color: #fff;
  font-size: 16px;
}

/* 商品信息卡片 */
.product-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.product-image {
  width: 70px;
  height: 70px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-placeholder {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 11px;
}

.product-info {
  flex: 1;
}

.product-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
  font-weight: 500;
}

.product-time {
  font-size: 11px;
  color: #999;
  margin-bottom: 6px;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 5px;
}

.price-label {
  font-size: 12px;
  color: #666;
}

.group-price {
  color: #f56c6c;
  font-size: 16px;
  font-weight: bold;
}

.original-price {
  color: #999;
  font-size: 11px;
  text-decoration: line-through;
}

.product-count {
  font-size: 14px;
  color: #666;
  padding: 0 10px;
}

/* 邀好友助力区域 */
.help-section {
  background: rgba(255, 245, 240, 0.95);
  border-radius: 8px;
  padding: 20px 15px;
  text-align: center;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.help-btn {
  width: 100px;
  height: 100px;
  margin: 0 auto 12px;
}

.help-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.help-btn-default {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: #fff;
  padding: 12px 40px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.help-text {
  color: #f56c6c;
  font-size: 14px;
  margin-bottom: 12px;
}

.countdown {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.countdown-num {
  background: #333;
  color: #fff;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 12px;
  min-width: 20px;
  text-align: center;
}

/* 拼团详情 */
.group-detail {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.group-detail-title {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
  color: #333;
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.member-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 13px;
  color: #333;
  margin-bottom: 4px;
}

.member-time {
  font-size: 11px;
  color: #999;
}

.member-phone {
  font-size: 13px;
  color: #666;
  margin-right: 10px;
}

.member-role {
  font-size: 13px;
  color: #666;
}

.leader-role {
  color: #f56c6c;
}

/* 首页icon */
.home-icon {
  position: absolute;
  bottom: 80px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.home-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 定位图标 */
.location-icon {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.location-marker {
  width: 40px;
  height: 40px;
  background: #f56c6c;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  position: relative;
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.4);
}

.location-marker::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.form-section {
  width: 340px;
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  overflow-y: auto;
  max-height: calc(100vh - 40px);
}

/* 图片列表布局 */
.upload-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-start;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-preview-item {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-preview.bg-preview {
  width: 80px;
  height: 80px;
}

.image-preview.icon-preview {
  width: 60px;
  height: 60px;
}

.image-preview.btn-preview {
  width: 100px;
  height: 36px;
}

.image-preview.bg-block-preview {
  width: 100px;
  height: 62px;
}

.image-preview.btn-bg-preview {
  width: 100px;
  height: 36px;
}

.image-actions {
  position: absolute;
  top: 2px;
  right: 2px;
}

.upload-box {
  width: 80px;
  height: 80px;
  border: 2px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s;
  flex-shrink: 0;
}

.upload-box:hover {
  border-color: #409eff;
}

.upload-box .el-icon {
  font-size: 20px;
  color: #8c939d;
}

.upload-box.bg-upload {
  width: 80px;
  height: 80px;
}

.upload-box.icon-upload {
  width: 60px;
  height: 60px;
}

.upload-box.icon-upload .el-icon {
  font-size: 16px;
}

.upload-box.btn-upload {
  width: 100px;
  height: 36px;
}

.upload-box.btn-upload .el-icon {
  font-size: 16px;
}

.upload-box.bg-block-upload {
  width: 100px;
  height: 62px;
}

.upload-box.btn-bg-upload {
  width: 100px;
  height: 36px;
}

.upload-tip {
  margin-top: 8px;
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
}
</style>
