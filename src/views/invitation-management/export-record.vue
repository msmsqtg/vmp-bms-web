<template>
  <div class="export-record">
    <el-card shadow="never" class="rr-view-ctx-card">
      <!-- 搜索和筛选区域 -->
      <div class="search-filter">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="导出批次号">
            <el-input v-model="searchForm.exportBatchNo" placeholder="请输入导出批次号"></el-input>
          </el-form-item>
          <el-form-item label="导出时间">
            <el-date-picker
              v-model="searchForm.startTime"
              type="datetime"
              placeholder="开始日期"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="至">
            <el-date-picker
              v-model="searchForm.endTime"
              type="datetime"
              placeholder="结束日期"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 数据表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="exportBatchNo" label="导出批次号"></el-table-column>
        <el-table-column prop="exportTime" label="导出时间"></el-table-column>
        <el-table-column prop="exportCount" label="导出数量"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleDownload(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import baseService from "@/service/baseService";
import { ElMessage } from 'element-plus';

interface ExportRecordItem {
  index: number;
  exportBatchNo: string;
  exportTime: string;
  exportCount: number;
  status: string;
  id: string;
}

export default defineComponent({
  name: "ExportRecord",
  data() {
    return {
      searchForm: {
        exportBatchNo: '',
        startTime: '',
        endTime: ''
      },
      tableData: [] as ExportRecordItem[],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      const params: any = {
        pageIndex: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        exportBatchNo: this.searchForm.exportBatchNo,
        startTime: this.searchForm.startTime,
        endTime: this.searchForm.endTime
      };

      baseService.get(`${import.meta.env.VITE_APP_API}/api/invitation/agent/whitelist/export-record/list`, params)
        .then((res: any) => {
          if (res.code === '00000') {
            this.pagination.total = res.total;
            this.tableData = res.data.map((item: any, index: number): ExportRecordItem => ({
              index: (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1,
              exportBatchNo: item.exportBatchNo || '',
              exportTime: item.exportTime || '',
              exportCount: item.exportCount || 0,
              status: item.status === 1 ? '成功' : '失败',
              id: item.id
            }));
          } else {
            ElMessage.error(res.msg || '获取数据失败');
          }
        })
        .catch(error => {
          console.error('获取数据失败:', error);
          ElMessage.error('获取数据失败');
        });
    },

    handleSearch() {
      this.pagination.currentPage = 1;
      this.loadData();
    },

    handleReset() {
      this.searchForm = {
        exportBatchNo: '',
        startTime: '',
        endTime: ''
      };
      this.pagination.currentPage = 1;
      this.loadData();
    },

    handleDownload(row: ExportRecordItem) {
      window.location.href = `${import.meta.env.VITE_APP_API}/api/invitation/agent/whitelist/export/download?id=${row.id}`;
    },

    handleSizeChange(size: number) {
      this.pagination.pageSize = size;
      this.loadData();
    },

    handleCurrentChange(current: number) {
      this.pagination.currentPage = current;
      this.loadData();
    }
  }
});
</script>

<style scoped>
.export-record {
  padding: 20px;
}

.search-filter {
  margin-bottom: 20px;
}

.demo-form-inline {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.demo-form-inline .el-form-item {
  margin-right: 10px;
  margin-bottom: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
