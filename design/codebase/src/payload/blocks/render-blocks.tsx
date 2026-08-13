import type { Page } from "@/payload-types";
import { ArchiveBlock } from "@/payload/blocks/archive/component";
import { ContentBlock } from "@/payload/blocks/content/component";
import { CallToActionBlock } from "@/payload/blocks/cta/component";
import { DifferentiationBlock } from "@/payload/blocks/differentiation/component";
import { FAQBlock } from "@/payload/blocks/faq/component";
import { FormBlock } from "@/payload/blocks/forms/component";
import { MediaBlock } from "@/payload/blocks/media/component";
import { MeetMichelleBlock } from "@/payload/blocks/meet-michelle/component";
import { PrimaryHeroBlock } from "@/payload/blocks/primary-hero/component";
import { ProblemAgitationBlock } from "@/payload/blocks/problem-agitation/component";
import { SecondaryHeroBlock } from "@/payload/blocks/secondary-hero/component";
import { SocialProofBlock } from "@/payload/blocks/social-proof/component";
import { SolutionBenefitsBlock } from "@/payload/blocks/solution-benefits/component";
import { ComponentType, Fragment } from "react";

/* defines which payload block types map to which react components.
   this acts as a registry that drives dynamic page rendering. */
const blockComponents = {
	archive: ArchiveBlock,
	content: ContentBlock,
	differentiation: DifferentiationBlock,
	cta: CallToActionBlock,
	faq: FAQBlock,
	form: FormBlock,
	media: MediaBlock,
	meetMichelle: MeetMichelleBlock,
	primaryHero: PrimaryHeroBlock,
	secondaryHero: SecondaryHeroBlock,
	socialProof: SocialProofBlock,
	solutionBenefits: SolutionBenefitsBlock,
	problemAgitation: ProblemAgitationBlock,
} as const; // use 'as const' to narrow down blockType keys

type BlockKey = keyof typeof blockComponents;

/* sanitizes payload data by recursively replacing null values with undefined.
   prevents react warnings and maintains predictable prop behavior. */
function normalizeBlock<T>(value: T): T {
	if (value === null) return undefined as unknown as T;

	if (Array.isArray(value)) return value.map(normalizeBlock) as unknown as T;

	if (typeof value === "object" && value !== undefined) {
		return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalizeBlock(v)])) as T;
	}

	return value;
}

interface RenderBlocksProps {
	blocks: NonNullable<Page["layout"]>;
}

/* dynamically renders blocks defined in payload cms.
   each block type is matched to its component, normalized, and safely passed as props.
   casting through 'unknown' is intentional to satisfy typescript's strictness
   when widening discriminated unions into generic record props. */
export const RenderBlocks = ({ blocks }: RenderBlocksProps) => {
	if (!Array.isArray(blocks) || blocks.length === 0) return null;

	return (
		<Fragment>
			{blocks.map((block, index) => {
				const Component = blockComponents[block.blockType as BlockKey];
				if (!Component) return null;

				const normalized = normalizeBlock(block);

				// acknowledge and explicitly widen block data for runtime-safe prop spreading
				const safeProps = normalized as unknown as Record<string, unknown>;

				// safely cast component type to accept the widened props
				const TypedComponent = Component as unknown as ComponentType<Record<string, unknown>>;

				return <TypedComponent key={index} {...safeProps} />;
			})}
		</Fragment>
	);
};
