import { api, getToken } from './api';

const API_BASE = 'https://api.nsir.uk';
const PING_INTERVAL_MS = 25_000;
const RECONNECT_BASE_MS = 2_000;
const RECONNECT_MAX_MS = 30_000;

export type TicketEvent = {
  type: 'ticket_event';
  event: 'created' | 'updated' | 'deleted';
  ticketId: number;
  at: number;
};

export type TicketSocketHandle = {
  close: () => void;
};

let socket: WebSocket | null = null;
let pingTimer: ReturnType<typeof setInterval> | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempt = 0;
let closedByUser = false;
let activeHandler: ((event: TicketEvent) => void) | null = null;

async function obtainSocketTicket(): Promise<string> {
  const data = await api<{ token: string }>('/tickets/socket-ticket', {
    method: 'POST',
    auth: true,
  });
  return data.token;
}

function wsUrl(token: string): string {
  const base = API_BASE.replace(/^https/, 'wss');
  return `${base}/tickets/socket?ticket=${encodeURIComponent(token)}`;
}

function clearTimers(): void {
  if (pingTimer !== null) {
    clearInterval(pingTimer);
    pingTimer = null;
  }
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function scheduleReconnect(): void {
  if (closedByUser || activeHandler === null) return;
  const delay = Math.min(RECONNECT_BASE_MS * 2 ** reconnectAttempt, RECONNECT_MAX_MS);
  reconnectAttempt += 1;
  reconnectTimer = setTimeout(() => {
    void connectTicketSocketInternal();
  }, delay);
}

async function connectTicketSocketInternal(): Promise<void> {
  if (closedByUser || activeHandler === null || getToken() === null) return;

  try {
    const token = await obtainSocketTicket();
    if (closedByUser || activeHandler === null) return;

    socket = new WebSocket(wsUrl(token));
    socket.addEventListener('open', () => {
      reconnectAttempt = 0;
      pingTimer = setInterval(() => {
        if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'ping' }));
      }, PING_INTERVAL_MS);
    });
    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(String(event.data)) as TicketEvent;
        if (data.type === 'ticket_event' && activeHandler !== null) activeHandler(data);
      } catch {
        // 非 JSON 或非事件訊息直接忽略
      }
    });
    socket.addEventListener('close', () => {
      clearTimers();
      socket = null;
      scheduleReconnect();
    });
    socket.addEventListener('error', () => {
      socket?.close();
    });
  } catch {
    scheduleReconnect();
  }
}

export function connectTicketSocket(
  onEvent: (event: TicketEvent) => void,
): TicketSocketHandle {
  activeHandler = onEvent;
  closedByUser = false;
  void connectTicketSocketInternal();

  return {
    close: () => {
      closedByUser = true;
      activeHandler = null;
      clearTimers();
      socket?.close();
      socket = null;
    },
  };
}
