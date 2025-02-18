import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export const MainContent = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Data Table</h2>
  
        <div className="flex items-center space-x-2 mb-4">
          <Label htmlFor="search">Search:</Label>
          <Input type="text" id="search" placeholder="Search..." className="max-w-sm" />
        </div>
      </div>
    );
  };