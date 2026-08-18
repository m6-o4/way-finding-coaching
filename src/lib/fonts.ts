import { Hanken_Grotesk, Libre_Caslon_Text } from "next/font/google";

// brand typography: Libre Caslon Text for headings/display/quotes, Hanken
// Grotesk for body, labels, and UI chrome. configured here once and imported
// by every root layout, which exposes each via its css variable on <html>
const heading = Libre_Caslon_Text({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: "--font-heading",
	display: "swap",
});

const sans = Hanken_Grotesk({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
});

export { heading, sans };
