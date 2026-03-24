<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      v-loading="loading"
      key="table9"
    >
        <el-table-column label="序号" align="center" type="index" width="50"></el-table-column>
        <el-table-column prop="orderNo" label="订单编号"></el-table-column>
        <el-table-column prop="userPhone" label="用户手机号"></el-table-column>
      <!-- 开团信息-->
      <el-table-column prop="userNickname" label="用户信息" width="200">
        <template  #default="{ row }">
          <div v-if="row.userNickname">姓名：{{row.userNickname}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="agentCode" label="代理人" width="200">
        <template  #default="{ row }">
          <div v-if="row.agent">
            <div v-if="row.agent.agentCode">工号：{{row.agent.agentCode}}</div>
            <div v-if="row.agent.agentName">姓名：{{row.agent.agentName}}</div>
            <div v-if="row.agent.agentPhone">手机号：{{row.agent.agentPhone}}</div>
            <div v-if="row.agent.agentOrg">机构：{{row.agent.agentOrg}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="兑换活力值"></el-table-column>
      <el-table-column prop="createTime" label="订单时间"></el-table-column>
       <el-table-column prop="productImg" label="奖品图片">
        <template  #default="{ row }">
          <img :src="row.productImg" class="head" alt="奖品图片" />            
          </template>
      </el-table-column>
      <el-table-column prop="productName" label="奖品名称"></el-table-column> 
       <el-table-column prop="productType" label="商品类型">
        <template  #default="{ row }">
          {{row.productType == "1" ? '实物' : row.productType == "2" ? '虚拟':''}}
        </template>
      </el-table-column>       
       <el-table-column prop="writeOffStatus" label="核销状态">
        <template  #default="{ row }">
          {{row.writeOffStatus == "1" ? '待核销' : row.writeOffStatus == "2" ? '已核销' : '无需核销'}}
        </template>
      </el-table-column>
      <el-table-column prop="writeOffTime" label="核销时间"></el-table-column>
      <el-table-column prop="writeOffPhone" label="核销人手机号"></el-table-column>      
      <el-table-column prop="exchangeStatus" label="兑换状态"> 
        <template  #default="{ row }">
          {{row.exchangeStatus==1?'未兑换':row.exchangeStatus==2?'已兑换 ':''}}
        </template>             
      </el-table-column>  
      <el-table-column prop="exchangeTime" label="兑换时间">               
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
import { ref, defineProps, defineEmits,reactive} from 'vue';
import { ElMessage,ElCascader  } from 'element-plus'

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
const num = ref(0);
const dialogVisible = ref(false);
const dialogTableData = ref([]);
const state = reactive({
  loading: false
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
.head{
  width: 100px;
  height:100px;
}
</style>