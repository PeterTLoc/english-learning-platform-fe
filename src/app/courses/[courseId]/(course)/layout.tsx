import CourseSidebar from "@/components/course/CourseSidebar"
import { ReactNode } from "react"
import { SidebarRefreshProvider } from "@/context/SidebarRefreshContext"

interface CourseLayoutProps {
  children: ReactNode
  params: {
    courseId: string
  }
}

export default async function CourseLayout({
  children,
  params,
}: CourseLayoutProps) {
  const { courseId } = await params

  return (
    <SidebarRefreshProvider>
      <div className="relative flex min-h-[calc(100vh-84px)] overflow-hidden">
        {/* 🌌 Lighter neutral background */}
        <div className="absolute inset-0 bg-[#202020]/95 backdrop-blur-sm" />

        {/* ✨ Ultra-subtle starfield */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(35)].map((_, i) => {
            const size = Math.random() * 1 + 0.4 // 0.4–1.4px
            const opacity = Math.random() * 0.08 + 0.03 // even fainter
            const twinkleDuration = `${3 + Math.random() * 5}s`

            return (
              <span
                key={i}
                className="absolute rounded-full bg-white animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity,
                  animationDuration: twinkleDuration,
                }}
              />
            )
          })}
        </div>

        {/* 🌫 Soft, faint color glows */}
        <div className="absolute -top-20 right-10 w-[200px] h-[200px] bg-[#4CC2FF]/8 rounded-full blur-[80px]" />
        <div className="absolute bottom-10 left-10 w-[180px] h-[180px] bg-[#34d399]/8 rounded-full blur-[70px]" />

        {/* ✅ Actual layout content stays the same */}
        <div className="relative flex w-full z-10">
          <div className="max-w-[280px] w-full m-5">
            <CourseSidebar courseId={courseId} />
          </div>

          <div className="flex-1 flex justify-center">
            <div className="max-w-[1000px] w-full mx-5 mb-5">{children}</div>
          </div>
        </div>
      </div>
    </SidebarRefreshProvider>
  )
}
