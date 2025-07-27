interface ExerciseImageProps {
  image?: string
}

const FALLBACK_IMAGE =
  "https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1699909962/fallback_image_header/fallback_image_header-png?_i=AA"

export default function ExerciseImage({ image }: ExerciseImageProps) {
  const displayImage = image || FALLBACK_IMAGE

  return (
    <div className="mb-5">
      <img
        src={displayImage}
        alt="Exercise"
        className="rounded-[5px] object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = FALLBACK_IMAGE
        }}
      />
    </div>
  )
}
