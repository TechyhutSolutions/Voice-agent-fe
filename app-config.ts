export interface AppConfig {
  pageTitle: string;
  pageDescription: string;
  companyName: string;

  supportsChatInput: boolean;
  supportsVideoInput: boolean;
  supportsScreenShare: boolean;
  isPreConnectBufferEnabled: boolean;

  logo: string;
  startButtonText: string;
  accent?: string;
  logoDark?: string;
  accentDark?: string;

  // optional sandbox integration
  sandboxId?: string;
  agentName?: string;
}

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'Techyhut Labs',
  pageTitle: 'Techyhut Labs Voice Agent',
  pageDescription: 'Experience the Techyhut Labs Voice Agent',

  supportsChatInput: true,
  supportsVideoInput: true,
  supportsScreenShare: true,
  isPreConnectBufferEnabled: true,

  logo: '/techyhut-logo.svg',
  accent: '#1d4ed8',
  logoDark: '/techyhut-logo-dark.svg',
  accentDark: '#60a5fa',
  startButtonText: 'Launch voice agent',

  // optional sandbox integration
  sandboxId: undefined,
  agentName: undefined,
};
