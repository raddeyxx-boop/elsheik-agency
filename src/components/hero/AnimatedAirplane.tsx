interface Props {
  className?: string
}

export default function AnimatedAirplane({ className = '' }: Props) {
  return (
    <span className={`animated-airplane ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 96 48" focusable="false">
        <path
          className="airplane-body"
          d="M91.5 22.2c-2.8-2.7-8.1-4.1-13.1-4.8L61.7 15 45.4 2.8c-1.5-1.1-3.4-1.7-5.3-1.7h-5.2l8.7 13-20.8-1.7-9.3-7.1H8.2l4.9 9.3-8.4 2.7c-2.6.8-4.2 2.7-4.2 4.7 0 2.2 1.8 4.1 4.6 4.8l8 2-4.9 9.4h5.3l9.3-7.2 20.8-1.7-8.7 13h5.2c1.9 0 3.8-.6 5.3-1.7l16.3-12.2 16.7-2.4c5-.7 10.3-2.1 13.1-4.8l1.7-1.6-1.7-1.4Z"
        />
        <path className="airplane-highlight" d="M8 21.8h72.5M47 15.3l13.5 2M47 28.7l13.5-2" />
        <path className="airplane-window" d="M70.5 19.2h3.2m3.1.4h3" />
      </svg>
    </span>
  )
}
