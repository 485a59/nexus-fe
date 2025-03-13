<template>
  <div class="h-auto bg-gray-100 dark:bg-gray-800 flex flex-col">
    <!-- PPT 预览区域 -->
    <div class="preview-container p-4 pb-2">
      <div v-if="currentPPT" class="w-full">
        <!-- PPT 预览 -->
        <div
          class="w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm"
          style="height: 700px"
        >
          <div id="placeholder" class="w-full h-full"></div>
        </div>
      </div>
      <div
        v-else
        class="empty-preview bg-white dark:bg-gray-900 rounded-lg"
        :style="{ height: '700px' }"
      >
        <el-empty :image-size="300" description="">
          <template #image>
            <div class="flex flex-col items-center">
              <EmptySelect />
              <div class="text-center">
                <h3
                  class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2"
                >
                  请从下方选择PPT资源
                </h3>
                <p
                  class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto"
                >
                  在下方列表中点击任意PPT，即可在此处查看详细信息
                </p>
              </div>
            </div>
          </template>
          <template #description> </template>
        </el-empty>
      </div>
    </div>

    <!-- 章节列表区域 -->
    <div class="chapter-section bg-white dark:bg-gray-900 mx-4 mb-4 rounded-lg">
      <!-- 课程信息头部 -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
              PPT课件资源库
            </h2>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              共 {{ chapterList.length }} 章 · {{ getTotalPPTs() }} 个PPT
            </p>
          </div>
          <!-- 搜索框移到右侧 -->
          <div class="w-64">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索PPT"
              :prefix-icon="Search"
              clearable
              @keyup.enter="handleSearch"
            />
          </div>
        </div>
      </div>

      <!-- 章节列表内容 -->
      <div class="p-4 pt-0">
        <el-collapse v-model="activeChapters">
          <el-collapse-item
            v-for="chapter in chapterList"
            :key="chapter.id"
            :name="chapter.id"
          >
            <template #title>
              <div class="flex items-center w-full">
                <el-icon class="mr-2 flex-shrink-0">
                  <Folder :class="{ 'text-gray-400': !hasPPTs(chapter) }" />
                </el-icon>
                <span
                  class="text-sm truncate"
                  :class="[
                    hasPPTs(chapter)
                      ? 'text-gray-600 dark:text-gray-300'
                      : 'text-gray-400 dark:text-gray-500'
                  ]"
                  :title="chapter.name"
                >
                  {{ chapter.name }}
                  <span v-if="hasPPTs(chapter)" class="chapter-count">
                    {{ countChapterPPTs(chapter) }}
                  </span>
                </span>
              </div>
            </template>

            <template v-for="item in chapter.children" :key="item.id">
              <div
                v-if="item.url"
                @click="handlePreview(item)"
                class="pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                :class="[
                  'cursor-pointer',
                  currentPPT?.id === item.id && 'bg-blue-50 dark:bg-gray-800'
                ]"
              >
                <div class="flex items-start">
                  <div
                    class="w-8 h-8 mr-3 flex items-center justify-center flex-shrink-0"
                  >
                    <PPTIcon :text="item.name" class="w-6 h-6" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4
                      class="text-xs font-normal truncate text-gray-700 dark:text-gray-200"
                      :title="item.name"
                    >
                      {{ item.name }}
                    </h4>
                    <div
                      class="mt-1 flex items-start text-xs text-gray-400 dark:text-gray-500 space-x-2"
                    >
                      <span
                        v-if="item.author"
                        class="flex items-center text-[10px]"
                      >
                        <el-icon class="mr-1 text-[10px]"><User /></el-icon>
                        {{ item.author }}
                      </span>
                      <span class="flex items-center text-[10px]">
                        <el-icon class="mr-1 text-[10px]"><Document /></el-icon>
                        PDF
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <el-collapse-item v-else :name="item.id" class="ml-4">
                <template #title>
                  <div class="flex items-center w-full">
                    <el-icon class="mr-2 flex-shrink-0">
                      <Folder :class="{ 'text-gray-400': !hasPPTs(item) }" />
                    </el-icon>
                    <span
                      class="text-sm truncate"
                      :class="[
                        hasPPTs(item)
                          ? 'text-gray-600 dark:text-gray-300'
                          : 'text-gray-400 dark:text-gray-500'
                      ]"
                      :title="item.name"
                    >
                      {{ item.name }}
                      <span v-if="hasPPTs(item)" class="chapter-count">
                        {{ countChapterPPTs(item) }}
                      </span>
                    </span>
                  </div>
                </template>

                <template v-for="subItem in item.children" :key="subItem.id">
                  <div
                    v-if="subItem.url"
                    @click="handlePreview(subItem)"
                    class="pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    :class="[
                      'cursor-pointer',
                      currentPPT?.id === subItem.id &&
                        'bg-blue-50 dark:bg-gray-800'
                    ]"
                  >
                    <div class="flex items-start">
                      <div
                        class="w-8 h-8 mr-3 flex items-center justify-center flex-shrink-0"
                      >
                        <PPTIcon :text="subItem.name" class="w-6 h-6" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4
                          class="text-xs font-normal truncate text-gray-700 dark:text-gray-200"
                          :title="subItem.name"
                        >
                          {{ subItem.name }}
                        </h4>
                        <div
                          class="mt-1 flex items-start text-xs text-gray-400 dark:text-gray-500 space-x-2"
                        >
                          <span
                            v-if="subItem.author"
                            class="flex items-center text-[10px]"
                          >
                            <el-icon class="mr-1 text-[10px]"><User /></el-icon>
                            {{ subItem.author }}
                          </span>
                          <span class="flex items-center text-[10px]">
                            <el-icon class="mr-1 text-[10px]"
                              ><Document
                            /></el-icon>
                            PDF
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <el-collapse-item v-else :name="subItem.id" class="ml-4">
                    <template #title>
                      <div class="flex items-center w-full">
                        <el-icon class="mr-2 flex-shrink-0">
                          <Folder
                            :class="{ 'text-gray-400': !hasPPTs(subItem) }"
                          />
                        </el-icon>
                        <span
                          class="text-sm truncate"
                          :class="[
                            hasPPTs(subItem)
                              ? 'text-gray-600 dark:text-gray-300'
                              : 'text-gray-400 dark:text-gray-500'
                          ]"
                          :title="subItem.name"
                        >
                          {{ subItem.name }}
                          <span v-if="hasPPTs(subItem)" class="chapter-count">
                            {{ countChapterPPTs(subItem) }}
                          </span>
                        </span>
                      </div>
                    </template>

                    <template
                      v-for="deepItem in subItem.children"
                      :key="deepItem.id"
                    >
                      <div
                        v-if="deepItem.url"
                        @click="handlePreview(deepItem)"
                        class="pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        :class="[
                          'cursor-pointer',
                          currentPPT?.id === deepItem.id &&
                            'bg-blue-50 dark:bg-gray-800'
                        ]"
                      >
                        <div class="flex items-start">
                          <div
                            class="w-8 h-8 mr-3 flex items-center justify-center flex-shrink-0"
                          >
                            <PPTIcon :text="deepItem.name" class="w-6 h-6" />
                          </div>
                          <div class="flex-1 min-w-0">
                            <h4
                              class="text-xs font-normal truncate text-gray-700 dark:text-gray-200"
                              :title="deepItem.name"
                            >
                              {{ deepItem.name }}
                            </h4>
                            <div
                              class="mt-1 flex items-start text-xs text-gray-400 dark:text-gray-500 space-x-2"
                            >
                              <span
                                v-if="deepItem.author"
                                class="flex items-center text-[10px]"
                              >
                                <el-icon class="mr-1 text-[10px]"
                                  ><User
                                /></el-icon>
                                {{ deepItem.author }}
                              </span>
                              <span class="flex items-center text-[10px]">
                                <el-icon class="mr-1 text-[10px]"
                                  ><Document
                                /></el-icon>
                                PDF
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <el-collapse-item
                        v-else-if="
                          deepItem.children && deepItem.children.length > 0
                        "
                        :name="deepItem.id"
                        class="ml-4"
                      >
                        <template #title>
                          <div class="flex items-center w-full">
                            <el-icon class="mr-2 flex-shrink-0">
                              <Folder
                                :class="{ 'text-gray-400': !hasPPTs(deepItem) }"
                              />
                            </el-icon>
                            <span
                              class="text-sm truncate"
                              :class="[
                                hasPPTs(deepItem)
                                  ? 'text-gray-600 dark:text-gray-300'
                                  : 'text-gray-400 dark:text-gray-500'
                              ]"
                              :title="deepItem.name"
                            >
                              {{ deepItem.name }}
                              <span
                                v-if="hasPPTs(deepItem)"
                                class="chapter-count"
                              >
                                {{ countChapterPPTs(deepItem) }}
                              </span>
                            </span>
                          </div>
                        </template>
                        <template
                          v-for="leafItem in deepItem.children"
                          :key="leafItem.id"
                        >
                          <div
                            v-if="leafItem.url"
                            @click="handlePreview(leafItem)"
                            class="pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            :class="[
                              'cursor-pointer',
                              currentPPT?.id === leafItem.id &&
                                'bg-blue-50 dark:bg-gray-800'
                            ]"
                          >
                            <div class="flex items-start">
                              <div
                                class="w-8 h-8 mr-3 flex items-center justify-center flex-shrink-0"
                              >
                                <PPTIcon
                                  :text="leafItem.name"
                                  class="w-6 h-6"
                                />
                              </div>
                              <div class="flex-1 min-w-0">
                                <h4
                                  class="text-xs font-normal truncate text-gray-700 dark:text-gray-200"
                                  :title="leafItem.name"
                                >
                                  {{ leafItem.name }}
                                </h4>
                                <div
                                  class="mt-1 flex items-start text-xs text-gray-400 dark:text-gray-500 space-x-2"
                                >
                                  <span
                                    v-if="leafItem.author"
                                    class="flex items-center text-[10px]"
                                  >
                                    <el-icon class="mr-1 text-[10px]"
                                      ><User
                                    /></el-icon>
                                    {{ leafItem.author }}
                                  </span>
                                  <span class="flex items-center text-[10px]">
                                    <el-icon class="mr-1 text-[10px]"
                                      ><Document
                                    /></el-icon>
                                    PDF
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <el-collapse-item
                            v-else-if="
                              leafItem.children && leafItem.children.length > 0
                            "
                            :name="leafItem.id"
                            class="ml-4"
                          >
                            <template #title>
                              <div class="flex items-center w-full">
                                <el-icon class="mr-2 flex-shrink-0">
                                  <Folder
                                    :class="{
                                      'text-gray-400': !hasPPTs(leafItem)
                                    }"
                                  />
                                </el-icon>
                                <span
                                  class="text-sm truncate"
                                  :class="[
                                    hasPPTs(leafItem)
                                      ? 'text-gray-600 dark:text-gray-300'
                                      : 'text-gray-400 dark:text-gray-500'
                                  ]"
                                  :title="leafItem.name"
                                >
                                  {{ leafItem.name }}
                                  <span
                                    v-if="hasPPTs(leafItem)"
                                    class="chapter-count"
                                  >
                                    {{ countChapterPPTs(leafItem) }}
                                  </span>
                                </span>
                              </div>
                            </template>
                            <template
                              v-for="finalItem in leafItem.children"
                              :key="finalItem.id"
                            >
                              <div
                                v-if="finalItem.url"
                                @click="handlePreview(finalItem)"
                                class="pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                :class="[
                                  'cursor-pointer',
                                  currentPPT?.id === finalItem.id &&
                                    'bg-blue-50 dark:bg-gray-800'
                                ]"
                              >
                                <div class="flex items-start">
                                  <div
                                    class="w-8 h-8 mr-3 flex items-center justify-center flex-shrink-0"
                                  >
                                    <PPTIcon
                                      :text="finalItem.name"
                                      class="w-6 h-6"
                                    />
                                  </div>
                                  <div class="flex-1 min-w-0">
                                    <h4
                                      class="text-xs font-normal truncate text-gray-700 dark:text-gray-200"
                                      :title="finalItem.name"
                                    >
                                      {{ finalItem.name }}
                                    </h4>
                                    <div
                                      class="mt-1 flex items-start text-xs text-gray-400 dark:text-gray-500 space-x-2"
                                    >
                                      <span
                                        v-if="finalItem.author"
                                        class="flex items-center text-[10px]"
                                      >
                                        <el-icon class="mr-1 text-[10px]"
                                          ><User
                                        /></el-icon>
                                        {{ finalItem.author }}
                                      </span>
                                      <span
                                        class="flex items-center text-[10px]"
                                      >
                                        <el-icon class="mr-1 text-[10px]"
                                          ><Document
                                        /></el-icon>
                                        PDF
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </template>
                          </el-collapse-item>
                        </template>
                      </el-collapse-item>
                    </template>
                  </el-collapse-item>
                </template>
              </el-collapse-item>
            </template>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePPT } from "./hooks";
