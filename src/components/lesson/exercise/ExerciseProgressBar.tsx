interface ExerciseProgressBarProps {
  completed: number
  total: number
  percent: number
}

export default function ExerciseProgressBar({
  completed,
  total,
  percent,
}: ExerciseProgressBarProps) {
  const progress = percent

  return (
    <div className="mb-4">
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-2 subtext text-sm">
        <span>{completed} of {total} questions</span>
        <span>{percent}%</span>
      </div>
    </div>
  )
}
