import CourseSidebar from "@/components/course/CourseSidebar";
import { ReactNode } from "react";
import { SidebarRefreshProvider } from "@/context/SidebarRefreshContext";

interface CourseLayoutProps {
  children: ReactNode;
  params: {
    courseId: string;
  };
}

export default async function CourseLayout({
  children,
  params,
}: CourseLayoutProps) {
  const { courseId } = await params;
  return (
    <SidebarRefreshProvider>
      <div className="flex mt-8">
        <div className="max-w-[280px] w-full m-5">
          <CourseSidebar courseId={courseId} />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="max-w-[1000px] w-full mx-5 mb-5">{children}</div>
        </div>
      </div>
    </SidebarRefreshProvider>
  );
}
