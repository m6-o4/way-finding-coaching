"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { BookingLink } from "@/components/posthog/booking-link";
import { Button } from "@/components/ui/button";
import { captureEvent } from "@/lib/posthog-events";
import type { Header } from "@/payload-types";

interface HeaderClientProps {
	data: Header;
}

// the only header nav items that report a click. the cms stores nav links as
// free text, so they are matched on the scroll-anchor fragment or, failing
// that, the label
const TRACKED_NAV_ANCHORS = ["programs", "blogs"];

const trackedAnchor = (link: { label?: string | null; url?: string | null }) => {
	const fragment = link.url?.startsWith("#") ? link.url.slice(1).toLowerCase() : null;
	const label = link.label?.trim().toLowerCase() ?? null;
	const candidate = fragment ?? label;

	return candidate && TRACKED_NAV_ANCHORS.includes(candidate) ? candidate : null;
};

// manages the interactive navigation experience including mobile menu states and branding
const HeaderClient = ({ data }: HeaderClientProps) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const { organizationName, organizationLogo, navigationItems, discovery } = data;
	const parts = (organizationName ?? "").split("|").map((s) => s.trim());
	const [main, accent] = parts.length > 1 ? parts : [organizationName ?? "", null];

	const trackNavClick = (link: { label?: string | null; url?: string | null }) => {
		const anchor = trackedAnchor(link);
		if (anchor) {
			captureEvent({ event: "nav_link_clicked", properties: { link: anchor } });
		}
	};

	return (
		<div className="absolute inset-x-0 top-0 z-20 px-4 pt-3 sm:px-8">
			<nav className="border-border/70 bg-card/90 mx-auto flex max-w-(--container) items-center justify-between rounded-full border px-5 py-3 backdrop-blur">
				<Link href="/" className="flex cursor-pointer items-center">
					{organizationLogo && typeof organizationLogo === "object" ? (
						<Image
							src={organizationLogo.url || ""}
							alt={organizationLogo.alt || ""}
							width={organizationLogo.width || 160}
							height={organizationLogo.height || 80}
							className="h-8 w-auto object-contain"
							priority
						/>
					) : (
						<span className="font-heading text-primary text-lg">
							{main}
							{accent && <span className="text-foreground"> {accent}</span>}
						</span>
					)}
				</Link>

				<div className="hidden items-center gap-6 md:flex">
					{navigationItems?.map(({ link }, index) => (
						<Link
							key={index}
							href={link.url || "#"}
							{...(link.newTab ? { rel: "noopener noreferrer", target: "_blank" } : {})}
							onClick={() => trackNavClick(link)}
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							{link.label || "#"}
						</Link>
					))}
				</div>

				{discovery?.link && (
					<Button
						render={
							<BookingLink
								location="header"
								href={discovery.link.url || "#"}
								{...(discovery.link.newTab
									? { rel: "noopener noreferrer", target: "_blank" }
									: {})}
							>
								{discovery.link.label || "#"}
							</BookingLink>
						}
						nativeButton={false}
						className="hidden md:inline-flex"
					/>
				)}

				<button
					type="button"
					aria-label={menuOpen ? "Close menu" : "Open menu"}
					onClick={() => setMenuOpen(!menuOpen)}
					className="text-primary md:hidden"
				>
					{menuOpen ? <X size={18} /> : <Menu size={18} />}
				</button>
			</nav>

			{menuOpen && (
				<div className="border-border bg-card mx-auto mt-2 flex max-w-(--container) flex-col gap-3 rounded-lg border p-5 text-sm md:hidden">
					{navigationItems?.map(({ link }, index) => (
						<Link
							key={index}
							href={link.url || "#"}
							{...(link.newTab ? { rel: "noopener noreferrer", target: "_blank" } : {})}
							onClick={() => {
								trackNavClick(link);
								setMenuOpen(false);
							}}
						>
							{link.label || "#"}
						</Link>
					))}
					{discovery?.link && (
						<BookingLink
							location="header"
							href={discovery.link.url || "#"}
							{...(discovery.link.newTab
								? { rel: "noopener noreferrer", target: "_blank" }
								: {})}
							onClick={() => setMenuOpen(false)}
							className="text-primary"
						>
							{discovery.link.label || "#"}
						</BookingLink>
					)}
				</div>
			)}
		</div>
	);
};

export { HeaderClient };
