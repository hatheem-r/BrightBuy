"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

const AnimatedList = ({
  items = [],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  displayScrollbar = true,
  className = "",
  itemClassName = "",
  selectedItemClassName = "",
  containerHeight = "400px",
  animationDuration = 0.3,
  staggerDelay = 0.05,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!enableArrowNavigation) return;

    const handleKeyDown = (e) => {
      if (!items.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = prev === null ? 0 : Math.min(prev + 1, items.length - 1);
          scrollToItem(next);
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = prev === null ? items.length - 1 : Math.max(prev - 1, 0);
          scrollToItem(next);
          return next;
        });
      } else if (e.key === "Enter" && selectedIndex !== null) {
        e.preventDefault();
        if (onItemSelect) {
          onItemSelect(items[selectedIndex], selectedIndex);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableArrowNavigation, items, selectedIndex, onItemSelect]);

  const scrollToItem = (index) => {
    if (itemRefs.current[index]) {
      itemRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  const handleItemClick = (item, index) => {
    setSelectedIndex(index);
    if (onItemSelect) {
      onItemSelect(item, index);
    }
  };

  return (
    <div className={`animated-list-container ${className}`}>
      {/* Top gradient */}
      {showGradients && (
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
      )}

      {/* List container */}
      <div
        ref={listRef}
        className={`animated-list-content ${
          displayScrollbar
            ? "overflow-y-auto"
            : "overflow-y-scroll scrollbar-hide"
        }`}
        style={{ height: containerHeight }}
      >
        <div className="py-2">
          {items.map((item, index) => (
            <motion.div
              key={index}
              ref={(el) => (itemRefs.current[index] = el)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: animationDuration,
                delay: index * staggerDelay,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleItemClick(item, index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                animated-list-item
                px-4 py-3 mx-2 mb-2 rounded-lg
                cursor-pointer transition-all duration-200
                ${
                  selectedIndex === index
                    ? selectedItemClassName || "bg-primary text-white shadow-lg"
                    : hoveredIndex === index
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "bg-white dark:bg-gray-800 hover:shadow-md"
                }
                ${itemClassName}
              `}
            >
              {typeof item === "string" ? (
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item}</span>
                  {selectedIndex === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-white"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.div>
                  )}
                </div>
              ) : (
                item
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom gradient */}
      {showGradients && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      )}

      {/* Scrollbar hide style */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AnimatedList;
