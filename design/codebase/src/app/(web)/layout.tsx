import { ClarityTracker } from "@/components/clarity-tracker";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Footer } from "@/payload/blocks/globals/footer/component";
import { Header } from "@/payload/blocks/globals/header/component";
import { getServerSideURL } from "@/payload/utilities/get-url";
import { mergeOpenGraph } from "@/payload/utilities/merge-opengraph";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ReactNode } from "react";

// load global styles to establish the baseline css for the site
import "@/styles/globals.css";

// use Geist to maintain a modern aesthetic while ensuring performance via local subsets
const geist = Geist({ subsets: ["latin"] });

const RootLayout = async (props: { children: ReactNode }) => {
	const { children } = props;

	return (
		// suppresshydrationwarning prevents attribute mismatch errors from theme injection
		<html lang="en" suppressHydrationWarning>
			<body className={cn("flex h-screen flex-col", geist.className)}>
				{/* track user behavior early in the lifecycle to catch session starts */}
				<ClarityTracker />

				{/* isolate theme logic to ensure accessible color contrast and persistent preferences */}
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
					{/* keep navigation accessible across all route segments */}
					<header>
						<Header />
					</header>

					{/* expand main area to push footer down and preserve layout integrity */}
					<main>{children}</main>

					{/* mt-auto ensures the footer sticks to the bottom on short pages */}
					<footer className="mt-auto">
						<Footer />
					</footer>
				</ThemeProvider>
			</body>
		</html>
	);
};

const metadata: Metadata = {
	// define a single source of truth for urls to prevent broken assets in seo crawlers
	metadataBase: new URL(getServerSideURL()),

	// standardize social sharing previews across different platforms
	openGraph: mergeOpenGraph(),

	twitter: {
		card: "summary_large_image",
		creator: "@m6o4solutions",
	},

	// use svg for the favicon to maintain sharpness across all screen resolutions
	icons: {
		icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
	},
};

export { RootLayout as default, metadata };
