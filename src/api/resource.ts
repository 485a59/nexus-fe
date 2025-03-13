import { baseUrlBackend, baseUrlFrontend } from "@/router/utils";
import { http } from "@/utils/http";
import { ResultTable, Result } from "@/utils/http/types";

/** 获取教材列表 */
export const getTextbookList = (data?: object) => {
    return http.request<Result>("post", baseUrlFrontend("resource/textbook/list"), { data });
};

/** 获取软件列表 */
export const getSoftwareTree = (data?: object) => {
    return http.request<Result>("get", baseUrlFrontend("resource/software/tree"), { data });
};


