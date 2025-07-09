import { ClipboardCheck } from "lucide-react"

interface ExerciseHeaderProps {
  index: number
  type: string
}

export default function ExerciseHeader({ index, type }: ExerciseHeaderProps) {
  return (
    <div className="bg-[#2B2B2B] border border-[#1D1D1D] rounded-t-[5px] h-[69px] flex items-center gap-5 px-5">
      <ClipboardCheck size={20} />

      <div className="flex flex-col">
        <div className="text-white text-sm">Exercise {index}</div>
        <div className="text-xs subtext">{type}</div>
      </div>
    </div>
  )
}
