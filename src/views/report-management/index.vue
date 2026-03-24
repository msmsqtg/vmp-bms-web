<template>
  <div class="report-container">
    <!-- 报表选择区域 -->
    <el-card class="report-selector">
      <el-form :inline="true" :model="reportForm">
        <el-form-item label="选择活动">
          <el-select
            v-model="reportForm.roleImpId"
            placeholder="请选择活动"
            clearable
            filterable
            style="width: 200px"
             @change="handleImpIdChange"
            :filter-method="filterActivity"
          >
            <el-option
              v-for="item in filteredActivities"
              :key="item.roleImpId"
              :label="item.impName"
              :value="item.roleImpId"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="选择报表">
          <el-select
            v-model="reportForm.reportId"
            placeholder="请选择报表"
            clearable
            style="width: 200px"
            @change="handleReportChange"
          >
            <el-option
              v-for="item in reportTypeOptions"
              :key="item.reportId"
              :label="item.reportName"
              :value="item.reportId"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 报表名称 -->
    <div class="report-title">
      <h3>{{ currentReportName }}</h3>
    </div>

    <!-- 搜索条件 -->
    <el-card class="search-box">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="机构" key="orgIds">          
          <el-cascader
            v-model="searchForm.orgIds"          
            :options="orgOptions"
            :props="props"
            collapse-tags
            clearable></el-cascader>
        </el-form-item>
        <el-form-item label="业务员姓名" key="salesmanName" v-if="reportForm.reportId==13 || reportForm.reportId==14">
          <el-input
            v-model="searchForm.salesmanName"
            placeholder="请输入业务员姓名"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="用户手机号" key="phone" v-if="reportForm.reportId==1 || reportForm.reportId==2 || reportForm.reportId==3 || reportForm.reportId==7 || reportForm.reportId==8 || reportForm.reportId==9 ">
          <el-input
            v-model="searchForm.phone"
            placeholder="请输入手机号"
            clearable
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="客户电话" key="customerMobile" v-if="reportForm.reportId==13 ">
          <el-input
            v-model="searchForm.customerMobile"
            placeholder="请输入客户手机号"
            clearable
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item label="代理人工号" key="agentCode" v-if="reportForm.reportId==1 || reportForm.reportId==2 || reportForm.reportId==3 || reportForm.reportId==7 || reportForm.reportId==8 || reportForm.reportId==9">
          <el-input
            v-model="searchForm.agentCode"
            placeholder="请输入工号"
            clearable
            style="width: 150px"
          />
        </el-form-item>
         <el-form-item label="核销状态" v-if="reportForm.reportId==3" key="status">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >          
            <el-option label="全部" :value="0"></el-option>
            <el-option label="待核销" :value="1"></el-option>
            <el-option label="无需核销" :value="3"></el-option>
            <el-option label="已核销" :value="2"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="核销状态" v-if="reportForm.reportId==9" key="writeOffStatus">
          <el-select
            v-model="searchForm.writeOffStatus"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >          
            <el-option label="全部" :value="0"></el-option>
            <el-option label="待核销" :value="1"></el-option>
            <el-option label="已核销" :value="2"></el-option>
            <el-option label="无需核销" :value="3"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item key="productType" label="商品类型" prop="productType" v-if="reportForm.reportId==9">
          <el-select v-model="searchForm.productType" placeholder="请选择状态">
            <el-option label="全部" :value="0"></el-option>
            <el-option label="实物" :value="1"></el-option>                    
            <el-option label="虚拟" :value="2"></el-option>
          </el-select>
        </el-form-item>    
          <el-form-item key="exchangeStatus" label="兑换状态" prop="exchangeStatus" v-if="reportForm.reportId==9">
            <el-select v-model="searchForm.exchangeStatus" placeholder="请选择状态">
              <el-option label="全部" :value="0"></el-option>
              <el-option label="未兑换" :value="1"></el-option>                    
              <el-option label="已兑换" :value="2"></el-option>
              <el-option label="无需兑换" :value="3"></el-option>  
            </el-select>
          </el-form-item>  
         <el-form-item label="状态" v-if="reportForm.reportId==2" key="status">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" v-if="reportForm.reportId==8" key="writeOffStatus">
          <el-select
            v-model="searchForm.type"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >          
            <el-option label="全部" :value="0"></el-option>
            <el-option label="团长" :value="1"></el-option>
            <el-option label="团员" :value="2"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="拼团用户" v-if="reportForm.reportId==2" key="impType">
          <el-select
            v-model="searchForm.impType"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >          
            <el-option label="全部" :value="0"></el-option>
            <el-option label="团长" :value="1"></el-option>
            <el-option label="团员" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组团编号" key="orderNo" v-if="reportForm.reportId==1 || reportForm.reportId==2 || reportForm.reportId==3">
          <el-input
            v-model="searchForm.orderNo"
            placeholder="请输入组团编号"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="奖品名称" v-if="reportForm.reportId==3 || reportForm.reportId==9" prop="productName" key="productName">
          <el-input v-model.trim="searchForm.productName" placeholder="请输入奖品名称"></el-input>
        </el-form-item>
        <el-form-item :label="reportForm.reportId==7?'打卡时间':reportForm.reportId==13?'拜访时间':'订单时间'"  v-if="reportForm.reportId==1 || reportForm.reportId==2 || reportForm.reportId==3 || reportForm.reportId==5 || reportForm.reportId==7 || reportForm.reportId==9 || reportForm.reportId==13">         
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD HH:mm:ss" 
            :default-time="defaultTime"          
        ></el-date-picker>
        </el-form-item>        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="success" @click="handleExport">导出</el-button>
          <el-button type="info" @click="showExportRecords" v-if="(reportForm.reportId!=1 && reportForm.reportId!=2 && reportForm.reportId!=3)">导出记录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="table-box" v-if="reportForm.reportId">
    <!-- 表格区域 -->
    <component
      :is="componentMap[reportForm.reportId]?.component"
      v-if="componentMap[reportForm.reportId]"
      :table-data="tableData"
      :loading="loading"
      :impId="impId"
      :total="pagination.total"
      :signSwitch="signSwitch"
      :visitSwitch="visitSwitch"
      :productData="productData"
      :roleImpId="reportForm.roleImpId"
      @page-change="handlePageChange"
    ></component>
    </el-card>
    <!-- 导出记录弹窗 -->
    <el-dialog
      v-model="exportRecordVisible"
      title="导出记录"
      width="60%"
    >
      <el-table :data="exportRecords" border>
        <el-table-column prop="fileName" label="文件名" width="200" />
        <el-table-column prop="reportType" label="报表类型" width="120">
          <template #default="{ row }">
            {{ getReportTypeLabel(row.reportType) }}
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="导出时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 2 ? 'success' : 'danger'">
              {{ row.status === 2 ? '成功' : '处理中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button
              type="text"
              size="small"             
              @click="downloadExportFile(row)"
            >
              下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>     
  </div>
</template>

<script setup>
import leaderList from './components/groupBuy/leaderList.vue';
import memberList from './components/groupBuy/memberList.vue';
import productList from './components/groupBuy/productList.vue';
import agentDetail from './components/xbox/agentDetail.vue';
import xboxDetail from './components/xbox/xboxDetail.vue';
import xboxSummary from './components/xbox/xboxSummary.vue';
import signInList from './components/walking/signInList.vue';
import valueDetails from './components/walking/valueDetails.vue';
import signPrizeDetails from './components/walking/prizeDetails.vue';
import agentVisitDetails from './components/agent/visitDetails.vue';
import agentIntergalDetails from './components/agent/intergalDetails.vue';
import { ref, reactive, computed,onMounted} from 'vue'
import { ElMessage,ElCascader  } from 'element-plus'
///imp/activity/leader/list?impId=32&pageIndex=1&pageSize=10
import { CacheToken } from "@/constants/cacheKey";
import baseService from "@/service/baseService";
import { useAppStore } from "@/store";
import { truncate } from 'lodash';
import { getToken } from "@/utils/cache";
import app from "@/constants/app";
import axios from "axios";
const store = useAppStore();
const props =  reactive({
  label: 'name', // 指定显示的字段为 name
  value: 'id',   // 指定绑定值的字段为 id
  children: 'children', // 子选项字段为 children
  multiple: true
})
const signSwitch = ref(0); //打开签到核销
const visitSwitch = ref(0); //打开拜访核销
const productData = ref([])
const state = reactive({
  loading: false
});
const impId = ref(0)
const componentMap = reactive({
  1: { component: leaderList },
  2: { component: memberList },
  3: { component: productList },
  4: { component: agentDetail },
  5: {component: xboxDetail},
  6: {component: xboxSummary},
  7: {component:signInList},
  8: {component:valueDetails},
  9: {component:signPrizeDetails},
  13: {component:agentVisitDetails},
  14: {component:agentIntergalDetails}
});
// 报表表单
const reportForm = reactive({
  roleImpId: '',
  reportId: ''
})
const dialogVisible = ref(false)
// 报表类型选项
const reportTypeOptions = ref([])
const filteredActivities = ref([])
// 当前报表名称
const currentReportName = computed(() => {
  const item = reportTypeOptions.value.find(item => item.reportId === reportForm.reportId)
  return item ? item.reportName : '请选择报表'
})

// 活动选项
const activityOptions = ref([]);
const dialogTableData = ref([])
const num = ref(1)
// 搜索表单
const searchForm = reactive({
  orgIds:[],
  agentNames:"",
  phone: '',
  agentCode: '',
  orderNo: '',
  startTime: '',
  endTime:'',
  status: '',
  writeOffStatus:'',
  productName:'',
  impType:0,
  type:0,
  exchangeStatus:0,
  productType:0,
  salesmanName:'',
  customerMobile:''
})

// 机构选项
const orgOptions = ref([])
const filteredOrgs = ref([])
// const filterOrg = (query) => {
//   const searchText = query?.toLowerCase() || '';
//   filteredOrgs.value = orgOptions.value.filter(item =>
//     item.orgName && item.orgName.toLowerCase().includes(searchText)
//   );
// };
// 状态选项
const statusOptions = ref([
  { value: 0, label: '全部' },
  { value: 1, label: '进行中' },
  { value: 3, label: '拼团成功' },
  { value: 2, label: '拼团失败' }
])
//获取活动列表
const getActivityList = ()=>{
   baseService
    .get("/imp/activity/user/imp/list", {})
    .then((res) => {
      state.loading = false;      
      if (res.code == 200) {
       activityOptions.value = res.data || [];
      filteredActivities.value = [...res.data]
      // activityOptions.value =     [
      //   {
      //     "impType": 2,
      //     "maskStatus": 1,
      //     "impName": "790拼团活动",
      //     "impId": 44,
      //     "roleImpId": 55
      //   },
      //   {
      //     "impType": 5,
      //     "maskStatus": 1,
      //     "impId": 745,
      //     "impName": "测试",
      //     "roleImpId": 56
      //   }
      // ]
      //  filteredActivities.value =     [
      //   {
      //     "impType": 2,
      //     "maskStatus": 1,
      //     "impName": "790拼团活动",
      //     "impId": 44,
      //     "roleImpId": 55
      //   },
      //   {
      //     "impType": 5,
      //     "maskStatus": 1,
      //     "impId": 745,
      //     "impName": "测试",
      //     "roleImpId": 56
      //   }
      // ]
      } else {
        ElMessage.error(res.msg);
      }
      })
      .catch(() => {
        state.loading = false;     
      });
}
//活动列表数据修改
const handleImpIdChange = (e) =>{
  if(e){
    //impId.value = e;
     filteredActivities.value.map(item=>{
        if(item.roleImpId==e) impId.value = item.impId
      })
    clearChoice();
     baseService
    .get("/imp/activity/user/imp/report/list", {
      roleImpId:e
    }).then((res) => {
      state.loading = false;
      console.log("resres",res)
      if (res.code == 200) {      
        reportTypeOptions.value = res.data;       
      } else {
        ElMessage.error(res.msg);
      }
      })
      .catch(() => {
        state.loading = false;     
      });
     baseService
    .get("/imp/activity/user/imp/org/list", {
      roleImpId:e
    }).then((res) => {
      state.loading = false;
      console.log("resres",res)
      if (res.code == 200) {      
       orgOptions.value = [res.data];
        // filteredOrgs.value = [...res.data]       
      } else {
        ElMessage.error(res.msg);
      }
      })
      .catch(() => {
        state.loading = false;     
      });
    //imp/activity/user/imp/org/list
  }else{
    impId.value = 0;
    clearChoice();
  }
}
const clearChoice = () =>{
  reportForm.reportId = "";
  searchForm.orgIds = []
  searchForm.agentNames = ""  
  orgOptions.value = [];
  reportTypeOptions.value = []
}
const filterActivity = (query) => {
  const searchText = query?.toLowerCase() || '';
  filteredActivities.value = activityOptions.value.filter(item => 
    item.impName && item.impName.toLowerCase().includes(searchText)
  );
};
// 表格数据
const tableData = ref([])
const loading = ref(false)
const dateRange = ref([])
const defaultTime = [
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
  ]
// 分页
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  total: 0
})

