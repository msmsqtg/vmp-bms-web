<template>
  <div class="agent-whitelist">
    <el-card shadow="never" class="rr-view-ctx-card">
      <!-- 搜索和筛选区域 -->
      <div class="search-filter">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="操作时间">
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
          <el-form-item label="使用状态">
            <el-select v-model="searchForm.status" placeholder="请选择使用状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="未使用" value="1"></el-option>
              <el-option label="已使用" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 按钮区域 -->
      <div class="button-group">
        <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
        <el-button type="primary" @click="showImportDialog = true">导入白名单</el-button>
        <el-button @click="showImportLogDialog = true">查看导入日志</el-button>
        <el-button type="primary" @click="handleExport">导出</el-button>
        <el-button @click="handleViewExportRecord">查看导出记录</el-button>
      </div>

      <!-- 数据表格 -->
      <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="status" label="使用状态" width="100"></el-table-column>
        <el-table-column prop="idCardNo" label="身份证号码"></el-table-column>
        <el-table-column prop="salesmanName" label="姓名"></el-table-column>
        <el-table-column prop="numericWord" label="数字编码"></el-table-column>
        <el-table-column prop="orgLevel1" label="机构名称"></el-table-column>
        <el-table-column prop="salesmanMobile" label="手机号码"></el-table-column>
        <el-table-column prop="stringWord" label="字符串"></el-table-column>
        <el-table-column prop="qty" label="总抽奖次数"></el-table-column>
        <el-table-column prop="usableQty" label="剩余抽奖次数"></el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- 导入白名单弹窗 -->
    <el-dialog title="导入白名单" v-model="showImportDialog" width="500px">
      <el-form :model="importForm" label-width="100px">
        <el-form-item label="导入文件" required>
          <el-upload
            class="upload-demo"
            action=""
            :auto-upload="false"
            :on-change="handleFileChange"
            :show-file-list="false"
            accept=".xls,.xlsx"
          >
            <el-button type="primary">选择文件</el-button>
          </el-upload>
          <div style="margin-top: 10px; color: #606266;">
            只能上传xls/xlsx文件。
            <a href="#" @click.prevent="downloadTemplate">下载导入模板</a>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showImportDialog = false">取消</el-button>
          <el-button type="primary" @click="handleImport">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看导入日志弹窗 -->
    <el-dialog title="查看导入日志" v-model="showImportLogDialog" width="800px">
      <div class="log-search">
        <el-form :inline="true">
          <el-form-item label="导入批次号">
          <el-input v-model="logSearchForm.importNo" placeholder="请输入导入批次号"></el-input>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogSearch">查询</el-button>
            <el-button @click="handleLogReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="logTableData" style="width: 100%">
        <el-table-column prop="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="logId" label="日志ID"></el-table-column>
        <el-table-column prop="createTime" label="生成时间"></el-table-column>
        <el-table-column prop="content" label="简介"></el-table-column>
        <el-table-column prop="importNo" label="导入批次号"></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleViewLogDetail(scope.row)">查看日志</el-button>
            <el-button type="text" size="small" @click="handleDownloadLog(scope.row)">下载日志</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="log-pagination">
        <el-pagination
          @size-change="handleLogSizeChange"
          @current-change="handleLogCurrentChange"
          :current-page="logPagination.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="logPagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="logPagination.total"
        ></el-pagination>
      </div>
    </el-dialog>

    <!-- 查看日志详情弹窗 -->
    <el-dialog title="查看日志" v-model="showLogDetailDialog" width="800px">
      <el-table :data="logDetailData" style="width: 100%">
        <el-table-column prop="createTime" label="时间" width="200"></el-table-column>
        <el-table-column prop="statusReason" label="状态原因"></el-table-column>
        <el-table-column prop="tableLine" label="行号" width="100"></el-table-column>
      </el-table>
      <div class="log-detail-pagination">
        <el-pagination
          @size-change="handleLogDetailSizeChange"
          @current-change="handleLogDetailCurrentChange"
          :current-page="logDetailPagination.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="logDetailPagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="logDetailPagination.total"
        ></el-pagination>
      </div>
    </el-dialog>

    <!-- 查看导出记录弹窗 -->
    <el-dialog title="查看导出记录" v-model="showExportRecordDialog" width="800px">
      <el-table :data="exportRecordData" style="width: 100%">
        <el-table-column prop="fileName" label="文件名"></el-table-column>
        <el-table-column prop="createdTime" label="导出时间" width="200"></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleDownloadExportFile(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="log-detail-pagination">
        <el-pagination
          @size-change="handleExportRecordSizeChange"
          @current-change="handleExportRecordCurrentChange"
          :current-page="exportRecordPagination.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="exportRecordPagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="exportRecordPagination.total"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import baseService from "@/service/baseService";
import { ElMessage, ElMessageBox } from 'element-plus';

interface WhitelistItem {
  index: number;
  status: string;
  idCardNo: string | null;
  salesmanName: string | null;
  numericWord: string | null;
  orgLevel1: string | null;
  salesmanMobile: string | null;
  stringWord: string | null;
  qty: number | null;
  usableQty: number | null;
  lotteryCode?: string;
  no?: string;
  type?: number;
  id?: number;
  impId?: number;
}

interface ImportLogItem {
  index: number;
  logId: number;
  createTime: string;
  content: string;
  importNo: string;
}

interface LogDetailItem {
  createTime: string;
  statusReason: string;
  tableLine: number;
}

interface ExportRecordItem {
  id: number;
  fileName: string;
  downloadUrl: string;
  createdTime: string;
}

export default defineComponent({
  name: "AgentWhitelist",
  data() {
    return {
      activityId: this.$route.query.activityId || '',
      searchForm: {
        startTime: '',
        endTime: '',
        status: '' as string | number
      },
      tableData: [] as WhitelistItem[],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      selectedRows: [] as WhitelistItem[],
      showImportDialog: false,
      importForm: {
        file: null as File | null
      },
      showImportLogDialog: false,
      logSearchForm: {
        importNo: ''
      },
      logTableData: [] as ImportLogItem[],
      logPagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      showLogDetailDialog: false,
      logDetailData: [] as LogDetailItem[],
      logDetailPagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      showExportRecordDialog: false,
      exportRecordData: [] as ExportRecordItem[],
      exportRecordPagination: {
        currentPage: 1,
        pageSize: 50,
        total: 0
      }
    };
  },
  created() {
    this.loadData();
  },
  watch: {
    showImportLogDialog(newVal) {
      if (newVal) {
        this.loadLogData();
      }
    }
  },
  methods: {
    loadData() {
      const params: any = {
        pageIndex: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        startTime: this.searchForm.startTime,
        endTime: this.searchForm.endTime,
        status: this.searchForm.status,
        impId: this.activityId
      };

      if (this.searchForm.status === '') {
        delete params.status;
      }

      baseService.get(`${import.meta.env.VITE_APP_API}/whitelist/record/list`, params)
        .then((res: any) => {
          if (res.code === '00000') {
            this.pagination.total = res.total;
            this.tableData = res.data.map((item: any, index: number): WhitelistItem => ({
              index: (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1,
              status: item.status === 1 ? '正常' : '已使用',
              idCardNo: item.idCardNo,
              salesmanName: item.salesmanName,
              numericWord: item.numericWord,
              orgLevel1: item.orgLevel1,
              salesmanMobile: item.salesmanMobile,
              stringWord: item.stringWord,
              qty: item.qty,
              usableQty: item.usableQty,
              lotteryCode: item.no,
              no: item.no,
              type: item.type,
              id: item.id,
              impId: item.impId
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
        startTime: '',
        endTime: '',
        status: ''
      };
      this.pagination.currentPage = 1;
      this.loadData();
    },

    handleSelectionChange(selection: WhitelistItem[]) {
      this.selectedRows = selection;
    },

    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        ElMessage.warning('请选择要删除的数据');
        return;
      }

      ElMessageBox.confirm('确定要批量删除选中的数据吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const ids = this.selectedRows.map(row => row.id);
        const type = this.selectedRows[0]?.type || 1;
        const impId = this.selectedRows[0]?.impId;
        baseService.post(`${import.meta.env.VITE_APP_API}/whitelist/record/delete`, { ids, impId, type })
          .then((res: any) => {
            if (res.code === '00000') {
              ElMessage.success('批量删除成功');
              this.loadData();
            } else {
              ElMessage.error(res.msg || '批量删除失败');
            }
          })
          .catch(error => {
            console.error('批量删除失败:', error);
            ElMessage.error('批量删除失败');
          });
      });
    },

    handleDelete(row: any) {
      ElMessageBox.confirm('确定要删除这条数据吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        baseService.post(`${import.meta.env.VITE_APP_API}/whitelist/record/delete`, { ids: [row.id], impId: row.impId, type: row.type })
          .then((res: any) => {
            if (res.code === '00000') {
              ElMessage.success('删除成功');
              this.loadData();
            } else {
              ElMessage.error(res.msg || '删除失败');
            }
          })
          .catch(error => {
            console.error('删除失败:', error);
            ElMessage.error('删除失败');
          });
      });
    },

    handleFileChange(file: any) {
      this.importForm.file = file.raw;
    },

    downloadTemplate() {
      window.location.href = `${import.meta.env.VITE_APP_API}/whitelist/template?impId=${this.activityId}`;
    },

    handleImport() {
      if (!this.importForm.file) {
        ElMessage.warning('请选择要导入的文件');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.importForm.file);
      formData.append('impId', String(this.activityId));

      baseService.post(`${import.meta.env.VITE_APP_API}/whitelist/import`, formData, {
        'Content-Type': 'multipart/form-data'
      })
        .then((res: any) => {
          if (res.code === '00000') {
            ElMessage.success('导入成功');
            this.showImportDialog = false;
            this.importForm.file = null;
            this.loadData();
          } else {
            ElMessage.error(res.msg || '导入失败');
          }
        })
        .catch(error => {
          console.error('导入失败:', error);
          ElMessage.error('导入失败');
        });
    },

    handleExport() {
      baseService.get(`${import.meta.env.VITE_APP_API}/whitelist/record/list`, {
        impId: this.activityId,
        export: true
      }).then((res: any) => {
        if (res.code === '00000' && res.data && res.data.length > 0) {
          const fileUrl = res.data[0].fileUrl;
          if (fileUrl) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = res.data[0].fileName || '白名单数据.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            ElMessage.error('获取下载链接失败');
          }
        } else {
          ElMessage.error(res.msg || '导出失败');
        }
      }).catch(error => {
        console.error('导出失败:', error);
        ElMessage.error('导出失败');
      });
    },

    handleViewExportRecord() {
      // 显示导出记录弹窗
      this.showExportRecordDialog = true;
      this.loadExportRecordData();
    },

    loadExportRecordData() {
      const params: any = {
        impId: this.activityId,
        pageIndex: this.exportRecordPagination.currentPage,
        pageSize: this.exportRecordPagination.pageSize,
        fileType: 3
      };

      baseService.get(`${import.meta.env.VITE_APP_API}/code/download/list`, params)
        .then((res: any) => {
          if (res.code === '00000') {
            this.exportRecordPagination.total = res.total;
            this.exportRecordData = res.data.map((item: any): ExportRecordItem => ({
              id: item.id,
              fileName: item.fileName || '',
              downloadUrl: item.downloadUrl || '',
              createdTime: item.createdTime || ''
            }));
          } else {
            ElMessage.error(res.msg || '获取导出记录失败');
          }
        })
        .catch(error => {
          console.error('获取导出记录失败:', error);
          ElMessage.error('获取导出记录失败');
        });
    },

    handleDownloadExportFile(row: ExportRecordItem) {
      if (row.downloadUrl) {
        const link = document.createElement('a');
        link.href = row.downloadUrl;
        link.download = row.fileName || '导出文件.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        ElMessage.error('下载链接不存在');
      }
    },

    handleExportRecordSizeChange(size: number) {
      this.exportRecordPagination.pageSize = size;
      this.loadExportRecordData();
    },

    handleExportRecordCurrentChange(current: number) {
      this.exportRecordPagination.currentPage = current;
      this.loadExportRecordData();
    },

    handleLogSearch() {
      this.logPagination.currentPage = 1;
      this.loadLogData();
    },

    handleLogReset() {
      this.logSearchForm = {
        importNo: ''
      };
      this.logPagination.currentPage = 1;
      this.loadLogData();
    },

    loadLogData() {
      const params: any = {
        pageIndex: this.logPagination.currentPage,
        pageSize: this.logPagination.pageSize,
        importNo: this.logSearchForm.importNo,
        impId: this.activityId
      };

      baseService.get(`${import.meta.env.VITE_APP_API}/log/list`, params)
        .then((res: any) => {
          if (res.code === '00000') {
            this.logPagination.total = res.total;
            this.logTableData = res.data.map((item: any, index: number): ImportLogItem => ({
              index: (this.logPagination.currentPage - 1) * this.logPagination.pageSize + index + 1,
              logId: item.id,
              createTime: item.createTime || '',
              content: item.content || '',
              importNo: item.importNo || ''
            }));
          } else {
            ElMessage.error(res.msg || '获取日志数据失败');
          }
        })
        .catch(error => {
          console.error('获取日志数据失败:', error);
          ElMessage.error('获取日志数据失败');
        });
    },

    handleViewLogDetail(row: ImportLogItem) {
      this.showLogDetailDialog = true;
      this.loadLogDetailData(row.logId);
    },

    handleDownloadLog(row: ImportLogItem) {
      baseService.get(`${import.meta.env.VITE_APP_API}/log/error/list`, {
        export: true,
        logId: row.logId,
        impId: this.activityId
      }).then((res: any) => {
        if (res.code === '00000' && res.data && res.data.length > 0) {
          const fileUrl = res.data[0].fileUrl;
          if (fileUrl) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = res.data[0].fileName || '日志文件.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            ElMessage.error('获取下载链接失败');
          }
        } else {
          ElMessage.error(res.msg || '下载失败');
        }
      }).catch(error => {
        console.error('下载失败:', error);
        ElMessage.error('下载失败');
      });
    },

    loadLogDetailData(logId: number) {
      const params = {
        logId,
        impId: this.activityId,
        pageIndex: this.logDetailPagination.currentPage,
        pageSize: this.logDetailPagination.pageSize
      };

      baseService.get(`${import.meta.env.VITE_APP_API}/log/error/list?export=false`, params)
        .then((res: any) => {
          if (res.code === '00000') {
            this.logDetailPagination.total = res.total;
            this.logDetailData = res.data.map((item: any): LogDetailItem => ({
              createTime: item.createTime || '',
              statusReason: item.statusReason || '',
              tableLine: item.tableLine || 0
            }));
          } else {
            ElMessage.error(res.msg || '获取日志详情失败');
          }
        })
        .catch(error => {
          console.error('获取日志详情失败:', error);
          ElMessage.error('获取日志详情失败');
        });
    },

    handleSizeChange(size: number) {
      this.pagination.pageSize = size;
      this.loadData();
    },

    handleCurrentChange(current: number) {
      this.pagination.currentPage = current;
      this.loadData();
    },

    handleLogSizeChange(size: number) {
      this.logPagination.pageSize = size;
      this.loadLogData();
    },

    handleLogCurrentChange(current: number) {
      this.logPagination.currentPage = current;
      this.loadLogData();
    },

    handleLogDetailSizeChange(size: number) {
      this.logDetailPagination.pageSize = size;
      this.loadLogDetailData(this.logTableData[0]?.logId || 0);
    },

    handleLogDetailCurrentChange(current: number) {
      this.logDetailPagination.currentPage = current;
      this.loadLogDetailData(this.logTableData[0]?.logId || 0);
    }
  }
});
</script>

<style scoped>
.agent-whitelist {
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

.button-group {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.log-search {
  margin-bottom: 20px;
}

.log-pagination,
.log-detail-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
