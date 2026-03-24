<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      v-loading="loading"
      key="table2"
    >
      <el-table-column prop="orderNo" label="拼团编号" width="170px"></el-table-column>
        <el-table-column prop="userPhone" label="用户手机号">
        <template  #default="{ row }">           
          <div v-if="row.userPhone || row.userHelpPhone">{{row.productImpType === "1"?row.userPhone:row.userHelpPhone}}</div>
        </template>
      </el-table-column>
      <!--      开团信息-->
      <el-table-column prop="teamLeader" label="开团信息" width="200">
        <template  #default="{ row }">
          <div v-if="row.userNickname">姓名：{{row.userNickname}}</div>
          <div v-if="row.userPhone">手机号：{{row.userPhone}}</div>
        </template>
      </el-table-column>
      <!-- 助力信息 -->
      <el-table-column prop="teamMember" label="助力信息">
        <template #default="{ row }">
          <div v-if="row.userHelpName">姓名：{{row.userHelpName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="userPhone" label="代理人" width="200">
        <template #default="{ row }">
          <div v-if="row.agent">
            <div v-if="row.agent.agentCode">工号：{{row.agent.agentCode}}</div>
            <div v-if="row.agent.agentName">姓名：{{row.agent.agentName}}</div>
            <div v-if="row.agent.agentPhone">手机号：{{row.agent.agentPhone}}</div>
            <div v-if="row.agent.agentOrg">机构：{{row.agent.agentOrg}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="拼团奖品名称"></el-table-column>
      <el-table-column prop="price" label="拼团商品原价">
        <template  #default="{ row }">
          <div v-if="row.price"> {{(row.price / 100).toFixed(2)}}元</div>
        </template>
      </el-table-column>
      <el-table-column prop="teamPrice" label="拼团商品成团价">
        <template  #default="{ row }">
          <div v-if="row.teamPrice"> {{(row.teamPrice / 100).toFixed(2)}}元</div>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态">
        <template  #default="{ row }">
          {{row.status==1?'进行中':row.status==2?'拼团失败 ':'拼团成功'}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="订单时间"></el-table-column>
      <el-table-column prop="writeOffStatus" label="核销状态">
        <template  #default="{ row }">
          {{row.writeOffStatus == "1" ? '待核销' : row.writeOffStatus == "2" ? '已核销' : '无需核销'}}
        </template>
      </el-table-column>
      <el-table-column prop="writeOffTime" label="核销时间"></el-table-column>
      <el-table-column prop="writeOffPhone" label="核销人手机号"></el-table-column>
      <el-table-column fixed="right" prop="createTime" label="说明" width="100">
        <template  #default="{ row }">
          {{row.productImpType==1?'团长':'团员'}}
        </template>          
      </el-table-column>
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