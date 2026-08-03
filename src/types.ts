export interface SlashCommand {
  id: string;
  command: string; // e.g., "/explain"
  description: string; // e.g., "Explain the selected code"
  systemPrompt: string; // e.g., "Analyze the following code and explain what it does in detail..."
}

export interface ExtensionConfig {
  extensionName: string; // e.g., "AI Studio Chatbot"
  author: string; // e.g., "MyCompany"
  version: string; // e.g., "1.0.0"
  description: string;
  defaultModel: string; // e.g., "gemini-3.5-flash" or "gemini-3.1-pro-preview"
  systemPrompt: string;
  slashCommands: SlashCommand[];
  vsVersion?: "2022" | "2026"; // Target Visual Studio Version
}

export interface PromptTelemetry {
  userPrompt: string;
  solutionRequirements: string;
  sentPrompt: string;
  provider: string;
  totalChars: number;
  estimatedTokens: number;
  chunksProcessed: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isCommand?: boolean;
  telemetry?: PromptTelemetry;
}

export interface EditorFile {
  name: string;
  language: string;
  content: string;
}

export interface AIChannel {
  id: string;
  name: string;
  provider: string;
  category: "Google" | "Cloud Platform" | "AI Builder" | "Free API Provider" | "Local / Open Source";
  isFreeTier: boolean;
  defaultModel: string;
  availableModels: string[];
  description: string;
  badge: string;
  badgeColor: string;
  endpointUrl?: string;
  requiresApiKey: boolean;
  docUrl: string;
  features: string[];
}

export interface AccountCredits {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  planName: string;
  tokensUsedToday: number;
  requestsLimitPerDay: number;
  requestsUsedToday: number;
  costPerPrompt: number;
}

export interface UserSession {
  username: string;
  email?: string;
  signedInAt: Date;
  selectedChannel: AIChannel;
  apiKey?: string;
  customEndpoint?: string;
  rememberMe: boolean;
  credits: AccountCredits;
}

export interface SolutionFile {
  id: string; // File ID
  name: string; // File Name
  size: string; // File Size
  filePath: string; // File Path
  uploadedTime: string; // Formatted Uploaded Time
  type?: string;
  previewUrl?: string;
}

