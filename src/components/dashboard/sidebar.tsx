import { Separator } from "@/components/ui/separator"

export const Sidebar = () => {
    return (
      <div className="w-64 border-r bg-secondary text-secondary-foreground flex flex-col p-4">
        <h2 className="text-lg font-semibold mb-4">Navigation</h2>
        <Separator />
        <nav className="flex-1 py-4">
          <ul>
            <li className="mb-2">
              <a href="#" className="block hover:bg-accent hover:text-accent-foreground p-2 rounded">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="block hover:bg-accent hover:text-accent-foreground p-2 rounded">
                Data
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  };