"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	useCarousel,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { SocialProof } from "@/payload-types";

const bgMap: Record<string, string> = {
	background: "bg-background",
	muted: "bg-muted",
};

const SocialProofNav = () => {
	const { scrollPrev, scrollNext } = useCarousel();

	return (
		<div className="mt-10 flex justify-center gap-4">
			<Button
				variant="outline"
				size="icon"
				aria-label="Previous testimonial"
				onClick={scrollPrev}
			>
				<ChevronLeft />
			</Button>
			<Button
				variant="outline"
				size="icon"
				aria-label="Next testimonial"
				onClick={scrollNext}
			>
				<ChevronRight />
			</Button>
		</div>
	);
};

const SocialProofBlock = ({
	backgroundVariant = "background",
	headline,
	headlineDescription,
	testimonials,
}: SocialProof) => {
	const backgroundClass = bgMap[backgroundVariant] ?? "bg-background";

	const items = testimonials ?? [];

	if (items.length === 0) return null;

	return (
		<section id="social-proof" className={cn("py-16 lg:py-30", backgroundClass)}>
			<Container>
				<div className="mx-auto max-w-3xl">
					<div className="mb-12 text-center">
						<h2 className="text-foreground mb-4 text-3xl font-semibold md:text-4xl">
							{headline}
						</h2>
						{headlineDescription && (
							<p className="text-muted-foreground">{headlineDescription}</p>
						)}
					</div>

					<Carousel opts={{ loop: true }}>
						<CarouselContent className="ml-0">
							{items.map((item, index) => {
								const photo = item.photo;
								const isMedia = typeof photo === "object" && photo !== null;
								const photoSrc = isMedia ? (photo.url ?? null) : null;
								const photoAlt = isMedia ? photo.alt || item.name : item.name;

								return (
									<CarouselItem key={item.id ?? index} className="pl-0">
										<figure className="flex flex-col items-center px-4 text-center sm:px-12">
											{photoSrc && (
												<Image
													src={photoSrc}
													alt={photoAlt}
													width={80}
													height={80}
													className="mb-6 size-20 rounded-full object-cover"
												/>
											)}

											<span
												aria-hidden="true"
												className="font-heading text-primary mb-2 text-6xl leading-none font-bold select-none"
											>
												&ldquo;
											</span>

											<blockquote className="font-heading text-foreground text-2xl leading-relaxed italic md:text-3xl">
												{item.testimony}
											</blockquote>

											<figcaption className="mt-6">
												<div className="text-foreground text-base font-semibold">
													{item.name}
												</div>
												{item.jobTitle && (
													<div className="text-muted-foreground mt-1 text-sm">
														{item.jobTitle}
													</div>
												)}
											</figcaption>
										</figure>
									</CarouselItem>
								);
							})}
						</CarouselContent>

						{items.length > 1 && <SocialProofNav />}
					</Carousel>
				</div>
			</Container>
		</section>
	);
};

export { SocialProofBlock };
