import { baseUrlBackend } from "@/router/utils";
import { http } from "@/utils/http";
import { ResultTable, Result } from "@/utils/http/types";

/** 获取系统管理-用户管理列表 */
export const getChapterList = (data?: object) => {
    return http.request<Result>("post", baseUrlBackend("curriculum/chapter/list"), { data });
};

/** 新增教材 */
export const addTextbook = (data?: object) => {
    return http.request<Result>("post", baseUrlBackend("system/resource/textbook"), { data });
};
