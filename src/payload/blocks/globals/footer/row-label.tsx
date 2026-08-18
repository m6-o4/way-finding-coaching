"use client";

import type { Footer } from "@/payload-types";

import { RowLabelProps, useRowLabel } from "@payloadcms/ui";

const RowLabel = (_props: RowLabelProps) => {
	const data = useRowLabel<NonNullable<Footer["navItems"]>[number]>();

	const label = data?.data?.link?.label
		? `Navigation Item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ""}: ${data?.data?.link?.label}`
		: "Row";

	return <div>{label}</div>;
};

export { RowLabel };
