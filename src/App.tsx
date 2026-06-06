import { useAppStore } from "@/store/useAppStore";
import { LeftRail } from "@/components/shell/LeftRail";
import { TopBar } from "@/components/shell/TopBar";
import { ChatView } from "@/components/chat/ChatView";
import { CoworkView } from "@/components/cowork/CoworkView";
import { CodeView } from "@/components/code/CodeView";
import { ModelsView } from "@/components/models/ModelsView";
import { ProjectsView } from "@/components/projects/ProjectsView";
import { CanvasView } from "@/components/canvas/CanvasView";
import { CustomizeView } from "@/components/customize/CustomizeView";

export default function App() {
  const view = useAppStore((s) => s.view);

  return (
    <div className="flex h-full w-full overflow-hidden bg-bg text-text">
      <LeftRail />
      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <div className="flex min-h-0 flex-1 flex-col">
          {view === "chat" && <ChatView />}
          {view === "cowork" && <CoworkView />}
          {view === "code" && <CodeView />}
          {view === "models" && <ModelsView />}
          {view === "projects" && <ProjectsView />}
          {view === "canvas" && <CanvasView />}
          {view === "customize" && <CustomizeView />}
        </div>
      </main>
    </div>
  );
}
