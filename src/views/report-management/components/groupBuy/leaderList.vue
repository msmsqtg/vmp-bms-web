<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      v-loading="loading"
      key="table1"
    >
        <el-table-column prop="orderNo" label="拼团编号"></el-table-column>
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
      <el-table-column prop="userPhone" label="代理人" width="200">
        <template  #default="{ row }">
          <div v-if="row.agent">
            <div v-if="row.agent.agentCode">工号：{{row.agent.agentCode}}</div>
            <div v-if="row.agent.agentName">姓名：{{row.agent.agentName}}</div>
            <div v-if="row.agent.agentPhone">手机号：{{row.agent.agentPhone}}</div>
            <div v-if="row.agent.agentOrg">机构：{{row.agent.agentOrg}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="userNickname" label="用户昵称"></el-table-column>

      <el-table-column prop="status" label="状态">
        <template  #default="{ row }">
          {{row.status==1?'进行中':row.status==2?'拼团失败 ':'拼团成功'}}
        </template>
      </el-table-column>

      <el-table-column prop="status" label="奖品类型">
        <template  #default="{ row }">
          {{row.productImpType === "1" ? '开团' : '助力'}}
        </template>
      </el-table-column>

      <el-table-column prop="productName" label="奖品名称">
      </el-table-column>

      <el-table-column prop="createTime" label="订单时间"></el-table-column>
      <el-table-column prop="writeOffStatus" label="核销状态">
        <template  #default="{ row }">
          {{row.writeOffStatus == "1" ? '待核销' : row.writeOffStatus == "2" ? '已核销' : '无需核销'}}
        </template>
      </el-table-column>
      <el-table-column prop="writeOffTime" label="核销时间"></el-table-column>
      <el-table-column prop="writeOffPhone" label="核销人手机号"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template  #default="{ row }">
          <el-button @click="handleClick(row)" type="text" >拼团记录</el-button>
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
     <el-dialog title="拼团情况"  v-model="dialogVisible" >
      <el-table :data="dialogTableData" style="width: 100%" :key="num">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="orderNo" label="拼团编号"></el-table-column>
        <el-table-column prop="userPhone" label="用户手机号"></el-table-column>
        <el-table-column prop="status" label="拼团结果">
          <template #default="{ row }">
            {{row.status==1?'进行中':row.status==2?'拼团失败 ':'拼团成功'}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits,reactive} from 'vue';
import { ElMessage,ElCascader  } from 'element-plus'
import baseService from "@/service/baseService";
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

//弹窗 
const  handleClick=(row) =>{
  num.value++;
  baseService
  .get("/imp/activity/leader/detail", {
      orderId: Number(row.id), pageIndex: 1, pageSize: 100 
  })
  .then((res) => {
    state.loading = false;
    console.log("resres",res)
    if (res.code == 200) {
      dialogVisible.value = true;
      dialogTableData.value = res.data.data || []
    } else {
      ElMessage.error(res.msg);
    }
    })
    .catch(() => {
      state.loading = false;     
    });
  
}
</script>

<style scoped>
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>