import { Check } from "lucide-react";

import { Container } from "@/components/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ProgramBenefits } from "@/payload-types";

const bgMap: Record<string, string> = {
	background: "bg-background",
	muted: "bg-muted",
};

const ProgramBenefitsBlock = ({
	backgroundVariant = "background",
	headline,
	headlineDescription,
	programs,
}: ProgramBenefits) => {
	const backgroundClass = bgMap[backgroundVariant] ?? "bg-background";

	return (
		<section id="program-benefits" className={cn("py-16 lg:py-30", backgroundClass)}>
			<Container>
				{(headline || headlineDescription) && (
					<div className="mb-12 text-center">
						{headline && (
							<h2 className="text-foreground mb-4 text-3xl font-semibold md:text-4xl">
								{headline}
							</h2>
						)}
						{headlineDescription && (
							<p className="text-muted-foreground">{headlineDescription}</p>
						)}
					</div>
				)}

				{programs && programs.length > 0 && (
					<div className="grid gap-8 md:grid-cols-3">
						{programs.map((program, index) => {
							const items = program.benefits ?? [];

							return (
								<Card
									key={program.id ?? index}
									className="border-card-border gap-0 rounded-lg border p-0 ring-0"
								>
									<CardHeader className="block p-6 pb-4">
										<CardTitle className="text-foreground text-xl font-semibold">
											{program.programTitle}
										</CardTitle>
									</CardHeader>
									{items.length > 0 && (
										<CardContent className="p-6 pt-0">
											<ul className="flex flex-col gap-2">
												{items.map((item, itemIndex) => (
													<li
														key={item.id ?? itemIndex}
														className="flex items-start gap-2 text-sm"
													>
														<Check className="text-primary mt-0.5 size-4 shrink-0" />
														<span className="text-foreground">{item.title}</span>
													</li>
												))}
											</ul>
										</CardContent>
									)}
								</Card>
							);
						})}
					</div>
				)}
			</Container>
		</section>
	);
};

export { ProgramBenefitsBlock };
