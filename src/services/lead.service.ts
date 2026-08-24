import { format } from "date-fns";
import type { Payload } from "payload";
import { getMediaUrl } from "@/payload/utilities/get-media-url";
import type { Lead, Media } from "@/payload-types";

// retrieve values from the environment variables
const mediaId = process.env.GUIDE_MEDIA_ID!;
const notificationEmail = process.env.NOTIFICATION_EMAIL!;

// media document ID of the guide PDF, set per environment so it can
// change without a code deploy. Find it in the admin Media collection
// list or the document's URL (/admin/collections/media/<id>).
const GUIDE_MEDIA_ID = mediaId;
const NOTIFICATION_EMAIL = notificationEmail;

type CaptureLeadInput = { firstName: string; email: string };
type CaptureLeadResult =
	{ success: true; data: Lead } | { success: false; error: string };

// creates the lead record and sends both the download link and the
// internal notification email. Called from the submitLead server action.
// the guide PDF is fixed, referenced by GUIDE_MEDIA_ID above
const captureLead = async (
	payload: Payload,
	{ firstName, email }: CaptureLeadInput,
): Promise<CaptureLeadResult> => {
	if (!GUIDE_MEDIA_ID) {
		return {
			success: false,
			error: "The guide is not configured. Please contact the site owner.",
		};
	}

	const guide = (await payload.findByID({
		collection: "media",
		id: GUIDE_MEDIA_ID,
	})) as Media | null;

	if (!guide?.url) {
		return { success: false, error: "The guide file could not be found." };
	}

	const downloadUrl = getMediaUrl(guide.url);

	const lead = await payload.create({
		collection: "leads",
		data: { firstName, email, guide: GUIDE_MEDIA_ID },
	});

	await payload.sendEmail({
		to: email,
		subject: "Your Way Finding Guide",
		html: `
			<div style="font-family: sans-serif; max-width: 480px;">
				<h2 style="margin-bottom: 4px;">Welcome to the path, ${firstName}</h2>
				<p style="color: #666; margin-top: 0;">
					We were never meant to walk this road alone, and neither is finding your way back to yourself.
					Here is your copy of The Compass of Connection, 30 prompts rooted in the philosophies of
					Ubuntu and Utu.
				</p>
				<p style="margin: 24px 0;">
					<a href="${downloadUrl}" style="background: #6b3529; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
						Download Your Guide
					</a>
				</p>
				<p style="color: #666;">
					Start wherever resonates most, "Wading In" for gentle reflection, or "Diving Deep" if you're
					ready to sit with something harder. Grab a pen and paper, and give yourself permission to pause.
				</p>
				<p style="margin-top: 16px; color: #666;">
					If something you write stirs up a truth that feels too big to hold alone, that's exactly
					what a discovery call is for.
					<a href="https://www.way-finding.co.ke" style="color: #6b3529;">Schedule one here</a>.
				</p>
				<p style="margin-top: 24px; font-size: 13px; color: #999;">
					Warmly,<br>Michelle, Way Finding Coaching
				</p>
			</div>
		`,
	});

	const submittedAt = format(new Date(), "d MMM yyyy, h:mm a");

	await payload.sendEmail({
		to: NOTIFICATION_EMAIL,
		subject: "New guide download",
		html: `
			<div style="font-family: sans-serif; max-width: 480px;">
				<h2 style="margin-bottom: 4px;">New Guide Download</h2>
				<p style="color: #666; margin-top: 0;">A visitor just requested the Compass of Connection guide.</p>
				<table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
					<tr>
						<td style="padding: 6px 0; font-weight: bold; width: 100px;">Name</td>
						<td style="padding: 6px 0;">${firstName}</td>
					</tr>
					<tr>
						<td style="padding: 6px 0; font-weight: bold;">Email</td>
						<td style="padding: 6px 0;"><a href="mailto:${email}">${email}</a></td>
					</tr>
					<tr>
						<td style="padding: 6px 0; font-weight: bold;">Submitted</td>
						<td style="padding: 6px 0;">${submittedAt}</td>
					</tr>
				</table>
				<p style="margin-top: 20px; font-size: 13px; color: #999;">
					This lead has been saved to your Leads collection in the admin panel.
				</p>
			</div>
		`,
	});

	return { success: true, data: lead };
};

export { captureLead };
