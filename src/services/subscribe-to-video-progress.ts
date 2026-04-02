import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export function subscribeToVideoProgress(slug: string, onUpdate: (data: any) => void) {
  const socket = new SockJS(`${process.env.NEXT_PUBLIC_BASE_URL}/ws`);
  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
  });

  client.onConnect = () => {
    client.subscribe('/topic/video', (message: any) => {
      const data = JSON.parse(message.body);

      if (data.type === 'COURSE' && data.id === slug) {
        onUpdate(data);
      }
    });
  };

  client.activate();

  return () => client.deactivate();
}