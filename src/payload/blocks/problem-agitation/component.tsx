import { Container } from "@/components/container";
import { ProblemAgitation } from "@/payload-types";
import { cn } from "@/lib/utils";

const bgMap: Record<string, string> = {
	background: "bg-background",
	muted: "bg-muted",
};

const ProblemAgitationBlock = ({
	backgroundVariant = "background",
	challenge,
	problem,
}: ProblemAgitation) => {
	const backgroundClass = bgMap[backgroundVariant] ?? "bg-background";

	return (
		<section id="problem-agitation" className={cn("py-16 lg:py-30", backgroundClass)}>
			<Container className="max-w-4xl text-center">
				<h2 className="text-foreground mb-8 text-3xl font-semibold md:text-4xl">
					{problem}
				</h2>
				<p className="text-muted-foreground text-lg leading-relaxed text-pretty md:text-xl">
					{challenge}
				</p>
			</Container>
		</section>
	);
};

export { ProblemAgitationBlock };
