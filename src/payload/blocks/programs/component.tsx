import { ArrowRight, Check, Compass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Programs } from "@/payload-types";

const bgMap: Record<string, string> = {
	background: "bg-background",
	muted: "bg-muted",
};

const ProgramsBlock = ({
	backgroundVariant = "background",
	bookingLink,
	headline,
	headlineDescription,
	programs,
}: Programs) => {
	const backgroundClass = bgMap[backgroundVariant] ?? "bg-background";
	const bookingHref = bookingLink?.link?.url ?? null;

	return (
		<section id="programs" className={cn("py-16 lg:py-30", backgroundClass)}>
			<Container>
				{(headline || headlineDescription || bookingHref) && (
					<div className="mb-12 flex flex-col items-end justify-between md:flex-row">
						<div>
							{headline && (
								<h2 className="text-foreground mb-4 text-3xl font-semibold md:text-4xl">
									{headline}
								</h2>
							)}
							{headlineDescription && (
								<p className="text-muted-foreground">{headlineDescription}</p>
							)}
						</div>
						{bookingHref && (
							<Button
								render={
									<Link
										href={bookingHref}
										{...(bookingLink?.link?.newTab
											? { rel: "noopener noreferrer", target: "_blank" }
											: {})}
									>
										{bookingLink?.link?.label ?? "Book a Call"}
										<ArrowRight className="ml-2 size-4 transition-transform group-hover/button:translate-x-1" />
									</Link>
								}
								nativeButton={false}
								variant="secondary"
								className="mt-6 hidden md:mt-0 md:inline-flex"
							/>
						)}
					</div>
				)}

				{programs && programs.length > 0 && (
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{programs.map((program, index) => {
							const image = program.programImage;
							const imageSrc =
								typeof image === "object" && image !== null ? (image.url ?? null) : null;
							const imageAlt =
								typeof image === "object" && image !== null
									? (image.alt ?? program.programTitle)
									: (program.programTitle ?? "Program image");
							const features = program.programFeatures ?? [];

							return (
								<article
									key={program.id ?? index}
									className="group border-card-border bg-card flex h-full flex-col overflow-hidden rounded-lg border"
								>
									<div className="bg-muted relative aspect-16/10 overflow-hidden">
										{imageSrc ? (
											<>
												<Image
													src={imageSrc}
													alt={imageAlt ?? ""}
													fill
													sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
													className="object-cover transition-transform duration-500 group-hover:scale-105"
												/>
												<div className="bg-primary/10 absolute inset-0 transition-colors duration-300 group-hover:bg-transparent" />
											</>
										) : (
											<div className="flex h-full w-full items-center justify-center">
												<Compass className="text-muted-foreground/30 size-12" />
											</div>
										)}
									</div>

									<div className="flex flex-1 flex-col p-6">
										<h3 className="text-foreground mb-3 text-xl font-semibold">
											{program.programTitle}
										</h3>

										{program.programDescription && (
											<p className="text-muted-foreground mb-4 text-sm leading-relaxed">
												{program.programDescription}
											</p>
										)}

										{features.length > 0 && (
											<ul className="mb-6 space-y-2">
												{features.map((feature, featureIndex) => (
													<li
														key={feature.id ?? featureIndex}
														className="flex items-start gap-2 text-sm"
													>
														<Check className="text-primary mt-0.5 size-4 shrink-0" />
														<span className="text-foreground">{feature.title}</span>
													</li>
												))}
											</ul>
										)}

										{program.programPrice && (
											<div className="mt-auto pt-4">
												<p className="text-foreground text-2xl font-semibold">
													${program.programPrice}
													<span className="text-muted-foreground text-base font-normal">
														/person
													</span>
												</p>
											</div>
										)}
									</div>
								</article>
							);
						})}
					</div>
				)}
			</Container>
		</section>
	);
};

export { ProgramsBlock };
