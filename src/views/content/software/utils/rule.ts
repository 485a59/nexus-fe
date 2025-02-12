import { ref } from "vue";
import type { FormRules } from "element-plus";

export const formRules = ref<FormRules>({
  name: [
    { required: true, message: "请输入软件名称", trigger: "blur" },
    { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" }
  ],
  category: [{ required: true, message: "请选择软件分类", trigger: "change" }],
  version: [
    { required: true, message: "请输入版本号", trigger: "blur" },
    {
      pattern: /^\d+\.\d+\.\d+$/,
      message: "请输入正确的版本号格式(x.x.x)",
      trigger: "blur"
    }
  ],
  platform: [{ required: true, message: "请输入支持平台", trigger: "blur" }],
  downloadUrl: [
    { required: true, message: "请输入下载链接", trigger: "blur" },
    {
      pattern: /^\/download\/.*/,
      message: "下载链接必须以/download/开头",
      trigger: "blur"
    }
  ]
});