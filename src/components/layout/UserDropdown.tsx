"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Dropdown from "../ui/Dropdown";
import UserAvatar from "../ui/UserAvatar";
import { UserRole } from "../guards";

const UserDropdown = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const dropdownItems = [
    ...(user.role === UserRole.ADMIN
      ? [{ label: "Admin Dashboard", href: "/admin" }]
      : []),
    { label: "Profile", href: "/profile" },
    { label: "My Flashcard Sets", href: `/flashcard-sets?userId=${user._id}` },
    { label: "Logout", onClick: handleLogout },
  ];

  const headerContent = (
    <div>
      <div className="flex items-center gap-3">
        <UserAvatar
          username={user.username}
          avatarUrl={user.avatar}
          size="md"
        />
        <div>
          <p className="text-md font-medium text-white">{user.username}</p>
          <p className="text-sm text-[#CFCFCF] truncate">{user.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Dropdown
      trigger={
        <UserAvatar
          username={user.username}
          avatarUrl={user.avatar}
          size="sm"
          className="bg-[#4CC2FF] cursor-pointer"
        />
      }
      items={dropdownItems}
      headerContent={headerContent}
      align="right"
    />
  );
};

export default UserDropdown;
