import { RichText } from "@/components/rich-text";
import { MeetMichelle } from "@/payload-types";
import Image from "next/image";

/**
 * @component meetmichelleblock
 * @description a dedicated block component for displaying a specific individual's
 * photo and biographical information, typically used in an 'about' section.
 * it enforces a two-column grid layout on large screens.
 *
 * @param {MeetMichelle} props - properties sourced from the payload cms.
 * @param {string} props.title - the main heading for the section (e.g., "meet michelle").
 * @param {object} props.photo - the media object containing the image data.
 * @param {object} props.bio - the rich text content for the biography.
 */
const MeetMichelleBlock = ({ bio, photo, title }: MeetMichelle) => {
	// safely extract the image url from the payload photo object, falling back to a default static image
	const photoSrc = typeof photo === "object" && "url" in photo && photo.url ? photo.url : "/way-finding-og.webp";
	// safely extract the alt text, falling back to the person's name
	const photoAlt = typeof photo === "object" && "alt" in photo && photo.alt ? photo.alt : "Michelle Mashonganyika";

	return (
		<section className="bg-white px-4 py-20">
			<div className="mx-auto max-w-6xl">
				<h2 className="mb-16 text-center text-3xl font-bold text-[#1A233D] md:text-4xl">{title}</h2>
				{/* main content grid: photo (1 col) and bio (2 col) on large screens */}
				<div className="grid items-start gap-12 lg:grid-cols-3">
					{/* photo column */}
					<div className="lg:col-span-1">
						<div className="relative aspect-4/5 w-full overflow-hidden rounded-lg shadow-xl">
							<Image src={photoSrc} alt={photoAlt} fill className="rounded-lg object-cover" />
						</div>
					</div>
					{/* biography rich text column */}
					<div className="space-y-6 lg:col-span-2">{bio && <RichText data={bio} enableGutter={false} />}</div>
				</div>
			</div>
		</section>
	);
};

export { MeetMichelleBlock };
