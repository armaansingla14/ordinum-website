interface OrdinumLogoProps {
  size?: number;
  className?: string;
}

const OrdinumLogo = ({ size = 32, className = "" }: OrdinumLogoProps) => {
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const gapSize = circumference * 0.06; // 6% gap
  const arcSize = (circumference - gapSize * 4) / 4; // 4 segments with 4 gaps

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
    >
      {/* Four segmented arcs */}
      {[0, 90, 180, 270].map((rotation, index) => (
        <circle
          key={index}
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${arcSize} ${circumference - arcSize}`}
          strokeDashoffset={-rotation * (circumference / 360) - gapSize / 2}
          style={{ transform: `rotate(-90deg)`, transformOrigin: 'center' }}
        />
      ))}
    </svg>
  );
};

export default OrdinumLogo;
