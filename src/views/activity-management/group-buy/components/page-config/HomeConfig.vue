<template>
  <div class="home-config">
    <div class="preview-section">
      <div class="preview-content">
        <!-- 页面头图 -->
        <div class="preview-header" v-if="form.headerImage">
          <img :src="form.headerImage" alt="页面头图">
          <!-- 右上角图标 -->
          <div class="header-icons">
            <div class="header-icon" v-if="form.myTeamIcon">
              <img :src="form.myTeamIcon" alt="我的拼团">
            </div>
            <div class="header-icon" v-if="form.myPrizeIcon">
              <img :src="form.myPrizeIcon" alt="我的奖品">
            </div>
          </div>
        </div>
        <div class="preview-header-placeholder" v-else>
          <div class="placeholder-text">页面头图</div>
        </div>

        <!-- 商品列表 -->
        <div class="preview-products" :style="productAreaStyle">
          <div class="product-card" v-for="(product, index) in previewProducts" :key="index">
            <div class="product-image">
              <img :src="product.thumb" v-if="product.thumb">
              <div class="product-placeholder" v-else>商品图</div>
            </div>
            <div class="product-info">
              <div class="product-title">{{ product.name || '商品标题' }}</div>
              <div class="product-price">
                <span class="group-label">成团价</span>
                <span class="group-price">¥{{ product.teamPrice || '0.00' }}</span>
                <span class="original-price">¥{{ product.price || '0.00' }}</span>
              </div>
            </div>
            <div class="product-btn" v-if="form.teamUpNowBtn">
              <img :src="form.teamUpNowBtn" alt="我要开团">
            </div>
            <div class="product-btn-default" v-else>我要开团</div>
          </div>
        </div>

        <!-- 进行中拼团 -->
        <div class="preview-group" :style="groupAreaStyle">
          <div class="group-title-bar" v-if="form.inTeamGoodsBg">
            <img :src="form.inTeamGoodsBg" alt="进行中">
          </div>
          <div class="group-title" v-else>进行中</div>
          <div class="group-card">
            <div class="group-image">
              <img :src="previewProducts[0]?.thumb" v-if="previewProducts[0]?.thumb">
              <div class="group-placeholder" v-else>商品图</div>
            </div>
            <div class="group-info">
              <div class="group-product-title">{{ previewProducts[0]?.name || '商品标题' }}</div>
              <div class="group-price">
                <span class="group-label">成团价</span>
                <span class="group-price-text">¥{{ previewProducts[0]?.teamPrice || '0.00' }}</span>
                <span class="group-original-price">¥0.00</span>
              </div>
              <div class="countdown">
                <span class="countdown-num">0</span>天
                <span class="countdown-num">00</span>:
                <span class="countdown-num">00</span>:
                <span class="countdown-num">00</span>后失效
              </div>
            </div>
            <div class="group-btn" v-if="form.teamUpContinueInviteBtn">
              <img :src="form.teamUpContinueInviteBtn" alt="邀请好友">
            </div>
            <div class="group-btn-default" v-else>邀请好友</div>
          </div>
        </div>
      </div>
    </div>

    <div class="form-section">
      <el-form :model="form" label-width="120px" v-loading="loading">
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

        <!-- 跑马灯 -->
        <el-form-item label="跑马灯:">
          <el-radio-group v-model="form.tickerSwitch">
            <el-radio :label="2">隐藏</el-radio>
            <el-radio :label="1">展示</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 活动规则 -->
        <el-form-item label="活动规则:">
          <el-radio-group v-model="form.remarkSwitch">
            <el-radio :label="2">隐藏</el-radio>
            <el-radio :label="1">展示</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 我的拼团icon -->
        <el-form-item label="我的拼团icon:">
          <div class="upload-wrapper">
            <div class="image-preview icon-preview" v-if="form.myTeamIcon">
              <img :src="form.myTeamIcon" alt="我的拼团icon">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.myTeamIcon = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box icon-upload" v-else @click="uploadImage('myTeamIcon')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽100px 高100px，格式为jpg/png/gif</div>
        </el-form-item>

        <!-- 我的奖品icon -->
        <el-form-item label="我的奖品icon:">
          <div class="upload-wrapper">
            <div class="image-preview icon-preview" v-if="form.myPrizeIcon">
              <img :src="form.myPrizeIcon" alt="我的奖品icon">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.myPrizeIcon = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box icon-upload" v-else @click="uploadImage('myPrizeIcon')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽100px 高100px，格式为jpg/png/gif</div>
        </el-form-item>

        <!-- 我要开团按钮 -->
        <el-form-item label="我要开团按钮:">
          <div class="upload-wrapper">
            <div class="image-preview btn-preview" v-if="form.teamUpNowBtn">
              <img :src="form.teamUpNowBtn" alt="我要开团按钮">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.teamUpNowBtn = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box btn-upload" v-else @click="uploadImage('teamUpNowBtn')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽462px 高164px，格式为jpg/png/gif</div>
        </el-form-item>

        <!-- 继续邀请按钮 -->
        <el-form-item label="继续邀请按钮:">
          <div class="upload-wrapper">
            <div class="image-preview btn-preview" v-if="form.teamUpContinueInviteBtn">
              <img :src="form.teamUpContinueInviteBtn" alt="继续邀请按钮">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.teamUpContinueInviteBtn = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box btn-upload" v-else @click="uploadImage('teamUpContinueInviteBtn')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽462px 高164px，格式为jpg/png/gif</div>
        </el-form-item>

        <!-- 未开团商品区背景块 -->
        <el-form-item label="未开团商品区背景块:">
          <div class="upload-wrapper">
            <div class="image-preview bg-block-preview" v-if="form.noTeamGoodsBg">
              <img :src="form.noTeamGoodsBg" alt="未开团商品区背景块">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.noTeamGoodsBg = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box bg-block-upload" v-else @click="uploadImage('noTeamGoodsBg')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽714px 高444px，格式为jpg/png/gif</div>
        </el-form-item>

        <!-- 进行中商品区背景块 -->
        <el-form-item label="进行中商品区背景块:">
          <div class="upload-wrapper">
            <div class="image-preview bg-block-preview" v-if="form.inTeamGoodsBg">
              <img :src="form.inTeamGoodsBg" alt="进行中商品区背景块">
              <div class="image-actions">
                <el-button type="danger" size="small" circle @click="form.inTeamGoodsBg = ''">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="upload-box bg-block-upload" v-else @click="uploadImage('inTeamGoodsBg')">
              <el-icon><Plus /></el-icon>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽714px 高444px，格式为jpg/png/gif</div>
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
  name: 'HomeConfig',
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
      tickerSwitch: 1,
      remarkSwitch: 1,
      remarkIcon: '',
      remarkPopUp: '',
      myPrizeIcon: '',
      myTeamIcon: '',
      teamUpNowBtn: '',
      teamUpInviteSwitch: 1,
      teamUpInviteBtn: '',
      teamUpContinueInviteBtn: '',
      noTeamGoodsBg: '',
      inTeamGoodsBg: '',
      bottomImage: '',
      backgroundImageOfButton: '',
      teamUpPopUp: null as string | null,
      teamUpFuCardsPopUp: null as string | null,
      teamUpSuccessBtn: null as string | null,
      teamUpSuccessPopUpBtn: null as string | null,
      errorBackgroundImage: null as string | null,
      teamUpBtn: null as string | null,
      shareContent: null as string | null,
      teamUpLogIcon: null as string | null,
      teamUpFuCardsPopUpBtn: null as string | null,
      teamUpSuccessPopUp: null as string | null,
      teamUpRepeatBtn: null as string | null,
      agentInfoBackground: null as string | null,
      luckyOrderShowBtn: null as string | null,
      agentContactSwitch: 0,
      shareBackgroundImage: null as string | null,
      agentCodeSwitch: 0,
      teamUpFuCardsNowBtn: null as string | null,
      shareDesc: null as string | null
    });

    const previewProducts = ref<any[]>([]);
    const loading = ref(false);

    const productAreaStyle = computed(() => {
      if (form.value.noTeamGoodsBg) {
        return {
          backgroundImage: `url(${form.value.noTeamGoodsBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };
      }
      return {};
    });

    const groupAreaStyle = computed(() => {
      if (form.value.inTeamGoodsBg) {
        return {
          backgroundImage: `url(${form.value.inTeamGoodsBg})`,
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

    const loadConfig = async () => {
      try {
        loading.value = true;
        const requestUrl = `${import.meta.env.VITE_APP_API}/team/up/h5/info`;
        const params = { impId: props.impId };
        const res: any = await baseService.get(requestUrl, params);
        if (res.code === '00000' && res.data) {
          const data = res.data;
          form.value.id = data.id || null;
          form.value.headerImage = data.headerImage || '';
          form.value.backgroundImage = data.backgroundImage || '';
          form.value.tickerSwitch = data.tickerSwitch ?? 1;
          form.value.remarkSwitch = data.remarkSwitch ?? 1;
          form.value.remarkIcon = data.remarkIcon || '';
          form.value.remarkPopUp = data.remarkPopUp || '';
          form.value.myPrizeIcon = data.myPrizeIcon || '';
          form.value.myTeamIcon = data.myTeamIcon || '';
          form.value.teamUpNowBtn = data.teamUpNowBtn || '';
          form.value.teamUpInviteSwitch = data.teamUpInviteSwitch ?? 1;
          form.value.teamUpInviteBtn = data.teamUpInviteBtn || '';
          form.value.teamUpContinueInviteBtn = data.teamUpContinueInviteBtn || '';
          form.value.noTeamGoodsBg = data.noTeamGoodsBg || '';
          form.value.inTeamGoodsBg = data.inTeamGoodsBg || '';
          form.value.bottomImage = data.bottomImage || '';
          form.value.backgroundImageOfButton = data.backgroundImageOfButton || '';
          form.value.teamUpPopUp = data.teamUpPopUp || null;
          form.value.teamUpFuCardsPopUp = data.teamUpFuCardsPopUp || null;
          form.value.teamUpSuccessBtn = data.teamUpSuccessBtn || null;
          form.value.teamUpSuccessPopUpBtn = data.teamUpSuccessPopUpBtn || null;
          form.value.errorBackgroundImage = data.errorBackgroundImage || null;
          form.value.teamUpBtn = data.teamUpBtn || null;
          form.value.shareContent = data.shareContent || null;
          form.value.teamUpLogIcon = data.teamUpLogIcon || null;
          form.value.teamUpFuCardsPopUpBtn = data.teamUpFuCardsPopUpBtn || null;
          form.value.teamUpSuccessPopUp = data.teamUpSuccessPopUp || null;
          form.value.teamUpRepeatBtn = data.teamUpRepeatBtn || null;
          form.value.agentInfoBackground = data.agentInfoBackground || null;
          form.value.luckyOrderShowBtn = data.luckyOrderShowBtn || null;
          form.value.agentContactSwitch = data.agentContactSwitch ?? 0;
          form.value.shareBackgroundImage = data.shareBackgroundImage || null;
          form.value.agentCodeSwitch = data.agentCodeSwitch ?? 0;
          form.value.teamUpFuCardsNowBtn = data.teamUpFuCardsNowBtn || null;
          form.value.shareDesc = data.shareDesc || null;
        }
      } catch (error) {
        console.error('获取配置数据失败:', error);
      } finally {
        loading.value = false;
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

    const save = async () => {
      try {
        loading.value = true;
        const requestUrl = `${import.meta.env.VITE_APP_API}/team/buy/h5/add`;
        const params = {
          impId: form.value.impId,
          headerImage: form.value.headerImage,
          backgroundImage: form.value.backgroundImage,
          tickerSwitch: form.value.tickerSwitch,
          remarkSwitch: form.value.remarkSwitch,
          remarkIcon: form.value.remarkIcon,
          remarkPopUp: form.value.remarkPopUp,
          myPrizeIcon: form.value.myPrizeIcon,
          myTeamIcon: form.value.myTeamIcon,
          teamUpNowBtn: form.value.teamUpNowBtn,
          teamUpInviteSwitch: form.value.teamUpInviteSwitch,
          teamUpInviteBtn: form.value.teamUpInviteBtn,
          teamUpContinueInviteBtn: form.value.teamUpContinueInviteBtn,
          noTeamGoodsBg: form.value.noTeamGoodsBg,
          inTeamGoodsBg: form.value.inTeamGoodsBg,
          bottomImage: form.value.bottomImage,
          backgroundImageOfButton: form.value.backgroundImageOfButton,
          id: form.value.id,
          teamUpPopUp: form.value.teamUpPopUp,
          teamUpFuCardsPopUp: form.value.teamUpFuCardsPopUp,
          teamUpSuccessBtn: form.value.teamUpSuccessBtn,
          teamUpSuccessPopUpBtn: form.value.teamUpSuccessPopUpBtn,
          errorBackgroundImage: form.value.errorBackgroundImage,
          teamUpBtn: form.value.teamUpBtn,
          shareContent: form.value.shareContent,
          teamUpLogIcon: form.value.teamUpLogIcon,
          teamUpFuCardsPopUpBtn: form.value.teamUpFuCardsPopUpBtn,
          teamUpSuccessPopUp: form.value.teamUpSuccessPopUp,
          teamUpRepeatBtn: form.value.teamUpRepeatBtn,
          agentInfoBackground: form.value.agentInfoBackground,
          luckyOrderShowBtn: form.value.luckyOrderShowBtn,
          agentContactSwitch: form.value.agentContactSwitch,
          shareBackgroundImage: form.value.shareBackgroundImage,
          agentCodeSwitch: form.value.agentCodeSwitch,
          teamUpFuCardsNowBtn: form.value.teamUpFuCardsNowBtn,
          shareDesc: form.value.shareDesc
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
      groupAreaStyle,
      uploadImage,
      save
    };
  }
});
</script>

<style scoped>
.home-config {
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
  position: relative;
  width: 375px;
  height: 667px;
}

.preview-header {
  width: 100%;
  height: 180px;
  overflow: hidden;
  position: relative;
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
}

.placeholder-text {
  color: #fff;
  font-size: 16px;
}

.header-icons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.header-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-products {
  padding: 10px;
}

.product-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
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
  font-size: 13px;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 5px;
}

.group-label {
  font-size: 11px;
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

.product-btn {
  width: 70px;
  height: 30px;
  flex-shrink: 0;
}

.product-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-btn-default {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: #fff;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 11px;
  white-space: nowrap;
  flex-shrink: 0;
}

.preview-group {
  padding: 0 10px 10px;
}

.group-title-bar {
  text-align: center;
  margin-bottom: 0;
}

.group-title-bar img {
  height: 30px;
  object-fit: contain;
}

.group-title {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: #fff;
  text-align: center;
  padding: 8px;
  border-radius: 8px 8px 0 0;
  font-size: 14px;
  font-weight: bold;
}

.group-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0 0 8px 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.group-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.group-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.group-placeholder {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 11px;
}

.group-info {
  flex: 1;
}

.group-product-title {
  font-size: 12px;
  color: #333;
  margin-bottom: 5px;
  line-height: 1.3;
}

.group-price {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 5px;
}

.group-price-text {
  color: #f56c6c;
  font-size: 14px;
  font-weight: bold;
}

.group-original-price {
  color: #999;
  font-size: 11px;
  text-decoration: line-through;
}

.countdown {
  font-size: 11px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 3px;
}

.countdown-num {
  background: #333;
  color: #fff;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 10px;
  min-width: 16px;
  text-align: center;
}

.group-btn {
  width: 60px;
  height: 28px;
  flex-shrink: 0;
}

.group-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.group-btn-default {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: #fff;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 10px;
  white-space: nowrap;
  flex-shrink: 0;
}

.form-section {
  width: 320px;
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

.bg-preview {
  width: 120px;
  height: 120px;
}

.icon-preview {
  width: 80px;
  height: 80px;
}

.btn-preview {
  width: 120px;
  height: 50px;
}

.bg-block-preview {
  width: 120px;
  height: 80px;
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

.bg-upload {
  width: 120px;
  height: 120px;
}

.icon-upload {
  width: 80px;
  height: 80px;
}

.btn-upload {
  width: 120px;
  height: 50px;
}

.bg-block-upload {
  width: 120px;
  height: 80px;
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
