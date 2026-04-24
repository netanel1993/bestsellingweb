export function StarRating({ value, size = 14 }: { value: number; size?: number }) {
  const rounded = Math.round(value * 2) / 2;
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Rated ${value} out of 5`}>
      {stars.map((i) => {
        const fill = rounded >= i ? "full" : rounded >= i - 0.5 ? "half" : "empty";
        return <Star key={i} fill={fill} size={size} />;
      })}
      <span className="ml-1 text-xs font-medium text-slate-700 dark:text-slate-300">
        {value.toFixed(1)}
      </span>
    </span>
  );
}

function Star({ fill, size }: { fill: "full" | "half" | "empty"; size: number }) {
  const id = `grad-${fill}-${Math.random().toString(36).slice(2, 6)}`;
  const color = "#f59e0b";
  const bg = "#cbd5e1";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {fill === "half" && (
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor={color} />
            <stop offset="50%" stopColor={bg} />
          </linearGradient>
        </defs>
      )}
      <path
        d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.7L6 22l1.5-7.2L2 10l7.1-1.1L12 2z"
        fill={fill === "full" ? color : fill === "empty" ? bg : `url(#${id})`}
      />
    </svg>
  );
}
