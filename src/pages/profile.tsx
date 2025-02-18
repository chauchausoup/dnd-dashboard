import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
      <div className="flex items-center mb-4">
        <Avatar className="mr-4">
          <AvatarImage src="https://github.com/shadcn.png" alt="Profile Image" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">John Doe</h2>
          <p className="text-gray-500">johndoe@example.com</p>
        </div>
      </div>
      <h2 className="text-xl font-semibold mt-4 mb-2">Your Settings</h2>
      <p className="mb-2">
        Manage your profile information and settings here. (This is dummy
        content.)
      </p>
      <ul className="list-disc list-inside">
        <li>Change Password</li>
        <li>Update Email Address</li>
        <li>Manage Notifications</li>
      </ul>
    </div>
  );
};

export default Profile;