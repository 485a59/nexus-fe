<script setup lang="ts">
import { ref } from "vue";
import { usePPT } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import Preview from "@iconify-icons/ep/view";
import Download from "@iconify-icons/ep/download";

defineOptions({
  name: "ContentPPT"
});

const formRef = ref();
const tableRef = ref();

const {
  form,
  loading,
  columns,
  dataList,
  selectedNum,
  onSearch,
  resetForm,
  onbatchDel,
  openDialog,
  addChapter,
  handleUpdate,
  handleDelete,
  handleSizeChange,
  onSelectionCancel,
  handleCurrentChange,
  handleSelectionChange
} = usePPT(tableRef);

function onFullscreen() {
  // 重置表格高度
  tableRef.value.setAdaptive();
}
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="课件名称：" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入课件名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择"
          clearable
          class="!w-[180px]"
        >
          <el-option label="已发布" value="1" />
          <el-option label="未发布" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      title="课件管理"
      :columns="columns"
      :tableRef="tableRef?.getTableRef()"
      :isExpandAll="false"
      @refresh="onSearch"
      @fullscreen="onFullscreen"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog()"
        >
          新增课件
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          adaptive
          row-key="id"
          :adaptiveConfig="{ offsetBottom: 32 }"
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-button
              v-if="!row.children"
              class="reset-margin"
              link
              type="warning"
              :size="size"
              :icon="useRenderIcon(Preview)"
              @click="window.open(row.previewUrl, '_blank')"
            >
              预览
            </el-button>
            <el-button
              v-if="!row.children"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(Download)"
              @click="window.open(row.downloadUrl, '_blank')"
            >
              下载
            </el-button>

            <el-popconfirm
              :title="`是否确认删除课件《${row.name}》${row?.children?.length > 0 ? '。注意下级课件也会一并删除，请谨慎操作' : ''}`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-table__inner-wrapper::before) {
  height: 0;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

.main {
  // 不需要设置 margin 和 padding
}

:deep(.el-button:focus-visible) {
  outline: none;
}

.reset-margin {
  margin: 0;
}

.chapter-header {
  border: 1px solid var(--el-border-color);
  border-bottom: none;
  border-radius: 4px 4px 0 0;
}
</style>
