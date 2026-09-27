"use server";

import { randomUUID } from "node:crypto";
import { getPayload } from "payload";
import { z } from "zod";

import { getPostHogClient } from "@/lib/posthog-server";
import config from "@/payload-config";
import type { Lead } from "@/payload-types";
import { captureLead } from "@/services/lead.service";

// validates the lead-capture form input at the server boundary
const LeadFormSchema = z.object({
	firstName: z.string().trim().min(1, "Please enter your first name.").max(100),
	email: z.email("Please enter a valid email address."),
	// which page/CTA the submission came from, e.g. "guide-page"
	source: z.string().trim().min(1).max(64),
	// the browser's posthog id, so the server-side event is attributed to the
	// same person as the pageviews. absent if the client never loaded posthog
	distinctId: z.string().max(200).optional(),
});

type SubmitLeadResult = { success: true; data: Lead } | { success: false; error: string };

// server action for the lead-magnet form. validates, delegates to the
// service, and never throws — errors come back as a plain result.
const submitLead = async (data: {
	firstName: string;
	email: string;
	source: string;
	distinctId?: string;
}): Promise<SubmitLeadResult> => {
	try {
		const parsed = LeadFormSchema.safeParse(data);
		if (!parsed.success) {
			return { success: false, error: "Please enter a valid name and email." };
		}

		const { firstName, email, source, distinctId } = parsed.data;
		const payload = await getPayload({ config });

		const result = await captureLead(payload, { firstName, email });

		if (result.success) {
			// `flushAt: 1` sends this immediately. posthog-node requires a distinct
			// id, so an unattributable submission gets a throwaway one rather than
			// collapsing every anonymous visitor into one person
			getPostHogClient().capture({
				distinctId: distinctId ?? randomUUID(),
				event: "lead_captured",
				properties: { source },
			});
		}

		return result;
	} catch {
		console.error("[actions/lead] submitLead failed");
		return { success: false, error: "Something went wrong, please try again." };
	}
};

export { submitLead };
