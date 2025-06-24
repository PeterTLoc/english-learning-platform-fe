import AnimatedTitle from "@/components/home/AnimatedTitle"
import Carousel from "@/components/ui/Carousel"

export default function Home() {
  return (
    <div>
      <div
        className="flex flex-col justify-center items-center bg-[#202020]"
        style={{ height: "calc(100vh - 84px)", overflow: "hidden" }}
      >
        <AnimatedTitle />
      </div>

      <div
        className="p-5 flex justify-center items-center"
        style={{ height: "calc(100vh - 84px)" }}
      >
        {/* <div className="flex-1 flex min-h-0 gap-5">
          <div className="p-5 flex flex-col justify-center w-1/2">
            <h2 className="font-bold text-xl">Learn Anytime, Anywhere</h2>
            <p className="text-gray-300 mt-4">
              Access lessons on your phone, tablet, or desktop at your
              convenience.
            </p>
          </div>

          <div className="p-5 w-1/2">
            <div className="relative w-full h-full rounded-md overflow-hidden">
              <Image
                alt="Learn Anytime, Anywhere"
                src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=800&q=80"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex min-h-0 gap-5">
          <div className="p-5 w-1/2">
            <div className="relative w-full h-full rounded-md overflow-hidden">
              <Image
                alt="Interactive Lessons & Quizzes"
                src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="p-5 flex flex-col justify-center w-1/2">
            <h2 className="font-bold text-xl">Interactive Lessons & Quizzes</h2>
            <p className="text-gray-300 mt-4">
              Engage with fun exercises and quizzes that make learning
              enjoyable.
            </p>
          </div>
        </div>

        <div className="flex-1 flex min-h-0 gap-5">
          <div className="p-5 flex flex-col justify-center w-1/2">
            <h2 className="font-bold text-xl">Track Your Progress</h2>
            <p className="text-gray-300 mt-4">
              Visualize your journey and stay motivated with progress tracking.
            </p>
          </div>

          <div className="p-5 w-1/2">
            <div className="relative w-full h-full rounded-md overflow-hidden">
              <Image
                alt="Track Your Progress"
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div> */}

        <div className="grid grid-cols-2 max-w-[1000px]">
          <h1 className="text-3xl font-bold">What is ELS?</h1>

          <div className="flex flex-col gap-7">
            <div>
              <h3 className="font-bold text-xl">Learn Anytime, Anywhere</h3>
              <p className="text-gray-300">
                Access lessons on your phone, tablet, or desktop at your
                convenience.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-xl">
                Interactive Lessons & Quizzes
              </h3>
              <p className="text-gray-300">
                Engage with fun exercises and quizzes that make learning
                enjoyable.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-xl">Track Your Progress</h3>
              <p className="text-gray-300">
                Visualize your journey and stay motivated with progress
                tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1D1D1D]" style={{ height: "calc(100vh - 84px)" }}>
        <Carousel />
      </div>
    </div>
  )
}