import {
  Search,
  Download,
  Share,
  User,
  Timer,
  Files,
  ArrowRight,
  Folder,
  Document
} from "@element-plus/icons-vue";
import PPTIcon from "./components/PPTIcon.vue";
import EmptySelect from "@/assets/images/empty-select.svg";

defineOptions({
  name: "ResourcePPT"
});

const {
  activeChapters,
  currentPPT,
  searchKeyword,
  chapterList,
  getTotalPPTs,
  handlePreview,
  handleDownload,
  handleSearch,
  hasPPTs,
  countChapterPPTs
} = usePPT();
</script>

<style lang="scss" scoped>
// 整体容器
.h-screen {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
}

// 预览容器
.preview-container {
  flex: 0 0 auto;
  margin-bottom: 10px;
  .empty-preview {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: 0.5rem;

    :deep(.el-empty) {
      margin: 0;
      padding: 2rem;
    }
  }

  #placeholder {
    height: 100%;
    width: 100%;
    border: none;
    background: #fff;
    border-radius: 0.5rem;
  }
}

// 章节列表区域
.chapter-section {
  flex: 1 1 auto;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 0.5rem;
  overflow: hidden;

  // 章节列表头部
  .p-4.border-b {
    flex: 0 0 auto;
  }

  // 章节列表内容区域
  .mt-10 {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 3px;

      &:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
  }
}

