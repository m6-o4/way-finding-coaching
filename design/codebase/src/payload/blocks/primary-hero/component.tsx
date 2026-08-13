import { Button } from "@/components/ui/button";
import { PrimaryHero } from "@/payload-types";
import Image from "next/image";
import Link from "next/link";

/**
 * @component primaryheroblock
 * @description a hero component designed to display critical page information
 * prominently over a full-bleed media background. it establishes a fixed minimum
 * height and centers the text content, making it ideal for landing pages.
 *
 * @param {PrimaryHero} props - properties sourced from the payload cms.
 * @param {object | string} props.media - the media object (image or video) for the background.
 * @param {string} props.headline - the main, large-font heading.
 * @param {string} props.subheadline - the secondary, descriptive text.
 * @param {array} props.links - array of link objects to be rendered as call-to-action buttons.
 */
const PrimaryHeroBlock = ({ media, headline, subHeadline, links }: PrimaryHero) => {
	const image = media;

	// determine image source url, using a default fallback path
	const imageSrc = typeof image === "string" ? image : (image.url ?? "/way-finding-og.webp");

	// determine image alt text, using a default string fallback
	const imageAlt = typeof image === "string" ? "Hero image" : (image.alt ?? "Hero image");

	return (
		// full-width, tall section with dark background and centered text
		<section className="relative flex h-[80vh] min-h-150 items-center justify-center overflow-hidden bg-[#1A233D] text-white">
			{/* the media component is set to fill the entire section */}
			<div className="absolute inset-0">
				<Image src={imageSrc} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
			</div>

			{/* dark, semi-transparent overlay to ensure text readability over the background media */}
			<div className="absolute inset-0 bg-[#1A233D]/30" />

			{/* content floating over background start */}
			{/* z-10 ensures content is above the media and the overlay */}
			<div className="absolute inset-0 z-10 flex items-center justify-center">
				<div className="mx-auto max-w-6xl text-center">
					<h1 className="mb-6 text-5xl font-bold text-balance md:text-6xl">{headline}</h1>
					<p className="mx-auto mb-8 max-w-4xl text-xl leading-relaxed text-pretty text-[#B2D2C2] md:text-2xl">
						{subHeadline}
					</p>
					{/* container for call-to-action buttons */}
					<div className="flex justify-center space-x-4">
						{links?.map(({ link }, index) => (
							<Button
								key={index}
								asChild // renders the button wrapper as a link
								size="lg"
								className="rounded-lg bg-[#FFD700] px-8 py-4 text-lg font-semibold text-[#1A233D] shadow-lg transition-all duration-300 hover:bg-[#E6C200] hover:shadow-xl"
							>
								<Link href={link.url ?? "/"} target="_blank" rel="noopener noreferrer">
									{link.label}
								</Link>
							</Button>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export { PrimaryHeroBlock };
