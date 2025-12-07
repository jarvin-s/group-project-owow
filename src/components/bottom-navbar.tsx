"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pixelify_Sans } from "next/font/google";

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 27 27"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 0H10.6667V2.66667H8V5.33333H5.33333V8H2.66667V10.6667H0V13.3333H2.66667V26.6667H12V18.6667H14.6667V26.6667H24V13.3333H26.6667V10.6667H24V8H21.3333V5.33333H18.6667V2.66667H16V0ZM16 2.66667V5.33333H18.6667V8H21.3333V10.6667H24V13.3333H21.3333V24H17.3333V16H9.33333V24H5.33333V13.3333H2.66667V10.6667H5.33333V8H8V5.33333H10.6667V2.66667H16Z"
      fill="currentColor"
    />
  </svg>
);

const FlipboardIcon = ({ active }: { active: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      fill="currentColor"
      d="M20 3H2v14h8v2H8v2h8v-2h-2v-2h8V3zm-6 12H4V5h16v10z"
    />
  </svg>
);

const ProgressIcon = ({ active }: { active: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      fill="currentColor"
      d="M13 5h2v14h-2zm-2 4H9v10h2zm-4 4H5v6h2zm12 0h-2v6h2z"
    />
  </svg>
);

const GardenIcon = ({ active }: { active: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 512 512"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      fill="currentColor"
      d="M408 304a168.21 168.21 0 0 0-152 96.5A168.21 168.21 0 0 0 104 304H16v16c0 92.636 75.364 168 168 168h144c92.636 0 168-75.364 168-168v-16ZM184 456c-69.581 0-127.124-52.519-135.064-120H104c69.581 0 127.124 52.519 135.064 120Zm144 0h-55.064c7.94-67.481 65.483-120 135.064-120h55.064c-7.94 67.481-65.483 120-135.064 120"
    />
    <path
      fill="currentColor"
      d="M169.227 262.773a87.36 87.36 0 0 0 24.547 47.453l4.687 4.686h6.627A87.35 87.35 0 0 0 256 298.716a87.36 87.36 0 0 0 50.912 16.2h6.627l4.687-4.686a87.36 87.36 0 0 0 24.547-47.453a87.36 87.36 0 0 0 47.453-24.547l4.686-4.687v-6.627A87.35 87.35 0 0 0 378.716 176a87.36 87.36 0 0 0 16.2-50.912v-6.627l-4.686-4.687a87.36 87.36 0 0 0-47.453-24.547a87.36 87.36 0 0 0-24.547-47.453l-4.687-4.686h-6.627A87.36 87.36 0 0 0 256 53.284a87.35 87.35 0 0 0-50.912-16.2h-6.627l-4.687 4.686a87.36 87.36 0 0 0-24.547 47.453a87.36 87.36 0 0 0-47.453 24.547l-4.686 4.687v6.627A87.36 87.36 0 0 0 133.284 176a87.35 87.35 0 0 0-16.2 50.912v6.627l4.686 4.687a87.36 87.36 0 0 0 47.457 24.547m-3.736-98.086a55.57 55.57 0 0 1-16-32.8A55.57 55.57 0 0 1 184 120h16v-16a55.57 55.57 0 0 1 11.884-34.506a55.57 55.57 0 0 1 32.8 16L256 96.8l11.313-11.313a55.57 55.57 0 0 1 32.8-16A55.57 55.57 0 0 1 312 104v16h16a55.57 55.57 0 0 1 34.506 11.884a55.57 55.57 0 0 1-16 32.8L335.2 176l11.314 11.314a55.57 55.57 0 0 1 16 32.8A55.57 55.57 0 0 1 328 232h-16v16a55.57 55.57 0 0 1-11.884 34.506a55.57 55.57 0 0 1-32.8-16L256 255.2l-11.314 11.31a55.57 55.57 0 0 1-32.8 16A55.57 55.57 0 0 1 200 248v-16h-16a55.57 55.57 0 0 1-34.506-11.884a55.57 55.57 0 0 1 16-32.8L176.8 176Z"
    />
  </svg>
);

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 22 27"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.6667 0H6.66667V2.66667H4V10.6667H6.66667V2.66667H14.6667V0ZM14.6667 10.6667H6.66667V13.3333H14.6667V10.6667ZM14.6667 2.66667H17.3333V10.6667H14.6667V2.66667ZM0 18.6667H2.66667V16H18.6667V18.6667H2.66667V24H18.6667V18.6667H21.3333V26.6667H0V18.6667Z"
      fill="currentColor"
    />
  </svg>
);

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: <HomeIcon active={false} /> },
  {
    href: "/flipboard",
    label: "Flipboard",
    icon: <FlipboardIcon active={false} />,
  },
  {
    href: "/flower-garden",
    label: "Garden",
    icon: <GardenIcon active={false} />,
  },
  {
    href: "/progress",
    label: "Progress",
    icon: <ProgressIcon active={false} />,
  },
  { href: "/profile", label: "Profile", icon: <ProfileIcon active={false} /> },
];

export default function BottomNavbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-black border-t-2 border-white/20 z-50 ${pixelifySans.className}`}
    >
      <div className="max-w-[375px] mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                active ? "text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {item.href === "/" && <HomeIcon active={active} />}
              {item.href === "/flipboard" && <FlipboardIcon active={active} />}
              {item.href === "/flower-garden" && <GardenIcon active={active} />}
              {item.href === "/progress" && <ProgressIcon active={active} />}
              {item.href === "/profile" && <ProfileIcon active={active} />}
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
