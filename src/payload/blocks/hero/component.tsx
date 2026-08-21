import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Hero } from "@/payload-types";

// maps cms variant values to tailwind background utility classes
const bgMap: Record<string, string> = {
	background: "bg-background",
	muted: "bg-muted",
};

const HeroBlock = ({
	backgroundVariant = "background",
	ctaDiscovery,
	ctaFreeGuide,
	heroDescription,
	heroHeadline,
	heroImage,
	heroOverline,
	heroType = "primary",
}: Hero) => {
	const backgroundClass = bgMap[backgroundVariant] ?? "bg-background";

	// compact page header used on internal pages
	if (heroType === "secondary") {
		return (
			<section
				id="hero"
				className={cn(
					"relative isolate flex min-h-130 items-center justify-center overflow-hidden px-6 pt-20 text-center",
					backgroundClass,
				)}
			>
				{heroImage && typeof heroImage === "object" && (
					<Image
						src={heroImage.url || ""}
						alt={heroImage.alt || ""}
						fill
						priority
						sizes="100vw"
						className="-z-10 object-cover object-center opacity-45 mix-blend-multiply"
					/>
				)}
				<div className="bg-primary/30 absolute inset-0 -z-10" />
				<div className="max-w-4xl">
					<h1 className="font-heading text-primary text-5xl leading-none font-bold sm:text-7xl">
						{heroHeadline}
					</h1>
					<p className="text-foreground mx-auto mt-6 max-w-2xl leading-7">
						{heroDescription}
					</p>
				</div>
			</section>
		);
	}

	// large page header used on main page
	return (
		<section
			id="hero"
			className={cn(
				"relative isolate flex min-h-170 items-end pt-32 pb-20 lg:min-h-190 lg:pb-28",
				backgroundClass,
			)}
		>
			{heroImage && typeof heroImage === "object" && (
				<Image
					src={heroImage.url || ""}
					alt={heroImage.alt || ""}
					fill
					priority
					sizes="100vw"
					className="-z-10 object-cover object-center opacity-75 mix-blend-multiply"
				/>
			)}
			<div className="from-secondary/40 via-secondary/10 to-background absolute inset-0 -z-10 bg-linear-to-b" />
			<div className="mx-auto w-full max-w-(--container) px-4 sm:px-6 lg:px-8">
				<div className="max-w-xl">
					{heroOverline && (
						<p className="text-primary mb-4 text-xs font-medium tracking-[0.22em] uppercase">
							{heroOverline}
						</p>
					)}
					<h1 className="font-heading text-primary text-5xl leading-none font-bold sm:text-6xl lg:text-7xl">
						{heroHeadline}
					</h1>
					<p className="text-foreground mt-6 max-w-md leading-6">{heroDescription}</p>
					<div className="mt-7 flex flex-wrap gap-3">
						{ctaDiscovery?.link && (
							<Button
								render={
									<Link
										href={ctaDiscovery.link.url || "#"}
										{...(ctaDiscovery.link.newTab
											? { rel: "noopener noreferrer", target: "_blank" }
											: {})}
									>
										{ctaDiscovery.link.label || ""}
										<ArrowRight />
									</Link>
								}
								nativeButton={false}
							/>
						)}
						{ctaFreeGuide?.link && (
							<Button
								variant="secondary"
								render={
									<Link
										href={ctaFreeGuide.link.url || "#"}
										{...(ctaFreeGuide.link.newTab
											? { rel: "noopener noreferrer", target: "_blank" }
											: {})}
									>
										{ctaFreeGuide.link.label || ""}
									</Link>
								}
								nativeButton={false}
							/>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export { HeroBlock };
