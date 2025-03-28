
export type PromptPodStatus = 'running' | 'paused' | 'archived';

export interface Identity {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  traits: string[];
}

export interface FileResource {
  id: string;
  name: string;
  type: string;
  content: string;
  createdAt: string;
  lastModified: string;
}

export interface Ritual {
  id: string;
  name: string;
  description: string;
  steps: string[];
  isActive: boolean;
}

export interface PromptPod {
  id: string;
  name: string;
  description: string;
  status: PromptPodStatus;
  identities: Identity[];
  files: FileResource[];
  rituals: Ritual[];
  tags: string[];
  createdAt: string;
  lastModified: string;
}
