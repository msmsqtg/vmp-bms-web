<template>
  <div class="group-settings">
    <h3>拼团规则</h3>
    <el-form :model="localForm" label-width="180px">
      <el-form-item label="拼团模式">
        <el-radio-group v-model="localForm.teamType" :disabled="isViewMode" @change="handleFormChange">
          <el-radio label="1">所有人都可开团</el-radio>
          <el-radio label="2">指定白名单可开团</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <!-- 白名单相关设置，仅当拼团模式为指定白名单可开团时显示 -->
      <div v-if="localForm.teamType === '2'">
        <el-form-item label="白名单类型">
          <el-radio-group v-model="localForm.whitelistType" :disabled="isViewMode" @change="handleFormChange">
            <el-radio label="1">姓名+身份证后四位</el-radio>
            <el-radio label="2">抽奖券码导入</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="非指定客群参与提示" required>
          <el-input
            v-model="localForm.nonDesignateCustomerMsg"
            placeholder="开团失败，您不是当前活动受邀用户！"
            maxlength="50"
            :disabled="isViewMode"
            @input="handleFormChange"
          ></el-input>
        </el-form-item>
      </div>
      
      <el-form-item label="重复开团设置">
        <el-radio-group v-model="localForm.multipleTimesSwitch" :disabled="isViewMode" @change="handleFormChange">
          <el-radio label="1">不限制</el-radio>
          <el-radio label="2">限制</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="重复开团提示" required>
        <el-input
          v-model="localForm.multipleTimesMsg"
          placeholder="开团失败，每位用户仅可成功开团一次！"
          maxlength="50"
          :disabled="isViewMode"
          @input="handleFormChange"
        ></el-input>
      </el-form-item>
      <el-form-item label="重复助力设置">
        <el-radio-group v-model="localForm.multipleHelpSwitch" :disabled="isViewMode" @change="handleFormChange">
          <el-radio label="1">不限制</el-radio>
          <el-radio label="2">限制</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="重复助力提示" required>
        <el-input
          v-model="localForm.multipleHelpMsg"
          placeholder="助力失败，每位用户仅可为除自己外一名用户助力一次！"
          maxlength="50"
          :disabled="isViewMode"
          @input="handleFormChange"
        ></el-input>
      </el-form-item>
    </el-form>

    <h3 style="margin-top: 30px;">参与规则</h3>
    <el-form :model="localForm.rules" label-width="180px">
      <el-form-item label="开团用户是否需要提交资料">
        <el-radio-group v-model="localForm.rules.needGroupInfo" :disabled="isViewMode" @change="handleFormChange">
          <el-radio label="true">是</el-radio>
          <el-radio label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="表单提交文案" required>
        <el-input
          v-model="localForm.rules.formTitle"
          placeholder="请填写相关信息以完成开团"
          :disabled="isViewMode"
          @input="handleFormChange"
        ></el-input>
      </el-form-item>
      <el-form-item label="表单说明文案">
        <el-input
          v-model="localForm.rules.formDesc"
          placeholder="请如实填写信息，以便我们及时与您联系"
          :disabled="isViewMode"
          @input="handleFormChange"
        ></el-input>
      </el-form-item>
      <el-form-item label="表单顶项配置">
        <el-table :data="localForm.rules.formItems" style="width: 100%">
          <el-table-column prop="type" label="表单类型"></el-table-column>
          <el-table-column prop="title" label="标题文案">
            <template #default="scope">
              <el-input v-model="scope.row.title" :disabled="isViewMode" @input="handleFormChange"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="required" label="是否必填" width="100">
            <template #default="scope">
              <el-checkbox v-model="scope.row.required" :disabled="isViewMode" @change="handleFormChange"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="助力用户是否需要提交资料">
        <el-radio-group v-model="localForm.rules.needHelpInfo" :disabled="isViewMode" @change="handleFormChange">
          <el-radio label="true">是</el-radio>
          <el-radio label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="助力表单提交文案" required>
        <el-input
          v-model="localForm.rules.helpFormTitle"
          placeholder="请填写相关信息以完成助力"
          :disabled="isViewMode"
          @input="handleFormChange"
        ></el-input>
      </el-form-item>
      <el-form-item label="助力表单说明文案">
        <el-input
          v-model="localForm.rules.helpFormDesc"
          placeholder="请如实填写信息，以便我们及时与您联系"
          :disabled="isViewMode"
          @input="handleFormChange"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否校验姓名" required>
        <el-radio-group v-model="localForm.rules.checkName" :disabled="isViewMode" @change="handleFormChange">
          <el-radio label="true">是</el-radio>
          <el-radio label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="助力表单顶项配置">
        <el-table :data="localForm.rules.helpFormItems" style="width: 100%">
          <el-table-column prop="type" label="表单类型"></el-table-column>
          <el-table-column prop="title" label="标题文案">
            <template #default="scope">
              <el-input v-model="scope.row.title" :disabled="isViewMode" @input="handleFormChange"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="required" label="是否必填" width="100">
            <template #default="scope">
              <el-checkbox v-model="scope.row.required" :disabled="isViewMode" @change="handleFormChange"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

export default defineComponent({
  name: "GroupSettings",
  props: {
    form: {
      type: Object,
      required: true
    },
    isViewMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:form'],
  setup(props, { emit }) {
    const localForm = ref({ ...props.form });

    // 监听外部 form 变化
    watch(
      () => props.form,
      (newForm) => {
        localForm.value = { ...newForm };
      },
      { deep: true }
    );

    const handleFormChange = () => {
      emit('update:form', { ...localForm.value });
    };

    return {
      localForm,
      handleFormChange
    };
  }
});
</script>

<style scoped>
.group-settings {
  padding: 20px 0;
}
</style>