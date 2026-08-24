import type { Payload } from "payload";

import type { Lead } from "@/payload-types";

// the owner's own verified Resend address doubles as the notification target
// until a dedicated ownerNotificationEmail field exists on a global
const ownerNotificationEmail = process.env.RESEND_FROM_EMAIL;

type Result<T = void> =
	{ success: true; data: T } | { success: false; error: string; code?: string };

// records a lead and emails both the visitor and the owner. email failures
// never fail the capture — the lead is the durable record that matters.
const captureLead = async (
	payload: Payload,
	data: { firstName: string; email: string },
): Promise<Result<Lead>> => {
	try {
		// overrideAccess: true is the one named exemption that lets an anonymous
		// visitor create a lead through the otherwise staff-gated collection
		const lead = await payload.create({
			collection: "leads",
			data: { firstName: data.firstName, email: data.email },
			overrideAccess: true,
		});

		// acknowledgement to the visitor
		try {
			await payload.sendEmail({
				to: data.email,
				subject: "Your free guide from Way Finding Coaching",
				html: `<p>Hi ${data.firstName},</p><p>Thanks for requesting the guide. Keep an eye on your inbox — it's on its way.</p>`,
			});
		} catch {
			console.error("[services/lead] acknowledgement email failed");
		}

		// notification to the owner so they can follow up personally
		if (ownerNotificationEmail) {
			try {
				await payload.sendEmail({
					to: ownerNotificationEmail,
					subject: "New lead captured",
					html: `<p>A new lead was captured. See the Leads collection to follow up.</p>`,
				});
			} catch {
				console.error("[services/lead] notification email failed");
			}
		}

		return { success: true, data: lead };
	} catch {
		console.error("[services/lead] failed to capture lead");
		return { success: false, error: "Something went wrong — please try again." };
	}
};

export { captureLead };
