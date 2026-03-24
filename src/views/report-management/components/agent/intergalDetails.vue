<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      v-loading="loading"
      key="11"
    >
      <el-table-column  type="index" label="序号" width="70px"></el-table-column>
      <el-table-column prop="orgLevel1" label="省级机构"></el-table-column>
      <el-table-column prop="orgLevel2" label="市级机构"></el-table-column>
      <el-table-column prop="orgLevel3" label="县级机构"></el-table-column>
      <el-table-column prop="salesmanName" label="业务员姓名"></el-table-column>
      <el-table-column prop="salesmanCode" label="业务员工号"></el-table-column>
      <el-table-column prop="userType" label="身份"></el-table-column>
      <el-table-column prop="availableBalance" label="剩余可用积分"></el-table-column>
      <el-table-column prop="identityName" label="积分挡位"></el-table-column>       
    </el-table>
     <!-- 分页 -->
    <el-pagination
      class="pagination"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />    
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  tableData: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number,
    default: 0
  }
});
const emit = defineEmits(['page-change']);

const currentPage = ref(1);
const pageSize = ref(10);

// 分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val;
  emitPageChange();
};

// 当前页变化
const handleCurrentChange = (val) => {
  currentPage.value = val;
  emitPageChange();
};

// 触发分页变化事件
const emitPageChange = () => {
  emit('page-change', {
    page: currentPage.value,
    pageSize: pageSize.value
  });
};
</script>

<style scoped>
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>