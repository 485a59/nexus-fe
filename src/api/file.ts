import { baseUrlBackend, baseUrlFrontend } from "@/router/utils";
import { http } from "@/utils/http";
import type { Result, ResultTable } from "@/utils/http/types";

/** 新建文件 */
export const createFile = (data: {
  type: number;
  path: string;
  extension: string;
}) => {
  return http.request<Result>("post", baseUrlFrontend("/file"), { data });
};

/** 新建文件夹 */
export const createFolder = (data: { name: string; path: string }) => {
  return http.request<Result>("post", baseUrlFrontend("/file/folder"), { data });
};

/** 重命名文件 */
export const renameFile = (data: { id: string; name: string }) => {
  return http.request<Result>("put", baseUrlFrontend("file/rename"), { data });
};

/** 更新文件 */
export const updateFile = (data: { id: string; content: String }) => {
  return http.request<Result>("put", baseUrlBackend("/file"), { data });
};

/** 删除文件 */
export const deleteFile = (id: string) => {
  return http.request<Result>("delete", baseUrlFrontend(`/file/${id}`));
};

/** 批量删除文件 */
export const deleteFiles = (data: { ids: string[] }) => {
  return http.request<Result>("delete", baseUrlFrontend("file/batch"), {
    data
  });
};

/** 复制文件 */
export const copyFile = (data: { ids: string[]; path: string }) => {
  return http.request<Result>("post", baseUrlBackend("/file/copy"), { data });
};

/** 移动文件 */
export const moveFile = (data: { id: string; path: string }) => {
  return http.request<Result>("post", baseUrlBackend("/file/move"), { data });
};

/** 批量移动文件 */
export const moveFiles = (data: { ids: string[]; path: string }) => {
  return http.request<Result>("post", baseUrlBackend("/file/move/batch"), {
    data
  });
};

/** 获取文件树 */
export const getFileTree = () => {
  return http.request<Result>("get", baseUrlFrontend("file/tree"));
};

/** 获取文件列表 */
export const getFileList = (
  data: {
    type: number;
    path: string;
  },
  params: { pageSize: number; pageNum: number }
) => {
  return http.request<ResultTable>("post", baseUrlFrontend("file/list"), {
    data: data,
    params: params
  });
};

/** 获取文件详情 */
export const getFileDetail = (id: string) => {
  return http.request<Result>("get", baseUrlBackend(`/file/${id}`));
};

