<template>
  <div class="basic-config">
    <h3>基本信息</h3>
    <el-form :model="localForm" label-width="120px">
      <el-form-item label="活动名称" required>
        <el-input v-model="localForm.name" placeholder="请输入活动名称" :disabled="isViewMode" @input="handleFormChange"></el-input>
      </el-form-item>
      <el-form-item label="活动标题" required>
        <el-input v-model="localForm.title" placeholder="请输入活动标题" :disabled="isViewMode" @input="handleFormChange"></el-input>
      </el-form-item>
      <el-form-item label="活动时间" required>
        <el-date-picker
          v-model="localActivityTimeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
          @change="handleTimeChange"
          :disabled="isViewMode"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="载体类型" required>
        <el-radio-group v-model="localForm.carrier_type" :disabled="isViewMode" @change="handleFormChange">
          <el-radio label="1">APP</el-radio>
          <el-radio label="2">小程序</el-radio>
          <el-radio label="3">公众号</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="主题背景图">
        <div class="upload-container">
          <div class="upload-row">
            <!-- 图片展示 -->
            <div v-if="localForm.home_bg_pic && localForm.home_bg_pic.length > 0" class="image-preview-list">
              <div v-for="(image, index) in localForm.home_bg_pic" :key="index" class="image-preview-item">
                <img :src="String(image).trim()" alt="主题背景图" class="preview-image">
                <el-button v-if="!isViewMode" type="danger" size="small" @click="removeImage(Number(index))">删除</el-button>
              </div>
            </div>
            <!-- 上传占位符 -->
            <div v-else class="upload-placeholder">
              <div class="placeholder-icon">!</div>
            </div>
            <!-- 上传按钮，仅在非查看模式且背景图数量小于5张时显示 -->
            <div v-if="!isViewMode && (!localForm.home_bg_pic || localForm.home_bg_pic.length < 5)" class="upload-button">
              <el-button type="primary" plain :disabled="isViewMode" @click="uploadImage">+</el-button>
            </div>
          </div>
          <div class="upload-tip">建议尺寸：宽750px 高750px，格式为jpg/png/gif，最多上传5张</div>
        </div>
      </el-form-item>
      <h3>关联活动设置</h3>
      <el-form-item label="是否有关联活动">
        <el-switch v-model="localForm.activity_switch" :disabled="isViewMode" @change="handleFormChange" :active-value="2" :inactive-value="1"></el-switch>
      </el-form-item>
      
      <el-form-item label="选择关联活动" required v-if="localForm.activity_switch === 2">
        <el-select v-model="localForm.activity_type" placeholder="选择关联活动" :disabled="isViewMode" @change="handleRelatedActivity1Change" style="width: 200px; margin-right: 10px;">
          <el-option label="组团" value="1"></el-option>
          <el-option label="拼团" value="2"></el-option>
          <el-option label="健步走" value="3"></el-option>
          <el-option label="定时抽奖" value="4"></el-option>
        </el-select>
        <el-select v-model="localForm.activity_id" placeholder="选择关联活动" :disabled="isViewMode" @change="handleFormChange" style="width: 200px;" :loading="relatedActivityLoading">
          <el-option v-for="item in relatedActivityOptions" :key="item.id" :label="item.name" :value="String(item.id)"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="选择关联机构" required v-if="localForm.activity_switch === 2">
        <el-select v-model="localForm.top_dept_id" placeholder="选择关联机构" :disabled="isViewMode" @change="handleFormChange" style="width: 200px;" :loading="organizationLoading">
          <el-option v-for="item in organizationOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <h3>抽奖次数设置</h3>
      <el-form-item label="启用代理人次数限制">
        <el-switch v-model="localForm.whitelist_qty_switch" :disabled="isViewMode" @change="handleFormChange" :active-value="1" :inactive-value="2"></el-switch>
      </el-form-item>
      
      <el-form-item label="客户参与活动次数超限提示语" required v-if="localForm.whitelist_qty_switch === 1">
        <el-input
          v-model="localForm.whitelist_qty_switch_msg"
          type="textarea"
          :rows="3"
          placeholder="客户参与活动次数超限提示语"
          :disabled="isViewMode"
          @input="handleFormChange"
          maxlength="20"
          show-word-limit
        ></el-input>
      </el-form-item>
      
      <h3>代理人邀约码设置</h3>
      <el-form-item label="启用代理人唯一邀约码限制">
        <el-switch v-model="localForm.invitation_code_switch" :disabled="isViewMode" @change="handleFormChange" :active-value="1" :inactive-value="2"></el-switch>
      </el-form-item>
      
      <el-form-item label="限制次数" required v-if="localForm.invitation_code_switch === 1">
        <el-input-number v-model="localForm.invitation_code_num" :min="1" :max="99" :disabled="isViewMode" @change="handleFormChange"></el-input-number>
      </el-form-item>
      
      <el-form-item label="客户邀约码被使用提示语" required v-if="localForm.invitation_code_switch === 1">
        <el-input
          v-model="localForm.invitation_code_switch_msg"
          type="textarea"
          :rows="3"
          placeholder="客户邀约码被使用提示语"
          :disabled="isViewMode"
          @input="handleFormChange"
          maxlength="20"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import baseService from "@/service/baseService";

