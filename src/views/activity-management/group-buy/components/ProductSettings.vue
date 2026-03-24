<template>
  <div class="product-settings">
    <!-- 商品操作按钮 -->
    <div class="product-actions" v-if="!isViewMode">
      <el-button type="primary" @click="addProduct" :disabled="isViewMode">添加商品</el-button>
      <el-button type="danger" @click="deleteProduct" :disabled="isViewMode">删除商品</el-button>
    </div>

    <!-- 商品 tab 导航 -->
    <div v-if="localForm.length > 1" class="product-tabs">
      <el-tabs v-model="activeProductIndex" @tab-click="handleTabClick">
        <el-tab-pane v-for="(product, index) in localForm" :key="index" :label="product.name || `商品${index + 1}`" :name="index.toString()"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 商品表单 -->
    <div v-if="localForm.length > 0" class="product-item">
      <h4>{{ currentProduct.name || `商品${parseInt(activeProductIndex) + 1}` }}</h4>
      <el-form :model="currentProduct" label-width="120px">
        <el-form-item label="商品类型">
          <el-radio-group v-model="currentProduct.type" :disabled="isViewMode" @change="handleFormChange">
            <el-radio label="physical">实物商品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品名称" required>
          <el-input v-model="currentProduct.name" placeholder="请输入商品名称" :disabled="isViewMode" @input="handleFormChange"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" required>
          <el-input v-model="currentProduct.price" placeholder="请输入商品价格" :disabled="isViewMode" @input="handleFormChange">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品库存" required>
          <el-input v-model="currentProduct.stock" placeholder="请输入商品库存" :disabled="isViewMode" @input="handleFormChange">
            <template #append>件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="拼团价格" required>
          <el-input v-model="currentProduct.groupPrice" placeholder="请输入拼团价格" :disabled="isViewMode" @input="handleFormChange">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="成团人数" required>
          <el-input v-model="currentProduct.groupSize" placeholder="请输入成团人数" :disabled="isViewMode" @input="handleFormChange">
            <template #append>人</template>
          </el-input>
        </el-form-item>
        <el-form-item label="每人限购">
          <el-radio-group v-model="currentProduct.overLimit" :disabled="isViewMode" @change="handleFormChange">
            <el-radio label="allow">允许</el-radio>
            <el-radio label="forbid">不允许</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="限购数量" required>
          <el-input v-model="currentProduct.limit" placeholder="请输入限购数量" :disabled="isViewMode" @input="handleFormChange">
            <template #append>件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品规格库存" required>
          <el-input v-model="currentProduct.specStock" placeholder="请输入规格库存" :disabled="isViewMode" @input="handleFormChange"></el-input>
        </el-form-item>
        <el-form-item label="商品缩略图" required>
          <div class="upload-container">
            <div class="upload-row">
              <!-- 图片展示 -->
              <div v-if="currentProduct.thumb" class="image-preview">
                <img :src="currentProduct.thumb.trim()" alt="商品缩略图" class="preview-image">
              </div>
              <!-- 上传占位符 -->
              <div v-else class="upload-placeholder">
                <div class="placeholder-icon">!</div>
              </div>
              <!-- 上传按钮，仅在非查看模式且没有缩略图时显示 -->
              <div v-if="!isViewMode && !currentProduct.thumb" class="upload-button">
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
              <div v-if="currentProduct.descrImage" class="image-preview-list">
                <div v-for="(image, index) in currentProduct.descrImage.split(',')" :key="index" class="image-preview-item">
                  <img :src="image.trim()" alt="商品详情图" class="preview-image">
                </div>
              </div>
              <!-- 上传占位符 -->
              <div v-else class="upload-placeholder">
                <div class="placeholder-icon">!</div>
              </div>
              <!-- 上传按钮，仅在非查看模式且详情图数量小于5张时显示 -->
              <div v-if="!isViewMode && (!currentProduct.descrImage || currentProduct.descrImage.split(',').length < 5)" class="upload-button">
                <el-button type="primary" plain :disabled="isViewMode" @click="uploadImage('descrImage')">+</el-button>
              </div>
            </div>
            <div class="upload-tip">建议尺寸：宽750px 高750px，格式为jpg/png/gif</div>
          </div>
        </el-form-item>

        <el-form-item label="商品详情" required>
          <div v-if="isViewMode" class="rich-text-view">
            <div v-html="currentProduct.detail"></div>
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
import { ElMessage } from 'element-plus';
import baseService from "@/service/baseService";

