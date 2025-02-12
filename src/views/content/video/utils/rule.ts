import type { FormRules } from "element-plus";

/** 表单校验规则 */
export const formRules: FormRules = {
  parentId: [
    { required: true, message: "请选择所属章节", trigger: "change" }
  ],
  label: [
    { required: true, message: "请输入视频名称", trigger: "blur" },
    { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" }
  ],
  lecturer: [
    { required: true, message: "请输入讲师姓名", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
  ],
  file: [
    { required: true, message: "请上传视频文件", trigger: "change" }
  ],
  poster: [
    { required: true, message: "请上传视频封面", trigger: "change" }
  ],
  description: [
    { required: true, message: "请输入视频描述", trigger: "blur" },
    { min: 10, max: 500, message: "长度在 10 到 500 个字符", trigger: "blur" }
  ]
}; 