
export interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  timestamp: number;
}

export interface ComfyPromptResponse {
  prompt_id: string;
  number: number;
  node_errors: Record<string, any>;
}

export interface ComfyHistoryResponse {
  [prompt_id: string]: {
    outputs: {
      [node_id: string]: {
        images: Array<{
          filename: string;
          subfolder: string;
          type: string;
        }>;
      };
    };
    status: {
      completed: boolean;
      messages: any[];
    };
  };
}
