import type { FormRules } from "element-plus";

/** 表单校验规则 */
export const formRules: FormRules = {
  name: [
    { required: true, message: "请输入课件名称", trigger: "blur" },
    { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" }
  ],
  parentId: [
    { required: true, message: "请选择所属章节", trigger: "change" }
  ],
  file: [
    { required: true, message: "请上传课件文件", trigger: "change" }
  ],
  description: [
    { required: true, message: "请输入课件描述", trigger: "blur" },
    { min: 10, max: 200, message: "长度在 10 到 200 个字符", trigger: "blur" }
  ]
}; 