import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type ContainerProps = ComponentProps<"div">;

const Container = ({ children, className, ...props }: ContainerProps) => {
	return (
		<div {...props} className={cn("mx-auto w-full max-w-(--container) px-4 sm:px-6 lg:px-8", className)}>
			{children}
		</div>
	);
};

export { Container };
