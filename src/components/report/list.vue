<template>
  <el-dialog
    v-model="dialogVisible"
    title="权限管理"
    width="80%"
    top="5vh"
    destroy-on-close
  >
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-box">
      <el-form :model="searchForm" inline>
        <el-form-item label="活动类型">  
          <ren-select v-model="searchForm.impType" dict-type="activity_type" placeholder="请选择活动类型"  @change="handleTypeChange"></ren-select>
        </el-form-item>        
        <el-form-item label="活动名称">        
          <el-select v-model="searchForm.impId" placeholder="请选择活动名称">
            <el-option
              v-for="item in tableActivityOptions"
              :key="item.impId"
              :label="item.impName"
              :value="item.impId"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="success" @click="showAddDialog">新增报表权限</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card shadow="never" class="table-box">
      <el-table :data="tableData" border v-loading="loading">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="impType" label="活动类型" width="120" align="center">
          <template #default="{ row }">
            {{ state.getDictLabel("activity_type", row.impType) }}  
          </template>
        </el-table-column>
        <el-table-column prop="impName" label="活动名称" min-width="150" />
        <el-table-column prop="createDate" label="创建时间" width="180" align="center" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(row)" style="color: #f56c6c">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        v-model:current-page="pagination.pageIndex"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="innerDialogVisible"
      :title="dialogTitle"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="180px">
        <el-form-item label="活动类型" prop="impType">        
          <ren-select v-model="formData.impType" dict-type="activity_type" placeholder="请选择活动类型"  @change="dialogHandleTypeChange"></ren-select>
        </el-form-item>
        
        <el-form-item label="活动名称" prop="impId">
          <el-select 
            v-model="formData.impId" 
            placeholder="请选择活动名称"
            filterable
            @change="handleIdChange"
          >
            <el-option
              v-for="item in activityOptions"
              :key="item.impId"
              :label="item.impName"
              :value="item.impId"
            />
          </el-select>
        </el-form-item>        
        <el-form-item label="机构权限" prop="orgId">
          <el-tree
            ref="treeRef"
            :data="permissionTree"
            show-checkbox
            node-key="id"
            :props="treeProps"            
            :default-expand-all="true"
          />
        </el-form-item>
        <el-form-item label="报表权限" prop="reportId"> 
           <el-checkbox-group v-model="formData.reportId">
            <el-checkbox :label="item.reportId" name="type"  v-for="(item,index) in activitySysOptions" :key="index">{{item.reportName}}</el-checkbox>
          </el-checkbox-group>          
        </el-form-item>
        <el-form-item label="H5用户手机号是否脱敏" prop="maskStatus">          
          <el-radio v-model="formData.maskStatus" :label="1">否</el-radio>
          <el-radio v-model="formData.maskStatus" :label="2">是</el-radio>
        </el-form-item>
      </el-form>      
      <template #footer>
        <el-button @click="innerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { nextTick,ref, reactive, computed, watch,onMounted, } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CacheToken } from "@/constants/cacheKey";
import baseService from "@/service/baseService";
import { useAppStore } from "@/store";
import { getDictDataList } from "@/utils/utils";
import useView from "@/hooks/useView";

const store = useAppStore();

const state = reactive({
  loading: false,
   ...useView({})
});
const props = defineProps({
  modelValue: Boolean,
  roleId: String || Number // 可选的初始活动ID
})

const emit = defineEmits(['update:modelValue', 'success'])

// 控制对话框显示
const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

// 搜索表单
const searchForm = reactive({
  impType: "",
  impId:''
})
const impType = ref(0)
const tableActivityOptions = ref([])
const activitySysOptions = ref([])
// 表格数据
const tableData = ref([])

// 分页
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  total: 0
})

// 加载状态
const loading = ref(false)

// 内部弹窗控制
const innerDialogVisible = ref(false)
const dialogTitle = ref('新增报表权限')
const formRef = ref(null)
const treeRef = ref(null)

// 表单数据
const formData = reactive({
  roleImpId:'',
  impType: '',
  impId: '',
  orgId: [],
  reportId:[],
  maskStatus:1
})

// 表单验证规则
const rules = {
  impType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  impId: [{ required: true, message: '请选择活动名称', trigger: 'change' }],
  reportId: [{ required: true, message: '请选择报表权限', trigger: 'change' }]    
}

// 活动名称下拉选项
const activityOptions = ref([])

// 权限树数据
const permissionTree = ref([])

const treeProps = {
  children: 'children',
  label: 'name'
}

// 获取活动类型标签
const getActivityTypeLabel = (value) => {
  // const item = activityTypeOptions.find(item => item.value === value)
  // return item ? item.label : value
}
	onMounted(() => {
    fetchTableData();
  })
// 搜索
const handleSearch = () => {
  pagination.pageIndex = 1
  fetchTableData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.impType = ''
  searchForm.impId = ''
  impType.value = 0
  handleSearch()
}

