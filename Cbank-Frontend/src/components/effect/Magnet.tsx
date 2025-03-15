import type React from "react";
import { useRef, useState, useEffect } from "react";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  className = "",
  strength = 50,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: MouseEvent) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);

    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 100;

    if (distance < maxDistance) {
      // Calculate strength based on distance (stronger when closer)
      const strengthFactor = 1 - distance / maxDistance;
      setPosition({
        x: x * strengthFactor * (strength / 50),
        y: y * strengthFactor * (strength / 50),
      });
    } else {
      // Reset position when mouse is far away
      setPosition({ x: 0, y: 0 });
    }
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("mouseleave", reset);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`magnetic-container ${className}`}
      style={{
        position: "relative",
        display: "inline-block",
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      {children}
    </div>
  );
};
