import { ModeToggle } from "./mode-toggle";
import { Avatar } from "@/components/ui/avatar"
import { AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"

export const Header = () => {
    return (
      <div className="flex items-center justify-between h-16">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  };