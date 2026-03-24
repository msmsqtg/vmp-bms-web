<template>
  <div>
     <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
        key="table3"
      >
        <el-table-column
          type="index"
          label="编号"
          width="60"
          align="center"
        />
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="numericWord" label="工号"></el-table-column>
        <el-table-column prop="organizationName" label="机构名称" ></el-table-column>
        <el-table-column prop="phoneNo" label="手机号码"></el-table-column>
        <el-table-column prop="loginStatus" label="是否登录">
          <template  #default="{ row }">
            {{row.loginStatus == true ? '已登录' : '未登录'}}
          </template>
        </el-table-column>
        <el-table-column prop="shareNum" label="分享成功次数"></el-table-column>
        <el-table-column prop="invitationNum" label="邀约客户数量（开奖）"></el-table-column>
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