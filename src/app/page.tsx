import AnimatedTitle from "@/components/home/AnimatedTitle"

export default function Home() {
  return (
    <div>
      <div
        className="relative flex flex-col justify-center items-center"
        style={{
          height: "calc(100vh - 84px)",
          overflow: "hidden",
        }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://w0.peakpx.com/wallpaper/491/1016/HD-wallpaper-book-bw-silhouette-minimalism.jpg')",
          }}
        />

        {/* Smoother Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/20 to-[#202020]/90 animate-fade-in" />

        {/* Foreground Content */}
        <div className="relative z-10">
          <AnimatedTitle />
        </div>
      </div>

      <div
        className="p-5 flex justify-center items-center"
        style={{ height: "calc(100vh - 84px)" }}
      >
        <div className="grid grid-cols-2 max-w-[1000px]">
          <h1 className="text-3xl font-bold">What is ELS?</h1>

          <div className="flex flex-col gap-7">
            <div>
              <h3 className="font-bold">Learn Anytime, Anywhere</h3>
              <p className="subtext text-sm">
                Access lessons on your phone, tablet, or desktop at your
                convenience.
              </p>
            </div>

            <div>
              <h3 className="font-bold">Interactive Lessons & Quizzes</h3>
              <p className="subtext text-sm">
                Engage with fun exercises and quizzes that make learning
                enjoyable.
              </p>
            </div>

            <div>
              <h3 className="font-bold">Track Your Progress</h3>
              <p className="subtext text-sm">
                Visualize your journey and stay motivated with progress
                tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
