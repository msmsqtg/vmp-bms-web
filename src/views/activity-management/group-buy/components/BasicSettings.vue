<template>
  <div class="basic-settings">
    <h3>基本信息设置</h3>
    <el-form :model="localForm" label-width="120px">
      <el-form-item label="活动标题" required>
        <el-input v-model="localForm.title" placeholder="请输入活动标题" maxlength="50" :disabled="isViewMode" @input="handleFormChange"></el-input>
      </el-form-item>
      <el-form-item label="活动名称" required>
        <el-input v-model="localForm.name" placeholder="请输入活动名称" maxlength="50" :disabled="isViewMode" @input="handleFormChange"></el-input>
      </el-form-item>
      <el-form-item label="活动时间" required>
        <el-date-picker
          v-model="localActivityTimeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
          @change="handleTimeChange"
          :disabled="isViewMode"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="活动规则" required>
        <div v-if="isViewMode" class="rich-text-view">
          <div v-html="localForm.remark"></div>
        </div>
        <div v-else class="editor-container">
          <wang-editor
            v-model="safeRemark"
            :default-content="safeRemark"
            @change="handleFormChange"
          />
        </div>
      </el-form-item>
      <el-form-item label="活动载体">
        <el-radio-group v-model="localForm.style" :disabled="isViewMode" @change="handleFormChange">
          <el-radio label="1">小程序</el-radio>
          <el-radio label="2">H5</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="AppId" required>
        <el-input v-model="localForm.key" placeholder="请输入APPID" disabled></el-input>
      </el-form-item>
      <el-form-item label="AppSecret" required>
        <el-input v-model="localForm.secret" placeholder="请输入APPSECRET" disabled></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, computed } from 'vue';
import WangEditor from '@/components/wang-editor/index.vue';

export default defineComponent({
  components: {
    WangEditor
  },
  name: "BasicSettings",
  props: {
    form: {
      type: Object,
      required: true
    },
    activityTimeRange: {
      type: Array as PropType<string[]>,
      required: true
    },
    isViewMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:form', 'update:activityTimeRange'],
  setup(props, { emit }) {
    const localForm = ref({ ...props.form });
    const localActivityTimeRange = ref(props.activityTimeRange);

    // 监听外部 form 变化
    watch(
      () => props.form,
      (newForm) => {
        localForm.value = { ...newForm };
      },
      { deep: true }
    );

    // 监听外部 activityTimeRange 变化
    watch(
      () => props.activityTimeRange,
      (newRange) => {
        localActivityTimeRange.value = newRange;
      },
      { deep: true }
    );

    // 确保 remark 是字符串类型
    const safeRemark = computed({
      get: () => {
        const remark = localForm.value.remark;
        return typeof remark === 'string' ? remark : '';
      },
      set: (value) => {
        localForm.value.remark = value;
        handleFormChange();
      }
    });

    const handleTimeChange = (value: any) => {
      localActivityTimeRange.value = value;
      emit('update:activityTimeRange', value);
      if (value && value.length === 2) {
        localForm.value.startTime = value[0];
        localForm.value.endTime = value[1];
        emit('update:form', { ...localForm.value });
      }
    };

    const handleFormChange = () => {
      emit('update:form', { ...localForm.value });
    };

    return {
      localForm,
      localActivityTimeRange,
      safeRemark,
      handleTimeChange,
      handleFormChange
    };
  }
});
</script>

<style scoped>
.basic-settings {
  padding: 20px 0;
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