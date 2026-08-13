import {
	FixedToolbarFeature,
	HeadingFeature,
	InlineToolbarFeature,
	lexicalEditor,
	OrderedListFeature,
	UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

const Content: Block = {
	slug: "content",
	interfaceName: "ContentBlock",
	labels: {
		singular: "Content Block",
		plural: "Content Blocks",
	},
	fields: [
		{
			name: "textContent",
			type: "richText",
			label: false,
			editor: lexicalEditor({
				features: ({ rootFeatures }) => {
					return [
						...rootFeatures,
						FixedToolbarFeature(),
						HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
						InlineToolbarFeature(),
						OrderedListFeature(),
						UnorderedListFeature(),
					];
				},
			}),
		},
	],
};

export { Content };
