import { ClipboardCheck } from 'lucide-react'

interface ExerciseHeaderProps {
  index: number
  type: string
}

export default function ExerciseHeader({ index, type }: ExerciseHeaderProps) {
  return (
    <div className="bg-[#2B2B2B] border border-[#1D1D1D] rounded-t-[5px] h-[69px] flex items-center gap-5">
      <div className="w-5 h-5 ml-5">
        <ClipboardCheck className="w-full h-full text-white" />
      </div>
      
      <div className="flex flex-col justify-center h-full">
        <div className="text-white text-sm font-semibold">
          Exercise {index}
        </div>
        <div className="text-xs subtext">
          {type}
        </div>
      </div>
    </div>
  )
} 