// import type React from "react";
// import { useRef, useEffect, useState } from "react";
// import { useSprings, animated, type SpringValue } from "@react-spring/web";

// interface BlurTextProps {
//   text?: string;
//   delay?: number;
//   className?: string;
//   animateBy?: "words" | "letters";
//   direction?: "top" | "bottom";
//   threshold?: number;
//   rootMargin?: string;
//   animationFrom?: Record<string, any>;
//   animationTo?: Record<string, any>[];
//   easing?: (t: number) => number | string;
//   onAnimationComplete?: () => void;
// }

// const BlurText: React.FC<BlurTextProps> = ({
//   text = "",
//   delay = 200,
//   className = "",
//   animateBy = "words",
//   direction = "top",
//   threshold = 0.1,
//   rootMargin = "0px",
//   animationFrom,
//   animationTo,
//   easing = "easeOutCubic",
//   onAnimationComplete,
// }) => {
//   const elements = animateBy === "words" ? text.split(" ") : text.split("");
//   const [inView, setInView] = useState(false);
//   const [isScrollingUp, setIsScrollingUp] = useState(false);
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const ref = useRef<HTMLParagraphElement>(null);
//   const animatedCount = useRef(0);
//   const lastScrollY = useRef(0);

//   // Default animations based on direction
//   const defaultFrom: Record<string, any> =
//     direction === "top"
//       ? {
//           filter: "blur(10px)",
//           opacity: 0,
//           transform: "translate3d(0,-50px,0)",
//         }
//       : {
//           filter: "blur(10px)",
//           opacity: 0,
//           transform: "translate3d(0,50px,0)",
//         };

//   const defaultTo: Record<string, any>[] = [
//     {
//       filter: "blur(0px)",
//       opacity: 1,
//       transform: "translate3d(0,0,0)",
//     },
//   ];

//   // Intersection Observer for initial animation
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setInView(true);
//           if (ref.current) {
//             observer.unobserve(ref.current);
//           }
//         }
//       },
//       { threshold, rootMargin }
//     );

//     if (ref.current) {
//       observer.observe(ref.current);
//     }

//     return () => observer.disconnect();
//   }, [threshold, rootMargin]);

//   // Scroll event handler
//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;

//       // Calculate scroll progress (0-100)
//       const maxScroll = 300; // Maximum scroll distance to track
//       const progress =
//         Math.min(Math.max(currentScrollY / maxScroll, 0), 1) * 100;
//       setScrollProgress(progress);

//       // Determine scroll direction
//       if (currentScrollY > lastScrollY.current) {
//         setIsScrollingUp(false); // Scrolling down
//       } else if (currentScrollY < lastScrollY.current) {
//         setIsScrollingUp(true); // Scrolling up
//       }

//       lastScrollY.current = currentScrollY;
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const springs = useSprings(
//     elements.length,
//     elements.map((_, i) => {
//       // Calculate the threshold for this letter
//       // When scrolling up, letters should blur in reverse order (last to first)
//       const letterThreshold = isScrollingUp
//         ? (elements.length - 1 - i) * (100 / elements.length)
//         : i * (100 / elements.length);

//       // Determine if this letter should be blurred based on scroll progress
//       const shouldBlur = isScrollingUp && scrollProgress > letterThreshold;

//       // Base animation for initial appearance
//       const baseAnimation = {
//         from: animationFrom || defaultFrom,
//         to: inView
//           ? async (
//               next: (arg: Record<string, SpringValue<any>>) => Promise<void>
//             ) => {
//               for (const step of animationTo || defaultTo) {
//                 await next(step);
//               }
//               animatedCount.current += 1;
//               if (
//                 animatedCount.current === elements.length &&
//                 onAnimationComplete
//               ) {
//                 onAnimationComplete();
//               }
//             }
//           : animationFrom || defaultFrom,
//         delay: i * delay,
//         config: { easing: easing as any },
//       };

//       // Sequential scroll-responsive behavior
//       return {
//         ...baseAnimation,
//         // Apply blur based on scroll progress and letter position
//         filter: shouldBlur ? "blur(8px)" : "blur(0px)",
//         opacity: shouldBlur ? 0.6 : 1,
//         // Move in one direction when blurred
//         transform: shouldBlur
//           ? direction === "top"
//             ? "translate3d(0,-20px,0)"
//             : "translate3d(0,20px,0)"
//           : "translate3d(0,0,0)",
//         // Make the transition smooth
//         config: {
//           tension: 300,
//           friction: 20,
//           duration: 300,
//         },
//       };
//     })
//   );

//   return (
//     <p ref={ref} className={`blur-text ${className} flex flex-wrap`}>
//       {springs.map((props, index) => (
//        <animated.span
//        key={index}
//        style={{ ...props }}
//        className="inline-block transition-transform will-change-[transform,filter,opacity]"
//      >
//        {elements[index] === " " ? "\u00A0" : elements[index]}
//        {animateBy === "words" && index < elements.length - 1 ? "\u00A0" : ""}
//      </animated.span>

//       ))}
//     </p>
//   );
// };

// export default BlurText;
