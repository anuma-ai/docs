import React from "react";

export function ReactIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-14 -14 28 28"
      fill="currentColor"
      style={{ width: 56, height: 56, minWidth: 56, minHeight: 56 }}
      className={className}
    >
      <circle r="2" />
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <ellipse rx="10" ry="4.5" />
        <ellipse rx="10" ry="4.5" transform="rotate(60)" />
        <ellipse rx="10" ry="4.5" transform="rotate(120)" />
      </g>
    </svg>
  );
}

export function ExpoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-4 -4 32 32"
      fill="currentColor"
      style={{ width: 56, height: 56, minWidth: 56, minHeight: 56 }}
      className={className}
    >
      <path d="M0 20.084c.043.53.23 1.063.718 1.778.58.849 1.576 1.315 2.399.553.897-.83 5.156-8.772 7.57-12.476.282-.434.49-.767.903-.767.414 0 .621.333.904.767 2.414 3.704 6.672 11.646 7.57 12.476.822.762 1.818.296 2.398-.553.489-.715.675-1.248.718-1.778.043-.53-.134-1.196-.912-2.683L14.244 3.201c-.439-.839-.7-1.331-1.334-1.892-.635-.56-1.403-.809-1.91-.809-.508 0-1.276.248-1.911.81-.634.56-.895 1.052-1.334 1.891L.912 17.401c-.778 1.487-.955 2.153-.912 2.683z" />
    </svg>
  );
}
