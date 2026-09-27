import { PostHogIdentify } from "@/components/providers/posthog-identify";

import { SignIn } from "@clerk/nextjs";

const Page = () => (
	<>
		<SignIn />
		<PostHogIdentify />
	</>
);

export { Page as default };
