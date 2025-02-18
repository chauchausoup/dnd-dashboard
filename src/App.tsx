import { BrowserRouter as Router, Route, Routes } from 'react-router';
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardTable } from "./components/dashboard/dashboard-table";

import Home from './pages/home';
import About from './pages/about';
import Profile from './pages/profile';

function App() {
    return (
            <Router>
                <div className="flex h-screen bg-background text-foreground">
                    <Sidebar />
                    <div className="flex-1 flex flex-col p-4">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/spells" element={<DashboardTable />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/profile" element={<Profile />} />

                        </Routes>
                    </div>
                </div>
            </Router>
    );
}

export default App;