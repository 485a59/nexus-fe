// 请求体接口
export interface ChatRequest {
  history: Array<{           // 历史消息记录
    query: string;          // 用户问题
    results: Array<{        // 结果数组
      summary: string;      // AI回复内容
    }>;
  }>;
  model: string;            // 使用的模型名称
  query: string;           // 当前问题
}

// 流式响应数据接口
export interface StreamResponse {
  type: 'content' | 'end';  // 响应类型：内容或结束
  content: string | null;   // JSON字符串或null
  error: null | string;     // 错误信息
}

// 流式内容解析后的结构
export interface StreamContent {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      content: string;
      reasoning_content: null | string;
    };
    finish_reason: null | string;
    content_filter_results: {
      hate: { filtered: boolean };
      self_harm: { filtered: boolean };
      sexual: { filtered: boolean };
      violence: { filtered: boolean };
    };
  }>;
  system_fingerprint: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// 消息接口（用于组件内部状态）
export interface Message {
  query: string;
  results: Array<{
    summary: string;
  }>;
  streaming?: boolean;
} 