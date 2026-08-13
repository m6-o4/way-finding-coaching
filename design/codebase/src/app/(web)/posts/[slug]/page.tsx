import { Container } from "@/components/container";
import { LivePreviewListener } from "@/components/live-preview-listener";
import { PayloadRedirects } from "@/components/payload-redirects";
import { RichText } from "@/components/rich-text";
import { formatAuthors } from "@/payload/utilities/format-authors";
import { formatDate } from "@/payload/utilities/format-date";
import { generateMeta } from "@/payload/utilities/generate-meta";
import config from "@payload-config";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Image from "next/image";
import { getPayload } from "payload";
import { cache, Fragment } from "react";

/**
 * @function generatestaticparams
 * @description next.js function to pre-render post pages at build time. it fetches
 * all published post slugs from payload to define the static routes.
 *
 * @returns {promise<array<{slug: string}>>} a promise that resolves to an array of objects, each containing a post slug.
 */
const generateStaticParams = async () => {
	const payload = await getPayload({ config: config });

	// fetch up to 100 post documents
	const posts = await payload.find({
		collection: "posts",
		draft: false, // only consider published posts for static generation
		limit: 100,
		overrideAccess: false,
		pagination: false,
		select: {
			slug: true, // only fetch the slug field
		},
	});

	// map the fetched documents to the required next.js params format
	const params = posts.docs.map(({ slug }) => ({ slug }));
	return params;
};

// type definition for the arguments passed to next.js page and metadata functions
type Args = { params: Promise<{ slug?: string }> };

/**
 * @function querypostbyslug
 * @description fetches a single post document by its slug. it uses react's `cache`
 * to memoize the result, ensuring the data is only fetched once per request, even
 * if called multiple times (e.g., by the page and metadata functions).
 *
 * @param {object} args - an object containing the slug.
 * @param {string} args.slug - the slug of the post to query.
 * @returns {promise<post | null>} a promise that resolves to the post object or null.
 */
const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
	// check if draft mode is enabled from next.js headers
	const { isEnabled: draft } = await draftMode();

	const payload = await getPayload({ config: config });

	// query the 'posts' collection
	const result = await payload.find({
		collection: "posts",
		draft, // fetch drafts if draft mode is enabled
		limit: 1,
		overrideAccess: draft, // override access control to view drafts
		pagination: false,
		where: {
			slug: {
				equals: slug, // filter by the requested slug
			},
		},
	});

	// return the first document found or null
	return result.docs?.[0] || null;
});

/**
 * @function generatemetadata
 * @description next.js function to generate seo metadata for the page.
 *
 * @param {args} args - contains the resolved slug from the route.
 * @returns {promise<metadata>} a promise that resolves to the next.js metadata object.
 */
const generateMetadata = async ({ params: paramsPromise }: Args): Promise<Metadata> => {
	const { slug = "" } = await paramsPromise;

	// query the post data (this call is cached)
	const post = await queryPostBySlug({ slug });

	// use a payload utility to structure the metadata
	return generateMeta({ doc: post });
};

/**
 * @function page
 * @description the main server component for rendering a single post page.
 *
 * @param {args} args - contains the resolved slug from the route.
 * @returns {promise<jsx.element>} the post content wrapped in layout components.
 */
const Page = async ({ params: paramsPromise }: Args) => {
	// check draft mode status
	const { isEnabled: draft } = await draftMode();

	const { slug = "" } = await paramsPromise;

	const url = "/posts/" + slug;

	// query the post data (this call is cached)
	const post = await queryPostBySlug({ slug });

	// if no post is found, use the payloadredirects component to handle 404s or redirects
	if (!post) return <PayloadRedirects url={url} />;

	// destructure post fields
	const { content, categories, heroImage, populatedAuthors, publishedAt, title } = post;

	// check for and format authors
	const hasAuthors = populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== "";

	// image handling and fallback logic
	const image = heroImage;
	// determine image source url, using a default fallback path
	const imageSrc = typeof image === "string" ? image : (image?.url ?? "/way-finding-og.webp");
	// determine image alt text, using a default string fallback
	const imageAlt = typeof image === "string" ? "Hero image" : (image?.alt ?? "Hero image");

	return (
		<Container className="px-4 pt-36 pb-20">
			{/* payload redirects component handles payload-defined redirects, even for valid pages */}
			<PayloadRedirects disableNotFound url={url} />

			{/* render the live preview listener only when draft mode is active */}
			{draft && <LivePreviewListener />}

			<div className="mx-auto max-w-4xl">
				{/* categories list */}
				<div className="mb-6 text-sm text-[#1A233D] uppercase">
					{categories?.map((category, index) => {
						if (typeof category === "object" && category !== null) {
							const { title: categoryTitle } = category;

							const titleToUse = categoryTitle || "Untitled category";

							const isLast = index === categories.length - 1;

							return (
								<Fragment key={index}>
									{titleToUse}
									{/* separator between category titles */}
									{!isLast && <Fragment>, &nbsp;</Fragment>}
								</Fragment>
							);
						}
						return null;
					})}
				</div>

				{/* main post title */}
				<h1 className="mb-6 text-4xl leading-tight font-bold text-balance text-[#1A233D] md:text-5xl">{title}</h1>

				{/* meta information: author and published date */}
				<div className="mb-6 flex flex-col gap-4 text-[#1A233D] md:flex-row md:gap-16">
					{hasAuthors && (
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-1">
								<p className="text-sm">Author</p>
								<p>{formatAuthors(populatedAuthors)}</p>
							</div>
						</div>
					)}
					{publishedAt && (
						<div className="flex flex-col gap-1">
							<p className="text-sm">Date Published</p>
							{/* use time element with formatted date */}
							<time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
						</div>
					)}
				</div>

				{/* hero image */}
				<div className="relative mb-12 h-100 w-full overflow-hidden rounded-lg md:h-125">
					<div className="absolute inset-0">
						<Image src={imageSrc} alt={imageAlt} fill priority className="object-cover" />
					</div>
				</div>

				{/* main rich text content of the post */}
				<RichText className="mx-auto max-w-208" data={content} enableGutter={false} />
			</div>
		</Container>
	);
};

export { Page as default, generateStaticParams, generateMetadata };
