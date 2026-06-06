import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { MessageBubble } from "./MessageBubble";
import { CanvasPanel } from "./CanvasPanel";
import { Composer } from "@/components/composer/Composer";
import { EmptyState } from "@/components/ui";
import { MessageSquare } from "lucide-react";

export function ChatView() {
  const conversations = useAppStore((s) => s.conversations);
  const activeConversationId = useAppStore((s) => s.activeConversationId);
  const canvasPanelOpen = useAppStore((s) => s.canvasPanelOpen);
  const convo =
    conversations.find((c) => c.id === activeConversationId) ?? conversations[0];

  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMsg = convo.messages[convo.messages.length - 1];
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [convo.messages.length, lastMsg?.content]);

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 py-8">
            {convo.messages.length === 0 ? (
              <EmptyState
                icon={<MessageSquare size={32} />}
                title={convo.title}
                description="Start the conversation. Pick a local or cloud model in the composer and switch any time mid-chat. Try asking Demi to build a dashboard."
              />
            ) : (
              <div className="space-y-6">
                {convo.messages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}
              </div>
            )}
          </div>
        </div>
        <Composer />
      </div>
      {canvasPanelOpen && <CanvasPanel />}
    </div>
  );
}
