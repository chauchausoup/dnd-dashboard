import { DashboardTable } from "./dashboard-table";

export const MainContent = () => {
    return (
      <div>  
        <div className="flex items-center space-x-2 mb-4">
          <DashboardTable/>
        </div>
      </div>
    );
  };