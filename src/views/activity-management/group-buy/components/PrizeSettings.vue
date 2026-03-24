<template>
  <div class="prize-settings">
    <h3>助力奖品设置</h3>
    
    <!-- 商品操作按钮 -->
    <div class="product-actions" v-if="!isViewMode">
      <el-button type="primary" @click="addPrize" :disabled="isViewMode">添加奖品</el-button>
      <el-button type="danger" @click="deletePrize" :disabled="isViewMode">删除奖品</el-button>
    </div>

    <!-- 商品 tab 导航 -->
    <div v-if="localForm.length > 1" class="product-tabs">
      <el-tabs v-model="activePrizeIndex" @tab-click="handleTabClick">
        <el-tab-pane v-for="(prize, index) in localForm" :key="index" :label="prize.name || `奖品${index + 1}`" :name="index.toString()"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 商品表单 -->
    <div v-if="localForm.length > 0" class="product-item">
      <h4>{{ currentPrize.name || `奖品${parseInt(activePrizeIndex) + 1}` }}</h4>
      <el-form :model="currentPrize" label-width="180px">
        <el-form-item label="助力成功是否发放奖品" required>
          <el-radio-group v-model="currentPrize.enable" :disabled="isViewMode" @change="handleFormChange">
            <el-radio label="yes">是</el-radio>
            <el-radio label="no">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品名称" required>
          <el-input v-model="currentPrize.name" placeholder="请输入商品名称" :disabled="isViewMode" @input="handleFormChange"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" required>
          <el-input v-model="currentPrize.price" placeholder="请输入商品价格" :disabled="isViewMode" @input="handleFormChange">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品库存" required>
          <el-input v-model="currentPrize.stock" placeholder="请输入商品库存" :disabled="isViewMode" @input="handleFormChange"></el-input>
        </el-form-item>
        <el-form-item label="商品缩略图" required>
          <div class="upload-container">
            <div class="upload-row">
              <!-- 图片展示 -->
              <div v-if="currentPrize.thumb" class="image-preview">
                <img :src="currentPrize.thumb.trim()" alt="商品缩略图" class="preview-image">
              </div>
              <!-- 上传占位符 -->
              <div v-else class="upload-placeholder">
                <div class="placeholder-icon">!</div>
              </div>
              <!-- 上传按钮，仅在非查看模式且没有缩略图时显示 -->
              <div v-if="!isViewMode && !currentPrize.thumb" class="upload-button">
                <el-button type="primary" plain :disabled="isViewMode" @click="uploadImage('thumb')">+</el-button>
              </div>
            </div>
            <div class="upload-tip">建议尺寸：宽750px 高750px，格式为jpg/png/gif</div>
          </div>
        </el-form-item>
        <el-form-item label="商品详情图" required>
          <div class="upload-container">
            <div class="upload-row">
              <!-- 图片展示 -->
              <div v-if="currentPrize.descrImage" class="image-preview-list">
                <div v-for="(image, index) in currentPrize.descrImage.split(',')" :key="index" class="image-preview-item">
                  <img :src="image.trim()" alt="商品详情图" class="preview-image">
                </div>
              </div>
              <!-- 上传占位符 -->
              <div v-else class="upload-placeholder">
                <div class="placeholder-icon">!</div>
              </div>
              <!-- 上传按钮，仅在非查看模式且详情图数量小于5张时显示 -->
              <div v-if="!isViewMode && (!currentPrize.descrImage || currentPrize.descrImage.split(',').length < 5)" class="upload-button">
                <el-button type="primary" plain :disabled="isViewMode" @click="uploadImage('descrImage')">+</el-button>
              </div>
            </div>
            <div class="upload-tip">建议尺寸：宽750px 高750px，格式为jpg/png/gif</div>
          </div>
        </el-form-item>
        <el-form-item label="商品详情" required>
          <div v-if="isViewMode" class="rich-text-view">
            <div v-html="currentPrize.detail"></div>
          </div>
          <div v-else class="editor-container">
            <wang-editor
              v-model="safeDetail"
              :default-content="safeDetail"
              @change="handleFormChange"
            />
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, computed } from 'vue';
import WangEditor from '@/components/wang-editor/index.vue';

