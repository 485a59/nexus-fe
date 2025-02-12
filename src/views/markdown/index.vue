<script setup lang="ts">
import { ref } from "vue";
import { useDark } from "@pureadmin/utils";
import Vditor from "./components/Vditor.vue";
import { ElMessage } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import SaveLine from "@iconify-icons/ri/save-line";
import FileTextLine from "@iconify-icons/ri/file-text-line";

defineOptions({
  name: "Markdown"
});

const { isDark } = useDark();
const docTitle = ref("");
const text = ref(`
\`\`\`ts
function sayHello(): void {
\tconsole.log("Hello, World!");
}
sayHello();
\`\`\`
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
`);

const handleSave = () => {
  if (!docTitle.value.trim()) {
    ElMessage.warning("请输入文档标题");
    return;
  }
  ElMessage.success("保存成功");
};
</script>

<template>
  <el-card shadow="never" class="markdown-card">
    <template #header>
      <div class="header-container">
        <div class="left-section">
          <el-icon class="file-icon">
            <component :is="useRenderIcon(FileTextLine)" />
          </el-icon>
          <el-input
            v-model="docTitle"
            placeholder="未命名文档"
            class="title-input"
          >
            <template #suffix>
              <span class="file-ext">.md</span>
            </template>
          </el-input>
        </div>
        <el-button
          type="primary"
          @click="handleSave"
          :icon="useRenderIcon(SaveLine)"
        >
          保存
        </el-button>
      </div>
    </template>
    <Vditor
      v-model="text"
      :options="{
        height: 560,
        outline: { enable: true, position: 'right' },
        theme: isDark ? 'dark' : 'light'
      }"
    />
  </el-card>
</template>

<style lang="scss" scoped>
.markdown-card {
  :deep(.el-card__header) {
    padding: 0;
    border-bottom: 1px solid var(--el-border-color-light);
  }
}

.header-container {
  height: 48px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.file-icon {
  font-size: 18px;
  color: var(--el-text-color-secondary);
}

.title-input {
  width: 300px;

  :deep(.el-input__wrapper) {
    padding-right: 8px;
    box-shadow: none;

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    .el-input__inner {
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-primary);

      &::placeholder {
        font-weight: normal;
      }
    }
  }
}

.file-ext {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}
</style>
