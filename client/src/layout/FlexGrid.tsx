import React, { CSSProperties, PropsWithChildren, useMemo } from "react";

interface FlexItemProps {
	align?: CSSProperties["alignItems"]
	justify?: CSSProperties["justifyItems"]
	wrap?: CSSProperties["flexWrap"]
}

export interface FlexGrid extends FlexItemProps {
	id?: string
	className?: string
}

export function FlexGrid(props: PropsWithChildren<FlexGrid>) {
	const {children, align, justify = "center", wrap = "wrap", id, className = ""} = props;

	return (
		<div className={`flex ${className}`} style={{alignItems: align, justifyItems: justify, flexWrap: wrap}} id={id}>
			{children}
		</div>
	)
}

export interface FlexCell extends Omit<FlexItemProps, "wrap"> {
	size?: "shrink" | "full" | "auto"
	shrink?: boolean
	full?: boolean
	auto?: boolean
}

function cellSize(shrink?: boolean, full?: boolean, auto?: boolean) {
	return shrink ? "shrink" : full ? "full" : "auto";
}

export function FlexCell(props: PropsWithChildren<FlexCell>) {
	const {children, align, justify, shrink, full, auto, size = cellSize(shrink, full, auto)} = props;

	return (
		<div className={`flex-cell ${size}`} style={{alignSelf: align, justifySelf: justify}}>
			{children}
		</div>
	)
}