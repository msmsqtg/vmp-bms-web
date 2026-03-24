<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      v-loading="loading"
      key="table8"
    >
        <el-table-column label="序号" align="center" type="index" width="50"></el-table-column>
        <el-table-column prop="accountId" label="用户编号"></el-table-column>
        <el-table-column prop="phone" label="用户手机号"></el-table-column>
      <!-- 开团信息-->
      <el-table-column prop="name" label="用户信息" width="200">
        <template  #default="{ row }">
          <div v-if="row.name">姓名：{{row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="agentCode" label="代理人" width="200">
        <template  #default="{ row }">
          <div>
            <div v-if="row.agentCode">工号：{{row.agentCode}}</div>
            <div v-if="row.agentName">姓名：{{row.agentName}}</div>
            <div v-if="row.agentPhone">手机号：{{row.agentPhone}}</div>
            <div v-if="row.agentOrg">机构：{{row.agentOrg}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="累计活力值"></el-table-column>
       <el-table-column prop="type" label="说明">
        <template  #default="{ row }">
          {{row.type == "1" ? '团长' : '团员'}}
        </template>
      </el-table-column> 
      <el-table-column prop="leaderName" label="关联团长姓名"></el-table-column>
      <el-table-column prop="leaderPhone" label="关联团长手机"></el-table-column>  
      <el-table-column fixed="right" label="操作" width="100">
        <template  #default="{ row }">
          <el-button @click="handleClick(row)" type="text" >活力值记录</el-button>
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
     <el-dialog title="活力值情况"  v-model="dialogVisible" >
      <el-table :data="dialogTableData" style="width: 100%" :key="num">
        <el-table-column type="index" label="序号"></el-table-column>        
        <el-table-column prop="type" label="活力值类型">
          <template #default="{ row }">
            {{row.type==1?'打卡获得':row.type==2?'好友打卡奖励 ':'奖品兑换'}}
          </template>
        </el-table-column>
        <el-table-column prop="qty" label="活力值"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="helpUserPhone" label="好友手机号"></el-table-column>
        <el-table-column prop="helpUserName" label="好友姓名"></el-table-column>              
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
  },
  impId:{
    type: Number,
    default: 0
  },
  roleImpId:{
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
  .get("/imp/activity/user/sign/in/list", {
    impId:Number(props.impId),
    roleImpId:props.roleImpId,
    accountId: Number(row.accountId), pageIndex: 1, pageSize: 100 
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