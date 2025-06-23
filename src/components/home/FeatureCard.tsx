import Image from "next/image"

type FeatureCardData = {
  title: string
  description: string
  imageUrl: string
  reverse?: boolean
}

const FeatureCard: React.FC<FeatureCardData> = ({
  title,
  description,
  imageUrl,
  reverse = false,
}) => {
  return (
    <div
      className={`flex flex-1 min-h-0 flex-col md:flex-row items-center justify-between gap-12 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="md:w-1/2 text-center md:text-left">
        <h2 className="text-lg md:text-xl font-bold mb-2">{title}</h2>
        <p className="text-sm text-[#CFCFCF]">{description}</p>
      </div>

      <div className="md:w-1/2 w-full">
        <div className="group relative max-w-[350px] aspect-video overflow-hidden rounded-[5px]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        </div>
      </div>
    </div>
  )
}

export default FeatureCard
