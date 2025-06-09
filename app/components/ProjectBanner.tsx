interface ProjectBannerProps {
  banner: string;
  projectName: string;
  className?: string;
  variant?: "card" | "page";
}

export function ProjectBanner({
  banner,
  projectName,
  className = "",
  variant = "page",
}: ProjectBannerProps) {
  if (variant === "card") {
    // For project cards, keep the fixed height and crop
    return (
      <div className={`w-full overflow-hidden ${className}`}>
        <img
          src={banner}
          alt={`${projectName} banner`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    );
  }

  // For project pages, show the full image
  return (
    <div className={`w-full overflow-hidden rounded-lg ${className}`}>
      <img
        src={banner}
        alt={`${projectName} banner`}
        className="w-full max-h-96 object-contain bg-gray-50"
      />
    </div>
  );
}
