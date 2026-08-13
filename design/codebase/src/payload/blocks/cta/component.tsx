import { Button } from "@/components/ui/button";
import type { CallToAction } from "@/payload-types";
import Link from "next/link";

/**
 * @component calltoactionblock
 * @description a dedicated component block to prompt user action. it features a
 * bold title, descriptive text, and a prominent call-to-action button, typically
 * displayed in a dark, high-contrast section.
 *
 * @param {CallToAction} props - properties sourced from the payload cms.
 * @param {string} props.title - the main, attention-grabbing title.
 * @param {string} props.content - the explanatory text accompanying the call to action.
 * @param {array} props.links - an array of link objects to be rendered as buttons.
 */
const CallToActionBlock = ({ content, links, title }: CallToAction) => {
	return (
		// main container section with dark background and white text for high contrast
		<section className="bg-[#1A233D] px-4 py-20 text-white">
			<div className="mx-auto max-w-6xl text-center">
				<h2 className="mb-8 text-3xl font-bold text-balance md:text-4xl">{title}</h2>
				<p className="mb-8 text-xl leading-relaxed text-pretty text-[#B2D2C2]">{content}</p>
				{/* map over the links array to render button components */}
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
		</section>
	);
};

export { CallToActionBlock };
