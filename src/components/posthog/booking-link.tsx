"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { captureEvent } from "@/lib/posthog-events";

type BookingLinkProps = ComponentProps<typeof Link> & {
	location: string;
	programName?: string;
};

// renders a booking/discovery anchor and reports the click before following it.
// its own client component so the blocks that use it stay server components —
// it is passed to Button's `render` prop
const BookingLink = ({ location, programName, onClick, ...props }: BookingLinkProps) => (
	<Link
		{...props}
		onClick={(event) => {
			captureEvent({
				event: "booking_cta_clicked",
				properties: { location, programName },
			});
			onClick?.(event);
		}}
	/>
);

export { BookingLink };
