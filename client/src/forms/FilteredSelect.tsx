
import React, {CSSProperties, useState, useRef, useMemo, useCallback, useReducer, MouseEventHandler, ReactChild} from "react"
import { useArbitraryId } from "src/uuid";
interface FilteredSelectProps {
    options: string[]
    value: string
    onChange: (val: string) => void
	label: ReactChild
    lineHeight?: CSSProperties["height"]
    arrowColor?: CSSProperties["color"]
    background?: CSSProperties["background"]
    color?: CSSProperties["color"]
    modalBackground?: CSSProperties["background"]
}

export function FilteredSelect({
    options,
    value,
    onChange,
    lineHeight,
    arrowColor,
    background,
    color,
    modalBackground,
	label,
}: FilteredSelectProps) {
    const [filter, setFilter] = useState("");
	const id = useArbitraryId();

    const canvas = useRef<HTMLCanvasElement>();
    const input = useRef<HTMLDivElement>();

    const variables = useMemo(() => Object.fromEntries(
        Object.entries(
            {"--line-height": lineHeight, "--arrow-color": arrowColor,
             "--background": background, "--color": color,
             "--modal-background": modalBackground}
        ).filter(([, v]) => v)
    ), [lineHeight, arrowColor, background, color, modalBackground]);

    const textWidth = useCallback(text => (canvas.current?.getContext("2d")?.measureText(text).width ?? 0), []);

    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const filteredOptions = useMemo(() => options.filter(o => o.includes(filter)), [filter, options]);
    const longestOption = useMemo(() => Math.max(50, ...filteredOptions.map(textWidth)), [filteredOptions]);
    
    const expanded = useMemo(() => {
        let currentElem = document.activeElement;
        let expanded = currentElem === input.current;
        
        while(!expanded && currentElem) {
            currentElem = currentElem.parentElement;
            expanded = input.current === currentElem;
        }

        return expanded;
    }, [input.current, document.activeElement]);

    const filterValue = expanded ? filter : value;

    const onSelected: MouseEventHandler<HTMLElement> = useCallback(e => {
        input.current!.focus();
    }, []);

    const selectValue: MouseEventHandler<HTMLElement> = useCallback((val) => {
        onChange(options[parseInt(val.currentTarget.id)]);
        input.current!.blur();
        val.currentTarget.blur();
    }, [onChange, options]);

    return (
		<div className="input-wrapper">
			<label htmlFor={id}>{label}</label>
			<div
				className="autocomplete-container"
				style={{...variables}}
				ref={container => {
					if(container && container !== input.current) {
						input.current = container!;
						forceUpdate();
					}
				}}
			>
				<canvas
					ref={c => {
						if(c && canvas.current !== c) {
							const vals = getComputedStyle(c, null);
							const ctx = c.getContext("2d");
							ctx!.font = `${vals.getPropertyValue("font-style")} ${vals.getPropertyValue("font-size")} ${vals.getPropertyValue("font-family")}`
							canvas.current = c;
							forceUpdate();
						}
					}}
				/>
				<div
					className="value"
					role="combobox"
					aria-autocomplete="list"
					aria-aria-expanded={expanded}
					tabIndex={-1}
					onClick={onSelected}
				>
					<input
						className="input"
						value={filterValue}
						onChange={e => setFilter(e.target.value)}
						onBlur={forceUpdate}
						onFocus={forceUpdate}
						style={{width: Math.ceil(Math.max(15, textWidth(filterValue)) + 6)}}
						id={id}
					/>
					<div className="split" />
					<svg
						viewBox="0 0 100 100"
						className="arrow"
						role="button"
						tabIndex={-1}
					>
						<path
							d={`M 20,20
								l 30,50
								l 30,-50`}
						/>
					</svg>
				</div>
				<div className="options-container">
					<div
						className="options"
						style={{width: longestOption}}
						role="listbox"
					>
						{filteredOptions.map((opt, idx) => (
							<div
								className="option"
								id={`${idx}`}
								key={opt}
								role="option"
								tabIndex={0}
								onClick={selectValue}
							>
								{opt}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
    );
}