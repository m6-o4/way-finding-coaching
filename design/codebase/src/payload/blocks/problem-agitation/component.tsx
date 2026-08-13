import { ProblemAgitation } from "@/payload-types";

const ProblemAgitationBlock = ({ challenge, problem }: ProblemAgitation) => {
	return (
		<section className="bg-[#F4F4F4] px-4 py-20">
			<div className="mx-auto max-w-4xl text-center">
				<h2 className="mb-8 text-3xl font-bold text-[#1A233D] md:text-4xl">{problem}</h2>
				<p className="text-lg leading-relaxed text-pretty text-[#49536C] md:text-xl">{challenge}</p>
			</div>
		</section>
	);
};

export { ProblemAgitationBlock };
