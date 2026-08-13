import { Card, CardContent } from "@/components/ui/card";
import type { Differentiation } from "@/payload-types";

/**
 * @component differentiationblock
 * @description a reusable component block designed to display a list of products
 * or service tiers, often used to highlight key differences or features in a
 * pricing or offering comparison section.
 *
 * @param {Differentiation} props - properties sourced from the payload cms.
 * @param {array} props.products - an array of product or service objects, each containing features.
 * @param {string} props.title - the main title for the section.
 * @param {string} props.subtitle - the descriptive text or secondary headline for the section.
 */
const DifferentiationBlock = ({ products, title, subtitle }: Differentiation) => {
	return (
		<section className="bg-white px-4 py-20">
			<div className="mx-auto max-w-6xl">
				{/* section title */}
				<h2 className="mb-8 text-center text-3xl font-bold text-[#1A233D] md:text-4xl">{title}</h2>
				{/* section subtitle */}
				<p className="mx-auto mb-16 max-w-3xl text-center text-xl text-pretty text-[#49536C]">{subtitle}</p>
				{/* product grid: 3 columns on medium screens and up */}
				<div className="grid gap-8 md:grid-cols-3">
					{/* map over the products array to render individual cards */}
					{products?.map((product) => (
						<Card key={product.id} className="overflow-hidden bg-[#F4F4F4] shadow-lg">
							<CardContent className="p-8 text-center">
								<h3 className="mb-6 text-2xl font-bold text-[#1A233D]">{product.name}</h3>

								<ul className="space-y-3 text-[#49536C]">
									{/* map over the features array for the current product */}
									{product.features?.map((item, index) => (
										<li key={index} className="flex items-start">
											<span className="mr-3 text-xl text-[#B2D2C2]">•</span>
											{item.feature}
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

export { DifferentiationBlock };
