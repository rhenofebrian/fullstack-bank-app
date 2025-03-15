import { ChevronDown, ArrowUpRight, X, ChevronRight } from "lucide-react";
import {
  motion,
  useInView,
  useAnimationControls,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Magnetic } from "../components/effect/Magnet";
import { expertiseCards, serviceCards, type ServiceCard } from "../data";

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const expertiseRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLElement>(document.body); // Inisialisasi dengan body secara default

  const [cardAnimationStarted, setCardAnimationStarted] = useState(false);
  const [cardAnimationComplete, setCardAnimationComplete] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceCard | null>(
    null
  );
  const [isHorizontalScrolling, setIsHorizontalScrolling] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [hasReachedStart, setHasReachedStart] = useState(true);
  const [manualScrolling, setManualScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [hasAnimatedOnce, setHasAnimatedOnce] = useState(false);
  const [isExpertiseSectionActive, setIsExpertiseSectionActive] =
    useState(false);
  // Animation controls for cards
  const firstCardControls = useAnimationControls();
  const secondCardControls = useAnimationControls();
  const thirdCardControls = useAnimationControls();
  const fourthCardControls = useAnimationControls();

  // Track if expertise section is in view
  const isExpertiseInView = useInView(expertiseRef, {
    once: false,
    amount: 0.5,
    margin: "-100px 0px",
  });

  // Initialize body reference
  useEffect(() => {
    bodyRef.current = document.body;
  }, []);

  // Store the original scroll position and body styles
  const [scrollPosition, setScrollPosition] = useState(0);

  // Lock/unlock body scroll with improved smoothness
  const lockScroll = () => {
    if (bodyRef.current && !isScrollLocked) {
      // Store current scroll position
      const currentScrollPosition = window.scrollY;
      setScrollPosition(currentScrollPosition);

      // Apply styles to body to prevent scrolling but maintain position visually
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${currentScrollPosition}px`;

      // Set state to track locked status
      setIsScrollLocked(true);
    }
  };

  const unlockScroll = () => {
    if (bodyRef.current && isScrollLocked) {
      // Remove scroll lock styles
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";

      // Restore scroll position
      window.scrollTo(0, scrollPosition);

      // Reset state
      setIsScrollLocked(false);
    }
  };

  // Add this function to handle cleanup on component unmount
  const cleanupScrollLock = () => {
    if (isScrollLocked) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.height = "";
    }
  };

  // Check scroll position to determine if we've reached the start or end
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const checkScrollPosition = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

      // Set precise thresholds for start and end detection
      const isAtStart = scrollLeft <= 5;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5;

      if (isAtStart !== hasReachedStart) {
        setHasReachedStart(isAtStart);
      }

      if (isAtEnd !== hasReachedEnd) {
        setHasReachedEnd(isAtEnd);
      }
    };

    // Check immediately and on scroll
    checkScrollPosition();

    const handleScroll = () => {
      requestAnimationFrame(checkScrollPosition);
    };

    scrollContainer.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [hasReachedStart, hasReachedEnd]);

  // Check if expertise section is active (in viewport)
  useEffect(() => {
    if (!expertiseRef.current) return;

    const checkExpertiseVisibility = () => {
      const expertiseRect = expertiseRef.current?.getBoundingClientRect();
      if (!expertiseRect) return;

      // Consider the section active when it's prominently in view
      const isActive =
        expertiseRect.top <= window.innerHeight * 0.4 &&
        expertiseRect.bottom >= window.innerHeight * 0.6;

      setIsExpertiseSectionActive(isActive);
    };

    // Check initially and on scroll
    checkExpertiseVisibility();
    window.addEventListener("scroll", checkExpertiseVisibility, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", checkExpertiseVisibility);
    };
  }, []);

  // Handle scroll events for card animations and horizontal scrolling
  useEffect(() => {
    if (!expertiseRef.current) return;

    let lastScrollY = window.scrollY;
    let isProcessingScroll = false;
    let lastScrollTime = 0;
    const scrollThreshold = 200; // Increased threshold to prevent rapid firing

    const handleScroll = () => {
      const now = Date.now();
      // Throttle scroll events
      if (now - lastScrollTime < scrollThreshold) return;
      lastScrollTime = now;

      if (isProcessingScroll || manualScrolling || isScrollLocked) return;

      const currentScrollY = window.scrollY;
      const expertiseRect = expertiseRef.current?.getBoundingClientRect();
      const scrollingDown = currentScrollY > lastScrollY;
      const scrollingUp = currentScrollY < lastScrollY;

      // Ignore small scroll movements to prevent accidental triggering
      const isSignificantScroll = Math.abs(currentScrollY - lastScrollY) > 10;
      if (!isSignificantScroll) {
        lastScrollY = currentScrollY;
        return;
      }

      // Check if we're in the expertise section's active zone
      const isInActiveZone =
        expertiseRect &&
        expertiseRect.top <= 100 &&
        expertiseRect.bottom >= window.innerHeight * 0.3;

      // Only reset cards when scrolling up AND we're actually in the expertise section
      if (scrollingUp && cardAnimationStarted && isExpertiseSectionActive) {
        isProcessingScroll = true;
        lockScroll();

        // Reset card positions with smooth animations
        resetCardPositions().then(() => {
          isProcessingScroll = false;
          setHasAnimatedOnce(false); // Allow animation again after reset

          // Delay unlock to ensure smooth transition
          setTimeout(() => {
            unlockScroll();
          }, 300);
        });
      }

      // Check if we're at the bottom of the page
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      // Only animate cards when scrolling down, in the active zone, and haven't animated yet
      // AND we're not at the bottom of the page
      if (
        scrollingDown &&
        isInActiveZone &&
        !cardAnimationStarted &&
        !hasAnimatedOnce &&
        !isAtBottom
      ) {
        isProcessingScroll = true;
        lockScroll();
        setHasAnimatedOnce(true); // Mark as animated to prevent repeating

        // Start card animation
        animateCardsOut().then(() => {
          isProcessingScroll = false;
          setIsHorizontalScrolling(true);

          // Delay unlock to ensure smooth transition
          setTimeout(() => {
            unlockScroll();
          }, 300);
        });
      }

      lastScrollY = currentScrollY;
    };

    const throttledScrollHandler = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", throttledScrollHandler, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);
      unlockScroll();
    };
  }, [
    cardAnimationStarted,
    cardAnimationComplete,
    manualScrolling,
    isScrollLocked,
    hasAnimatedOnce,
    isExpertiseSectionActive,
  ]);

  // Improved wheel event handling for horizontal scrolling
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let wheelTimeout: NodeJS.Timeout;
    let isWheelProcessing = false;
    let lastWheelTime = 0;
    const wheelThreshold = 150; // Minimum time between wheel events to process

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();

      // Check if we're at the bottom of the page
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      // If we're at the bottom, don't trigger card animations
      if (isAtBottom && e.deltaY > 0) {
        return;
      }

      // Prevent default only when we're in horizontal scroll mode
      if (isHorizontalScrolling || cardAnimationComplete) {
        e.preventDefault();
      }

      // Throttle wheel events to prevent rapid firing
      if (now - lastWheelTime < wheelThreshold || isWheelProcessing) {
        return;
      }
      lastWheelTime = now;

      // Only handle when expertise section is in view
      if (!isExpertiseInView || isScrollLocked) {
        return;
      }

      clearTimeout(wheelTimeout);

      // If we're already in horizontal scrolling mode
      if (isHorizontalScrolling || cardAnimationComplete) {
        isWheelProcessing = true;

        // Calculate the card width for snapping
        const cards = scrollContainer.querySelectorAll(".snap-center");
        if (cards.length === 0) {
          isWheelProcessing = false;
          return;
        }

        const cardWidth = cards[0].clientWidth + 24; // Width + gap
        const { scrollLeft } = scrollContainer;
        const currentIndex = Math.round(scrollLeft / cardWidth);
        const maxIndex = cards.length - 1;

        // Determine target based on scroll direction
        let targetIndex = currentIndex;
        if (e.deltaY > 0 && !hasReachedEnd && currentIndex < maxIndex) {
          targetIndex = Math.min(currentIndex + 1, maxIndex);
        } else if (e.deltaY < 0 && !hasReachedStart && currentIndex > 0) {
          targetIndex = Math.max(currentIndex - 1, 0);
        } else if (
          hasReachedStart &&
          e.deltaY < 0 &&
          isExpertiseSectionActive
        ) {
          // If we're at the start and scrolling up, reset cards
          setManualScrolling(true);
          resetCardPositions().then(() => {
            setIsHorizontalScrolling(false);
            setHasAnimatedOnce(false); // Allow animation again after reset

            // After a short delay, allow normal scrolling
            wheelTimeout = setTimeout(() => {
              setManualScrolling(false);
              isWheelProcessing = false;
            }, 400);
          });
          return;
        } else if (hasReachedEnd && e.deltaY > 0) {
          // If we've reached the end and trying to scroll further, just release
          isWheelProcessing = false;
          return;
        }

        // Smooth scroll to the target card
        scrollContainer.scrollTo({
          left: targetIndex * cardWidth,
          behavior: "smooth",
        });

        // Release wheel processing after animation completes
        wheelTimeout = setTimeout(() => {
          isWheelProcessing = false;
        }, 400);
      } else if (
        !cardAnimationStarted &&
        !hasAnimatedOnce &&
        e.deltaY > 0 &&
        !isAtBottom
      ) {
        // Start card animation when scrolling down and not yet animated
        // AND we're not at the bottom of the page
        isWheelProcessing = true;
        setHasAnimatedOnce(true);

        animateCardsOut().then(() => {
          isWheelProcessing = false;
          setIsHorizontalScrolling(true);
        });
      }
    };

    // Use passive: false to allow preventDefault()
    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel);
      clearTimeout(wheelTimeout);
    };
  }, [
    isExpertiseInView,
    hasReachedEnd,
    hasReachedStart,
    cardAnimationComplete,
    cardAnimationStarted,
    isHorizontalScrolling,
    isScrollLocked,
    isExpertiseSectionActive,
    hasAnimatedOnce,
  ]);

  // Improved touch handling for mobile devices
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let isTouching = false;
    let isHorizontalSwipe = false;
    let cardWidth = 0;
    let currentCardIndex = 0;
    let touchScrollingLocked = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (touchScrollingLocked) return;

      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      isTouching = true;

      // Calculate card width for snapping
      if (scrollContainerRef.current) {
        const cards =
          scrollContainerRef.current.querySelectorAll(".snap-center");
        if (cards.length > 0) {
          cardWidth = cards[0].clientWidth + 24; // Width + gap
          currentCardIndex = Math.round(
            scrollContainerRef.current.scrollLeft / cardWidth
          );
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching || touchScrollingLocked) return;

      // Store current touch position
      touchEndY = e.touches[0].clientY;
      touchEndX = e.touches[0].clientX;

      const verticalDistance = Math.abs(touchStartY - touchEndY);
      const horizontalDistance = Math.abs(touchStartX - touchEndX);
      const expertiseRect = expertiseRef.current?.getBoundingClientRect();

      // Check if we're at the bottom of the page
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      // Check if we're in the expertise section's active zone
      const isInActiveZone =
        expertiseRect &&
        expertiseRect.top <= 100 &&
        expertiseRect.bottom >= window.innerHeight * 0.3;

      // If we're scrolling up and cards are animated, reset them only if we're in the expertise section
      if (
        touchEndY > touchStartY &&
        cardAnimationStarted &&
        isExpertiseSectionActive &&
        verticalDistance > 50 &&
        !isHorizontalSwipe
      ) {
        touchScrollingLocked = true;
        setManualScrolling(true);

        resetCardPositions().then(() => {
          touchScrollingLocked = false;
          setHasAnimatedOnce(false); // Allow animation again after reset

          // After a short delay, allow normal scrolling
          setTimeout(() => {
            setManualScrolling(false);
          }, 400);
        });

        return;
      }

      // Determine if this is primarily a horizontal swipe
      if (
        horizontalDistance > verticalDistance * 1.2 &&
        cardAnimationComplete &&
        isInActiveZone
      ) {
        isHorizontalSwipe = true;

        if (scrollContainerRef.current) {
          // Calculate the delta for smoother scrolling
          const deltaX = touchStartX - touchEndX;

          // Check if we're at the end and trying to scroll further right
          if (hasReachedEnd && deltaX > 0) {
            return; // Don't scroll further
          }

          // Check if we're at the start and trying to scroll further left
          if (hasReachedStart && deltaX < 0) {
            return; // Don't scroll further
          }

          scrollContainerRef.current.scrollLeft += deltaX * 0.5;
          touchStartX = touchEndX; // Update for continuous scrolling
        }
      } else if (
        touchEndY < touchStartY &&
        isInActiveZone &&
        !cardAnimationStarted &&
        !hasAnimatedOnce &&
        verticalDistance > 30 &&
        !isHorizontalSwipe &&
        !isAtBottom
      ) {
        touchScrollingLocked = true;
        setManualScrolling(true);
        setHasAnimatedOnce(true); // Mark as animated to prevent repeating

        animateCardsOut().then(() => {
          touchScrollingLocked = false;
          setTimeout(() => {
            setManualScrolling(false);
          }, 400);
        });
      }
    };

    const handleTouchEnd = () => {
      if (!isTouching || touchScrollingLocked || !scrollContainerRef.current)
        return;
      isTouching = false;

      // If we were doing a horizontal swipe in the expertise section
      if (isHorizontalSwipe && cardAnimationComplete) {
        // Calculate which card to snap to
        const swipeDirection = touchStartX > touchEndX ? 1 : -1; // 1 for right, -1 for left

        // Only snap if we've moved enough
        if (Math.abs(touchStartX - touchEndX) > 30) {
          let targetIndex = currentCardIndex + swipeDirection;
          const cards =
            scrollContainerRef.current.querySelectorAll(".snap-center");
          const maxIndex = cards.length - 1;

          // Ensure target index is within bounds
          targetIndex = Math.max(0, Math.min(targetIndex, maxIndex));

          // Smooth scroll to the target card
          scrollContainerRef.current.scrollTo({
            left: targetIndex * cardWidth,
            behavior: "smooth",
          });
        } else {
          // If the swipe wasn't significant, snap back to current card
          scrollContainerRef.current.scrollTo({
            left: currentCardIndex * cardWidth,
            behavior: "smooth",
          });
        }
      }

      isHorizontalSwipe = false;
    };

    // Add touch event listeners with proper options
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    cardAnimationStarted,
    cardAnimationComplete,
    isScrollLocked,
    hasAnimatedOnce,
    isExpertiseSectionActive,
    hasReachedStart,
    hasReachedEnd,
  ]);

  const animateCardsOut = async () => {
    setCardAnimationStarted(true);

    const animationOptions = {
      ease: [0.4, 0, 0.2, 1],
      duration: 0.8,
    };

    const viewportWidth = window.innerWidth;
    const isMobileView = viewportWidth < 768;
    const isTabletView = viewportWidth >= 768 && viewportWidth < 1024;
    const animateCount = isMobileView ? 1 : isTabletView ? 2 : 4;

    const staggerDelay = 0.07;

    const animations = [
      firstCardControls.start({
        x: "-80%",
        opacity: 1,
        transition: { ...animationOptions },
      }),
    ];

    if (animateCount >= 2) {
      animations.push(
        secondCardControls.start({
          x: "-80%",
          opacity: 1,
          transition: { ...animationOptions, delay: staggerDelay },
        })
      );
    }

    if (animateCount >= 3) {
      animations.push(
        thirdCardControls.start({
          x: "-80%",
          opacity: 1,
          transition: { ...animationOptions, delay: staggerDelay * 2 },
        })
      );
    }

    if (animateCount >= 4) {
      animations.push(
        fourthCardControls.start({
          x: "-80%",
          opacity: 1,
          transition: { ...animationOptions, delay: staggerDelay * 3 },
        })
      );
    }

    await Promise.all(animations);

    setTimeout(() => setCardAnimationComplete(true), 150);

    setTimeout(() => {
      if (isScrollLocked) {
        unlockScroll();
      }
    }, 200);

    return Promise.resolve();
  };

  // Helper function to reset card positions
  const resetCardPositions = async () => {
    // Use a more subtle animation with better easing
    const animationOptions = {
      ease: [0.25, 0.1, 0.25, 1],
      duration: 0.5,
    };

    // Reset card positions with smooth animations
    firstCardControls.start({
      x: "0%",
      opacity: 1,
      transition: { ...animationOptions },
    });

    secondCardControls.start({
      x: "0%",
      opacity: 1,
      transition: { ...animationOptions, delay: 0.04 },
    });

    thirdCardControls.start({
      x: "0%",
      opacity: 1,
      transition: { ...animationOptions, delay: 0.08 },
    });

    await fourthCardControls.start({
      x: "0%",
      opacity: 1,
      transition: { ...animationOptions, delay: 0.12 },
    });

    // Add a small delay before resetting animation states for smoother transition
    await new Promise((resolve) => setTimeout(resolve, 50));
    setCardAnimationStarted(false);
    setCardAnimationComplete(false);

    return Promise.resolve();
  };

  // Detect device type
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      // setIsTablet(width >= 768 && width < 1024);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Add this useEffect to prevent automatic scrolling when the component mounts
  useEffect(() => {
    // Prevent automatic scrolling on mount
    const preventInitialScroll = () => {
      if (window.scrollY === 0 && expertiseRef.current) {
        // If we're at the top, don't allow automatic scrolling
        window.scrollTo(0, 0);
      }
    };

    preventInitialScroll();

    // Also prevent scrolling when the component updates
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        preventInitialScroll();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      cleanupScrollLock();
    };
  }, []);

  // Reset animation state when clicking the button to scroll to expertise
  const scrollToExpertise = () => {
    if (expertiseRef.current) {
      // Reset animation states
      setCardAnimationStarted(false);
      setCardAnimationComplete(false);
      setIsHorizontalScrolling(false);
      setManualScrolling(false);
      setHasAnimatedOnce(false);

      // Reset card positions
      resetCardPositions();

      // Reset horizontal scroll position
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
      }

      // Ensure we're not locked
      if (isScrollLocked) {
        unlockScroll();
      }

      // Use a more reliable scrolling method with a slight delay
      setTimeout(() => {
        const offset = isMobile ? 30 : 50;
        const targetPosition = expertiseRef.current!.offsetTop - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }, 50);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-500 overflow-x-hidden"
      ref={containerRef}
    >
      {/* Hero Section */}
      <section className="min-h-screen relative flex flex-col items-center justify-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-600 text-center text-gray-900 dark:text-white max-w-4xl tracking-tight"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
        >
          We are security-first banking solution
        </motion.h1>

        <div className="absolute bottom-12">
          <Magnetic strength={30}>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              onClick={scrollToExpertise}
              className="p-4 rounded-full bg-black dark:bg-white text-white dark:text-black hover:scale-105 transition-transform duration-300 hover:bg-blue-600 dark:hover:bg-blue-600"
            >
              <ChevronDown className="w-6 h-6 animate-bounce" />
            </motion.button>
          </Magnetic>
        </div>
      </section>

      {/* Expertise Section - Fixed position when scrolling */}
      <section
        id="expertise-content"
        className="py-20 px-4 md:px-8 min-h-screen flex items-center relative"
        ref={expertiseRef}
      >
        <div className="max-w-[90rem] mx-auto w-full">
          <motion.h2
            className="text-xl font-light mb-12 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: false, amount: 0.2 }}
          >
            Our Expertise
          </motion.h2>

          {/* Scrollable container with improved scrolling */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-6"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE/Edge
              cursor: isExpertiseInView ? "grab" : "default",
              WebkitOverflowScrolling: "touch",
              position: "relative",
            }}
          >
            <div className="flex space-x-6 px-4">
              {expertiseCards?.length > 0 &&
                expertiseCards.map((card, index) => (
                  <motion.div
                    key={index}
                    animate={
                      index === 0
                        ? firstCardControls
                        : index === 1
                        ? secondCardControls
                        : index === 2
                        ? thirdCardControls
                        : fourthCardControls
                    }
                    initial={{ opacity: index === 3 ? 0 : 1, x: "0%" }}
                    transition={{
                      duration: 0.8,
                      delay: card.delay ?? 0,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="min-w-[280px] sm:min-w-[300px] md:min-w-[400px] h-[350px] sm:h-[400px] md:h-[500px] bg-white dark:bg-gray-800 rounded-3xl p-8 flex flex-col justify-between group cursor-pointer relative overflow-hidden snap-center"
                    whileHover={{
                      scale: 0.98,
                      transition: { duration: 0.4, ease: "easeOut" },
                    }}
                  >
                    <div className="relative z-10">
                      <h3 className="text-5xl sm:text-6xl font-light text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                        {card.title ?? "Default Title"}
                      </h3>
                      <p className="text-lg sm:text-xl font-light text-gray-600 dark:text-gray-400">
                        {card.description ?? "Default description"}
                      </p>
                    </div>

                    {/* Background image with improved overlay transition */}
                    <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
                      <img
                        src={card.image || "/placeholder.svg"}
                        alt={card.type || "Expertise Image"}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "/placeholder.svg?height=500&width=400")
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
                    </div>

                    <div className="relative z-10 h-48">
                      {card.type === "team" && (
                        <motion.img
                          src={card.image}
                          alt="Banking Team"
                          className="absolute bottom-0 right-0 w-44 h-auto rounded-lg shadow-lg"
                          initial={{ rotate: 8 }}
                          whileHover={{ rotate: 0, scale: 1.1 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      )}
                      {card.type === "experience" && (
                        <motion.img
                          src={card.image}
                          alt="Banking App"
                          className="absolute bottom-0 right-0 w-40 h-auto rounded-lg shadow-lg"
                          initial={{ rotate: 12 }}
                          whileHover={{ rotate: 0, scale: 1.1 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      )}
                      {card.type === "projects" && (
                        <motion.img
                          src={card.image}
                          alt="Project Portfolio"
                          className="absolute bottom-0 right-0 w-56 h-auto rounded-lg shadow-lg"
                          initial={{ rotate: -12 }}
                          whileHover={{ rotate: 0, scale: 1.1 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      )}
                      {card.type === "support" && (
                        <motion.div
                          className="absolute bottom-0 right-0 w-40 h-40 flex items-center justify-center"
                          initial={{ opacity: 0.2 }}
                          whileHover={{ opacity: 0.8, scale: 1.1 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                          <ChevronRight className="w-full h-full text-blue-500" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        className="py-20 px-4 md:px-8 bg-gray-100 dark:bg-gray-950"
        ref={servicesRef}
      >
        <div className="max-w-[90rem] mx-auto">
          <motion.h2
            className="text-xl font-light mb-12 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.2 }}
          >
            Our Services
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {serviceCards.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: false, amount: 0.2, margin: "-100px" }}
                className="group relative overflow-hidden rounded-3xl bg-[#f5f5f5] dark:bg-gray-800 p-0 cursor-pointer h-[350px]"
                whileHover={{
                  y: -10,
                  transition: { duration: 0.4, ease: "easeOut" },
                }}
                onClick={() => setSelectedService(service)}
              >
                {/* Background Image with improved transitions */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "/placeholder.svg?height=350&width=400")
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-700"></div>
                </div>

                {/* Content with staggered animations */}
                <div className="relative z-10 flex flex-col justify-end h-full p-8">
                  <motion.div
                    className="bg-white/10 backdrop-blur-sm p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-blue-600/20 transition-colors duration-500"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                    viewport={{ once: false, amount: 0.6 }}
                  >
                    <service.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <motion.h3
                    className="text-2xl sm:text-3xl font-light text-white mb-4"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                    viewport={{ once: false, amount: 0.6 }}
                  >
                    {service.title}
                  </motion.h3>

                  <motion.p
                    className="text-white/80 mb-6 max-w-md transform translate-y-0 opacity-100 group-hover:translate-y-0 transition-all duration-500 text-sm sm:text-base"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                    viewport={{ once: false, amount: 0.6 }}
                  >
                    {service.description}
                  </motion.p>

                  <motion.div
                    className="flex gap-2 mb-4 flex-wrap"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                    viewport={{ once: false, amount: 0.6 }}
                  >
                    {service.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 text-xs sm:text-sm bg-white/10 backdrop-blur-sm rounded-full text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-2 text-white font-light"
                    initial={{ x: -10, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                    viewport={{ once: false, amount: 0.6 }}
                  >
                    <span>Learn more</span>
                    <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-64 md:h-80">
                  <img
                    src={selectedService.image || "/placeholder.svg"}
                    alt={selectedService.title}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "/placeholder.svg?height=300&width=800")
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>

                  <motion.button
                    className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
                    onClick={() => setSelectedService(null)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={20} />
                  </motion.button>

                  <div className="absolute bottom-0 left-0 p-6 md:p-8">
                    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <selectedService.icon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {selectedService.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedService.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm bg-white/10 backdrop-blur-sm rounded-full text-white"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  {selectedService.details && (
                    <>
                      <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
                        {selectedService.details.longDescription}
                      </p>

                      <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                          Key Features
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedService.details.features.map(
                            (feature, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                              >
                                <div className="mt-1 text-blue-600 dark:text-blue-400">
                                  <ChevronRight size={16} />
                                </div>
                                {feature}
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                          Benefits
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedService.details.benefits.map(
                            (benefit, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                              >
                                <div className="mt-1 text-green-600 dark:text-green-400">
                                  <ChevronRight size={16} />
                                </div>
                                {benefit}
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      <motion.button
                        className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {selectedService.details.cta}
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
