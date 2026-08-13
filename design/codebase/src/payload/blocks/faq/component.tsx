import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQS } from "@/payload-types";
import config from "@payload-config";
import { getPayload } from "payload";

/**
 * @component faqblock
 * @description a server component block that fetches frequently asked questions (faqs)
 * from the payload cms and renders them in an interactive accordion component.
 *
 * @param {FAQS} props - properties sourced from the payload cms.
 * @param {string} props.title - the main title for the faq section.
 */
const FAQBlock = async ({ title }: FAQS) => {
	// initialize payload instance for data fetching
	const payload = await getPayload({ config: config });

	// fetch documents from the 'faqs' collection
	const faqs = await payload.find({
		collection: "faqs",
		limit: 10, // retrieve up to 10 faqs
		sort: "createdAt", // sort by creation date
	});

	return (
		// main container section with a light green background and padding
		<section className="bg-[#B2D2C2] px-4 py-20">
			<div className="mx-auto max-w-6xl">
				<h2 className="mb-16 text-center text-3xl font-bold text-[#1A233D] md:text-4xl">{title}</h2>
				{/* accordion component container: single item can be open at a time */}
				<Accordion type="single" collapsible className="w-full space-y-4">
					{/* map over the fetched faqs to render individual accordion items */}
					{faqs.docs.map((faq, index) => (
						<AccordionItem value={`item-${index}`} key={index} className="rounded-lg border border-[#B2D2C2] px-6">
							{/* accordion trigger displays the question */}
							<AccordionTrigger className="text-left text-lg font-semibold text-[#1A233D] hover:text-[#49536C]">
								{faq.question}
							</AccordionTrigger>
							{/* accordion content displays the answer when the item is open */}
							<AccordionContent className="text-base leading-relaxed text-[#1A233D]">{faq.answer}</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
};

export { FAQBlock };
