import Image from "next/image";

import { Container } from "@/components/container";
import { RichText } from "@/components/payload/rich-text";
import { cn } from "@/lib/utils";
import type { MeetMichelle } from "@/payload-types";

const bgMap: Record<string, string> = {
	background: "bg-background",
	muted: "bg-muted",
};

const MeetMichelleBlock = ({
	backgroundVariant = "background",
	bio,
	headline,
	headlineDescription,
	photo,
}: MeetMichelle) => {
	const backgroundClass = bgMap[backgroundVariant] ?? "bg-background";

	return (
		<section id="meet-michelle" className={cn("py-16 lg:py-30", backgroundClass)}>
			<Container>
				<div className="mb-12 text-center">
					<h2 className="text-foreground mb-4 text-3xl font-semibold md:text-4xl">
						{headline}
					</h2>
					{headlineDescription && (
						<p className="text-muted-foreground">{headlineDescription}</p>
					)}
				</div>
				<div className="grid items-start gap-12 lg:grid-cols-3">
					<div className="lg:col-span-1">
						<div className="bg-muted relative aspect-4/5 w-full overflow-hidden rounded-lg border border-card-border">
							{typeof photo === "object" && photo !== null && (
								<Image
									src={photo.url ?? ""}
									alt={photo.alt ?? ""}
									fill
									sizes="(max-width: 1024px) 100vw, 33vw"
									className="rounded-lg object-cover"
								/>
							)}
						</div>
					</div>
					<div className="space-y-6 lg:col-span-2">
						<RichText data={bio} enableGutter={false} />
					</div>
				</div>
			</Container>
		</section>
	);
};

export { MeetMichelleBlock };