export default defineComponent({
  components: {
    WangEditor
  },
  name: "PrizeSettings",
  props: {
    form: {
      type: Array as PropType<any[]>,
      required: true
    },
    isViewMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:form'],
  setup(props, { emit }) {
    const localForm = ref([...props.form]);
    const activePrizeIndex = ref('0'); // 默认展示第一个奖品

    // 监听外部 form 变化
    watch(
      () => props.form,
      (newForm) => {
        localForm.value = [...newForm];
        console.log('助力奖品设置页 - 奖品数组：', localForm.value);
        console.log('助力奖品设置页 - 奖品数量：', localForm.value.length);
      },
      { deep: true }
    );

    // 监听 localForm 长度变化，确保 activePrizeIndex 始终指向有效的奖品索引
    watch(
      () => localForm.value.length,
      (newLength) => {
        if (newLength > 0) {
          const currentIndex = parseInt(activePrizeIndex.value);
          if (currentIndex >= newLength) {
            activePrizeIndex.value = (newLength - 1).toString();
          }
        }
      }
    );

    // 计算当前选中的奖品
    const currentPrize = computed(() => {
      const index = parseInt(activePrizeIndex.value);
      return localForm.value[index] || {};
    });

    // 确保 detail 是字符串类型
    const safeDetail = computed({
      get: () => {
        const detail = currentPrize.value.detail;
        return typeof detail === 'string' ? detail : '';
      },
      set: (value) => {
        const index = parseInt(activePrizeIndex.value);
        localForm.value[index].detail = value;
        handleFormChange();
      }
    });

    // 初始打印奖品数组
    console.log('助力奖品设置页 - 初始奖品数组：', localForm.value);
    console.log('助力奖品设置页 - 初始奖品数量：', localForm.value.length);

    // 手动触发数据更新
    const handleFormChange = () => {
      emit('update:form', [...localForm.value]);
    };

    // 图片上传
    const uploadImage = (type: 'thumb' | 'descrImage') => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          const file = target.files[0];
          const formData = new FormData();
          formData.append('file', file);

          try {
            // 导入 baseService
            const { default: baseService } = await import('@/service/baseService');
            const res: any = await baseService.post('/common/upload/image', formData);
            
            if (res.code === '00000' && res.data && res.data.url) {
              const index = parseInt(activePrizeIndex.value);
              if (type === 'thumb') {
                localForm.value[index].thumb = res.data.url;
              } else {
                // 处理详情图，多个图片用逗号分隔
                const currentImages = localForm.value[index].descrImage || '';
                const imagesArray = currentImages ? currentImages.split(',') : [];
                imagesArray.push(res.data.url);
                localForm.value[index].descrImage = imagesArray.join(',');
              }
              handleFormChange();
            } else {
              alert('图片上传失败，请重试');
            }
          } catch (error) {
            console.error('图片上传失败:', error);
            alert('图片上传失败，请重试');
          }
        }
      };
      input.click();
    };

    const addPrize = () => {
      const newPrize = {
        id: undefined,
        enable: 'yes',
        name: '',
        price: '',
        stock: '',
        detail: '',
        descrImage: '',
        thumb: ''
      };
      localForm.value.push(newPrize);
      // 切换到新添加的奖品
      activePrizeIndex.value = (localForm.value.length - 1).toString();
      handleFormChange();
    };

    const deletePrize = () => {
      if (localForm.value.length > 1) {
        const currentIndex = parseInt(activePrizeIndex.value);
        localForm.value.splice(currentIndex, 1);
        // 如果删除的是当前选中的奖品，切换到前一个奖品
        if (currentIndex >= localForm.value.length) {
          activePrizeIndex.value = (localForm.value.length - 1).toString();
        }
        handleFormChange();
      }
    };

    const handleTabClick = () => {
      // 切换 tab 时不需要触发数据更新
    };

    return {
      localForm,
      activePrizeIndex,
      currentPrize,
      safeDetail,
      addPrize,
      deletePrize,
      handleFormChange,
      handleTabClick,
      uploadImage
    };
  }
});
</script>

<style scoped>
.prize-settings {
  padding: 20px 0;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: wrap;
}

.upload-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.upload-placeholder {
  width: 150px;
  height: 150px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  margin-right: 10px;
}

.placeholder-icon {
  font-size: 48px;
  color: #409eff;
  font-weight: bold;
}

.upload-button {
  margin-right: 10px;
}

.upload-tip {
  color: #909399;
  font-size: 12px;
}

.image-preview {
  margin-right: 10px;
}

.preview-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.image-preview-list {
  display: flex;
  flex-wrap: wrap;
  margin-right: 10px;
}

.image-preview-item {
  margin: 0 10px 10px 0;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.image-item {
  margin: 10px 10px 0 0;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 5px;
}

.image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
.editor-container {
  min-height: 300px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.rich-text-view {
  min-height: 300px;
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #f5f7fa;
  overflow-y: auto;
}
</style>