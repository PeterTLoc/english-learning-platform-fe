import { useState } from "react"
import { Info, CheckCircle, XCircle } from "lucide-react"

interface ExerciseTextInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  showValidation?: boolean
  isValid?: boolean
  validationResult?: 'correct' | 'incorrect'
  hideSubmitAndHint?: boolean
}

export default function ExerciseTextInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  showValidation = false,
  isValid = true,
  validationResult,
  hideSubmitAndHint = false,
}: ExerciseTextInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      onSubmit()
    }
  }

  const getBorderColor = () => {
    if (showValidation) {
      return isValid ? "border-green-500" : "border-red-500"
    }
    return isFocused ? "border-blue-500" : "border-[#1D1D1D]"
  }

  return (
    <div>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        placeholder="Type your answer..."
        className={`w-full h-[44px] p-5 bg-[#373737] border border-[#3F3F3F] rounded-[5px] text-[#AAAAAA] text-sm placeholder-[#AAAAAA] focus:outline-none transition-colors ${getBorderColor()}`}
      />
      {!hideSubmitAndHint && !disabled && !validationResult && (
        <>
          <div className="flex items-center gap-1 text-xs mt-1" style={{ color: '#AAAAAA' }}>
            <Info className="w-3 h-3" style={{ color: '#AAAAAA' }} />
            <span>Press Enter or click Submit</span>
          </div>
        </>
      )}
      {!hideSubmitAndHint && disabled && validationResult === 'correct' && (
        <div className="flex items-center gap-1 text-xs mt-1" style={{ color: '#22c55e' }}>
          <CheckCircle className="w-3 h-3" style={{ color: '#22c55e' }} />
          <span>Correct</span>
        </div>
      )}
      {!hideSubmitAndHint && disabled && validationResult === 'incorrect' && (
        <div className="flex items-center gap-1 text-xs mt-1" style={{ color: '#ef4444' }}>
          <XCircle className="w-3 h-3" style={{ color: '#ef4444' }} />
          <span>Incorrect</span>
        </div>
      )}
      {!hideSubmitAndHint && !disabled && (
        <button
          onClick={onSubmit}
          disabled={!value?.trim()}
          className="mt-8 button-blue disabled:bg-[#666666] disabled:cursor-not-allowed"
        >
          Submit
        </button>
      )}
    </div>
  )
} 