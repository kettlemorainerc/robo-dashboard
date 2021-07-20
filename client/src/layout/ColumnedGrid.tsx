import React, { CSSProperties, PropsWithChildren, useMemo } from "react";
import { useArbitraryId } from "src/uuid";
import { FlexGrid } from "./FlexGrid";

function ColumnedGridCss({id, columns}: {id: string, columns: number}) {
    const css = useMemo(() => {
        const cols = Math.floor(columns);
        let ret = "";
        const percentInterval = (100 / cols);
        for(let i = 1; i <= cols; i++) {
            ret += `#${id} > .cols-${i} {
    flex: 0 0 calc(${(percentInterval * i).toFixed(4)}% - calc(var(--cg-mar-horizontal, 0px) + var(--cg-pad-horizontal, 0px)));
    margin: var(--ch-mar-vertical, 0px) var(--ch-mar-horizontal, 0px);
    padding: var(--ch-pad-vertical, 0px) var(--ch-pad-horizontal, 0px);
}
`;
        }

        return ret;
    }, [columns]);

    return (
        <style>
            {css}
        </style>
    );
}

interface ColumnedGridProps extends FlexGrid {
    columns: number
    margin?: {
        horizontal?: CSSProperties["margin"]
        vertical?: CSSProperties["margin"]
    }
    padding?: {
        horizontal?: CSSProperties["padding"]
        vertical?: CSSProperties["padding"]
    }
}

export function ColumnedGrid(props: PropsWithChildren<ColumnedGridProps>) {
    const {margin, padding, className = "", ...rest} = props;
    const id = useArbitraryId(props.id);

    const vars = useMemo(() => {
        const vars: any = {};

        if(margin?.horizontal) vars["--cg-mar-horizontal"] = typeof margin.horizontal === "number" ? `${margin.horizontal}px` : margin.horizontal
        if(margin?.vertical) vars["--cg-mar-vertical"] = typeof margin.vertical === "number" ? `${margin.vertical}px` : margin.vertical
        if(padding?.horizontal) vars["--cg-pad-horizontal"] = typeof padding.horizontal === "number" ? `${padding.horizontal}px` : padding.horizontal
        if(padding?.vertical) vars["--cg-pad-vertical"] = typeof padding.vertical === "number" ? `${padding.vertical}px` : padding.vertical

    }, [margin?.horizontal, margin?.vertical, padding?.vertical, padding?.horizontal]);

    return (
        <>
            <ColumnedGridCss id={id} columns={props.columns} />
            <FlexGrid className={`columned-grid ${className}`} {...rest} id={id} />
        </>
    )
}

interface ColumnedCellProps extends Pick<ColumnedGridProps, "columns"> {

}

export function ColumnedCell(props: PropsWithChildren<ColumnedCellProps>) {
    return (
        <div className={`columned-cell .cols-${props.columns}`}>
            {props.children}
        </div>
    )
}