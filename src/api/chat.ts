import type { ChatRequest, StreamResponse } from '@/types/chat';
import { http } from '@/utils/http';
import { baseUrlAi } from "@/router/utils";
import type { AxiosProgressEvent } from 'axios';


// 创建聊天流式请求
export const createChatStream = (body: ChatRequest, onData: (text: string) => void, onEnd: () => void) => {
  // 创建 AbortController
  const controller = new AbortController();
  
  let buffer = ''; // 用于存储未完整的行
  let previousText = ''; // 用于存储之前的响应文本
  
  http.request<any>('post', baseUrlAi("chat/stream"), {
    data: body,
    signal: controller.signal,
    responseType: 'text',
    timeout: 600000,
    onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
      const responseText = progressEvent.event?.currentTarget?.response || '';
      // 获取新增的文本
      const newText = responseText.substring(previousText.length);
      previousText = responseText;
      
      // 将新文本添加到buffer
      buffer += newText;
      
      // 按行分割并处理完整的行
      const lines = buffer.split('\n');
      // 保留最后一个可能不完整的行
      buffer = lines.pop() || '';
      
      lines.forEach(line => {
        if (line.trim()) {
          try {
            // 移除 'data:' 前缀并解析 JSON
            const jsonStr = line.replace(/^data:\s*/, '').trim();
            if (!jsonStr) return;
            
            const parsed: StreamResponse = JSON.parse(jsonStr);
            
            if (parsed.type === 'content' && parsed.content) {
              // 解析内容数据
              const contentData = JSON.parse(parsed.content);
              const text = contentData.choices[0]?.delta?.content;
              // 只处理有实际内容的delta
              if (text) {
                onData(text);
              }
            } else if (parsed.type === 'end') {
              // 处理最后一个可能的数据
              if (buffer) {
                try {
                  const lastJsonStr = buffer.replace(/^data:\s*/, '').trim();
                  if (lastJsonStr) {
                    const lastParsed: StreamResponse = JSON.parse(lastJsonStr);
                    if (lastParsed.type === 'content' && lastParsed.content) {
                      const lastContentData = JSON.parse(lastParsed.content);
                      const lastText = lastContentData.choices[0]?.delta?.content;
                      if (lastText) {
                        onData(lastText);
                      }
                    }
                  }
                } catch (e) {
                  console.error('Error parsing final buffer:', e);
                }
              }
              onEnd();
            } else if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e, '\nLine:', line);
          }
        }
      });
    }
  }).catch(error => {
    console.error('Fetch error:', error);
    onEnd();
  });

  // 返回取消函数
  return () => {
    controller.abort();
  };
};

// 使用示例:
/*
const messages = ref<Message[]>([]);
const streaming = ref(false);
let currentMessage = '';

const sendMessage = async (query: string) => {
  streaming.value = true;
  
  const params: ChatRequest = {
    history: messages.value,
    model: 'deepseek-ai/DeepSeek-V3',
    query
  };
  
  messages.value.push({
    query,
    results: [{
      summary: ''
    }],
    streaming: true
  });
  
  const cancelStream = createChatStream(
    params,
    (text) => {
      currentMessage += text;
      const lastMessage = messages.value[messages.value.length - 1];
      if (lastMessage) {
        lastMessage.results[0].summary = currentMessage;
      }
    },
    () => {
      streaming.value = false;
      const lastMessage = messages.value[messages.value.length - 1];
      if (lastMessage) {
        lastMessage.streaming = false;
      }
      currentMessage = '';
    }
  );
  
  return cancelStream;
};
*/
