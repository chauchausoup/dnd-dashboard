import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "./mode-toggle";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Link, useLocation } from "react-router";

export const Sidebar = () => {
  const location = useLocation();

  const isActive = (pathname: string) =>
    location.pathname === pathname;

  return (
    <div className="w-64 border-r bg-secondary text-secondary-foreground flex flex-col p-4">
      <Link
        to="/"
        className={`block p-2 rounded ${
          isActive("/spells")
            ? "bg-accent text-accent-foreground"
            : "hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4">
          dashboard
        </h2>
      </Link>
      <nav className="flex-1 py-4">
        <ul>
          <li className="mb-2">
            <Link
              to="/spells"
              className={`block p-2 rounded ${
                isActive("/spells")
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              Spells
            </Link>
          </li>
          <Separator />
          <li>
            <Link
              to="/profile"
              className={`block p-2 rounded ${
                isActive("/about")
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`block p-2 rounded ${
                isActive("/about")
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              About
            </Link>
          </li>
        </ul>
      </nav>
      <Separator />
      <div className="mt-auto">
        <div className="flex items-center justify-center space-x-3 py-4">
          <ModeToggle />
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="User Avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};
