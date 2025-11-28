import { QueueItem } from '@/types/Queue';

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000';

class QueueService {
  private ws: WebSocket | null = null;
  private listeners: ((items: QueueItem[]) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private isIntentionalClose = false;

  connect(callback: (items: QueueItem[]) => void): void {
    this.listeners.push(callback);
    this.isIntentionalClose = false;
    this.establishConnection();
  }

  private establishConnection(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.ws = new WebSocket(`${WS_BASE_URL}/ws/queue`);

      this.ws.onopen = () => {
        console.log('✅ Queue WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const items: QueueItem[] = JSON.parse(event.data);
          this.notifyListeners(items);
        } catch (error) {
          console.error('Failed to parse queue data:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ Queue WebSocket error:', error);
      };

      this.ws.onclose = (event) => {
        console.log('🔌 Queue WebSocket disconnected', event.code, event.reason);
        
        if (!this.isIntentionalClose && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => this.establishConnection(), this.reconnectDelay);
        }
      };
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      // Fall back to polling or notify with empty queue
      this.notifyListeners([]);
    }
  }

  disconnect(): void {
    this.isIntentionalClose = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners = [];
    this.reconnectAttempts = 0;
  }

  private notifyListeners(items: QueueItem[]): void {
    this.listeners.forEach(listener => listener(items));
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export default new QueueService();
