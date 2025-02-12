import { baseUrlFrontend } from "@/router/utils";
import { http } from "@/utils/http";
import { Result, ResultTable } from "@/utils/http/types";

/** 获取回收站列表 */
export const getRecycleList = (params: { pageSize: number; pageNum: number }) => {
  return http.request<ResultTable>("get", baseUrlFrontend("recycle/list"), { params });
};

/** 删除回收站文件 */
export const deleteRecycle = (id: string) => {
  return http.request<Result>("delete", baseUrlFrontend(`recycle/${id}`));
};

/** 批量删除回收站文件 */
export const deleteRecycles = (ids: string[]) => {
  return http.request<Result>("delete", baseUrlFrontend("recycle/batch"), {
    data: { ids }
  });
};

/** 恢复回收站文件 */
export const restoreRecycle = (data: { deleteBatchNum: string, path: string }) => {
  return http.request<Result>("post", baseUrlFrontend("recycle/restore"), { data });
};



