import { baseUrlBackend, baseUrlFrontend } from "@/router/utils";
import { http } from "@/utils/http";
import { ResultTable, Result } from "@/utils/http/types";

/** 获取系统管理-用户管理列表 */
export const getChapterList = (data?: object) => {
    return http.request<Result>("post", baseUrlBackend("system/chapter/list"), { data });
};

/** 新增教材 */
export const addTextbook = (data?: object) => {
    return http.request<Result>("post", baseUrlBackend("system/resource/textbook"), { data });
};

/** 新增视频 */
export const addVideo = (data?: object) => {
    return http.request<Result>("post", baseUrlBackend("system/resource/video"), { data });
};

/** 新增幻灯片 */
export const addSlide = (data?: object) => {
    return http.request<Result>("post", baseUrlBackend("system/resource/slide"), { data });
};

/** 新增软件 */
export const addSoftware = (data?: object) => {
    return http.request<Result>("post", baseUrlBackend("system/resource/software"), { data });
};

/** 教材列表 */
export const getTextbookList = (data?: object, params?: {pageSize: number, pageNum: number}) => {
    return http.request<Result>("post", baseUrlBackend("system/resource/textbook/list"), { data, params });
};

/** 视频列表 */
export const getVideoList = (data?: object, params?: {pageSize: number, pageNum: number}) => {
    return http.request<Result>("post", baseUrlBackend("system/resource/video/list"), { data, params });
};

/** 幻灯片列表 */      
export const getSlideList = (data?: object, params?: {pageSize: number, pageNum: number}) => {
    return http.request<Result>("post", baseUrlBackend("system/resource/slide/list"), { data, params });
};

/** 软件列表 */
export const getSoftwareList = (data?: object, params?: {pageSize: number, pageNum: number}) => {
    return http.request<Result>("post", baseUrlBackend("system/resource/software/list"), { data, params });
};

/** 删除资源 */
export const deleteResource = (id: string) => {
    return http.request<Result>("delete", baseUrlBackend(`system/resource/${id}`));
};

/** 获取视频树 */
export const getVideoTree = () => {
    return http.request<Result>("get", baseUrlFrontend("resource/video/tree"));
};

/** 获取PPT树 */
export const getPPTTree = () => {
    return http.request<Result>("get", baseUrlFrontend("resource/slide/tree"));
};

/** 获取教材列表 */
export const getTextbookTree = () => {
    return http.request<Result>("get", baseUrlFrontend("resource/textbook/list"));
};




