import { Container } from "@/components/container";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { Faq } from "@/payload-types";

const bgMap: Record<string, string> = {
	background: "bg-background",
	muted: "bg-muted",
};

const FaqBlock = ({
	backgroundVariant = "background",
	faqs,
	headline,
	headlineDescription,
}: Faq) => {
	const backgroundClass = bgMap[backgroundVariant] ?? "bg-background";

	return (
		<section id="faq" className={cn("py-16 lg:py-30", backgroundClass)}>
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

				{faqs && faqs.length > 0 && (
					<Accordion className="mx-auto max-w-3xl gap-4">
						{faqs.map((faq, index) => (
							<AccordionItem
								key={faq.id ?? index}
								value={faq.id ?? `faq-${index}`}
								className="border-card-border rounded-lg border bg-card"
							>
								<AccordionTrigger className="text-foreground px-6 py-4 text-base font-semibold">
									{faq.question}
								</AccordionTrigger>
								<AccordionContent className="px-6 pb-5 text-muted-foreground leading-relaxed">
									{faq.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				)}
			</Container>
		</section>
	);
};

export { FaqBlock };
