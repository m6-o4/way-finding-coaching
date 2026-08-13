import { Card, CardContent } from "@/components/ui/card";
import { SocialProof } from "@/payload-types";
import config from "@payload-config";
import { getPayload } from "payload";

/**
 * @component socialproofblock
 * @description a server component block that fetches testimonials from the payload
 * cms and displays them in a responsive, card-based grid layout. it serves as a
 * section for social proof on a page.
 *
 * @param {SocialProof} props - properties sourced from the payload cms.
 * @param {string} props.title - the heading for the testimonial section.
 */
const SocialProofBlock = async ({ title }: SocialProof) => {
	// initialize payload instance for data fetching
	const payload = await getPayload({ config: config });

	// fetch documents from the 'testimonials' collection
	const testimonials = await payload.find({
		collection: "testimonials",
		limit: 10, // retrieve up to 10 testimonials
		sort: "createdAt", // sort by creation date
	});

	return (
		// main container section with a light green background and padding
		<section className="bg-[#B2D2C2] px-4 py-20">
			<div className="mx-auto max-w-6xl">
				{/* section title */}
				<h2 className="mb-16 text-center text-3xl font-bold text-[#1A233D] md:text-4xl">{title}</h2>
				{/* testimonial grid: 3 columns on medium screens and up */}
				<div className="grid gap-8 md:grid-cols-3">
					{testimonials.docs.map((testimonial) => (
						<Card key={testimonial.id} className="bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
							<CardContent className="p-8">
								{/* the testimonial quote */}
								<p className="mb-4 leading-relaxed text-[#49536C] italic">&quot;{testimonial.testimony}&quot;</p>

								{/* container for author information */}
								<div className="mt-6 flex items-center">
									<div className="ml-0 text-[#1A233D]">
										<h1 className="font-semibold">{testimonial.name}</h1>
										<span className="text-sm">{testimonial.job}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

export { SocialProofBlock };
