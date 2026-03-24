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
        <el-table-column prop="agentNum" label="参与业务员数"></el-table-column>
        <el-table-column prop="xboxUserNum" label="报名客户数"></el-table-column>
        <el-table-column  v-for="item in productData" :key="item.value" :label="item.label" :prop="item.value">
        </el-table-column>        
        <el-table-column prop="successOrderNum" label="中奖且填写资料客户"></el-table-column>
        <el-table-column prop="signNum" label="签到核销数" v-if="signSwitch==1" :key="signNum"></el-table-column>
        <el-table-column prop="visitNum" label="拜访核销数" v-if="visitSwitch==1" :key="visitNum"></el-table-column>           
        <el-table-column prop="orderNum" label="盲盒中奖数"></el-table-column>
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
import { ref, defineProps, defineEmits,onMounted } from 'vue';

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
  productData:{
    type: Array,
    default: () => []
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
onMounted(()=>{
  console.log(props.productData)
})
//const productData = ref([])

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
// const getList = () =>{
//   setTimeout(()=>{
//       productData.value=[{label:'奖项一',value:'productOne'},{label:'奖项二',value:'productTwo'},{label:'奖项三',value:'productThree'},{label:'奖项四',value:'productFour'},{label:'奖项五',value:'productFive'},{label:'奖项六',value:'productSix'},{label:'奖项七',value:'productSeven'},{label:'奖项八',value:'productEight'},{label:'奖项九',value:'productNine'},{label:'奖项十',value:'productTen'}]
//   },1000)
// }
</script>

<style scoped>
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>