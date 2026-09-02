"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HorizontalScrollRowProps {
  header: ReactNode;
  children: ReactNode;
}

export function HorizontalScrollRow({ header, children }: HorizontalScrollRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getStepWidth(): number {
    const el = scrollRef.current;
    if (!el) return 0;
    const firstCard = el.firstElementChild as HTMLElement | null;
    if (!firstCard) return el.clientWidth;

    const style = window.getComputedStyle(el);
    const gap = parseFloat(style.columnGap || style.gap || "16") || 16;
    return firstCard.getBoundingClientRect().width + gap;
  }

  function scrollByAmount(direction: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;

    const step = getStepWidth();
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    let target = el.scrollLeft + direction * step;

    if (target < 0) target = 0;
    if (target > maxScrollLeft) target = maxScrollLeft;

    el.scrollTo({ left: target, behavior: "smooth" });
  }

  return (
    <div>
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0">{header}</div>
        <div className="flex shrink-0 gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full shadow-sm disabled:opacity-30"
            onClick={() => scrollByAmount(-1)}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full shadow-sm disabled:opacity-30"
            onClick={() => scrollByAmount(1)}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-3"
      >
        {children}
      </div>
    </div>
  );
}