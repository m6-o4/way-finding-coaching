"use client";

import { Button } from "@/components/ui/button";
import type { Header } from "@/payload-types";
import Link from "next/link";
import { useEffect, useState } from "react";

interface HeaderClientProps {
	data: Header;
}

const HeaderClient = ({ data }: HeaderClientProps) => {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 80);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navigationItems = data?.navItems || [];

	return (
		<div
			className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
				isScrolled ? "border-b border-[#B2D2C2]/20 bg-white/95 shadow-sm backdrop-blur-sm" : "bg-transparent"
			}`}
		>
			<div className="container mx-auto flex items-center justify-between px-6 py-8">
				<Link href="/" className="flex items-center">
					<h1
						className={`text-2xl font-bold transition-colors duration-300 ${
							isScrolled ? "text-[#1A233D]" : "text-[#1A233D]"
						}`}
					>
						{data.title}
					</h1>
				</Link>

				{navigationItems.map(({ link }, index) => (
					<Button
						key={index}
						asChild
						className="rounded-lg bg-[#FFD700] px-6 py-2 font-semibold text-[#1A233D] shadow-md transition-all duration-300 hover:bg-[#E6C200] hover:shadow-lg"
					>
						<Link href={link.url ?? "/"} target="_blank">
							{link.label}
						</Link>
					</Button>
				))}
			</div>
		</div>
	);
};

export { HeaderClient };
