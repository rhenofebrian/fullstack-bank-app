// import {
//   useRef,
//   useLayoutEffect,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import {
//   motion,
//   useScroll,
//   useSpring,
//   useTransform,
//   useMotionValue,
//   useVelocity,
//   useAnimationFrame,
// } from "framer-motion";

// // Hook untuk mendapatkan lebar elemen dengan ResizeObserver
// function useElementWidth(ref: React.RefObject<HTMLElement>) {
//   const [width, setWidth] = useState(0);

//   const updateWidth = useCallback(() => {
//     if (ref.current) {
//       setWidth(ref.current.offsetWidth);
//     }
//   }, [ref]);

//   useLayoutEffect(() => {
//     if (!ref.current) return;

//     updateWidth();
//     const resizeObserver = new ResizeObserver(updateWidth);
//     resizeObserver.observe(ref.current);

//     return () => resizeObserver.disconnect();
//   }, [updateWidth]);

//   return width;
// }

// // Fungsi untuk looping nilai dalam rentang tertentu
// function wrap(min: number, max: number, v: number) {
//   return ((((v - min) % (max - min)) + (max - min)) % (max - min)) + min;
// }

// interface ScrollVelocityProps {
//   scrollContainerRef?: React.RefObject<HTMLElement>;
//   texts: string[];
//   velocity?: number;
//   className?: string;
//   damping?: number;
//   stiffness?: number;
//   numCopies?: number;
//   velocityMapping?: { input: [number, number]; output: [number, number] };
//   parallaxClassName?: string;
//   scrollerClassName?: string;
//   parallaxStyle?: React.CSSProperties;
//   scrollerStyle?: React.CSSProperties;
// }

// export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
//   scrollContainerRef,
//   texts = [],
//   velocity = 100,
//   className = "",
//   damping = 50,
//   stiffness = 400,
//   numCopies = 6,
//   velocityMapping = { input: [0, 1000], output: [0, 5] },
//   parallaxClassName,
//   scrollerClassName,
//   parallaxStyle,
//   scrollerStyle,
// }) => {
//   const VelocityText: React.FC<{ children: string; baseVelocity?: number }> =
//     React.memo(({ children, baseVelocity = velocity }) => {
//       const baseX = useMotionValue(0);
//       const { scrollY } = useScroll(
//         scrollContainerRef ? { container: scrollContainerRef } : {}
//       );
//       const scrollVelocity = useVelocity(scrollY);
//       const smoothVelocity = useSpring(scrollVelocity, { damping, stiffness });
//       const velocityFactor = useTransform(
//         smoothVelocity,
//         velocityMapping.input,
//         velocityMapping.output,
//         { clamp: false }
//       );

//       const copyRef = useRef<HTMLElement>(null);
//       const copyWidth = useElementWidth(copyRef);
//       const directionFactor = useMotionValue(1);

//       const x = useTransform(baseX, (v) =>
//         copyWidth === 0 ? "0px" : `${wrap(-copyWidth, 0, v)}px`
//       );

//       useAnimationFrame((_, delta) => {
//         let moveBy = directionFactor.get() * baseVelocity * (delta / 1000);
//         moveBy += directionFactor.get() * moveBy * velocityFactor.get();
//         baseX.set(baseX.get() + moveBy);
//       });

//       return (
//         <div
//           className={`relative overflow-hidden ${parallaxClassName || ""}`}
//           style={parallaxStyle}
//         >
//           <motion.div
//             className={`flex whitespace-nowrap text-center text-4xl font-bold tracking-tight drop-shadow md:text-[5rem] md:leading-[5rem] ${
//               scrollerClassName || ""
//             }`}
//             style={{ x, ...scrollerStyle }}
//           >
//             {Array.from({ length: Math.max(numCopies, 1) }).map((_, i) => (
//               <span
//                 className={`flex-shrink-0 ${className}`}
//                 key={i}
//                 ref={i === 0 ? copyRef : null}
//               >
//                 {children}
//               </span>
//             ))}
//           </motion.div>
//         </div>
//       );
//     });

//   return (
//     <section>
//       {texts.map((text, index) => (
//         <VelocityText
//           key={index}
//           baseVelocity={index % 2 !== 0 ? -velocity : velocity}
//         >
//           {text}
//         </VelocityText>
//       ))}
//     </section>
//   );
// };

// export default ScrollVelocity;
