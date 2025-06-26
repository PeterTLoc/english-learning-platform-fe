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

      <div
        className="bg-[#1D1D1D]"
        style={{ height: "calc(100vh - 84px)" }}
      ></div>
    </div>
  );
}
