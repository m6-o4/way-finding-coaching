"use server";

import { getPayload } from "payload";
import { z } from "zod";

import config from "@/payload-config";
import type { Lead } from "@/payload-types";
import { captureLead } from "@/services/lead.service";

// validates the lead-capture form input at the server boundary
const LeadFormSchema = z.object({
	firstName: z.string().trim().min(1, "Please enter your first name.").max(100),
	email: z.email("Please enter a valid email address."),
});

type SubmitLeadResult = { success: true; data: Lead } | { success: false; error: string };

// server action for the lead-magnet form. validates, delegates to the
// service, and never throws — errors come back as a plain result.
const submitLead = async (data: {
	firstName: string;
	email: string;
}): Promise<SubmitLeadResult> => {
	try {
		const parsed = LeadFormSchema.safeParse(data);
		if (!parsed.success) {
			return { success: false, error: "Please enter a valid name and email." };
		}

		const payload = await getPayload({ config });

		return await captureLead(payload, parsed.data);
	} catch {
		console.error("[actions/lead] submitLead failed");
		return { success: false, error: "Something went wrong, please try again." };
	}
};

export { submitLead };
