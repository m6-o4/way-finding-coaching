import { LivePreviewListener } from "@/components/live-preview-listener";
import { PayloadRedirects } from "@/components/payload-redirects";
import { RenderBlocks } from "@/payload/blocks/render-blocks";
import { generateMeta } from "@/payload/utilities/generate-meta";
import config from "@payload-config";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import { cache } from "react";

/**
 * generates the static path segments for all published pages in the 'pages' collection.
 * this allows next.js to statically generate these routes at build time (ssg).
 */
const generateStaticParams = async () => {
	const payload = await getPayload({ config: config });

	const pages = await payload.find({
		collection: "pages",
		// only include published documents for static generation.
		draft: false,
		limit: 1000,
		// override access control to ensure the build process can read all pages.
		overrideAccess: false,
		pagination: false,
		select: {
			slug: true,
		},
	});

	const params = pages.docs
		// exclude the 'home' slug as it is handled by the root page route.
		?.filter((doc) => {
			return doc.slug !== "home";
		})
		// map documents to the specific parameter structure required by next.js.
		.map(({ slug }) => {
			return { slug };
		});

	return params || [];
};

type Args = { params: Promise<{ slug?: string }> };

/**
 * fetches a specific page document from payload based on the url slug.
 * uses react cache to prevent duplicate database queries during the same request cycle.
 */
const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
	// check if draft mode is active to determine whether to fetch published or draft content.
	const { isEnabled: draft } = await draftMode();

	const payload = await getPayload({ config: config });

	const result = await payload.find({
		collection: "pages",
		draft,
		limit: 1,
		pagination: false,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slug,
			},
		},
	});

	// return the first matching document or null if no match is found.
	return result.docs?.[0] || null;
});

/**
 * the main page component responsible for rendering content based on the dynamic slug.
 * it handles data fetching, redirects, and live preview integration.
 */
const Page = async ({ params: paramsPromise }: Args) => {
	// check draft status to conditionally render preview tools.
	const { isEnabled: draft } = await draftMode();

	// extract the slug from the params promise, defaulting to 'home' if undefined.
	const { slug = "home" } = await paramsPromise;

	const url = "/" + slug;

	const page = await queryPageBySlug({
		slug,
	});

	// if no page is found, delegate to the redirects component to handle 404s or database-defined redirects.
	if (!page) {
		return <PayloadRedirects url={url} />;
	}

	const { layout } = page;

	return (
		<article>
			{/* checks for redirects even on valid pages to ensure correct canonical paths. */}
			<PayloadRedirects disableNotFound url={url} />

			{/* renders the live preview listener only when draft mode is active. */}
			{draft && <LivePreviewListener />}

			{/* renders the flexible content blocks defined in the page layout. */}
			<RenderBlocks blocks={layout} />
		</article>
	);
};

/**
 * generates dynamic seo metadata for the page by fetching the corresponding payload document.
 */
const generateMetadata = async ({ params: paramsPromise }: Args): Promise<Metadata> => {
	const { slug = "home" } = await paramsPromise;

	const page = await queryPageBySlug({
		slug,
	});

	return generateMeta({ doc: page });
};

export { generateStaticParams, Page as default, generateMetadata };
