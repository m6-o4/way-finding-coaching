import { Card, CardContent } from "@/components/ui/card";
import { SolutionBenefits } from "@/payload-types";
import config from "@payload-config";
import Image from "next/image";
import { getPayload } from "payload";

/**
 * @component solutionbenefitsblock
 * @description a server component that fetches and displays a list of 'products'
 * from the payload cms, presenting each as a stylized card with its image, name,
 * description, features, and price.
 *
 * @param {SolutionBenefits} props - the properties for the block.
 * @param {string} props.title - the title to be displayed for the entire section.
 */
const SolutionBenefitsBlock = async ({ title }: SolutionBenefits) => {
	// initialize payload instance for data fetching
	const payload = await getPayload({ config: config });

	// fetch all documents from the 'products' collection
	const products = await payload.find({
		collection: "products",
		limit: 10, // retrieve up to 10 products
		sort: "createdAt", // sort by creation date
	});

	return (
		<section className="bg-[#B2D2C2] px-4 py-20">
			<div className="mx-auto max-w-6xl">
				{/* section title */}
				<h2 className="mb-16 text-center text-3xl font-bold text-[#1A233D] md:text-4xl">{title}</h2>
				{/* grid layout for product cards, 3 columns on medium screens and up */}
				<div className="grid gap-8 md:grid-cols-3">
					{products.docs.map((product) => {
						const image = product.image;

						// determine image source url, using a default fallback path
						const imageSrc = typeof image === "string" ? image : (image?.url ?? "/way-finding-og.webp");

						// determine image alt text, using a default string fallback
						const imageAlt = typeof image === "string" ? "Product image" : (image?.alt ?? "Product image");

						return (
							<Card
								key={product.id}
								className="overflow-hidden bg-white p-0 shadow-lg transition-shadow duration-300 hover:shadow-xl"
							>
								{/* image container setup for next.js image component */}
								<div className="relative h-64 w-full">
									<Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
								</div>

								<CardContent className="p-8">
									{/* product name */}
									<h3 className="mb-4 text-2xl font-bold text-[#1A233D]">{product.name}</h3>
									{/* product description */}
									<p className="mb-6 text-sm font-semibold tracking-wide text-[#49536C] uppercase">
										{product.description}
									</p>
									{/* product features list */}
									<ul className="mb-6 space-y-4 text-[#49536C]">
										{product.features?.map((item, i) => (
											<li key={`${product.id}-feature-${i}`} className="flex items-start">
												<span className="mr-3 text-xl text-[#B2D2C2]">•</span>
												{item.feature}
											</li>
										))}
									</ul>
									<div className="shrink-0">
										{/* product price */}
										<span className="pt-2 text-xl font-bold text-[#1A233D]">${product.price}</span>
										<span className="text-[#49536C]">/person</span>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export { SolutionBenefitsBlock };
