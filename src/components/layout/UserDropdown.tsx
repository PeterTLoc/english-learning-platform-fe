"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import Dropdown from "../ui/Dropdown";
import UserAvatar from "../ui/UserAvatar";
import { UserRole } from "../guards";
import UserEnum from "@/enums/UserEnum";
import { parseAxiosError } from "@/utils/apiErrors";

const UserDropdown = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      showToast("Logged out successfully", "success");
      router.push("/login");
    } catch (error) {
      const parsedError = parseAxiosError(error);
      showToast(parsedError.message, "error");
    }
  };

  const dropdownItems = [
    ...(user.role === UserEnum.ADMIN
      ? [{ label: "Admin Dashboard", href: "/admin" }]
      : []),
    { label: "Profile", href: `/profile/${user._id}` },
    ...(user.role === UserEnum.USER
      ? [{ label: "Recommendations", href: "/recommendations" }]
      : []),
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
