import { http } from "@/utils/http";
import SparkMD5 from "spark-md5";
import type { Result } from "@/utils/http/types";
import { baseUrlFrontend } from "@/router/utils";
import pLimit from 'p-limit';

// 上传文件的主函数
// export const uploadFile = async (file: File, currentPath: string, onProgress?: (progress: number) => void): Promise<String> => {
//   const chunkSize = 5 * 1024 * 1024; // 5MB 每片
//   const totalChunks = Math.ceil(file.size / chunkSize);
//   const spark = new SparkMD5.ArrayBuffer();
//   let currentChunk = 0;

//   // 计算文件MD5
//   const calculateMD5 = (): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const fileReader = new FileReader();
//       fileReader.onload = e => {
//         spark.append(e.target.result as ArrayBuffer);
//         currentChunk++;

//         if (currentChunk < totalChunks) {
//           loadNextChunk();
//         } else {
//           resolve(spark.end());
//         }
//       };
//       fileReader.onerror = () => reject(new Error("文件读取出错"));

//       const loadNextChunk = () => {
//         const start = currentChunk * chunkSize;
//         const end = Math.min(start + chunkSize, file.size);
//         fileReader.readAsArrayBuffer(file.slice(start, end));
//       };
//       loadNextChunk();
//     });
//   };

//   // 上传分片
//   const uploadChunk = async (chunk: Blob, chunkIndex: number, md5: string) => {
//     const formData = new FormData();
//     formData.append("file", chunk, file.name);
//     formData.append("path", currentPath);
//     formData.append("name", file.name);
//     formData.append("chunkNumber", chunkIndex.toString());
//     formData.append("chunkSize", chunk.size.toString());
//     formData.append("relativePath", "");
//     formData.append("totalChunks", totalChunks.toString());
//     formData.append("totalSize", file.size.toString());
//     formData.append("currentChunkSize", chunk.size.toString());
//     formData.append("identifier", md5);

//     return http.request<Result>("post", baseUrlFrontend("transfer/upload"), {
//       data: formData,
//       headers: {
//         "Content-Type": "multipart/form-data"
//       },
//       onUploadProgress: progressEvent => {
//         if (onProgress) {
//           const percent = Math.round(
//             ((chunkIndex * chunkSize + progressEvent.loaded) / file.size) * 100
//           );
//           onProgress(percent);
//         }
//       }
//     });
//   };

//   try {
//     // 计算文件MD5
//     const md5 = await calculateMD5();

//     // 上传所有分片
//     for (let i = 0; i < totalChunks; i++) {
//       const start = i * chunkSize;
//       const end = Math.min(start + chunkSize, file.size);
//       const chunk = file.slice(start, end);
//       const response = await uploadChunk(chunk, i, md5);
      
//       if (response?.code !== 200) {
//         return "";
//       }
//     }
    
//     return md5;
//   } catch (error) {
//     console.error("文件上传失败:", error);
//     return "";
//   }
// };

export const uploadFile = async (file: File, currentPath: string, onProgress?: (progress: number) => void): Promise<string> => {
  const chunkSize = 5 * 1024 * 1024; // 5MB 每片
  const totalChunks = Math.ceil(file.size / chunkSize);
  const spark = new SparkMD5.ArrayBuffer();
  let currentChunk = 0;

  // 计算文件MD5
  const calculateMD5 = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = e => {
        spark.append(e.target.result as ArrayBuffer);
        currentChunk++;

        if (currentChunk < totalChunks) {
          loadNextChunk();
        } else {
          resolve(spark.end());
        }
      };
      fileReader.onerror = () => reject(new Error("文件读取出错"));

      const loadNextChunk = () => {
        const start = currentChunk * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        fileReader.readAsArrayBuffer(file.slice(start, end));
      };
      loadNextChunk();
    });
  };

  // 上传分片
  const uploadChunk = async (chunk: Blob, chunkIndex: number, md5: string) => {
    const formData = new FormData();
    formData.append("file", chunk, file.name);
    formData.append("path", currentPath);
    formData.append("name", file.name);
    formData.append("chunkNumber", chunkIndex.toString());
    formData.append("chunkSize", chunk.size.toString());
    formData.append("relativePath", "");
    formData.append("totalChunks", totalChunks.toString());
    formData.append("totalSize", file.size.toString());
    formData.append("currentChunkSize", chunk.size.toString());
    formData.append("identifier", md5);

    return http.request<Result>("post", baseUrlFrontend("transfer/upload"), {
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: progressEvent => {
        if (onProgress) {
          const percent = Math.round(
            ((chunkIndex * chunkSize + progressEvent.loaded) / file.size) * 100
          );
          onProgress(percent);
        }
      }
    });
  };

  try {
    // 计算文件MD5
    const md5 = await calculateMD5();

    // 并发上传（设置并发数为 5）
    const limit = pLimit(5);
    const uploadPromises = [];

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      uploadPromises.push(
        limit(() => uploadChunk(chunk, i, md5))
      );
    }

    // 等待所有分片上传完成
    await Promise.all(uploadPromises);

    return md5;
  } catch (error) {
    console.error("文件上传失败:", error);
    return "";
  }
};


