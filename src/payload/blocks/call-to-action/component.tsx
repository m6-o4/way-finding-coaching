import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { CallToAction } from "@/payload-types";

// renders a high-impact call to action section with two primary navigation paths
const CallToActionBlock = ({ calltoaction }: CallToAction) => {
	// the relationship arrives unpopulated (a string id) until expanded, so only render the populated object
	if (!calltoaction || typeof calltoaction !== "object") return null;

	const { ctaDiscovery, ctaFreeGuide, headline, headlineDescription } = calltoaction;

	return (
		<section className="bg-primary relative overflow-hidden py-16 lg:py-30">
			<Container className="text-center">
				<h2 className="text-primary-foreground font-heading mb-6 text-4xl font-semibold sm:text-5xl">
					{headline}
				</h2>
				<p className="text-primary-foreground mx-auto mb-10 text-lg sm:text-xl">
					{headlineDescription}
				</p>
				<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
					{ctaDiscovery.link && (
						<Button
							render={
								<Link
									href={ctaDiscovery.link.url || "#"}
									{...(ctaDiscovery.link.newTab
										? { rel: "noopener noreferrer", target: "_blank" }
										: {})}
								>
									{ctaDiscovery.link.label || "#"}
								</Link>
							}
							nativeButton={false}
							variant="secondary"
							className="w-full sm:w-auto"
						/>
					)}

					{ctaFreeGuide.link && (
						<Button
							render={
								<Link
									href={ctaFreeGuide.link.url || "#"}
									{...(ctaFreeGuide.link.newTab
										? { rel: "noopener noreferrer", target: "_blank" }
										: {})}
								>
									{ctaFreeGuide.link.label || "#"}
									<ArrowRight className="ml-2 size-4 transition-transform group-hover/button:translate-x-1" />
								</Link>
							}
							nativeButton={false}
							variant="outline"
							className="dark:border-primary-foreground/40 dark:text-primary-foreground dark:hover:bg-primary-foreground/10 w-full sm:w-auto dark:bg-transparent"
						/>
					)}
				</div>
			</Container>
		</section>
	);
};

export { CallToActionBlock };
