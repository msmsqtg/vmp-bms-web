<template>
  <div class="invitation-management">
    <el-card shadow="never" class="rr-view-ctx-card">
      <!-- 搜索和筛选区域 -->
      <div class="search-filter">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="活动名称">
            <el-input v-model="searchForm.activityName" placeholder="请输入活动名称"></el-input>
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
              <el-option label="已结束" value="3"></el-option>
              <el-option label="已暂停" value="4"></el-option>
              <el-option label="已删除" value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动标题">
            <el-input v-model="searchForm.activityTitle" placeholder="请输入活动标题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="handleCreate">+ 新增邀约活动</el-button>
      </div>

      <!-- 数据表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="activityName" label="活动名称"></el-table-column>
        <el-table-column prop="activityCode" label="活动编号"></el-table-column>
        <el-table-column prop="activityTitle" label="活动标题"></el-table-column>
        <el-table-column prop="activityLink" label="活动链接">
          <template #default="scope">
            <a :href="scope.row.activityLink" target="_blank">{{ scope.row.activityLink }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="formSubmitLink" label="表单提交链接">
          <template #default="scope">
            <a :href="scope.row.formSubmitLink" target="_blank">{{ scope.row.formSubmitLink }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="activityTime" label="活动时间"></el-table-column>
        <el-table-column prop="status" label="活动状态">
          <template #default="scope">
            <span v-if="scope.row.status === '已结束'" class="status-ended">{{ scope.row.status }}</span>
            <span v-else-if="scope.row.status === '已暂停'" class="status-paused">{{ scope.row.status }}</span>
            <span v-else-if="scope.row.status === '已删除'" class="status-deleted">{{ scope.row.status }}</span>
            <span v-else class="status-normal">{{ scope.row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template #default="scope">
            <el-button style="padding: 0; margin-right: 5px" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button style="padding: 0; margin-right: 5px" type="text" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button style="padding: 0; margin-right: 5px" type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
            <el-button style="padding: 0; margin-right: 5px" type="text" size="small" @click="handleAgentWhitelist(scope.row)">代理人白名单</el-button>
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

interface InvitationItem {
  id: number | string;
  name: string;
  code: string;
  title: string;
  activityLink: string;
  formSubmitLink: string;
  startTime: string;
  endTime: string;
  status: number | string;
}

interface TableRow {
  index: number;
  activityName: string;
  activityCode: string;
  activityTitle: string;
  activityLink: string;
  formSubmitLink: string;
  activityTime: string;
  status: string;
  id: number | string;
  activityId: string;
}

export default defineComponent({
  name: "InvitationManagement",
  data() {
    return {
      searchForm: {
        activityName: '',
        activityTitle: '',
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
      const requestUrl = `${import.meta.env.VITE_APP_API}/api/invitation/activity/list`;

      const params: any = {
        pageIndex: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        name: this.searchForm.activityName,
        title: this.searchForm.activityTitle,
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
            this.tableData = res.data.map((item: any, index: number): TableRow => ({
              index: (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1,
              activityName: item.name,
              activityCode: item.activityNo || '',
              activityTitle: item.name, // 使用活动名称作为标题
              activityLink: item.thirdLinkAddress ? item.thirdLinkAddress.trim() : '',
              formSubmitLink: item.thirdLinkAddress ? item.thirdLinkAddress.trim() : '',
              activityTime: `${item.startTime} 至 ${item.endTime}`,
              status: this.getStatusText(item.isDel),
              id: item.id,
              activityId: item.activityId || ''
            }));
            console.log('数据处理完成，共', this.tableData.length, '条记录');
          } else {
            console.error('获取邀约活动列表失败:', res.msg);
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

    getStatusText(isDel: number | string): string {
      return Number(isDel) === 0 ? '正常' : '已删除';
    },

    handleSearch() {
      this.pagination.currentPage = 1;
      this.loadData();
    },

    handleReset() {
      this.searchForm = {
        activityName: '',
        activityTitle: '',
        startTime: '',
        endTime: '',
        status: ''
      };
      this.pagination.currentPage = 1;
      this.loadData();
    },

    handleCreate() {
      // 跳转到创建页面
      this.$router.push('/invitation-management/create');
    },

    handleEdit(row: TableRow) {
      // 跳转到编辑页面
      this.$router.push({
        path: '/invitation-management/create',
        query: {
          id: row.id,
          impId: row.activityId
        }
      });
    },

    handleView(row: TableRow) {
      // 跳转到查看页面
      this.$router.push({
        path: '/invitation-management/create',
        query: {
          id: row.id,
          mode: 'view',
          impId: row.activityId
        }
      });
    },

    handleDelete(row: TableRow) {
      ElMessageBox.confirm('确定要删除该活动吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const requestUrl = `${import.meta.env.VITE_APP_API}/invitation/delete`;
        const params = {
          id: row.id
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

    handleAgentWhitelist(row: TableRow) {
      // 跳转到代理人白名单页面
      this.$router.push({
        path: '/invitation-management/agent-whitelist',
        query: {
          activityId: row.id,
          _mt: '代理人白名单'
        }
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
.invitation-management {
  padding: 20px;
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