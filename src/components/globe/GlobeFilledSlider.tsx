import React from 'react';

export interface GlobeFilledSliderProps {
  id?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
  fillColorClass?: string;
  ariaLabel?: string;
}

export const GlobeFilledSlider: React.FC<GlobeFilledSliderProps> = ({
  id,
  min,
  max,
  step,
  value,
  onChange,
  fillColorClass = 'bg-amber-500',
  ariaLabel,
}) => {
  const safeVal = Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;
  const percentage = Math.min(100, Math.max(0, ((safeVal - min) / (max - min)) * 100));

  return (
    <div className="relative w-full flex items-center h-6" id={id}>
      <div className="absolute inset-x-0 h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-75 ${fillColorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeVal}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="solar-range-input relative z-10 w-full h-6 cursor-pointer focus:outline-none"
        aria-label={ariaLabel}
      />
    </div>
  );
};