// 获取表格数据
const fetchTableData = () => {
  loading.value = true
  // 这里应该是API调用
  baseService
.get("/imp/activity/role/imp/list", {
  roleId:props.roleId,
  ...pagination,
  ...searchForm
})
.then((res) => {
  state.loading = false;
  if (res.code === 200) {
     loading.value = false;
     tableData.value = res.data.data;
     pagination.total = res.data.total;
  } else {
    ElMessage.error(res.msg);
  }
  })
  .catch(() => {
    state.loading = false;     
  });
}

// 分页变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchTableData()
}

const handleCurrentChange = (val) => {
  pagination.pageIndex = val
  fetchTableData()
}

// 显示新增弹窗
const showAddDialog = () => {
  dialogTitle.value = '新增报表权限'
  resetForm()
  innerDialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑报表权限'
  resetForm()
  baseService
  .get("/imp/activity/role/imp/info", {
    roleId:props.roleId,
    impId:row.impId,
    roleImpId:row.id
  })
  .then((res) => {
    state.loading = false;
    if (res.code === 200) {
      Object.assign(formData, res.data);
      innerDialogVisible.value = true;      
      dialogHandleTypeChange(formData.impType,false); 
      handleIdChange(formData.impId);                   
    } else {
      ElMessage.error(res.msg);
    }
    })
  .catch(() => {
      state.loading = false;     
  });
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除这条权限记录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里应该是API调用
    baseService
    .post("/imp/activity/org/report/delete", {
      roleId:props.roleId,
      impId:row.impId,
      roleImpId:row.id
    })
    .then((res) => {      
      if (res.code === 200) {
        ElMessage.success('删除成功');
        if(pagination.pageIndex!=1 && (Math.ceil((pagination.total-1)/pagination.pageSize))<pagination.pageIndex){
          pagination.pageIndex= pagination.pageIndex-1;
        }
         fetchTableData()                  
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch(() => {       
    });    
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}
// 重置表单
const resetForm = () => {
  formData.roleImpId = ''
  formData.impId = ''
  formData.orgId =  []
  formData.impType = ""
  formData.maskStatus = 1
  formData.reportId = []
   nextTick(() => {
    if(treeRef.value) {
      treeRef.value.setCheckedKeys([]);
    }
   });
}
// 提交表单
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 获取选中的权限
      const checkedKeys = treeRef.value.getCheckedKeys()
      const halfCheckedKeys = treeRef.value.getHalfCheckedKeys()
      const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys]
      
      if (allCheckedKeys.length === 0) {
        ElMessage.warning('请至少选择一个权限')
        return
      }
      
      // 这里应该是API调用
      console.log('提交数据:', {
        ...formData,
        orgId: allCheckedKeys
      })
      baseService
      .post("/imp/activity/org/report/create", {...formData,orgId: allCheckedKeys,roleId:props.roleId})
      .then((res) => {
        state.loading = false;
        if (res.code === 200) {
          ElMessage.success(dialogTitle.value + '成功')
          innerDialogVisible.value = false ;         
          fetchTableData()    
        } else {
          ElMessage.error(res.msg);
        }
        })
      .catch(() => {
          state.loading = false;     
      });
     
     
    }
  })
}

const handleTypeChange = (type) =>{
  baseService
  .get("/imp/activity/list", {type})
  .then((res) => {
    state.loading = false;
    if (res.code === 200) {
      console.log(res);
      tableActivityOptions.value = res.data;
      searchForm.impId = "";
    } else {
      ElMessage.error(res.msg);
    }
    })
    .catch(() => {
      state.loading = false;     
    });  
}
 
const dialogHandleTypeChange  = (type,isCheck=true) =>{
  //
  impType.value = type  
   baseService
  .get("/imp/activity/report", {type})
  .then((res) => {
    state.loading = false;
    if (res.code === 200) {
      activitySysOptions.value = res.data;      
    } else {
      ElMessage.error(res.msg);
    }
    })
    .catch(() => {
      state.loading = false;
    });
  baseService
  .get("/imp/activity/list", {type})
  .then((res) => {
    state.loading = false;
    if (res.code === 200) {
      console.log(res);
      activityOptions.value = res.data;
      if(isCheck) formData.impId = "";
    } else {
      ElMessage.error(res.msg);
    }
    })
    .catch(() => {
      state.loading = false;
    });
}
const handleIdChange = (impId)=>{
  console.log('idid',impId);
  console.log('searchForm.impType',searchForm)
   baseService
  .get("/imp/activity/org/list", {impId:Number(impId),impType:Number(impType.value)})
  .then((res) => {
    state.loading = false;
    if (res.code === 200) {
      permissionTree.value = res.data?[res.data]:[];   
      setTimeout(()=>{
        if(treeRef.value) {
          formData.orgId.forEach(item => treeRef.value.setChecked(item*1, true));
        } 
      },100)
    } else {
      ElMessage.error(res.msg);
    }
    })
    .catch(() => {
      state.loading = false;
    });
}
// // 初始化时如果有activityId，设置搜索条件
// watch(() => props.activityId, (val) => {
//   if (val) {   
//     resetSearch()
//   }
// }, { immediate: true })
</script>

<style scoped>
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
:deep(.el-tree__empty-text){
 
  position: relative;
}
</style>