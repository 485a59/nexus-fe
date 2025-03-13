import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { ElMessage } from "element-plus";

interface ExportOptions {
  margins?: number;
  scale?: number;
  quality?: number;
}

export class ExportHelper {
  private element: HTMLElement;
  private message: typeof ElMessage;

  constructor(elementId: string, message: typeof ElMessage) {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Element not found");
    }
    this.element = element;
    this.message = message;
  }

  private setupElement(width: string | number, padding: string | number) {
    this.element.style.display = "block";
    this.element.style.width = typeof width === 'number' ? `${width}px` : width;
    this.element.style.position = "fixed";
    this.element.style.top = "-9999px";
    this.element.style.left = "0";
    this.element.style.padding = typeof padding === 'number' ? `${padding}px` : padding;
    this.element.style.backgroundColor = "white";
  }

  private cleanupElement() {
    this.element.style.display = "none";
    this.element.style.position = "";
    this.element.style.top = "";
    this.element.style.left = "";
    this.element.style.width = "";
    this.element.style.padding = "";
  }

  async exportToPDF(options: ExportOptions = {}) {
    try {
      this.message.info("正在生成 PDF，请稍候...");

      const {
        margins = 40,
        scale = 3,
        quality = 1.0
      } = options;

      // 设置 A4 尺寸（以 px 为单位，96dpi）
      const a4Width = 595.28; // 210mm 转 px
      const a4Height = 841.89; // 297mm 转 px

      this.setupElement(a4Width - margins * 2, margins);

      // 获取内容高度和计算页数
      const contentHeight = this.element.scrollHeight;
      const pageCount = Math.ceil(contentHeight / (a4Height - margins * 2));

      // 创建 PDF 文档
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });

      // 逐页生成
      for (let i = 0; i < pageCount; i++) {
        this.element.style.top = `${-i * (a4Height - margins * 2)}px`;

        const canvas = await html2canvas(this.element, {
          scale,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: "#ffffff",
          width: a4Width - margins * 2,
          height: Math.min(
            a4Height - margins * 2,
            contentHeight - i * (a4Height - margins * 2)
          ),
          windowWidth: a4Width - margins * 2,
          x: 0,
          y: i * (a4Height - margins * 2)
        });

        const imgData = canvas.toDataURL("image/jpeg", quality);
        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          imgData,
          "JPEG",
          margins,
          margins,
          a4Width - margins * 2,
          (canvas.height * (a4Width - margins * 2)) / canvas.width
        );
      }

      // 设置 PDF 元数据
      pdf.setProperties({
        title: "AI对话记录",
        subject: "AI对话记录",
        author: "AI助手",
        keywords: "AI, 对话记录",
        creator: "AI助手"
      });

      pdf.save(`AI对话记录_${new Date().toLocaleDateString()}.pdf`);
      this.message.success("PDF 导出成功！");
    } catch (error) {
      console.error("PDF export error:", error);
      this.message.error("PDF 导出失败");
    } finally {
      this.cleanupElement();
    }
  }

  async exportToImage(width = 1240) {
    try {
      this.message.info("正在生成图片，请稍候...");

      this.setupElement(width, 40);

      const canvas = await html2canvas(this.element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "#ffffff",
        windowWidth: width
      });

      const link = document.createElement("a");
      link.download = `AI对话记录_${new Date().toLocaleDateString()}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();

      this.message.success("图片导出成功！");
    } catch (error) {
      console.error("Image export error:", error);
      this.message.error("图片导出失败");
    } finally {
      this.cleanupElement();
    }
  }
} 