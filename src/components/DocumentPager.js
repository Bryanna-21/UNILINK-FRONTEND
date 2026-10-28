import { useCallback, useRef, useState } from "react";

// The pages of a posted document, one at a time: swipe (touch), drag (mouse),
// arrow keys, or the Previous/Next buttons. The same behaviour as the app.
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function DocumentPager({ name, pages }) {
  const trackRef = useRef(null);
  const drag = useRef(null);
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const total = pages.length;

  const goTo = useCallback(
    (target) => {
      const el = trackRef.current;
      const next = Math.max(0, Math.min(total - 1, target));
      setIndex(next);
      if (!el) return;
      const left = next * el.clientWidth;
      if (typeof el.scrollTo === "function") {
        el.scrollTo({ left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      } else {
        el.scrollLeft = left;
      }
    },
    [total]
  );

  // Keeps the counter right when the reader swipes instead of pressing a button.
  const handleScroll = () => {
    const el = trackRef.current;
    if (!el || drag.current) return;
    const current = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
    setIndex((prev) => {
      const clamped = Math.max(0, Math.min(total - 1, current));
      return prev === clamped ? prev : clamped;
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
  };

  // Touch already scrolls and snaps by itself. A mouse needs dragging taught to it.
  const handlePointerDown = (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || total < 2) return;
    const el = trackRef.current;
    drag.current = { x: event.clientX, left: el.scrollLeft, moved: false };
  };

  const handlePointerMove = (event) => {
    const state = drag.current;
    if (!state) return;
    const delta = event.clientX - state.x;
    if (!state.moved && Math.abs(delta) < 4) return;
    if (!state.moved) {
      state.moved = true;
      setDragging(true);
    }
    trackRef.current.scrollLeft = state.left - delta;
  };

  const endDrag = () => {
    const state = drag.current;
    if (!state) return;
    drag.current = null;
    setDragging(false);
    if (state.moved) {
      const el = trackRef.current;
      goTo(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    }
  };

  return (
    <div className="doc-pager">
      <div className="doc-pager__viewport">
        <div
          ref={trackRef}
          className={`doc-pager__track${dragging ? " is-dragging" : ""}`}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label={`${name}, ${total} ${total === 1 ? "page" : "pages"}`}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
        >
          {pages.map((page, i) => (
            <div
              key={page.page}
              className="doc-pager__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`Page ${i + 1} of ${total}`}
            >
              <img
                src={page.url}
                alt={`${name}, page ${page.page}`}
                loading={i === 0 ? "eager" : "lazy"}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              className="doc-pager__nav doc-pager__nav--prev"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Previous page"
            >
              ‹
            </button>
            <button
              type="button"
              className="doc-pager__nav doc-pager__nav--next"
              onClick={() => goTo(index + 1)}
              disabled={index === total - 1}
              aria-label="Next page"
            >
              ›
            </button>
            <span className="doc-pager__count" aria-live="polite">
              {index + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <p className="doc-pager__hint">Swipe, drag or use the arrows to turn the page</p>
      )}
    </div>
  );
}
