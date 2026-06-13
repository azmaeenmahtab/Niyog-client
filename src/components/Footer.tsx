import Image from "next/image";
import Link from "next/link";
import { Oswald } from "next/font/google";
import whitelogo from "@/assets/whitelogo.png";

const oswald = Oswald({
	subsets: ["latin"],
});

const footerColumns = [
	{
		title: "Product",
		links: ["Job discovery", "Worker AI", "Companies", "Salary data"],
	},
	{
		title: "Navigations",
		links: ["Help center", "Career library", "Contact"],
	},
	{
		title: "Resources",
		links: ["Brand Guideline", "Newsroom"],
	},
];

interface SocialButtonProps {
	href: string;
	label: string;
	active?: boolean;
	children: React.ReactNode;
}

function SocialButton({ href, label, active, children }: SocialButtonProps) {
	return (
		<Link
			href={href}
			aria-label={label}
			className={`flex h-8 w-8 items-center justify-center rounded-2xl transition hover:brightness-110 ${
				active ? "bg-[#4b4dd6] text-white" : "bg-[#141414] text-white/60"
			}`}
		>
			{children}
		</Link>
	);
}

export default function Footer() {
	return (
		<footer className="bg-[#050505] px-4 pb-8   text-white sm:px-6 lg:px-8">
			<div className="mx-auto w-full max-w-337.5 border-t border-white/5 pt-10">
				<div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
					<div className="max-w-sm">
						<div className="flex items-center gap-2">
							<Image src={whitelogo} alt="Niyog" className="h-11 w-auto" priority />
							<span className={`${oswald.className} text-[34px] font-semibold italic tracking-[0.02em] text-white drop-shadow-[0_0_0_1px_rgba(255,255,255,0.95)] -skew-x-15`}>
								Niyog
							</span>
						</div>

						<p className="mt-6 max-w-xs text-[15px] leading-7 text-white/18">
							The AI-native career platform. Built for
							people who take their work seriously.
						</p>

						<div className="mt-16 flex items-center gap-2">
							<SocialButton href="#" label="Facebook">
								<svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
									<path d="M13.5 22v-7h2.5l.5-3h-3v-2c0-.9.3-1.5 1.5-1.5H16V6.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 4v2H7v3h3v7h3.5Z" />
								</svg>
							</SocialButton>
							<SocialButton href="#" label="Pinterest" active>
								<svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
									<path d="M12 2a10 10 0 0 0-3.8 19.3c-.1-.8-.1-1.9 0-2.8l1.2-5.1s-.3-.6-.3-1.4c0-1.3.8-2.2 1.8-2.2.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.4-.3 1 .6 1.8 1.7 1.8 2 0 3.5-2.2 3.5-5.3 0-2.8-2-4.8-4.9-4.8-3.4 0-5.4 2.5-5.4 5.1 0 1 .4 1.9.9 2.5.1.1.1.3.1.5l-.3 1.2c-.1.4-.3.4-.6.3-1.2-.6-2-2.5-2-4 0-3.3 2.4-6.4 7-6.4 3.7 0 6.5 2.6 6.5 6.1 0 3.6-2.2 6.5-5.3 6.5-1 0-2-.5-2.3-1.1l-.6 2.1c-.2.8-.9 1.8-1.3 2.4A10 10 0 1 0 12 2Z" />
								</svg>
							</SocialButton>
							<SocialButton href="#" label="LinkedIn">
								<svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
									<path d="M6.94 6.5A1.94 1.94 0 1 1 3.06 6.5a1.94 1.94 0 0 1 3.88 0ZM3.4 8.9h3.1V21H3.4V8.9Zm5 0h3v1.6h.1c.4-.8 1.5-1.8 3.2-1.8 3.4 0 4 2.2 4 5V21h-3.1v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H8.4V8.9Z" />
								</svg>
							</SocialButton>
						</div>
					</div>

					{footerColumns.map((column) => (
						<div key={column.title}>
							<h3 className="text-[15px] font-semibold text-[#4c50d5]">
								{column.title}
							</h3>
							<ul className="mt-6 space-y-4 text-[15px] text-white/24">
								{column.links.map((link) => (
									<li key={link}>
										<Link href="#" className="transition-colors hover:text-white/55">
											{link}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-16 flex flex-col items-start gap-3 text-[14px] text-white/20 sm:items-center sm:justify-end lg:flex-row">
					<p>Copyright 2024 – Programming Hero</p>
					<p>Terms & Policy - Privacy Guideline</p>
				</div>
			</div>
		</footer>
	);
}
