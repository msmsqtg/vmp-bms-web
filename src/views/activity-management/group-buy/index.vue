<template>
  <div class="group-buy-management">
    <el-card shadow="never" class="rr-view-ctx-card">
      <!-- 搜索和筛选区域 -->
      <div class="search-filter">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="活动标题">
            <el-input v-model="searchForm.title" placeholder="请输入活动标题"></el-input>
          </el-form-item>
          <el-form-item label="活动时间">
            <el-date-picker
              v-model="searchForm.startTime"
              type="datetime"
              placeholder="选择开始时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="至">
            <el-date-picker
              v-model="searchForm.endTime"
              type="datetime"
              placeholder="选择结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="活动状态">
            <el-select v-model="searchForm.status" placeholder="全部">
              <el-option label="全部" value=""></el-option>
              <el-option label="未开始" value="1"></el-option>
              <el-option label="进行中" value="2"></el-option>
              <el-option label="非暂停" value="3"></el-option>
              <el-option label="已结束" value="4"></el-option>
              <el-option label="已暂停" value="5"></el-option>
              <el-option label="已删除" value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="handleCreate">新建活动</el-button>
      </div>

      <!-- 数据表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="activityTitle" label="活动标题"></el-table-column>
        <el-table-column prop="activityName" label="活动名称"></el-table-column>
        <el-table-column prop="activityCode" label="活动编号"></el-table-column>
        <el-table-column prop="startTime" label="活动开始时间"></el-table-column>
        <el-table-column prop="endTime" label="活动结束时间"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <span v-if="scope.row.status === '已结束'" class="status-ended">{{ scope.row.status }}</span>
            <span v-else-if="scope.row.status === '已暂停'" class="status-paused">{{ scope.row.status }}</span>
            <span v-else-if="scope.row.status === '已删除'" class="status-deleted">{{ scope.row.status }}</span>
            <span v-else class="status-normal">{{ scope.row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="activityLink" label="活动链接">
          <template #default="scope">
            <a :href="scope.row.activityLink" target="_blank">{{ scope.row.activityLink }}</a>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template #default="scope">
            <el-button style="padding: 0;" type="text" size="small" @click="handleEdit(scope.row)" v-if="scope.row.status !== '已删除'">编辑</el-button>
            <el-button style="padding: 0;" type="text" size="small" @click="handleView(scope.row)" v-if="scope.row.status !== '已删除'">查看</el-button>
            <el-button style="padding: 0;" type="text" size="small" @click="handlePageConfig(scope.row)">页面配置</el-button>
            <el-button style="padding: 0;" type="text" size="small" @click="handleGroupData(scope.row)">拼团数据</el-button>  
            <el-button style="padding: 0;" type="text" size="small" @click="handlePause(scope.row)" v-if="scope.row.status === '进行中'">暂停</el-button>
            <el-button style="padding: 0;" type="text" size="small" @click="handleEnable(scope.row)" v-if="scope.row.status === '已暂停'">开启</el-button>
            <el-button style="padding: 0;color: #F56C6C;" type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus';

interface ActivityItem {
  id: number | string;
  title: string;
  name: string;
  no: string;
  startTime: string;
  endTime: string;
  status: number | string;
  impUrl?: string;
}

interface TableRow {
  index: number;
  activityTitle: string;
  activityName: string;
  activityCode: string;
  startTime: string;
  endTime: string;
  status: string;
  activityLink: string;
  id: number | string;
}

export default defineComponent({
  name: "GroupBuyManagement",
  data() {
    return {
      searchForm: {
        title: '',
        startTime: '',
        endTime: '',
        status: '' as string | number
      },
      tableData: [] as TableRow[],
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
      const requestTime = new Date().toLocaleString('zh-CN', { hour12: false });
      const userId = 4440;
      const requestUrl = `${import.meta.env.VITE_APP_API}/team/up/list`;

      const params: any = {
        pageIndex: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        type: 2,
        title: this.searchForm.title,
        startTime: this.searchForm.startTime,
        endTime: this.searchForm.endTime,
        status: this.searchForm.status
      };

      if (this.searchForm.status === '') {
        delete params.status;
      }

      const headers = { createUserId: userId };

      console.log('=== 接口调用开始 ===');
      console.log('请求时间:', requestTime);
      console.log('用户ID:', userId);
      console.log('请求URL:', requestUrl);
      console.log('请求参数:', JSON.stringify(params, null, 2));
      console.log('请求头:', JSON.stringify(headers, null, 2));

      const startTime = Date.now();

      baseService.get(requestUrl, params, headers)
        .then((res: any) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          console.log('=== 接口调用成功 ===');
          console.log('响应时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
          console.log('请求耗时:', duration + 'ms');
          console.log('响应数据:', JSON.stringify(res, null, 2));

          if (res.code === '00000') {
            this.pagination.total = res.total;
            this.tableData = res.data.map((item: ActivityItem, index: number): TableRow => ({
              index: (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1,
              activityTitle: item.title,
              activityName: item.name,
              activityCode: item.no,
              startTime: item.startTime,
              endTime: item.endTime,
              status: this.getStatusText(item.status),
              activityLink: item.impUrl ? item.impUrl.trim() : '',
              id: item.id
            }));
            console.log('数据处理完成，共', this.tableData.length, '条记录');
          } else {
            console.error('获取活动列表失败:', res.msg);
          }
        })
        .catch(error => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          console.log('=== 接口调用失败 ===');
          console.log('响应时间:', new Date().toLocaleString('zh-CN', { hour12: false }));
          console.log('请求耗时:', duration + 'ms');
          console.error('错误信息:', error);
        });
    },

    getStatusText(status: number | string): string {
      const statusMap: Record<number, string> = {
        1: '未开始',
        2: '进行中',
        3: '非暂停',
        4: '已结束',
        5: '已暂停',
        6: '已删除'
      };
      return statusMap[Number(status)] || String(status);
    },

    handleSearch() {
      this.pagination.currentPage = 1;
      this.loadData();
    },

    handleReset() {
      this.searchForm = {
        title: '',
        startTime: '',
        endTime: '',
        status: ''
      };
      this.pagination.currentPage = 1;
      this.loadData();
    },

    handleCreate() {
      this.$router.push('/activity-management/group-buy/create');
    },

    handleEdit(row: TableRow) {
      // 跳转到create.vue页面的基础设置tab
      this.$router.push({
        path: '/activity-management/group-buy/create',
        query: {
          impId: row.id,
          tab: 'basic'
        }
      });
    },

    handleView(row: TableRow) {
      // 跳转到create.vue页面的基础设置tab，设置为查看模式
      this.$router.push({
        path: '/activity-management/group-buy/create',
        query: {
          impId: row.id,
          tab: 'basic',
          mode: 'view'
        }
      });
    },

    handlePageConfig(row: TableRow) {
      // 跳转到页面配置
      this.$router.push({
        path: '/activity-management/group-buy/page-config',
        query: {
          impId: row.id
        }
      });
    },

    handleGroupData(row: TableRow) {
      console.log('拼团数据', row.id);
    },

    handlePause(row: TableRow) {
      ElMessageBox.confirm('确定要暂停该活动吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const requestUrl = `${import.meta.env.VITE_APP_API}/team/up/main/update/status`;
        const params = {
          id: row.id,
          type: 1 // 1 暂停
        };
        const headers = { createUserId: 4440 };

        baseService.post(requestUrl, params, headers)
          .then((res: any) => {
            if (res.code === '00000') {
              ElMessage.success('暂停成功');
              this.loadData();
            } else {
              ElMessage.error(res.msg || '暂停失败');
            }
          })
          .catch(error => {
            console.error('暂停失败:', error);
            ElMessage.error('暂停失败');
          });
      }).catch(() => {
        // 取消操作
      });
    },

    handleEnable(row: TableRow) {
      ElMessageBox.confirm('确定要开启该活动吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        const requestUrl = `${import.meta.env.VITE_APP_API}/team/up/main/update/status`;
        const params = {
          id: row.id,
          type: 2 // 2 取消暂停
        };
        const headers = { createUserId: 4440 };

        baseService.post(requestUrl, params, headers)
          .then((res: any) => {
            if (res.code === '00000') {
              ElMessage.success('开启成功');
              this.loadData();
            } else {
              ElMessage.error(res.msg || '开启失败');
            }
          })
          .catch(error => {
            console.error('开启失败:', error);
            ElMessage.error('开启失败');
          });
      }).catch(() => {
        // 取消操作
      });
    },

    handleDelete(row: TableRow) {
      ElMessageBox.confirm('确定要删除该活动吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const requestUrl = `${import.meta.env.VITE_APP_API}/team/up/main/update/status`;
        const params = {
          id: row.id,
          type: 3 // 3 删除
        };
        const headers = { createUserId: 4440 };

        baseService.post(requestUrl, params, headers)
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
      }).catch(() => {
        // 取消操作
      });
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
.group-buy-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-filter {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.status-ended {
  color: #909399;
}

.status-paused {
  color: #E6A23C;
}

.status-deleted {
  color: #F56C6C;
}

.status-normal {
  color: #67C23A;
}

/* 操作按钮样式 */
:deep(.el-table-column__content .el-button) {
  margin-right: 5px;
  padding: 0;
}
</style>
