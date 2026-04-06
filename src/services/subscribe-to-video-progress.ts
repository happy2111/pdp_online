import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { VideoProgressSchema, VideoProgressType, VideoProgressEventType } from "@/schemas/video-progress";

export function subscribeToVideoProgress(
  id: string,
  type: VideoProgressEventType,
  onUpdate: (data: VideoProgressType) => void
) {
  const socket = new SockJS(`${process.env.NEXT_PUBLIC_BASE_URL}/ws`);
  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
  });

  client.onConnect = () => {
    client.subscribe("/topic/video", (message: any) => {
      const parsed = VideoProgressSchema.safeParse(JSON.parse(message.body));

      if (!parsed.success) {
        console.error("Invalid video progress:", parsed.error);
        return;
      }

      const data = parsed.data;

      console.table(data);

      if (data.type === type && data.id === id) {
        onUpdate(data);
      }
    });
  };

  client.activate();

  return () => {
    client.deactivate();
  };
}