// 导出记录相关
const exportRecordVisible = ref(false)
const exportRecords = ref([])

// 获取状态标签
const getStatusLabel = (status) => {
  const item = statusOptions.value.find(item => item.value === status)
  return item ? item.label : status
}
// 获取报表类型标签
const getReportTypeLabel = (type) => {
  const item = reportTypeOptions.value.find(item => item.reportId == type)
  return item ? item.reportName : type
}

// 报表类型变化
const handleReportChange = (val) => {
  console.log('val',val)
  if (val) {   
    resetSearch()
  } else {
    tableData.value = []
  }
}
	onMounted(() => {
    getActivityList();
  })
// 搜索
const handleSearch = () => {
  pagination.pageIndex = 1
  fetchTableData()
}
// 分页变化处理
const handlePageChange = ({ page, pageSize }) => {
  pagination.pageIndex = page;
  pagination.pageSize = pageSize;
  fetchTableData()
};

// 重置搜索
const resetSearch = () => {
  searchForm.orgIds = []
  searchForm.agentNames =""
  searchForm.phone = ''
  searchForm.agentCode = ''
  searchForm.orderNo = ''
  searchForm.startTime = ""
  searchForm.endTime = ""
  searchForm.status = '';
  searchForm.impType = 0
  searchForm.writeOffStatus = "";
  searchForm.productName=""
  searchForm.type = 0;
  searchForm.exchangeNo = "";
  searchForm.exchangeStatus = 0;
  searchForm.productType = 0;
  searchForm.salesmanName = "";
  searchForm.customerMobile = ""
  dateRange.value = [];
  handleSearch();
}
const findPathNames = (options, path)=> {
  const names = [];
  let currentOptions = options;
  console.log("options",options);
  for (const id of path) {
    if (!Array.isArray(currentOptions)) {
      break; // 如果当前层级不是数组，停止查找
    }

    const found = currentOptions.find(option => option.id === id);
    if (found) {
      names.push(found.name);
      currentOptions = found.children || []; // 确保 children 是数组
    } else {
      break; // 如果找不到对应的 id，停止查找
    }
  }
  return names;
}
// 获取表格数据
const fetchTableData = () => {
  if (!reportForm.reportId) {
    ElMessage.warning('请先选择报表类型')
    return
  } 
  if(dateRange.value && dateRange.value.length>0){
    searchForm.startTime = dateRange.value[0];
    searchForm.endTime = dateRange.value[1]
  }else{
    searchForm.startTime = ""
    searchForm.endTime = ""
  }
  console.log('searchForm.orgIds',searchForm.orgIds);
  if(searchForm.orgIds.length>0){
     let org = searchForm.orgIds.map(path => findPathNames(orgOptions.value, path)) // 获取每条路径的 name 数组
    .flat(); 
     searchForm.agentNames = [...new Set(org)].join(',')
  }else{
    searchForm.agentNames="";
  }   
  loading.value = true;
  let link = "";
  switch(reportForm.reportId){
    case 1:
      link ='/imp/activity/leader/list'
    break;
    case 2:
      link ='/imp/activity/member/list'
    break;
    case 3:
      link ='/imp/activity/product/list'
    break;
    case 4:
      link ='/imp/xbox/agent/list'
    break;
    case 5:
      link ='/imp/xbox/order/list'
    break;
    case 6:
      link ='/imp/xbox/org/list'
    break;
    case 7:
      link ='/imp/activity/user/sign/in/list'
    break;
    case 8:
      link ='/imp/activity/user/account/info/list'
    break;
    case 9:
      link = '/imp/activity/order/list/jbz'
    break;
    case 13:
      link = '/imp/xbox/visit/record/report'
    break;
    case 14:
      link = '/imp/xbox/agent/integral/report'
    break;
  }
  if(reportForm.reportId==6){
    getProductData(impId)
  }
    baseService
    .get(link, {
      impId:impId.value,
      activityId:impId.value,
      roleImpId:reportForm.roleImpId,
      ...pagination,      
      ...searchForm,
      orgIds:'',
      impType:(reportForm.reportId==7 || reportForm.reportId==8 || reportForm.reportId==9)?4:0,
      export:false
    })
    .then((res) => {
      state.loading = false;
      console.log("resres",res)
      if (res.code == 200) {
        loading.value = false;
        if(res.data.data){
          tableData.value = res.data.data || [];
          pagination.total = Number(res.data.total);
          if(reportForm.reportId==6 || reportForm.reportId==5){
            signSwitch.value = res.data.signSwitch;
            visitSwitch.value = res.data.visitSwitch;
          }
        }else{
          tableData.value = []
          pagination.total = 0
        }
      } else {
        ElMessage.error(res.msg);
      }
      })
      .catch(() => {
        state.loading = false;     
      }); 
}
const getProductData = (activityId) =>{  
  baseService
    .get('/imp/xbox/list', {
      activityId,      
    })
    .then((res) => {
      if (res.code == 200) {
        if(res.data){
          productData.value = res.data || [];
        }else{
          productData.value = []
        }
      } else {
        ElMessage.error(res.msg);
      }
  })
}
// 分页大小变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchTableData()
}

