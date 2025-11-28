const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Get auth token for requests
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export interface ImageDetectionResult {
  caseId: string;
  filename: string;
  predicted_label: string;
  is_fake: boolean;
  confidence: number;
  verdict: string;
  explanation: string;
}

export interface AudioDetectionResult {
  caseId: string;
  similarity_score: number;
  is_same_speaker: boolean;
  threshold: number;
  confidence: number;
  verdict: string;
  explanation: string;
}

export interface VideoDetectionResult {
  caseId: string;
  filename: string;
  duration_sec: number;
  frames_analyzed: number;
  is_fake: boolean;
  confidence: number;
  verdict: string;
  explanation: string;
  frame_details: Array<{ label: string; confidence: number }>;
}

export const detectImage = async (file: File): Promise<ImageDetectionResult> => {
  const form = new FormData();
  form.append("image", file);
  
  const res = await fetch(`${API_BASE}/detect/image`, {
    method: "POST",
    body: form,
    headers: getAuthHeaders(),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Detection failed' }));
    throw new Error(error.detail || 'Image detection failed');
  }
  
  return res.json();
};

export const detectAudio = async (file1: File, file2: File): Promise<AudioDetectionResult> => {
  const form = new FormData();
  form.append("audio_files", file1);
  form.append("audio_files", file2);
  
  const res = await fetch(`${API_BASE}/detect/audio`, {
    method: "POST",
    body: form,
    headers: getAuthHeaders(),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Detection failed' }));
    throw new Error(error.detail || 'Audio detection failed');
  }
  
  return res.json();
};

export const detectVideo = async (file: File): Promise<VideoDetectionResult> => {
  const form = new FormData();
  form.append("video", file);
  
  const res = await fetch(`${API_BASE}/detect/video`, {
    method: "POST",
    body: form,
    headers: getAuthHeaders(),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Detection failed' }));
    throw new Error(error.detail || 'Video detection failed');
  }
  
  return res.json();
};

// Health check
export const checkHealth = async (): Promise<{ status: string; models_loaded: boolean }> => {
  const res = await fetch(`${API_BASE.replace('/api', '')}/health`);
  return res.json();
};
