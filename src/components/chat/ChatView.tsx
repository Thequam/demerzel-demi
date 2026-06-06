import { useAppStore } from "@/store/useAppStore";
import { conversations } from "@/data/mock";
import { MessageBubble } from "./MessageBubble";
import { ArtifactPanel } from "./ArtifactPanel";
import { Composer } from "@/components/composer/Composer";
import { EmptyState } from "@/components/ui";
import { MessageSquare } from "lucide-react";

export function ChatView() {
  const { activeConversationId, artifactPanelOpen } = useAppStore();
  const convo = conversations.find((c) => c.id === activeConversationId) ?? conversations[0];

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-6 py-8">
            {convo.messages.length === 0 ? (
              <EmptyState
                icon={<MessageSquare size={32} />}
                title={convo.title}
                description="Start the conversation. Pick a local or cloud model in the composer and switch any time mid-chat."
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
      {artifactPanelOpen && <ArtifactPanel />}
    </div>
  );
}