export default defineComponent({
  name: "BasicConfig",
  props: {
    form: {
      type: Object,
      default: () => ({
        id: '',
        store_id: 0,
        name: '',
        title: '',
        activity_no: '',
        activity_type: '',
        activity_id: '',
        start_time: '',
        end_time: '',
        carrier_type: '3',
        login_switch: '1',
        login_whitelist_switch: '2',
        data_switch: '2',
        c_data_switch: '2',
        customer_switch: '2',
        sign_in_status: '0',
        login_form: '',
        data_form: '',
        c_data_form: '',
        share_mode: '1',
        is_del: 0,
        tenant_id: 1,
        home_bg_pic: [] as any[],
        activity_switch: 1, // 默认不关联
        top_dept_id: '',
        whitelist_qty_switch: 2,
        whitelist_qty_switch_msg: '',
        invitation_code_switch: 2,
        invitation_code_switch_msg: '',
        invitation_code_num: 1,
        share_bg_setting: '{"share_style": "1", "share_bg_pic": "", "wx_share_pic": "", "share_btn_pic": "", "share_id_type": 1, "wx_share_desc": "", "wx_share_title": ""}'
      })
    },
    isViewMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:form', 'save-success'],
  setup(props, { emit }) {
    const localForm = ref({ ...props.form });
    const localActivityTimeRange = ref<string[]>([]);
    const relatedActivityLoading = ref(false);
    const relatedActivityOptions = ref<any[]>([]);
    const organizationLoading = ref(false);
    const organizationOptions = ref<any[]>([]);

    // 初始化时间范围
    if (props.form.start_time && props.form.end_time) {
      localActivityTimeRange.value = [props.form.start_time, props.form.end_time];
    }

    // 初始化时确保关联活动设置字段有正确的值
    if (localForm.value.activity_switch === undefined) {
      localForm.value.activity_switch = 1; // 默认不关联
    } else {
      localForm.value.activity_switch = Number(localForm.value.activity_switch);
    }
    if (localForm.value.activity_type === undefined) {
      localForm.value.activity_type = '';
    } else {
      localForm.value.activity_type = String(localForm.value.activity_type);
    }
    if (localForm.value.activity_id === undefined) {
      localForm.value.activity_id = '';
    } else {
      localForm.value.activity_id = String(localForm.value.activity_id);
    }
    if (localForm.value.top_dept_id === undefined) {
      localForm.value.top_dept_id = '';
    } else {
      localForm.value.top_dept_id = String(localForm.value.top_dept_id);
    }
    // 初始化时确保抽奖次数设置字段有正确的值
    if (localForm.value.whitelist_qty_switch === undefined) {
      localForm.value.whitelist_qty_switch = 2;
    }
    if (localForm.value.whitelist_qty_switch_msg === undefined) {
      localForm.value.whitelist_qty_switch_msg = '';
    }
    // 初始化时确保代理人邀约码设置字段有正确的值
    if (localForm.value.invitation_code_switch === undefined) {
      localForm.value.invitation_code_switch = 2;
    }
    if (localForm.value.invitation_code_switch_msg === undefined) {
      localForm.value.invitation_code_switch_msg = '';
    }
    if (localForm.value.invitation_code_num === undefined) {
      localForm.value.invitation_code_num = 1;
    }


    // 监听外部 form 变化
    watch(
      () => props.form,
      (newForm) => {
        console.log('=== props.form 变化 ===');
        console.log('newForm.activity_switch:', newForm.activity_switch);
        console.log('newForm.activity_type:', newForm.activity_type);
        console.log('newForm.activity_id:', newForm.activity_id);
        console.log('newForm.top_dept_id:', newForm.top_dept_id);
        
        localForm.value = { ...newForm };
        // 确保 carrier_type 是字符串类型
        if (newForm.carrier_type !== undefined) {
          localForm.value.carrier_type = String(newForm.carrier_type);
        }
        // 确保 home_bg_pic 是数组类型
        if (newForm.home_bg_pic) {
          localForm.value.home_bg_pic = Array.isArray(newForm.home_bg_pic) ? newForm.home_bg_pic : [];
        } else {
          localForm.value.home_bg_pic = [];
        }
        // 确保 activity_switch 是数字类型
        if (newForm.activity_switch !== undefined) {
          localForm.value.activity_switch = Number(newForm.activity_switch);
          console.log('localForm.value.activity_switch after Number():', localForm.value.activity_switch);
        }
        // 确保 activity_type 是字符串类型
        if (newForm.activity_type !== undefined) {
          localForm.value.activity_type = String(newForm.activity_type);
        }
        // 确保 activity_id 是字符串类型
        if (newForm.activity_id !== undefined) {
          localForm.value.activity_id = String(newForm.activity_id);
          // 当 activity_id 存在时，加载活动信息
          if (newForm.activity_id) {
            loadActivityInfo(newForm.activity_id);
          }
        }
        // 确保 top_dept_id 是字符串类型
        if (newForm.top_dept_id !== undefined) {
          localForm.value.top_dept_id = String(newForm.top_dept_id);
        }
        // 确保 whitelist_qty_switch 是数字类型
        if (newForm.whitelist_qty_switch !== undefined) {
          localForm.value.whitelist_qty_switch = Number(newForm.whitelist_qty_switch);
        }
        // 当 activity_type 变化时，重新加载相关活动列表
        if (newForm.activity_type) {
          loadRelatedActivities(newForm.activity_type).then(() => {
            // 重新加载活动信息，确保活动信息被添加到 relatedActivityOptions 中
            if (newForm.activity_id) {
              loadActivityInfo(newForm.activity_id);
            }
          });
        }
        // 确保 whitelist_qty_switch_msg 是字符串类型
        if (newForm.whitelist_qty_switch_msg !== undefined) {
          localForm.value.whitelist_qty_switch_msg = String(newForm.whitelist_qty_switch_msg);
        }
        // 确保 invitation_code_switch 是数字类型
        if (newForm.invitation_code_switch !== undefined) {
          localForm.value.invitation_code_switch = Number(newForm.invitation_code_switch);
        }
        // 确保 invitation_code_switch_msg 是字符串类型
        if (newForm.invitation_code_switch_msg !== undefined) {
          localForm.value.invitation_code_switch_msg = String(newForm.invitation_code_switch_msg);
        }
        // 确保 invitation_code_num 是数字类型
        if (newForm.invitation_code_num !== undefined) {
          localForm.value.invitation_code_num = Number(newForm.invitation_code_num);
        }
        if (newForm.start_time && newForm.end_time) {
          localActivityTimeRange.value = [newForm.start_time, newForm.end_time];
        }
        
        console.log('=== localForm.value 变化后 ===');
        console.log('localForm.value.activity_switch:', localForm.value.activity_switch);
        console.log('localForm.value.activity_type:', localForm.value.activity_type);
        console.log('localForm.value.activity_id:', localForm.value.activity_id);
        console.log('localForm.value.top_dept_id:', localForm.value.top_dept_id);
      },
      { deep: true }
    );

    // 加载关联活动列表
    const loadRelatedActivities = async (type: string) => {
      relatedActivityLoading.value = true;
      try {
        const url = `${import.meta.env.VITE_APP_API}/team/up/list?pageSize=10&pageIndex=1&type=${type}`;
        const res: any = await baseService.get(url);
        console.log('=== 加载关联活动列表接口返回 ===');
        console.log('响应数据:', JSON.stringify(res, null, 2));
        
        // 接口返回的数据结构是 { code: '00000', data: [活动列表] }
        if (res.code === '00000' && res.data) {
          // 检查 res.data 是数组还是对象
          if (Array.isArray(res.data)) {
            relatedActivityOptions.value = res.data;
          } else if (res.data.data && Array.isArray(res.data.data)) {
            relatedActivityOptions.value = res.data.data;
          } else if (res.data.list && Array.isArray(res.data.list)) {
            relatedActivityOptions.value = res.data.list;
          } else {
            relatedActivityOptions.value = [];
          }
        } else {
          relatedActivityOptions.value = [];
        }
      } catch (error) {
        console.error('加载关联活动列表失败:', error);
        relatedActivityOptions.value = [];
      } finally {
        relatedActivityLoading.value = false;
      }
    };

    // 根据 activity_id 查询活动信息
    const loadActivityInfo = async (activityId: string) => {
      if (!activityId) return;
      
      try {
        // 注意：这里需要根据实际接口参数格式调整
        // 用户建议使用 impId = activity_id 作为入参
        const url = `${import.meta.env.VITE_APP_API}/team/up/main/info?impId=${activityId}`;
        const res: any = await baseService.get(url);
        if (res.code === '00000' && res.data) {
          // 检查活动是否已经在 relatedActivityOptions 中
          const existingIndex = relatedActivityOptions.value.findIndex(item => String(item.id) === activityId);
          if (existingIndex === -1) {
            // 将活动信息添加到 relatedActivityOptions 中
            relatedActivityOptions.value.push(res.data);
          }
        }
      } catch (error) {
        console.error('加载活动信息失败:', error);
      }
    };

    // 初始化时确保 carrier_type 是字符串类型
    if (props.form.carrier_type !== undefined) {
      localForm.value.carrier_type = String(props.form.carrier_type);
    }
    // 初始化时确保 home_bg_pic 是数组类型
    if (props.form.home_bg_pic) {
      localForm.value.home_bg_pic = Array.isArray(props.form.home_bg_pic) ? props.form.home_bg_pic : [];
    } else {
      localForm.value.home_bg_pic = [];
    }
    // 确保其他字段有正确的值
    if (localForm.value.login_switch === undefined) {
      localForm.value.login_switch = '1';
    }
    if (localForm.value.data_switch === undefined) {
      localForm.value.data_switch = '2';
    }
    if (localForm.value.customer_switch === undefined) {
      localForm.value.customer_switch = '2';
    }
    if (localForm.value.sign_in_status === undefined) {
      localForm.value.sign_in_status = '0';
    }
    
    // 初始化时根据 activity_type 加载相关活动列表
    if (localForm.value.activity_type) {
      loadRelatedActivities(localForm.value.activity_type).then(() => {
        // 加载活动信息，确保活动信息被添加到 relatedActivityOptions 中
        if (localForm.value.activity_id) {
          loadActivityInfo(localForm.value.activity_id);
        }
      });
    } else if (localForm.value.activity_id) {
      // 如果没有 activity_type，但有 activity_id，直接加载活动信息
      loadActivityInfo(localForm.value.activity_id);
    }

    const handleTimeChange = (value: any) => {
      localActivityTimeRange.value = value;
      if (value && value.length === 2) {
        localForm.value.start_time = value[0];
        localForm.value.end_time = value[1];
        emit('update:form', { ...localForm.value });
      }
    };

    const handleFormChange = () => {
      emit('update:form', { ...localForm.value });
    };

    // 处理第一个关联活动选择变化
    const handleRelatedActivity1Change = async (value: string) => {
      localForm.value.activity_type = value;
      // 清空第二个关联活动的选择
      localForm.value.activity_id = '';
      // 根据第一个选择的类型加载第二个关联活动的选项
      if (value) {
        await loadRelatedActivities(value);
      }
      handleFormChange();
    };

    // 加载机构列表
    const loadOrganizations = async () => {
      organizationLoading.value = true;
      try {
        const url = `${import.meta.env.VITE_APP_API}/sys/dept/top/list`;
        const res: any = await baseService.get(url);
        if (res.code === 200 && res.data) {
          // 接口返回的数据结构是 { code: 200, data: [机构列表] }
          organizationOptions.value = Array.isArray(res.data) ? res.data : [];
        } else {
          organizationOptions.value = [];
        }
      } catch (error) {
        console.error('加载机构列表失败:', error);
        organizationOptions.value = [];
      } finally {
        organizationLoading.value = false;
      }
    };

    // 初始化加载机构列表
    loadOrganizations();

    // 图片上传函数
    const uploadImage = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          try {
            const uploadUrl = `${import.meta.env.VITE_APP_API}/common/upload/image`;
            const res: any = await baseService.post(uploadUrl, formData);
            if (res.code === '00000' && res.data?.url) {
              // 处理主题背景图，支持多张，最多5张
              if (!localForm.value.home_bg_pic) {
                localForm.value.home_bg_pic = [];
              }
              if (localForm.value.home_bg_pic.length < 5) {
                localForm.value.home_bg_pic.push(res.data.url);
              } else {
                ElMessage.warning('最多只能上传5张图片');
                return;
              }
              handleFormChange();
              ElMessage.success('上传成功');
            }
          } catch (error) {
            console.error('上传失败:', error);
            ElMessage.error('上传失败');
          }
        }
      };
      input.click();
    };

    // 删除图片函数
    const removeImage = (index: number) => {
      if (localForm.value.home_bg_pic && localForm.value.home_bg_pic.length > 0) {
        localForm.value.home_bg_pic.splice(index, 1);
        handleFormChange();
        ElMessage.success('删除成功');
      }
    };



    return {
      localForm,
      localActivityTimeRange,
      relatedActivityLoading,
      relatedActivityOptions,
      organizationLoading,
      organizationOptions,
      handleTimeChange,
      handleFormChange,
      handleRelatedActivity1Change,
      uploadImage,
      removeImage
    };
  }
});
</script>

