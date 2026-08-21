import type { CollectionConfig } from "payload";

import {
	isAdminOrEditor,
	isAdminOrEditorOrPublished,
} from "@/payload/access/access-control";
import { ProgramBenefits } from "@/payload/blocks/program-benefits/schema";
import { CallToAction } from "@/payload/blocks/call-to-action/schema";
import { ContentEditor } from "@/payload/blocks/content-editor/schema";
import { Faq } from "@/payload/blocks/faq/schema";
import { Hero } from "@/payload/blocks/hero/schema";
import { MeetMichelle } from "@/payload/blocks/meet-michelle/schema";
import { PostsArchive } from "@/payload/blocks/posts-archive/schema";
import { ProblemAgitation } from "@/payload/blocks/problem-agitation/schema";
import { Programs } from "@/payload/blocks/programs/schema";
import { SocialProof } from "@/payload/blocks/social-proof/schema";
import {
	revalidateDelete,
	revalidatePage,
} from "@/payload/collections/pages/hooks/revalidate-page";
import { slugField } from "@/payload/fields/slug";
import { populatePublishedAt } from "@/payload/hooks/populate-published-at";
import { generatePreviewPath } from "@/payload/utilities/generate-preview-path";

import {
	MetaDescriptionField,
	MetaImageField,
	MetaTitleField,
	OverviewField,
	PreviewField,
} from "@payloadcms/plugin-seo/fields";

const Pages: CollectionConfig<"pages"> = {
	slug: "pages",
	labels: { singular: "Page", plural: "Pages" },
	admin: {
		defaultColumns: ["title", "slug", "createdAt", "updatedAt"],
		group: "Content",
		livePreview: {
			url: ({ data, req }) => {
				const path = generatePreviewPath({
					slug: typeof data?.slug === "string" ? data.slug : "",
					collection: "pages",
					req,
				});

				return path;
			},
		},
		preview: (data, { req }) =>
			generatePreviewPath({
				slug: typeof data?.slug === "string" ? data.slug : "",
				collection: "pages",
				req,
			}),
		useAsTitle: "title",
	},
	access: {
		create: isAdminOrEditor,
		delete: isAdminOrEditor,
		read: isAdminOrEditorOrPublished,
		update: isAdminOrEditor,
	},
	defaultPopulate: { title: true, slug: true },
	fields: [
		{ name: "title", type: "text", required: true },
		{
			type: "tabs",
			tabs: [
				{
					label: "Content",
					fields: [
						{
							name: "layout",
							type: "blocks",
							required: true,
							admin: { initCollapsed: true },
							blocks: [
								Hero,
								PostsArchive,
								ContentEditor,
								CallToAction,
								ProblemAgitation,
								Programs,
								ProgramBenefits,
								MeetMichelle,
								SocialProof,
								Faq,
							],
						},
					],
				},
				{
					name: "meta",
					label: "SEO",
					fields: [
						OverviewField({
							titlePath: "meta.title",
							descriptionPath: "meta.description",
							imagePath: "meta.image",
						}),
						MetaTitleField({ hasGenerateFn: true }),
						MetaImageField({ relationTo: "media" }),
						MetaDescriptionField({}),
						PreviewField({
							hasGenerateFn: true,
							titlePath: "meta.title",
							descriptionPath: "meta.description",
						}),
					],
				},
			],
		},
		...slugField(),
		{
			name: "publishedAt",
			type: "date",
			label: "Date Published",
			admin: {
				date: { pickerAppearance: "dayOnly", displayFormat: "dd MMMM yyyy" },
				position: "sidebar",
			},
		},
	],
	hooks: {
		afterChange: [revalidatePage],
		beforeChange: [populatePublishedAt],
		afterDelete: [revalidateDelete],
	},
	versions: {
		drafts: { autosave: { interval: 100 }, schedulePublish: true },
		maxPerDoc: 50,
	},
};

export { Pages };
