"use client";

import { ArrowRight, BookOpen, Check, Mail, User } from "lucide-react";
import Image from "next/image";
import { useState, type FormEvent } from "react";

import { submitLead } from "@/app/actions/lead";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LeadMagnet } from "@/payload-types";

// maps cms variant values to tailwind background utility classes
const bgMap: Record<string, string> = {
	background: "bg-background",
	muted: "bg-muted",
};

// the guide's contents, shown as a fixed checklist beside the form
const guideContents = [
	"Uncovering hidden conflicts",
	"The purpose worksheet",
	"Somatic grounding techniques",
];

const LeadMagnetBlock = ({
	backgroundVariant = "background",
	headline,
	headlineDescription,
	image,
}: LeadMagnet) => {
	const [submitted, setSubmitted] = useState(false);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const backgroundClass = bgMap[backgroundVariant] ?? "bg-background";

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const form = new FormData(event.currentTarget);
		const firstName = String(form.get("firstName") ?? "");
		const email = String(form.get("email") ?? "");

		setPending(true);
		setError(null);

		const result = await submitLead({ firstName, email });

		setPending(false);

		if (result.success) {
			setSubmitted(true);
		} else {
			setError(result.error);
		}
	};

	return (
		<section className={cn("text-foreground", backgroundClass)}>
			<Container>
				<div className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-2 lg:gap-x-16 lg:py-30">
					<div className="text-center lg:col-span-2">
						<h1 className="font-heading mx-auto max-w-3xl text-5xl leading-none sm:text-6xl">
							{headline}
						</h1>
						{headlineDescription && (
							<p className="text-muted-foreground mx-auto mt-7 max-w-2xl text-base leading-7">
								{headlineDescription}
							</p>
						)}
					</div>

					<div className="min-w-0">
						<p className="text-primary text-xs font-semibold tracking-widest uppercase">
							What&apos;s inside the guide
						</p>
						<ul className="mt-4 flex flex-col gap-3">
							{guideContents.map((item) => (
								<li
									key={item}
									className="border-card-border bg-card flex items-center gap-4 rounded-lg border px-4 py-4 text-sm"
								>
									<span className="bg-accent text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
										<Check size={14} />
									</span>
									{item}
								</li>
							))}
						</ul>

						<form
							onSubmit={handleSubmit}
							className="border-card-border bg-card mt-10 rounded-lg border p-6 sm:p-8"
						>
							{submitted ? (
								<div className="flex flex-col items-center gap-3 py-5 text-center">
									<span className="bg-accent text-primary flex h-12 w-12 items-center justify-center rounded-full">
										<Check />
									</span>
									<h2 className="font-heading text-primary text-2xl">
										Your guide is on its way.
									</h2>
									<p className="text-muted-foreground text-sm leading-6">
										Check your inbox for the download link and a little encouragement for
										the road ahead.
									</p>
								</div>
							) : (
								<>
									<label className="border-border text-muted-foreground focus-within:border-ring flex items-center gap-2 border-b pb-3 text-sm">
										<User size={16} />
										<span className="sr-only">Your first name</span>
										<input
											required
											name="firstName"
											placeholder="Your First Name"
											className="text-foreground placeholder:text-muted-foreground w-full bg-transparent outline-none"
										/>
									</label>
									<label className="border-border text-muted-foreground focus-within:border-ring mt-6 flex items-center gap-2 border-b pb-3 text-sm">
										<Mail size={16} />
										<span className="sr-only">Your email address</span>
										<input
											required
											type="email"
											name="email"
											placeholder="Your Email Address"
											className="text-foreground placeholder:text-muted-foreground w-full bg-transparent outline-none"
										/>
									</label>
									<Button type="submit" disabled={pending} className="mt-7 w-full py-4">
										{pending ? "Sending…" : "Send Me the Guide"}
										{!pending && <ArrowRight />}
									</Button>
									{error && (
										<p className="text-destructive mt-4 text-center text-sm">{error}</p>
									)}
									<p className="text-muted-foreground mt-4 text-center text-xs leading-5">
										No spam. Just thoughtful tools to help you find your way.
									</p>
								</>
							)}
						</form>
					</div>

					<div className="relative flex-1 lg:min-h-160">
						<div className="border-card-border relative aspect-4/5 overflow-hidden rounded-lg border lg:aspect-auto lg:h-160">
							{image && typeof image === "object" && (
								<Image
									src={image.url || ""}
									alt={image.alt || ""}
									fill
									sizes="(max-width: 1024px) 100vw, 50vw"
									className="object-cover"
								/>
							)}
							<div className="bg-card/90 absolute inset-x-5 bottom-5 rounded-lg p-5 backdrop-blur-sm">
								<div className="flex items-start gap-3">
									<BookOpen size={18} className="text-primary mt-1 shrink-0" />
									<div>
										<p className="font-heading text-primary text-xl">
											A gentle first step
										</p>
										<p className="text-muted-foreground mt-1 text-xs leading-5">
											A practical companion for moving from stuck to clear.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
};

export { LeadMagnetBlock };