<style scoped>
.basic-config {
  padding: 20px 0;
}

/* 修复label多行时被遮挡的问题 */
:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  white-space: normal;
  line-height: 1.4;
  height: auto;
  padding-top: 0;
  padding-bottom: 5px;
}

:deep(.el-form-item__content) {
  margin-left: 130px !important;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: wrap;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
}

.upload-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: 10px;
  width: 100%;
}

.upload-placeholder {
  width: 150px;
  height: 150px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  margin-right: 10px;
  margin-bottom: 10px;
}

.placeholder-icon {
  font-size: 48px;
  color: #409eff;
  font-weight: bold;
}

.upload-button {
  margin-right: 10px;
  margin-bottom: 10px;
  align-self: flex-start;
}

.upload-tip {
  color: #909399;
  font-size: 12px;
  width: 100%;
  margin-top: 5px;
}

.image-preview-list {
  display: flex;
  flex-wrap: wrap;
  margin-right: 10px;
  margin-bottom: 10px;
}

.image-preview-item {
  margin: 0 10px 10px 0;
  position: relative;
}

.preview-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.image-preview-item .el-button {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  border-radius: 0 0 4px 4px;
}

/* 确保内容编辑区域不被限制高度 */
.el-form {
  min-height: 100%;
}

/* 确保整个组件高度自适应 */
.basic-config {
  min-height: 100%;
  overflow-y: auto;
  padding: 20px;
}

/* 调整radio-group布局 */
:deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
}

:deep(.el-radio) {
  margin-right: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

/* 确保radio标签正确显示 */
:deep(.el-radio__input) {
  margin-right: 5px;
  margin-bottom: 0;
  display: inline-block;
}
</style>