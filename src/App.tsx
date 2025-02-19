import {
  HashRouter as Router,
  Route,
  Routes,
} from "react-router";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Profile from "@/pages/Profile";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardTable } from "@/components/dashboard/table/DashboardTable";


function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar />
        <div className="flex-1 flex flex-col p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/spells"
              element={<DashboardTable />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
