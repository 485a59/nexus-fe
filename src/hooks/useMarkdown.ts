import { marked } from "marked";

export const useMarkdown = () => {
  // 自定义渲染器
  const renderer = new marked.Renderer();

  // 处理段落
  renderer.paragraph = (text) => {
    return text;
  };

  // 处理标题
  renderer.heading = (text, level) => {
    return `\n\n${'#'.repeat(level)} ${text}\n\n`;
  };

  // 处理列表项
  renderer.listitem = (text) => {
    return `- ${text}\n`;
  };

  // 处理代码块
  renderer.code = (code, language) => {
    return `\n\`\`\`${language || ''}\n${code}\n\`\`\`\n`;
  };

  // 处理行内代码
  renderer.codespan = (code) => {
    return `\`${code}\``;
  };

  // 处理表格
  renderer.table = (header, body) => {
    return `\n${header}${body}\n`;
  };

  // 处理引用
  renderer.blockquote = (quote) => {
    return `\n> ${quote.replace(/\n/g, '\n> ')}\n`;
  };

  // 处理分隔线
  renderer.hr = () => {
    return '\n---\n';
  };

  // 配置 marked 选项
  marked.setOptions({
    renderer,
    breaks: false,
    gfm: true,
    headerIds: false,
    mangle: false,
    sanitize: true // 启用 sanitize 以防止 XSS
  });

  // 复制纯文本（移除 Markdown 语法）
  const copyPlainText = async (text: string) => {
    try {
      const plainText = text
        .replace(/#+\s/g, "")
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/~~[^~]*~~/g, "")
        .replace(/`[^`]*`/g, "")
        .replace(/```[\s\S]*?```/g, "")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, "")
        .replace(/>/g, "")
        .trim();

      await navigator.clipboard.writeText(plainText);
      return true;
    } catch (err) {
      return false;
    }
  };

  return {
    marked,
    copyPlainText
  };
}; 