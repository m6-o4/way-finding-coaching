import {
	AlignFeature,
	FixedToolbarFeature,
	HeadingFeature,
	InlineToolbarFeature,
	lexicalEditor,
	OrderedListFeature,
	UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

const MeetMichelle: Block = {
	slug: "meetMichelle",
	interfaceName: "MeetMichelle",
	labels: { singular: "Meet Michelle Block", plural: "Meet Michelle Blocks" },
	fields: [
		{
			name: "title",
			type: "text",
			label: "Title",
			required: true,
		},
		{
			name: "photo",
			type: "upload",
			label: "Photo",
			required: true,
			relationTo: "media",
		},
		{
			name: "bio",
			type: "richText",
			label: "Biography",
			required: true,
			editor: lexicalEditor({
				features: ({ rootFeatures }) => {
					return [
						...rootFeatures,
						FixedToolbarFeature(),
						HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
						InlineToolbarFeature(),
						OrderedListFeature(),
						UnorderedListFeature(),
						AlignFeature(),
					];
				},
			}),
		},
		{
			name: "backgroundVariant",
			type: "select",
			label: "Background Style",
			defaultValue: "background",
			options: [
				{ label: "Background", value: "background" },
				{ label: "Muted", value: "muted" },
			],
			required: true,
		},
	],
};

export { MeetMichelle };
