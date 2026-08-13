import { SecondaryHero } from "@/payload-types";
import Image from "next/image";

/**
 * @component secondaryheroblock
 * @description a smaller, secondary hero component used for interior pages. it
 * displays a headline and optional subheadline over a full-bleed media background.
 * it enforces a consistent minimum height and centers the content.
 *
 * @param {SecondaryHero} props - properties sourced from the payload cms.
 * @param {object | string} props.media - the media object (image or video) for the background.
 * @param {string} props.headline - the main heading, typically the page title.
 * @param {string} props.subheadline - the secondary, descriptive text.
 */
const SecondaryHeroBlock = ({ media, headline, subHeadline }: SecondaryHero) => {
	const image = media;

	// determine image source url, using a default fallback path
	const imageSrc = typeof image === "string" ? image : (image.url ?? "/way-finding-og.webp");

	// determine image alt text, using a default string fallback
	const imageAlt = typeof image === "string" ? "Hero image" : (image.alt ?? "Hero image");

	return (
		<section className="relative flex h-[50vh] min-h-100 items-center justify-center overflow-hidden bg-[#1A233D] text-white">
			{/* the media component is set to fill the entire section */}
			<div className="absolute inset-0">
				<Image src={imageSrc} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
			</div>

			{/* dark, semi-transparent overlay (50% opacity) for text readability */}
			<div className="absolute inset-0 bg-[#1A233D]/50" />

			{/* content floating over background start */}
			{/* z-10 ensures content is above the media and the overlay */}
			<div className="absolute inset-0 z-10 flex items-center justify-center">
				<div className="mx-auto max-w-6xl text-center">
					<h1 className="mb-6 text-5xl font-bold text-balance md:text-6xl">{headline}</h1>
					<p className="mx-auto mb-8 max-w-4xl text-xl leading-relaxed text-pretty text-[#B2D2C2] md:text-2xl">
						{subHeadline}
					</p>
				</div>
			</div>
		</section>
	);
};

export { SecondaryHeroBlock };
