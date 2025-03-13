import { ref } from 'vue';

export const useTextarea = () => {
  const textareaHeight = ref(56);

  // 自动调整文本框高度
  const autoGrow = (e: Event) => {
    const textarea = e.target as HTMLTextAreaElement;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  // 限制输入框高度
  const limitInputHeight = (e: Event) => {
    const textarea = e.target as HTMLTextAreaElement;
    const maxHeight = 100;
    textarea.style.height = "auto";

    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  // 重置文本框高度
  const resetTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = `${textareaHeight.value}px`;
      textarea.style.overflowY = "hidden";
    }
  };

  return {
    textareaHeight,
    autoGrow,
    limitInputHeight,
    resetTextareaHeight
  };
}; 