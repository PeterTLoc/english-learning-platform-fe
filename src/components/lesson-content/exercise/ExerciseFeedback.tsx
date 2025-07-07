import { IExercise } from "@/types/models/IExercise"
import { CheckCircle, Lightbulb } from 'lucide-react'

interface ExerciseFeedbackProps {
  exercise: IExercise
  hasSubmitted: boolean
  isCompleted?: boolean
}

export default function ExerciseFeedback({
  exercise,
  hasSubmitted,
  isCompleted = false,
}: ExerciseFeedbackProps) {
  if (!hasSubmitted && !isCompleted) {
    return null
  }

  const correctAnswers = Array.isArray(exercise.answer)
    ? exercise.answer
    : [exercise.answer]

  if (!exercise.explanation && !correctAnswers[0]) {
    return null
  }

  return (
    <>
      <h2 className="subtitle">Feedback</h2>
      <div className="flex flex-col gap-1 mb-5">
        {correctAnswers[0] && (
          <div>
            <div className="bg-[#2B2B2B] border border-[#1D1D1D] rounded-t-[5px] h-[69px] flex items-center gap-5">
              <div className="w-5 h-5 ml-5 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-full h-full" style={{ color: '#22c55e' }} />
              </div>
              <div className="flex flex-col justify-center h-full">
                <div className="text-white text-sm font-semibold">
                  Correct Answer{correctAnswers.length > 1 ? "s" : ""}
                </div>
              </div>
            </div>
            <div className="bg-[#2B2B2B] border border-[#1D1D1D] border-t-[#2B2B2B] rounded-b-[5px] pl-[60px] pb-4 pt-4">
              <div className="flex flex-col gap-[5px]">
                {correctAnswers.map((ans: string, idx: number) => (
                  <span key={idx} className="text-white text-[13px] font-medium">
                    {ans}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        {exercise.explanation && (
          <div>
            <div className="bg-[#2B2B2B] border border-[#1D1D1D] rounded-t-[5px] h-[69px] flex items-center gap-5">
              <div className="w-5 h-5 ml-5 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-full h-full" style={{ color: '#FFD600' }} />
              </div>
              <div className="flex flex-col justify-center h-full">
                <div className="text-white text-sm font-semibold">
                  Explanation
                </div>
              </div>
            </div>
            <div className="bg-[#2B2B2B] border border-[#1D1D1D] border-t-[#2B2B2B] rounded-b-[5px] pl-[60px] pb-4 pt-4">
              <p className="text-white text-[13px] mb-0">{exercise.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