export default defineComponent({
  components: {
    WangEditor
  },
  name: "ProductSettings",
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
    const activeProductIndex = ref('0'); // 默认展示第一个商品

    // 监听外部 form 变化
    watch(
      () => props.form,
      (newForm) => {
        localForm.value = [...newForm];
        console.log('开团商品设置页 - 商品数组：', localForm.value);
        console.log('开团商品设置页 - 商品数量：', localForm.value.length);
      },
      { deep: true }
    );

    // 监听 localForm 长度变化，确保 activeProductIndex 始终指向有效的商品索引
    watch(
      () => localForm.value.length,
      (newLength) => {
        if (newLength > 0) {
          const currentIndex = parseInt(activeProductIndex.value);
          if (currentIndex >= newLength) {
            activeProductIndex.value = (newLength - 1).toString();
          }
        }
      }
    );

    // 计算当前选中的商品
    const currentProduct = computed(() => {
      const index = parseInt(activeProductIndex.value);
      return localForm.value[index] || {};
    });

    // 确保 detail 是字符串类型
    const safeDetail = computed({
      get: () => {
        const detail = currentProduct.value.detail;
        return typeof detail === 'string' ? detail : '';
      },
      set: (value) => {
        const index = parseInt(activeProductIndex.value);
        localForm.value[index].detail = value;
        handleFormChange();
      }
    });

    // 初始打印商品数组
    console.log('开团商品设置页 - 初始商品数组：', localForm.value);
    console.log('开团商品设置页 - 初始商品数量：', localForm.value.length);

    // 手动触发数据更新
    const handleFormChange = () => {
      emit('update:form', [...localForm.value]);
    };

    const addProduct = () => {
      const newProduct = {
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
      };
      localForm.value.push(newProduct);
      // 切换到新添加的商品
      activeProductIndex.value = (localForm.value.length - 1).toString();
      handleFormChange();
    };

    const deleteProduct = () => {
      if (localForm.value.length > 1) {
        const currentIndex = parseInt(activeProductIndex.value);
        localForm.value.splice(currentIndex, 1);
        // 如果删除的是当前选中的商品，切换到前一个商品
        if (currentIndex >= localForm.value.length) {
          activeProductIndex.value = (localForm.value.length - 1).toString();
        }
        handleFormChange();
      }
    };

    const handleTabClick = () => {
      // 切换 tab 时不需要触发数据更新
    };

    // 图片上传函数
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
              const index = parseInt(activeProductIndex.value);
              if (field === 'descrImage') {
                // 处理详情图，支持多张
                const existingImages = localForm.value[index].descrImage || '';
                if (existingImages) {
                  localForm.value[index].descrImage = existingImages + ',' + res.data.url;
                } else {
                  localForm.value[index].descrImage = res.data.url;
                }
              } else {
                // 处理缩略图，只支持一张
                localForm.value[index][field] = res.data.url;
              }
              handleFormChange();
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

    return {
      localForm,
      activeProductIndex,
      currentProduct,
      safeDetail,
      addProduct,
      deleteProduct,
      handleFormChange,
      handleTabClick,
      uploadImage
    };
  }
});
</script>

<style scoped>
.product-settings {
  padding: 20px 0;
}

.product-actions {
  margin-bottom: 20px;
}

.product-item {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
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
