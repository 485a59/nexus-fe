import { baseUrlFrontend } from "@/router/utils";
import { http } from "@/utils/http";
import { Result, ResultTable } from "@/utils/http/types";

/** 创建分享文件 */
export const shareFile = (data: { ids: string[], endTime: Date, shareType: number, remark: string, extractionCode: string }) => {
  return http.request<Result>("post", baseUrlFrontend("share"), { data });
};

/** 获取分享文件列表 */
export const getShareFileList = (params: { page: number, size: number }) => {
  return http.request<Result>("get", baseUrlFrontend("share/list"), { params });
};



