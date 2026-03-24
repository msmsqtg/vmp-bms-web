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
        <el-table-column prop="parentOrg" label="上级机构"></el-table-column>
        <el-table-column prop="orgName" label="支公司"></el-table-column>
        <el-table-column prop="agentName" label="业务员姓名"></el-table-column>
        <el-table-column prop="agentCode" label="业务员工号"></el-table-column>
        <el-table-column prop="orderUserName" label="领取人名称"></el-table-column>
        <el-table-column prop="userPhone" label="微信认证电话" ></el-table-column>
        <el-table-column prop="orderUserPhone" label="领取人电话"></el-table-column>
        <el-table-column prop="customerProductName" label="自定义奖项名称"></el-table-column>
        <el-table-column prop="birthday" label="生日"></el-table-column>
        <el-table-column prop="city" label="城市"></el-table-column>
        <el-table-column prop="productName" label="奖品名称"></el-table-column>
        <el-table-column prop="createTime" label="抽奖时间"></el-table-column>
        <el-table-column prop="getTime" label="领取时间"></el-table-column>
        <el-table-column prop="parentName" label="推荐人姓名"></el-table-column>
        <el-table-column prop="parentPhone" label="推荐人手机号"></el-table-column>
        <el-table-column prop="signStatus" label="签到核销状态" v-if="signSwitch==1">
          <template  #default="{ row }">
           {{row.signStatus == "0" ? '待核销' : row.signStatus == "1" ? '已核销' : row.signStatus == "3" ?'无需核销':'待核销'}}
          </template>
        </el-table-column>
        <el-table-column prop="signTime" label="签到核销时间" v-if="signSwitch==1"></el-table-column>
        <el-table-column prop="signAdminName" label="签到核销人" v-if="signSwitch==1"></el-table-column>
        <el-table-column prop="visitStatus" label="拜访状态" v-if="visitSwitch==1">
          <template  #default="{ row }">
           {{row.visitStatus == "1" ? '已拜访':'待拜访'}}
          </template>
        </el-table-column>
        <el-table-column prop="visitTime" label="拜访时间" v-if="visitSwitch==1"></el-table-column>
        
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
  },
  signSwitch:{
    type: Number,
    default: 0
  },
  visitSwitch:{
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