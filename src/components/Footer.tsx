import Link from "next/link";

const footerLinks = ["About", "Terms", "Privacy", "Support"];

export default function Footer() {
  return (
    <footer className="w-full bg-[#f3ede2] px-4 pb-8 pt-6 text-[#1a1a1a] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl border-t border-[#1a1a1a]/10 pt-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="font-serif text-2xl italic text-[#1a1a1a]">
              Niyog
            </span>
            <p className="mt-2 text-[13px] text-[#1a1a1a]/55">
              © 2024 Niyog. Sun-baked simplicity for the modern career.
            </p>
          </div>

          <ul className="flex items-center text-[14px] text-[#1a1a1a]/75">
            {footerLinks.map((link, i) => (
              <li
                key={link}
                className={
                  i === 0
                    ? ""
                    : "border-l border-[#1a1a1a]/15 pl-4"
                }
              >
                <Link
                  href="#"
                  className="block pr-4 transition-colors hover:text-[#e2613a]"
                >
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
