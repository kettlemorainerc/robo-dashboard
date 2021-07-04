import React from "react";
import {useMemo} from "react";

export interface LoadingIconProps extends Omit<React.SVGProps<SVGSVGElement>, "viewBox"> {
	
}

const empty = {};

export function LoadingIcon(props: LoadingIconProps) {
	const defaultStyle = {maxHeight: "100%", maxWidth: "100%", display: "block", padding: "0 .25rem"};

	const {style = empty, ...nativeProps} = props;

	// prevent unecessary object merging
	const actualStyle = useMemo(() => ({...defaultStyle, ...style}), [style]);

	return (
		<svg
			width='100%'
			height='100%'
			{...nativeProps} // putting it here so they CAN'T override viewBox or style, but can for anything else
			style={actualStyle}
			viewBox='0 0 100 100'
		>
			<path
				d='M 50 10 a 40 40 0 1 0 0,80'
				fill='transparent'
				strokeWidth='7'
			>
				<animateTransform
					attributeName='transform'
					attributeType='XML'
					dur='1s'
					from='0 50 50'
					repeatCount='indefinite'
					to='360 50 50'
					type='rotate'
				/>
				<animate
					attributeName='stroke'
					attributeType='XML'
					dur='6'
					repeatCount='indefinite'
					values='#228;#288;#228'
				/>
			</path>
			<path
				d='M 50 20 a 30 30 0 1 0 0,60'
				fill='transparent'
				strokeWidth='7'
			>
				<animateTransform
					attributeName='transform'
					attributeType='XML'
					dur='1.5s'
					from='0 50 50'
					repeatCount='indefinite'
					to='360 50 50'
					type='rotate'
				/>
				<animate
					attributeName='stroke'
					attributeType='XML'
					dur='6'
					repeatCount='indefinite'
					values='#228;#288;#228'
				/>
			</path>
			<path d='M 50 30 a 20 20 0 1 0 0,40'>
				<animateTransform
					attributeName='transform'
					attributeType='XML'
					dur='3s'
					from='0 50 50'
					repeatCount='indefinite'
					to='360 50 50'
					type='rotate'
				/>
				<animate
					attributeName='fill'
					attributeType='XML'
					dur='6'
					repeatCount='indefinite'
					values='#228;#288;#228'
				/>
			</path>
		</svg>
	)
}