// 章节列表样式
.chapter-list {
  :deep(.el-collapse) {
    border: none;
  }

  :deep(.el-collapse-item__header) {
    border: none;
    height: 40px;
    padding: 0 1rem;
    font-size: 13px;
    overflow: hidden;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }

    // 禁用状态样式
    &.is-disabled {
      cursor: not-allowed;
      opacity: 0.6;

      &:hover {
        background-color: transparent;
      }
    }
  }

  // 添加章节标题的悬停效果
  .el-collapse-item__header:not(.is-disabled):hover {
    .text-gray-600 {
      color: var(--el-color-primary);
    }

    .el-icon {
      color: var(--el-color-primary);
    }
  }

  :deep(.el-collapse-item__content) {
    padding-bottom: 0;
  }

  :deep(.el-collapse-item__wrap) {
    border: none;
  }
}

// 空章节样式
.empty-chapter {
  opacity: 0.6;
  cursor: not-allowed;

  .el-icon {
    color: var(--el-text-color-disabled);
  }

  .text-sm {
    color: var(--el-text-color-disabled);
  }
}

// 章节数量标记样式
.chapter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  margin-left: 8px;
  font-size: 11px;
  line-height: 1;
  color: #fff;
  background-color: var(--el-color-primary);
  border-radius: 8px;
  transform: scale(0.9);
  transform-origin: left center;
}

// 暗色模式适配
.dark {
  .preview-container .empty-preview,
  .chapter-section,
  #placeholder {
    background: var(--el-bg-color);
  }

  .mt-10::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }

  .chapter-count {
    background-color: var(--el-color-primary-light-3);
  }
}

// 通用工具类
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flex-1 {
  flex: 1;
  min-width: 0;
}

.flex.items-center {
  min-width: 0;
}
</style>
