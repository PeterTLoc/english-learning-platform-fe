interface ContinueButtonProps {
  onClick: () => void
}

export default function ContinueButton({ onClick }: ContinueButtonProps) {
  return (
    <button
      onClick={onClick}
      className="button-blue"
    >
      Continue
    </button>
  )
} 