import type { Footer } from "@/payload-types";
import { getCachedGlobal } from "@/payload/utilities/get-globals";
import Link from "next/link";

const Footer = async () => {
	const footerData = (await getCachedGlobal("footer", 1)()) as Footer;

	const navigationItems = footerData?.navItems || [];
	const footerTitle = footerData?.title;
	const footerCopyright = footerData?.copyright;
	const contactLinkedInLink = footerData?.contactItems?.[0]?.link ?? "/";

	return (
		<div className="bg-[#49536C] text-white">
			<div className="container mx-auto px-6 py-8">
				<div className="flex flex-col items-center text-center">
					<Link href="/" className="flex items-center">
						<h3 className="text-2xl font-bold text-[#B2D2C2]">{footerTitle}</h3>
					</Link>

					<div className="-mx-4 mt-6 flex flex-wrap justify-center">
						{navigationItems.map(({ link }, index) => (
							<Link key={index} href={link.url ?? "/"} className="mx-4 text-sm text-[#B2D2C2] hover:text-white">
								{link.label}
							</Link>
						))}
					</div>
				</div>

				<hr className="my-6 border-white/20 md:my-10" />

				<div className="flex flex-col items-center gap-3 lg:flex-row lg:justify-between">
					<p className="text-center text-sm text-[#B2D2C2]">
						&copy; {new Date().getFullYear()} {footerCopyright}
					</p>

					<div className="flex">
						<Link
							href={contactLinkedInLink}
							target="_blank"
							rel="noopener noreferrer"
							className="mx-3 text-[#B2D2C2] hover:text-white"
						>
							<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
									clipRule="evenodd"
								/>
							</svg>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export { Footer };
