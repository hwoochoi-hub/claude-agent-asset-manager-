"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "대시보드" },
  { href: "/assets", label: "자산 관리" },
  { href: "/analysis", label: "투자 분석" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header
      className="border-b sticky top-0 z-10 backdrop-blur"
      style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--surface-1)" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <span className="font-semibold tracking-tight">💰 나의 자산관리</span>
        <nav className="flex gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                style={{
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  backgroundColor: active ? "var(--gridline)" : "transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
