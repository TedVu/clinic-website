"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { MenuIcon } from "./icons";

type Item = { key: string; href: string; label: string; current: boolean };

type Props = {
  items: Item[];
  bookingHref: string;
  labels: { menu: string; open: string; close: string; nav: string; book: string };
  children?: ReactNode;
};

/** The site's only client component: a disclosure menu for screens below the desktop breakpoint. */
export function MobileNav({ items, bookingHref, labels, children }: Props) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    document.addEventListener("keydown", onKeyDown);
    // The open menu covers the page; stop the page behind it from scrolling.
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      root.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <div className="shrink-0 xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? labels.close : labels.open}
        onClick={() => setOpen((value) => !value)}
        className="-mr-2 flex min-h-11 items-center gap-2 rounded-control px-2 text-ink"
      >
        <MenuIcon open={open} />
        <span aria-hidden="true" className="text-[0.95rem] font-medium">
          {labels.menu}
        </span>
      </button>

      <div
        id={panelId}
        hidden={!open}
        // Fills the screen below the header (100% = the header's height), so page content such as
        // the hero's buttons never shows through underneath the menu.
        className="absolute inset-x-0 top-full z-50 h-[calc(100dvh-100%)] overflow-y-auto overscroll-contain bg-paper"
      >
        <nav aria-label={labels.nav} className="container-page pb-6">
          <ul className="divide-y divide-rule">
            {items.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  onClick={() => close(false)}
                  className={`flex min-h-12 items-center py-2 text-lg no-underline ${
                    item.current ? "font-medium text-accent" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={bookingHref}
            onClick={() => close(false)}
            className="btn btn-primary mt-4 w-full text-lg"
          >
            {labels.book}
          </Link>
          {children && <div className="mt-4">{children}</div>}
        </nav>
      </div>
    </div>
  );
}
