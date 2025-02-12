import type { FormRules } from "element-plus";

/** 表单校验规则 */
export const formRules: FormRules = {
  name: [
    { required: true, message: "请输入教材名称", trigger: "blur" },
    { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" }
  ],
  subject: [
    { required: true, message: "请选择所属学科", trigger: "change" }
  ],
  file: [
    { required: true, message: "请上传教材文件", trigger: "change" }
  ]
}; 