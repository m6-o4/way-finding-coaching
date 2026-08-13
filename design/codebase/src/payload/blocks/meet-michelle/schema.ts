import { FixedToolbarFeature, HeadingFeature, InlineToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Block } from "payload";

const MeetMichelle: Block = {
	slug: "meetMichelle",
	interfaceName: "MeetMichelle",
	labels: {
		singular: "Meet Michelle Block",
		plural: "Meet Michelle Blocks",
	},
	fields: [
		{
			name: "title",
			type: "text",
			label: "Title",
			required: true,
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
					];
				},
			}),
		},
		{
			name: "photo",
			type: "upload",
			label: "Photo",
			required: true,
			relationTo: "media",
		},
	],
};

export { MeetMichelle };
