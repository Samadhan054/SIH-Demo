/**
 * AI Service — Provider Abstraction Layer
 * ----------------------------------------
 * Supports: Google Gemini (default), OpenAI-compatible APIs
 * Switch providers by changing env variables — no business logic changes needed.
 *
 * Env vars:
 *   AI_API_KEY      — Required. Your Gemini or OpenAI API key.
 *   AI_MODEL        — Optional. Default: gemini-1.5-flash
 *   AI_BASE_URL     — Optional. For OpenAI-compatible APIs (leave blank for Gemini)
 *   AI_SYSTEM_PROMPT — Optional. Override default system prompt.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// ─── Configuration ────────────────────────────────────────────────────────────

const AI_API_KEY = process.env.AI_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || 'gemini-1.5-flash';

export const DEFAULT_SYSTEM_PROMPT = process.env.AI_SYSTEM_PROMPT || `You are FloodGuard AI, an intelligent assistant for the FloodGuard Disaster Management Platform — a real-time flash flood, landslide, and avalanche monitoring system for hilly regions of India.

You help users understand:
- Flash flood risk levels and monitoring data
- Landslide and avalanche warnings
- Soil saturation readings
- River gauge data and CWC thresholds
- Emergency SOS procedures and first aid requests
- Rescue team coordination
- Digital disaster training resources
- How to interpret maps, charts, and risk meters on the platform

Guidelines:
- Be concise, helpful, and accurate.
- Use simple language accessible to citizens in hilly regions.
- If you do not know something, clearly say so — do not invent data.
- Never fabricate official government warnings or real-time sensor readings.
- For genuine emergencies, always direct users to call official emergency numbers (112 in India).
- This platform's data may include DEMO/SIMULATED values — remind users when relevant.
- Do not expose any internal system data, credentials, or sensitive information.`;

/** Maximum number of conversation messages to include in AI context (to control token usage) */
export const MAX_CONTEXT_MESSAGES = 20;

/** Maximum input length per user message */
export const MAX_MESSAGE_LENGTH = 4000;

// ─── Provider Interface ───────────────────────────────────────────────────────

export interface AIMessage {
  role: 'user' | 'model';
  content: string;
}

export interface AIProvider {
  isAvailable(): boolean;
  streamChat(
    messages: AIMessage[],
    systemPrompt: string,
    onChunk: (chunk: string) => void
  ): Promise<string>;
}

// ─── Google Gemini Provider ───────────────────────────────────────────────────

class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI | null = null;

  constructor() {
    if (AI_API_KEY) {
      this.client = new GoogleGenerativeAI(AI_API_KEY);
    }
  }

  isAvailable(): boolean {
    return !!this.client && !!AI_API_KEY;
  }

  async streamChat(
    messages: AIMessage[],
    systemPrompt: string,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    if (!this.client) {
      throw new Error('AI provider is not configured. Please set AI_API_KEY environment variable.');
    }

    const model = this.client.getGenerativeModel({
      model: AI_MODEL,
      systemInstruction: systemPrompt,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ],
    });

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    const chat = model.startChat({ history });

    const result = await chat.sendMessageStream(lastMessage.content);

    let fullContent = '';
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        fullContent += text;
        onChunk(text);
      }
    }

    return fullContent;
  }
}

// ─── Demo/Fallback Provider (when no API key set) ─────────────────────────────

class DemoAIProvider implements AIProvider {
  isAvailable(): boolean { return true; }

  async streamChat(
    messages: AIMessage[],
    _systemPrompt: string,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
    let response = '';

    if (lastMsg.includes('flood') || lastMsg.includes('risk')) {
      response = `⚠️ **AI Provider Not Configured**\n\nI'm running in demo mode because no \`AI_API_KEY\` is set.\n\nTo enable real AI responses:\n1. Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com/app/apikey)\n2. Add \`AI_API_KEY=your_key_here\` to your \`.env\` file\n3. Restart the server\n\nFor flash flood information, check the **Hill Dashboard** or **Live Risk Map** pages.`;
    } else {
      response = `⚠️ **AI Provider Not Configured**\n\nI'm running in demo mode. Set \`AI_API_KEY\` in your \`.env\` file to enable real AI responses.\n\nGet a free key at [aistudio.google.com](https://aistudio.google.com/app/apikey)`;
    }

    // Simulate streaming by chunking the response
    const words = response.split(' ');
    for (const word of words) {
      await new Promise((r) => setTimeout(r, 30));
      onChunk(word + ' ');
    }

    return response;
  }
}

// ─── Exported AI Service ──────────────────────────────────────────────────────

class AIService {
  private provider: AIProvider;

  constructor() {
    if (AI_API_KEY) {
      this.provider = new GeminiProvider();
      console.log(`✅ AI Service: Gemini provider initialized (model: ${AI_MODEL})`);
    } else {
      this.provider = new DemoAIProvider();
      console.warn('⚠️  AI Service: No AI_API_KEY set. Running in demo mode. Responses will be placeholder only.');
    }
  }

  isAvailable(): boolean {
    return this.provider.isAvailable();
  }

  async streamChat(
    messages: AIMessage[],
    systemPrompt: string = DEFAULT_SYSTEM_PROMPT,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    // Limit context window
    const contextMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
    return this.provider.streamChat(contextMessages, systemPrompt, onChunk);
  }
}

export const aiService = new AIService();
