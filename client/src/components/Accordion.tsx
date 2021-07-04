import React, {forwardRef, Ref, PropsWithChildren, useReducer, ReactNode} from "react";
import {useArbitraryId} from "src/uuid";

interface AccordionProps {
	label: React.ReactChild
	children: React.ReactNode | React.ReactNodeArray
}

export const Accordion = forwardRef(function Accordion({children, label}: AccordionProps, ref: Ref<HTMLDivElement>) {
	const [open, flipOpen] = useReducer(a => !a, false);
	const id = useArbitraryId();
	const contentId = `${id}-content`;
	const buttonId = `${id}-button`;
	
	return (
		<div className="accordion" ref={ref}>
			<div
				aria-controls={contentId}
				aria-expanded={open}
				onClick={flipOpen}
				tabIndex={0}
				id={buttonId}
				className="button"
			>
				<div className="label">
					{label}
				</div>
				<div className="identifier">
					<svg viewBox="0 0 10 10" width="1em" height="1em" strokeWidth="2" stroke="black" fill="transparent">
						{open ?
							<path d="M 1,1 L 5,7 L 9,1"></path> :
							<path d="M 1,1 L 7,5 L 1,9"></path>
						}
					</svg>
				</div>
			</div>
			<div
				id={contentId}
				className="content"
			>
				{children}
			</div>
		</div>
	)
});