export const deleteFile = (id: string) => {
  return http.request<Result>("delete", baseUrlFrontend(`file/${id}`));
};

/** 下载文件 */ 
export const downloadFile = async (
  id: string,
  fileName: string,
  extension: string,
  onProgress?: (progress: number) => void
) => {
  try {
    const response = await http.request(
      "get",
      baseUrlFrontend(`transfer/download?id=${id}`),
      {
        responseType: "blob",
        headers: {
          Accept: "application/force-download"
        },
        onDownloadProgress: progressEvent => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            onProgress(percent);
          }
        }
      }
    );

    // 直接使用响应数据作为 Blob
    const blob = response as Blob;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}.${extension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    throw new Error("文件下载失败");
  }
};

/** 批量下载文件 */
export const downloadFiles = async (
  ids: string[],
  onProgress?: (progress: number) => void
) => {
  try {
    const response = await http.request(
      "post",
      baseUrlFrontend("transfer/download/batch"),
      {
        responseType: "blob",
        headers: {
          Accept: "application/force-download",
          "Content-Type": "application/json"
        },
        data: { ids },
        onDownloadProgress: progressEvent => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            onProgress(percent);
          }
        }
      }
    );

    // 创建下载
    const blob = response as Blob;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    // 使用时间戳作为文件名
    link.setAttribute("download", `${Date.now()}.zip`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    throw new Error("批量下载失败");
  }
};

// 文件类型判断辅助函数
const isImageFile = (extension: string) => {
  return /^(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(extension);
};

const isVideoFile = (extension: string) => {
  return /^(mp4|webm|ogg|avi|mov)$/i.test(extension);
};

const isAudioFile = (extension: string) => {
  return /^(mp3|flac|wav|ogg|m4a)$/i.test(extension);
};

const isOfficeFile = (extension: string) => {
  return /^(doc|docx|xls|xlsx|ppt|pptx)$/i.test(extension);
};

const isPdfFile = (extension: string) => {
  return /^pdf$/i.test(extension);
};

const isTextFile = (extension: string) => {
  return /^(txt|json|md|xml|log|js|ts|html|css|java|py|cpp|c|go|rs)$/i.test(extension);
};

const isArchiveFile = (extension: string) => {
  return /^(zip|rar|7z|tar|gz)$/i.test(extension);
};

/** 预览文件 */
export const previewFile = async (
  id: string,
  extension: string,
  onProgress?: (progress: number) => void
): Promise<{ type: string; url: string }> => {
  try {
    if (isOfficeFile(extension)) {
      // 对于 Office 文件，返回完整的公网可访问 URL
      const previewUrl = `${window.location.origin}${baseUrlFrontend(`transfer/download?id=${id}`)}`;
      return { type: 'office', url: previewUrl };
    }

    // 其他文件类型保持不变
    const response = await http.request(
      "get",
      baseUrlFrontend(`transfer/download?id=${id}`),
      {
        responseType: "blob",
        onDownloadProgress: progressEvent => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            onProgress(percent);
          }
        }
      }
    );

    const blob = response as Blob;
    const url = window.URL.createObjectURL(blob);

    if (isImageFile(extension)) {
      return { type: 'image', url };
    } else if (isVideoFile(extension)) {
      return { type: 'video', url };
    } else if (isAudioFile(extension)) {
      return { type: 'audio', url };
    } else if (isPdfFile(extension)) {
      return { type: 'pdf', url };
    } else if (isTextFile(extension)) {
      return { type: 'text', url };
    } else {
      return { type: 'other', url };
    }
  } catch (error) {
    throw new Error("文件预览失败");
  }
};