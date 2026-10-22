interface RingBackgroundProps {
  className?: string;
}

const RingBackground = ({ className = "" }: RingBackgroundProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Outer faint ring */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-border/30"
        style={{ opacity: 0.15 }}
      />
      {/* Middle ring */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-border/40"
        style={{ opacity: 0.1 }}
      />
      {/* Inner ring */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-border/50"
        style={{ opacity: 0.08 }}
      />
      {/* Segmented logo ring - very faint */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
        width="500"
        height="500"
        viewBox="0 0 500 500"
        fill="none"
      >
        {[0, 90, 180, 270].map((rotation, index) => {
          const radius = 220;
          const circumference = 2 * Math.PI * radius;
          const gapSize = circumference * 0.06;
          const arcSize = (circumference - gapSize * 4) / 4;
          return (
            <circle
              key={index}
              cx="250"
              cy="250"
              r={radius}
              stroke="currentColor"
              strokeWidth="40"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${arcSize} ${circumference - arcSize}`}
              strokeDashoffset={-rotation * (circumference / 360) - gapSize / 2}
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              className="text-foreground"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default RingBackground;
