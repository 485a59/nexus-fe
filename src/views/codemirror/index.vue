<script setup lang="ts">
import { useDark } from "@pureadmin/utils";
import { ref, watch } from "vue";
import MonacoEditor from "monaco-editor-vue3";
import * as monaco from "monaco-editor";
import { ElMessage } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import SaveLine from "@iconify-icons/ri/save-line";
import FileTextLine from "@iconify-icons/ri/file-text-line";
const { isDark } = useDark();

// 文档标题
const docTitle = ref("");

// 支持的语言列表
const languages = [
  { label: "Markdown", value: "markdown" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "JSON", value: "json" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "SQL", value: "sql" },
  { label: "Plain Text", value: "plaintext" }
];

const currentLanguage = ref("markdown");
const code = ref("");

// 根据语言获取默认模板
const getTemplateByLanguage = (lang: string) => {
  switch (lang) {
    case "markdown":
      return `# 未命名文档

## 简介

这是一个新的文档...

## 目录

1. 第一部分
2. 第二部分

## 正文

在这里开始编写您的内容...
`;
    case "javascript":
      return `/**
 * 文件描述：
 * 创建时间：${new Date().toLocaleString()}
 */

function main() {
    console.log("Hello, World!");
}

main();`;
    case "python":
      return `#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
文件描述：
创建时间：${new Date().toLocaleString()}
"""

def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`;
    default:
      return "";
  }
};

// 初始化内容
code.value = getTemplateByLanguage(currentLanguage.value);

const editorOptions = {
  language: currentLanguage.value,
  theme: isDark.value ? "vs-dark" : "vs",
  automaticLayout: true,
  minimap: {
    enabled: false
  },
  fontSize: 14,
  tabSize: 2,
  scrollBeyondLastLine: false,
  readOnly: false,
  autoClosingBrackets: "always",
  autoClosingQuotes: "always",
  formatOnPaste: true,
  formatOnType: true,
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: "on",
  quickSuggestions: {
    other: true,
    comments: true,
    strings: true
  },
  snippetSuggestions: "top",
  colors: {
    focusBorder: "#ffffff",
    "editorCursor.foreground": "#666666",
    "editor.selectionBackground": "#e5ebf1"
  },
  wordWrap: "on"
};

// 监听暗色模式变化
watch(
  () => isDark.value,
  newVal => {
    editorOptions.theme = newVal ? "vs-dark" : "vs";
  }
);

// 监听语言变化
watch(
  () => currentLanguage.value,
  newVal => {
    editorOptions.language = newVal;
    if (!code.value) {
      code.value = getTemplateByLanguage(newVal);
    }
  }
);

const handleChange = (value: string) => {
  code.value = value;
};

// 保存文档
const handleSave = () => {
  if (!docTitle.value.trim()) {
    ElMessage.warning("请输入文档标题");
    return;
  }
  // TODO: 调用保存接口
  ElMessage.success("保存成功");
};

// 编辑器实例准备就绪的回调
const handleEditorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
  // 配置自定义代码补全
  monaco.languages.registerCompletionItemProvider("javascript", {
    provideCompletionItems: () => {
      const suggestions = [
        {
          label: "console.log",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "console.log($1);",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "输出到控制台"
        },
        {
          label: "function",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: "function ${1:name}(${2:params}) {\n\t${3}\n}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: "函数声明"
        }
      ];
      return { suggestions };
    }
  });
};

// 获取文件图标
const getFileIcon = (language: string) => {
  // 可以根据不同语言返回不同图标
  return FileTextLine;
};
</script>

<template>
  <el-card shadow="never" class="editor-card">
    <div class="editor-container">
      <div class="title-bar">
        <div class="file-info">
          <el-icon class="file-icon">
            <component :is="useRenderIcon(getFileIcon(currentLanguage))" />
          </el-icon>
          <el-input
            v-model="docTitle"
            placeholder="未命名文档"
            class="title-input"
          >
            <template #suffix>
              <span class="file-ext">{{
                currentLanguage === "plaintext" ? ".txt" : `.${currentLanguage}`
              }}</span>
            </template>
          </el-input>
        </div>
        <el-button
          type="primary"
          @click="handleSave"
          :icon="useRenderIcon(SaveLine)"
          >保存</el-button
        >
      </div>
      <div class="toolbar">
        <el-select
          v-model="currentLanguage"
          placeholder="选择编程语言"
          class="language-selector"
          size="small"
        >
          <el-option
            v-for="lang in languages"
            :key="lang.value"
            :label="lang.label"
            :value="lang.value"
          />
        </el-select>
      </div>
      <div class="monaco-container">
        <MonacoEditor
          v-model:value="code"
          :options="editorOptions"
          @change="handleChange"
          @mounted="handleEditorMounted"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.editor-card {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    height: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
}

.editor-container {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.title-bar {
  height: 40px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: var(--el-bg-color-overlay);
  border-bottom: 1px solid var(--el-border-color-light);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.file-icon {
  font-size: 18px;
  color: var(--el-text-color-secondary);
}

.title-input {
  flex: 1;
  max-width: 300px;
  min-width: 100px;

  :deep(.el-input__wrapper) {
    padding-right: 8px;
    box-shadow: none !important;
    background: transparent;

    &:hover,
    &:focus-within {
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

.toolbar {
  height: 40px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
}

.language-selector {
  width: 120px;

  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px var(--el-border-color) !important;

    &:hover,
    &.is-focus {
      box-shadow: 0 0 0 1px var(--el-border-color-darker) !important;
    }
  }
}

.monaco-container {
  flex: 1;
  position: relative;

  :deep(.monaco-editor) {
    padding: 8px;
    box-sizing: border-box;
    --vscode-focusBorder: #ffffff !important;
    --vscode-editor-background: transparent !important;
  }
}
</style>