// 当前页变化
const handleCurrentChange = (val) => {
  pagination.pageIndex = val
  fetchTableData()
}
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
// 导出
const handleExport = () => {
  console.log(reportForm.reportType)
  if (!reportForm.reportId) {
    ElMessage.warning('请先选择报表类型')
    return
  }
  if(dateRange.value.length>0){
    searchForm.startTime = dateRange.value[0];
    searchForm.endTime = dateRange.value[1]
  }else{
    searchForm.startTime = ""
    searchForm.endTime = ""
  }
  if(searchForm.orgIds.length>0){
     let org = searchForm.orgIds.map(path => findPathNames(orgOptions.value, path)) // 获取每条路径的 name 数组
    .flat(); 
     searchForm.agentNames = [...new Set(org)].join(',')
  }else{
    searchForm.agentNames="";
  }   
  const token = getToken();
  if(reportForm.reportId==1 || reportForm.reportId==2 || reportForm.reportId==3){
    let link = "";
    switch(reportForm.reportId){   
      case 1:
        link ='/imp/xbox/agent/list'
      break;
      case 2:
        link ='/imp/xbox/order/list'
      break;
      case 3:
        link ='/imp/xbox/org/list'
      break;       
    }
    //拼团记录
    axios
    .get(app.api+link, {params:{
     impId:impId.value,
     activityId:impId.value,
     roleImpId:reportForm.roleImpId,
      ...pagination,      
      ...searchForm,
      orgIds:'',
      export:true     
    }, 
    headers: {
      'Content-Type': 'application/json',
      'token': token          
    },responseType: 'blob'})
    .then((res) => {
        const content = res.data
        exportExcel(content,reportForm.reportId==1?'拼团列表':reportForm.reportId==2?'拼团日志':'奖品列表')           
      })
      .catch(() => {
        state.loading = false;     
      });
  }
  if(reportForm.reportId==4 || reportForm.reportId==5 || reportForm.reportId==6 || reportForm.reportId==7 || reportForm.reportId==8 || reportForm.reportId==9 || reportForm.reportId==13 || reportForm.reportId==14){
    let link = "";
    switch(reportForm.reportId){   
      case 4:
        link ='/imp/xbox/agent/list'
      break;
      case 5:
        link ='/imp/xbox/order/list'
      break;
      case 6:
        link ='/imp/xbox/org/list'
      break;
      case 7:
        link ='/imp/activity/user/sign/in/list'
      break;
      case 8:
        link ='/imp/activity/user/account/info/list'
      break;
      case 9:
        link = '/imp/activity/order/list/jbz'
      break;
      case 13:
        link ='/imp/xbox/visit/record/report'
      break; 
      case 14:
        link ='/imp/xbox/agent/integral/report'
      break;
    }
    baseService
    .get(link, {
      impId:impId.value,
      activityId:impId.value,
      roleImpId:reportForm.roleImpId,
      ...pagination,      
      ...searchForm,
      impType:(reportForm.reportId==7 || reportForm.reportId==8 || reportForm.reportId==9)?4:(reportForm.reportId==13 || reportForm.reportId==14)?5:0,
      orgIds:'',
      export:true
    })
    .then((res) => {
      state.loading = false;
      console.log("resres",res)
      if (res.code == 200) {
        loading.value = false;
        ElMessage.success('导出任务已提交，请稍后在导出记录中查看');
      } else {
       
        ElMessage.error(res.msg);
      }
    })
    .catch(() => {
      state.loading = false;     
    });
  } 
  // ElMessage.success('导出任务已提交，请稍后在导出记录中查看')
  
  // // 模拟添加到导出记录
  // const now = new Date()
  // const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0]
  // exportRecords.value.unshift({
  //   id: Date.now().toString(),
  //   fileName: `${currentReportName.value}_${timestamp}.xlsx`,
  //   reportType: reportForm.reportType,
  //   createTime: now.toLocaleString(),
  //   status: 'success',
  //   filePath: `/exports/${reportForm.reportType}_${timestamp}.xlsx`
  // })
}
const exportExcel = (content,fileName) =>{
   const now = new Date()
   const timestamp = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
   const blob = new Blob([content], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }) // 构造一个blob对象来处理数据    
    // let blob = new Blob([data], {type: 'application/vnd.ms-excel'})
    // 对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
    // IE10以上支持blob但是依然不支持download
    ElMessage.success('导出成功')
    if ('download' in document.createElement('a')) {
      // 支持a标签download的浏览器
      const link = document.createElement('a') // 创建a标签
      link.download = `${fileName}_${timestamp}.xlsx`, // a标签添加属性
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      document.body.appendChild(link)
      link.click() // 执行下载
      URL.revokeObjectURL(link.href) // 释放url
      document.body.removeChild(link) // 释放标签
    } else {
      // 其他浏览器
      navigator.msSaveBlob(blob, fileName)
    }
}
// 显示导出记录
const showExportRecords = () => {
   if (!reportForm.reportId) {
    ElMessage.warning('请先选择报表类型')
    return
  } 
  baseService
  .get('/imp/xbox/download/list', {
    //fileType:(reportForm.reportId==7 || reportForm.reportId==8 || reportForm.reportId==9)?5:4,
    reportType:reportForm.reportId,
    impId:impId.value,
    pageIndex:1,
    pageSize:50
  })
  .then((res) => {
    state.loading = false;
    console.log("resres",res)
    if (res.code == 200) {
      loading.value = false;
      if(res.data.data){
        exportRecordVisible.value = true
        exportRecords.value = res.data.data || [];       
      }else{
        exportRecords.value = []
        pagination.total = 0
      }
    } else {
      ElMessage.error(res.msg);
    }
    })
    .catch(() => {
      state.loading = false;     
    }); 
  
}

// 下载导出文件
const downloadExportFile = (record) => {
  let element = document.createElement('a');   
  element.setAttribute('href',record.downloadUrl)
  element.setAttribute('download', record.fileName) ;      
  element.setAttribute('target', '_blank') ;         
  element.style.display = 'none'
  element.click();  
}

// 查看详情
const handleDetail = (row) => {
  ElMessage.info(`查看详情: ${row.id}`)
  // 实际项目中这里应该是跳转详情页或打开详情弹窗
}
</script>

<style scoped>
.report-container {
  padding: 20px;
}

.report-selector {
  margin-bottom: 20px;
}

.report-title {
  margin: 10px 0 20px;
  padding-left: 10px;
  border-left: 4px solid #409eff;
}

.search-box {
  margin-bottom: 20px;
}

.table-box {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>