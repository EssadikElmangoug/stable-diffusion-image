
import { ComfyPromptResponse, ComfyHistoryResponse } from '../types';

// Use proxy in development, direct URL in production
const BASE_URL = import.meta.env.DEV ? '/api' : 'http://208.115.102.98:8188';

export const comfyService = {
  /**
   * Generates a unique seed for the workflow
   */
  generateSeed: () => Math.floor(Math.random() * 1000000000000000),

  /**
   * Sends the prompt workflow to ComfyUI
   */
  async submitPrompt(prompt: string): Promise<string> {
    const seed = this.generateSeed();
    
    const workflow = {
      "5": {
        "inputs": { "width": 512, "height": 512, "batch_size": 1 },
        "class_type": "EmptyLatentImage",
        "_meta": { "title": "Empty Latent Image" }
      },
      "6": {
        "inputs": { "text": prompt, "clip": ["20", 1] },
        "class_type": "CLIPTextEncode",
        "_meta": { "title": "CLIP Text Encode (Prompt)" }
      },
      "7": {
        "inputs": { "text": "text, watermark, low quality, blurry", "clip": ["20", 1] },
        "class_type": "CLIPTextEncode",
        "_meta": { "title": "CLIP Text Encode (Prompt)" }
      },
      "8": {
        "inputs": { "samples": ["13", 0], "vae": ["20", 2] },
        "class_type": "VAEDecode",
        "_meta": { "title": "VAE Decode" }
      },
      "13": {
        "inputs": {
          "add_noise": true,
          "noise_seed": seed,
          "cfg": 1,
          "model": ["20", 0],
          "positive": ["6", 0],
          "negative": ["7", 0],
          "sampler": ["14", 0],
          "sigmas": ["22", 0],
          "latent_image": ["5", 0]
        },
        "class_type": "SamplerCustom",
        "_meta": { "title": "SamplerCustom" }
      },
      "14": {
        "inputs": { "sampler_name": "euler_ancestral" },
        "class_type": "KSamplerSelect",
        "_meta": { "title": "KSamplerSelect" }
      },
      "20": {
        "inputs": { "ckpt_name": "sd_xl_turbo_1.0_fp16.safetensors" },
        "class_type": "CheckpointLoaderSimple",
        "_meta": { "title": "Load Checkpoint" }
      },
      "22": {
        "inputs": { "steps": 1, "denoise": 1, "model": ["20", 0] },
        "class_type": "SDTurboScheduler",
        "_meta": { "title": "SDTurboScheduler" }
      },
      "27": {
        "inputs": { "filename_prefix": "TurboGen", "images": ["8", 0] },
        "class_type": "SaveImage",
        "_meta": { "title": "Save Image" }
      }
    };

    try {
      const response = await fetch(`${BASE_URL}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: workflow }),
      });

      if (!response.ok) {
        throw new Error(`ComfyUI Error: ${response.statusText}`);
      }

      const data: ComfyPromptResponse = await response.json();
      return data.prompt_id;
    } catch (error) {
      console.error("Failed to submit prompt:", error);
      throw error;
    }
  },

  /**
   * Polls the history endpoint until the generation is complete
   */
  async waitForImage(promptId: string): Promise<string> {
    const maxRetries = 60; // 60 seconds
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const response = await fetch(`${BASE_URL}/history/${promptId}`);
        const history: ComfyHistoryResponse = await response.json();

        if (history[promptId]) {
          const outputs = history[promptId].outputs;
          // Node 27 is our SaveImage node in the provided JSON
          const imageInfo = outputs["27"]?.images[0];
          
          if (imageInfo) {
            return `${BASE_URL}/view?filename=${imageInfo.filename}&type=${imageInfo.type}&subfolder=${imageInfo.subfolder}`;
          }
        }
      } catch (e) {
        console.warn("Polling error:", e);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      retries++;
    }

    throw new Error("Generation timed out");
  }
};
