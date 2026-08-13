import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
	return (
		<Container>
			<div className="py-64">
				<div className="prose max-w-none text-[#1A233D]">
					<h1 className="text-4xl" style={{ marginBottom: 0 }}>
						404
					</h1>
					<p className="mb-4">The page you are looking for could not be found.</p>
				</div>

				<Button
					className="rounded-lg bg-[#FFD700] px-6 py-2 font-semibold text-[#1A233D] shadow-md transition-all duration-300 hover:bg-[#E6C200] hover:shadow-lg"
					variant="default"
					asChild
				>
					<Link href="/">Go To Homepage</Link>
				</Button>
			</div>
		</Container>
	);
};

export { NotFound as default };
