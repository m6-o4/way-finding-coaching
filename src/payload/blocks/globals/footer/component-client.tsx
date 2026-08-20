import Link from "next/link";

import type { Footer } from "@/payload-types";

interface FooterClientProps {
	data: Footer;
}

// renders the site footer with dynamic content from payload cms
const FooterClient = ({ data }: FooterClientProps) => {
	const { copyright, navItems, organizationName, organizationSlogan } = data;

	return (
		<div className="bg-secondary">
			<div className="container mx-auto px-6 py-8 text-center">
				<Link href="/" className="font-heading text-secondary-foreground block text-2xl">
					{organizationName}
				</Link>
				<p className="text-secondary-foreground">{organizationSlogan}</p>

				{navItems && navItems.length > 0 && (
					<div className="text-secondary-foreground mt-7 flex justify-center gap-6">
						{navItems.map((item, i) => (
							<Link
								key={i}
								href={item.link.url || "#top"}
								{...(item.link.newTab
									? { rel: "noopener noreferrer", target: "_blank" }
									: {})}
							>
								{item.link.label}
							</Link>
						))}
					</div>
				)}

				<hr className="border-secondary-foreground/20 my-6 md:my-10" />

				<p className="text-secondary-foreground mt-8">
					&copy; {new Date().getFullYear()} {copyright}
				</p>
			</div>
		</div>
	);
};

export { FooterClient };
