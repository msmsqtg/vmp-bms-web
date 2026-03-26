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
        <el-radio-group v-model="localForm.rules.up.nendInfo" :disabled="isViewMode" @change="handleFormChange">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="表单提交文案" required>
        <el-input
          v-model="localForm.rules.up.title"
          placeholder="请填写相关信息以完成开团"
          :disabled="isViewMode"
          @input="handleFormChange"
        ></el-input>
      </el-form-item>
      <el-form-item label="表单说明文案">
        <el-input
          v-model="localForm.rules.up.content"
          placeholder="请如实填写信息，以便我们及时与您联系"
          :disabled="isViewMode"
          @input="handleFormChange"
        ></el-input>
      </el-form-item>
      <el-form-item label="表单项配置">
        <el-table :data="localForm.rules.up.formData" style="width: 100%">
          <el-table-column prop="selected" label="选择" width="100">
            <template #default="scope">
              <el-checkbox :model-value="scope.row.selected === 1" :disabled="isViewMode" @change="(val: boolean) => { scope.row.selected = val ? 1 : 0; handleFormChange(); }"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="表单类型">
            <template #default="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题文案">
            <template #default="scope">
              <el-input v-model="scope.row.title" :disabled="isViewMode" @input="handleFormChange"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="check" label="是否必填" width="100">
            <template #default="scope">
              <el-checkbox :model-value="scope.row.check === 1" :disabled="isViewMode" @change="(val: boolean) => { scope.row.check = val ? 1 : 0; handleFormChange(); }"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="助力用户是否需要提交资料">
        <el-radio-group v-model="localForm.rules.help.nendInfo" :disabled="isViewMode" @change="handleFormChange">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="助力表单提交文案" required>
        <el-input
          v-model="localForm.rules.help.title"
          placeholder="请填写相关信息以完成助力"
          :disabled="isViewMode"
          @input="handleFormChange"
        ></el-input>
      </el-form-item>
      <el-form-item label="助力表单说明文案">
        <el-input
          v-model="localForm.rules.help.content"
          placeholder="请如实填写信息，以便我们及时与您联系"
          :disabled="isViewMode"
          @input="handleFormChange"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否校验姓名" required>
        <el-radio-group v-model="localForm.rules.help.checkName" :disabled="isViewMode" @change="handleFormChange">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="助力表单顶项配置">
        <el-table :data="localForm.rules.help.formData" style="width: 100%">
          <el-table-column prop="selected" label="选择" width="100">
            <template #default="scope">
              <el-checkbox :model-value="scope.row.selected === 1" :disabled="isViewMode" @change="(val: boolean) => { scope.row.selected = val ? 1 : 0; handleFormChange(); }"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="表单类型">
            <template #default="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题文案">
            <template #default="scope">
              <el-input v-model="scope.row.title" :disabled="isViewMode" @input="handleFormChange"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="check" label="是否必填" width="100">
            <template #default="scope">
              <el-checkbox :model-value="scope.row.check === 1" :disabled="isViewMode" @change="(val: boolean) => { scope.row.check = val ? 1 : 0; handleFormChange(); }"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

// 定义表单项类型
interface FormItem {
  name: string;
  type: string;
  title: string;
  input_name: string;
  selected: number;
  check: number;
}

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
    // 初始化表单数据，确保rules对象存在
    const initForm = () => {
      // 创建深拷贝，避免修改props
      const form = JSON.parse(JSON.stringify(props.form));
      // 确保rules对象存在
      if (!form.rules) {
        form.rules = {
          up: {
            nendInfo: 1,
            title: "请填写相关信息以完成开团",
            content: "请如实填写信息，以便我们及时与您联系",
            formData: []
          },
          help: {
            nendInfo: 1,
            title: "请填写相关信息以完成助力",
            content: "请如实填写信息，以便我们及时与您联系",
            formData: [],
            checkName: 2
          }
        };
      }
      // 确保up和help对象存在
      if (!form.rules.up) {
        form.rules.up = {
          nendInfo: 1,
          title: "请填写相关信息以完成开团",
          content: "请如实填写信息，以便我们及时与您联系",
          formData: []
        };
      }
      if (!form.rules.help) {
        form.rules.help = {
          nendInfo: 1,
          title: "请填写相关信息以完成助力",
          content: "请如实填写信息，以便我们及时与您联系",
          formData: [],
          checkName: 2
        };
      }
      // 确保formData数组存在
      if (!form.rules.up.formData) {
        form.rules.up.formData = [];
      }
      if (!form.rules.help.formData) {
        form.rules.help.formData = [];
      }
      
      // 定义默认表单项
      const defaultUpFormItems = [
        { name: "姓名", type: "name", title: "姓名", input_name: "name", selected: 0, check: 0 },
        { name: "身份证后四位", type: "idcard", title: "身份证后四位", input_name: "idcard", selected: 0, check: 0 }
      ];
      const defaultHelpFormItems = [
        { name: "姓名", type: "name", title: "姓名", input_name: "name", selected: 0, check: 0 }
      ];
      
      // 合并后台返回的数据和默认表单项
      // 确保所有默认表单项都显示，根据后台的值来决定勾选状态和标题文案
      const mergedUpFormItems = [...defaultUpFormItems];
      const mergedHelpFormItems = [...defaultHelpFormItems];
      
      // 合并up表单数据
      if (form.rules.up.formData && form.rules.up.formData.length > 0) {
        form.rules.up.formData.forEach((item: any) => {
          const existingItem = mergedUpFormItems.find((defaultItem) => defaultItem.type === item.type);
          if (existingItem) {
            // 如果后台返回了相同类型的表单项，使用后台的值
            existingItem.selected = item.selected;
            existingItem.check = item.check;
            existingItem.title = item.title;
          }
        });
      }
      form.rules.up.formData = mergedUpFormItems;
      
      // 合并help表单数据
      if (form.rules.help.formData && form.rules.help.formData.length > 0) {
        form.rules.help.formData.forEach((item: any) => {
          const existingItem = mergedHelpFormItems.find((defaultItem) => defaultItem.type === item.type);
          if (existingItem) {
            // 如果后台返回了相同类型的表单项，使用后台的值
            existingItem.selected = item.selected;
            existingItem.check = item.check;
            existingItem.title = item.title;
          }
        });
      }
      form.rules.help.formData = mergedHelpFormItems;
      
      return form;
    };

    const localForm = ref(initForm());

    // 监听外部 form 变化
    watch(
      () => props.form,
      (newForm) => {
        // 只有当外部form与当前localForm不同时才更新，避免死循环
        if (JSON.stringify(newForm) !== JSON.stringify(localForm.value)) {
          localForm.value = initForm();
        }
      },
      { deep: true }
    );

    const handleFormChange = () => {
      // 直接传递当前表单数据，不进行过滤，保持所有表单项显示
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
