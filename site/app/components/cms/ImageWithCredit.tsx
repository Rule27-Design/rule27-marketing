import Image from "next/image";

export interface ImageWithCreditProps {
  src: string;
  alt: string;
  photographer?: string;
  pexelsUrl?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

export function ImageWithCredit({
  src,
  alt,
  photographer,
  pexelsUrl,
  className,
  fill = false,
  width,
  height,
  priority = false,
  sizes,
}: ImageWithCreditProps) {
  const imgProps = fill
    ? { fill: true, sizes: sizes ?? "(max-width: 768px) 100vw, 50vw" }
    : { width: width ?? 1600, height: height ?? 900 };

  return (
    <>
      <Image
        src={src}
        alt={alt}
        className={className}
        priority={priority}
        {...imgProps}
      />
      {photographer && (
        <a
          href={pexelsUrl ?? "https://www.pexels.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 z-10 rounded bg-black/60 px-2 py-1 text-xs text-white/80 backdrop-blur hover:text-white"
        >
          Photo by {photographer} on Pexels
        </a>
      )}
    </>
  );
}
