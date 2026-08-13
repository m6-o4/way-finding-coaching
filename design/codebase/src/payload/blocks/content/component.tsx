import { Container } from "@/components/container";
import { RichText } from "@/components/rich-text";
import { ContentBlock as ContentBlockType } from "@/payload-types";

/**
 * @component contentblock
 * @description a reusable payload block component designed to render rich text
 * content within the standard page layout container. it serves as a basic text section.
 *
 * @param {ContentBlockType} textcontent - the rich text data (lexical json state)
 * supplied by payload cms for this block instance.
 */
const ContentBlock = ({ textContent }: ContentBlockType) => {
	return (
		// wraps the entire content in the standard container component for max-width and centering.
		<Container>
			{/* inner div for slight horizontal padding (px-3) applied directly to the content. */}
			<div className="px-3">
				{/* conditional rendering: displays the rich text only if textcontent data is present. */}
				{textContent && <RichText className="mx-auto mb-6 max-w-200" data={textContent} enableGutter={false} />}
			</div>
		</Container>
	);
};

export { ContentBlock };
