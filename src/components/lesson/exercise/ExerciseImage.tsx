interface ExerciseImageProps {
  image?: string
}

export default function ExerciseImage({ image }: ExerciseImageProps) {
  if (!image) {
    return null
  }

  return (
    <div className="mb-5">
      <img
        src={image}
        alt="Exercise"
        className="rounded-[5px] object-cover"
      />
    </div>
  )
} 