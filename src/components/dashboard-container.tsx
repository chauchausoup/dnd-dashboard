
import { MainContent } from "./dashboard/main-content";
import { Sidebar } from "./dashboard/sidebar";

export default function DashboardContainer() {
  return (
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <div className="flex-1 flex flex-col p-4">
          <MainContent />
        </div>
      </div>
  );
}