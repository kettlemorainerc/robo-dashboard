import { CSSProperties } from "react";

type Listener<args extends any[]> = (...args: args) => void;
type ConnectionListener = Listener<[boolean]>;
type NetworkTableListener = Listener<[string, any, boolean]>;

namespace globalThis {
	interface NetworkTable {
		/**
		 * @param listener A function to run whenever we (dis)connect to the bot
		 * @param immediate Should this immediately be invoked with the current status
		 */
		addRobotConnectionListener(listener: (connected: boolean) => void, immediate?: boolean): void
		removeRobotConnectionListener(listener: (connected: boolean) => void): boolean;
		/**
		 * @param listener A listener for ANY network table key updates
		 * @param immediate Should this be invoked immediately for every known key
		 */
		addGlobalListener(listener: NetworkTableListener, immediate?: boolean): void
		removeGlobalListener(listener: NetworkTableListener): boolean
		/**
		 * 
		 * @param key a network table key
		 * @param callback a function that processes a key/result/isnew evertime a key is updated externally
		 * @param immediate should the callback be invoked IMMEDIATELY with the current status of the {@link key}
		 */
		addKeyListener(key: string, callback: NetworkTableListener, immediate?: boolean): void
		removeKeyListener(key: string, callback: NetworkTableListener): boolean
		/**
		 * Is this a known network table key
		 * @param key a network table key
		 */
		containsKey(key: string): boolean
		/**
		 * Get known network table keys
		 */
		getKeys(): string[]
		/**
		 * 
		 * @param key a network table key
		 * @param defaultValue if the given {@link key} isn't present return this value
		 */
		getValue<T>(key: string, defaultValue: T): T
		getRobotAddress(): string | null
		isRobotConnected(): boolean
		/**
		 * Attempts to set the value in NetworkTables
		 * @param key a network table key
		 * @param value the value to put
		 * @returns false if there's no connection to the target network tables
		 */
		putValue(key: string, value: any): boolean
		/**
		 * Transforms a netowkr table key into a valid HTML identifier
		 * @param str a network table key
		 */
		keyToId(key: string): string
	}
	var NetworkTable: NetworkTable;
}

module "react-plotly.js" {
	interface SharedTraceProps {

	}

	type ScatterMode = "lines" | "markers" | "text" | "lines+markers" | "markers+text" | "lines+markers+text" | "none"
	type fontDef = {family?: CSSProperties["fontFamily"], size?: number, color?: CSSProperties["color"]};

	interface ScatterPlotProps extends SharedTraceProps {
		type: "scatter"
		name?: string
		visible?: boolean
		showlegend?: boolean
		legendrank?: boolean
		legendgroup?: boolean
		legendgrouptitle?: {
			text?: string
			font?: fontDef
		}
		opacity?: number
		mode?: ScatterMode,
		ids?: string[]
		x?: string[] | number[]
		x0?: number | string,
		dx?: number
		y?: string[] | number[]
		y0?: number | string
		dy?: number
		text?: string[] | string
		textposition?: "top left" | "top center" | "top right" | "middle left" | "middle center" | "middle right" | "bottom left" | "bottom center" | "bottom right"
		texttemplate?: string
		hovertext?: string
		hoverinfo?: string
		/**
		 * Template string used for rendering the information that appear on hover box. Note that this will override `hoverinfo`. Variables are inserted using %{variable}, for example "y: %{y}" as well as %{xother}, {%_xother}, {%_xother_}, {%xother_}. When showing info for several points, "xother" will be added to those with different x positions from the first point. An underscore before or after "(x|y)other" will add a space on that side, only when this field is shown. Numbers are formatted using d3-format's syntax %{variable:d3-format}, for example "Price: %{y:$.2f}". https://github.com/d3/d3-3.x-api-reference/blob/master/Formatting.md#d3_format for details on the formatting syntax. Dates are formatted using d3-time-format's syntax %{variable|d3-time-format}, for example "Day: %{2019-01-01|%A}". https://github.com/d3/d3-time-format#locale_format for details on the date formatting syntax. The variables available in `hovertemplate` are the ones emitted as event data described at this link https://plotly.com/javascript/plotlyjs-events/#event-data. Additionally, every attributes that can be specified per-point (the ones that are `arrayOk: true`) are available. Anything contained in tag `<extra>` is displayed in the secondary box, for example "<extra>{fullData.name}</extra>". To hide the secondary box completely, use an empty tag `<extra></extra>`.
		 */
		hovertemplate?: string
		xhoverformat?: string
		yhoverformat?: string
		meta?: string | number
		customdata?: string[] | number[]
		/**
		 * Sets a reference between this trace's x coordinates and a 2D cartesian x axis. If "x" (the default value), the x coordinates refer to `layout.xaxis`. If "x2", the x coordinates refer to `layout.xaxis2`, and so on.
		 */
		xaxis?: string
		/**
		 * Sets a reference between this trace's y coordinates and a 2D cartesian y axis. If "y" (the default value), the y coordinates refer to `layout.yaxis`. If "y2", the y coordinates refer to `layout.yaxis2`, and so on.
		 */
		yaxis?: string
		orientation?: "v" | "h"
		groupnorm?: "" | "fraction" | "percent"
		stackgroup?: string
		/**
		 * Only relevant when the axis `type` is "date". Sets the period positioning in milliseconds or "M<n>" on the x axis. Special values in the form of "M<n>" could be used to declare the number of months. In this case `n` must be a positive integer.
		 */
		xperiod?: string | number
		xperiodalignment?: "start" | "middle" | "end"
		xperiod0?: string | number
		yperiod?: string | number
		yperiodalignment?: "start" | "middle" | "end"
		yperiod0?: string | number
		marker?: {
			symbol?: "0" | "0" | "circle" | "100" | "100" | "circle-open" | "200" | "200" | "circle-dot" | "300" | "300" | "circle-open-dot" | "1" | "1" | "square" | "101" | "101" | "square-open" | "201" | "201" | "square-dot" | "301" | "301" | "square-open-dot" | "2" | "2" | "diamond" | "102" | "102" | "diamond-open" | "202" | "202" | "diamond-dot" | "302" | "302" | "diamond-open-dot" | "3" | "3" | "cross" | "103" | "103" | "cross-open" | "203" | "203" | "cross-dot" | "303" | "303" | "cross-open-dot" | "4" | "4" | "x" | "104" | "104" | "x-open" | "204" | "204" | "x-dot" | "304" | "304" | "x-open-dot" | "5" | "5" | "triangle-up" | "105" | "105" | "triangle-up-open" | "205" | "205" | "triangle-up-dot" | "305" | "305" | "triangle-up-open-dot" | "6" | "6" | "triangle-down" | "106" | "106" | "triangle-down-open" | "206" | "206" | "triangle-down-dot" | "306" | "306" | "triangle-down-open-dot" | "7" | "7" | "triangle-left" | "107" | "107" | "triangle-left-open" | "207" | "207" | "triangle-left-dot" | "307" | "307" | "triangle-left-open-dot" | "8" | "8" | "triangle-right" | "108" | "108" | "triangle-right-open" | "208" | "208" | "triangle-right-dot" | "308" | "308" | "triangle-right-open-dot" | "9" | "9" | "triangle-ne" | "109" | "109" | "triangle-ne-open" | "209" | "209" | "triangle-ne-dot" | "309" | "309" | "triangle-ne-open-dot" | "10" | "10" | "triangle-se" | "110" | "110" | "triangle-se-open" | "210" | "210" | "triangle-se-dot" | "310" | "310" | "triangle-se-open-dot" | "11" | "11" | "triangle-sw" | "111" | "111" | "triangle-sw-open" | "211" | "211" | "triangle-sw-dot" | "311" | "311" | "triangle-sw-open-dot" | "12" | "12" | "triangle-nw" | "112" | "112" | "triangle-nw-open" | "212" | "212" | "triangle-nw-dot" | "312" | "312" | "triangle-nw-open-dot" | "13" | "13" | "pentagon" | "113" | "113" | "pentagon-open" | "213" | "213" | "pentagon-dot" | "313" | "313" | "pentagon-open-dot" | "14" | "14" | "hexagon" | "114" | "114" | "hexagon-open" | "214" | "214" | "hexagon-dot" | "314" | "314" | "hexagon-open-dot" | "15" | "15" | "hexagon2" | "115" | "115" | "hexagon2-open" | "215" | "215" | "hexagon2-dot" | "315" | "315" | "hexagon2-open-dot" | "16" | "16" | "octagon" | "116" | "116" | "octagon-open" | "216" | "216" | "octagon-dot" | "316" | "316" | "octagon-open-dot" | "17" | "17" | "star" | "117" | "117" | "star-open" | "217" | "217" | "star-dot" | "317" | "317" | "star-open-dot" | "18" | "18" | "hexagram" | "118" | "118" | "hexagram-open" | "218" | "218" | "hexagram-dot" | "318" | "318" | "hexagram-open-dot" | "19" | "19" | "star-triangle-up" | "119" | "119" | "star-triangle-up-open" | "219" | "219" | "star-triangle-up-dot" | "319" | "319" | "star-triangle-up-open-dot" | "20" | "20" | "star-triangle-down" | "120" | "120" | "star-triangle-down-open" | "220" | "220" | "star-triangle-down-dot" | "320" | "320" | "star-triangle-down-open-dot" | "21" | "21" | "star-square" | "121" | "121" | "star-square-open" | "221" | "221" | "star-square-dot" | "321" | "321" | "star-square-open-dot" | "22" | "22" | "star-diamond" | "122" | "122" | "star-diamond-open" | "222" | "222" | "star-diamond-dot" | "322" | "322" | "star-diamond-open-dot" | "23" | "23" | "diamond-tall" | "123" | "123" | "diamond-tall-open" | "223" | "223" | "diamond-tall-dot" | "323" | "323" | "diamond-tall-open-dot" | "24" | "24" | "diamond-wide" | "124" | "124" | "diamond-wide-open" | "224" | "224" | "diamond-wide-dot" | "324" | "324" | "diamond-wide-open-dot" | "25" | "25" | "hourglass" | "125" | "125" | "hourglass-open" | "26" | "26" | "bowtie" | "126" | "126" | "bowtie-open" | "27" | "27" | "circle-cross" | "127" | "127" | "circle-cross-open" | "28" | "28" | "circle-x" | "128" | "128" | "circle-x-open" | "29" | "29" | "square-cross" | "129" | "129" | "square-cross-open" | "30" | "30" | "square-x" | "130" | "130" | "square-x-open" | "31" | "31" | "diamond-cross" | "131" | "131" | "diamond-cross-open" | "32" | "32" | "diamond-x" | "132" | "132" | "diamond-x-open" | "33" | "33" | "cross-thin" | "133" | "133" | "cross-thin-open" | "34" | "34" | "x-thin" | "134" | "134" | "x-thin-open" | "35" | "35" | "asterisk" | "135" | "135" | "asterisk-open" | "36" | "36" | "hash" | "136" | "136" | "hash-open" | "236" | "236" | "hash-dot" | "336" | "336" | "hash-open-dot" | "37" | "37" | "y-up" | "137" | "137" | "y-up-open" | "38" | "38" | "y-down" | "138" | "138" | "y-down-open" | "39" | "39" | "y-left" | "139" | "139" | "y-left-open" | "40" | "40" | "y-right" | "140" | "140" | "y-right-open" | "41" | "41" | "line-ew" | "141" | "141" | "line-ew-open" | "42" | "42" | "line-ns" | "142" | "142" | "line-ns-open" | "43" | "43" | "line-ne" | "143" | "143" | "line-ne-open" | "44" | "44" | "line-nw" | "144" | "144" | "line-nw-open" | "45" | "45" | "arrow-up" | "145" | "145" | "arrow-up-open" | "46" | "46" | "arrow-down" | "146" | "146" | "arrow-down-open" | "47" | "47" | "arrow-left" | "147" | "147" | "arrow-left-open" | "48" | "48" | "arrow-right" | "148" | "148" | "arrow-right-open" | "49" | "49" | "arrow-bar-up" | "149" | "149" | "arrow-bar-up-open" | "50" | "50" | "arrow-bar-down" | "150" | "150" | "arrow-bar-down-open" | "51" | "51" | "arrow-bar-left" | "151" | "151" | "arrow-bar-left-open" | "52" | "52" | "arrow-bar-right" | "152" | "152" | "arrow-bar-right-open"
			opacity?: number | number[]
			size?: number
			maxdisplayed?: number
			sizeref?: number
			sizemin?: number
			sizemode?: "diameter" | "area"
			line?: {
				width?: number | number[]
				color?: CSSProperties["color"] | CSSProperties["color"][]
				cauto?: boolean
				cmin?: number
				cmax?: number
				cmid?: number
			}
		}
		line?: {
			color?: CSSProperties["color"]
			width?: number
			shape?: "linear" | "spline" | "hv" | "vh" | "hvh" | "vhv"
			smoothing?: number
			dash?: "solid"| "dot" | "dash" | "longdash" | "dashdot" | "longdashdot"
			simplify?: boolean
		}
		textfont?: fontDef
		error_x?: {
			visible?: boolean
			type?: "percent" | "constant" | "sqrt" | "data"
			symmetric?: boolean
			array?: number[] | string[]
			arrayminus?: number[]
			value?: number
			valueminus?: number
			traceref?: number
			copy_ystyle?: boolean
			color?: CSSProperties["color"]
			thickness?: number
			width?: number
		},
		error_y?: {
			visible?: boolean
			type?: "percent" | "constant" | "sqrt" | "data"
			symmetric?: boolean
			array?: number[] | string[]
			arrayminus?: number[]
			value?: number
			valueminus?: number
			traceref?: number
			copy_ystyle?: boolean
			color?: CSSProperties["color"]
			thickness?: number
			width?: number
		}
	}

	interface Font {
		family?: CSSProperties["fontFamily"]
		size?: number
		color: CSSProperties["color"]
	}

	interface Spacing {
		t?: number
		b?: number
		r?: number
		l?: number
	}

	/**
	 * https://plotly.com/javascript/reference/layout
	 */
	interface Layout {
		title?: {
			text?: string
			font?: Font
			xref?: "container" | "paper"
			yref?: "container" | "paper"
			/**
			 * number between 0-1
			 */
			x?: number | "left" | "right" | "auto"
			y?: number | "left" | "right" | "auto"
			xanchor?: "left" | "right" | "center" | "auto"
			yanchor?: "auto" | "top" | "middle" | "bottom"
			pad?: Spacing
			showlegend?: boolean
			legend?: {
				bgcolor?: CSSProperties["backgroundColor"]
				bordercolor?: CSSProperties["borderColor"]
				borderWidth?: number
				font?: Font
				orientation?: "v" | "h"
				traceorder?: "reversed" | "grouped" | "reversed+grouped" | "normal"
				tracegroupgap?: number
				itemsizing?: "trace" | "constant"
				itemwidth?: number
				itemclick?: "toggle" | "toggleothers" | false
				itemdoubleclick?: "toggle" | "toggleothers" | false
				x?: number
				xanchor?: "auto" | "left" | "center" | "right"
				y?: number
				yanchor?: "auto" | "top" | "middle" | "bottom"
				uirevision?: number | string
				valign?: "top" | "middle" | "bottom"
				title?: {
					text?: string
					font?: Font
					side?: "top" | "left" | "top left"
				}
				margin?: Spacing & {
					pad?: number
					autoexpand?: boolean
				}
			}
		}
		autosize?: boolean
		width?: number
		height?: number
		font?: Font
		uniformtext?: {
			mode?: false | "hide" | "show"
			minsize?: number
		}
		separators?: string
		paper_bgcolor?: CSSProperties["color"]
		plot_bgcolor?: CSSProperties["color"]
		autotypenumbers?: "convert types" | "strict"
		colorscale?: {
			sequential?: [number, CSSProperties["color"]][]
			sequentialminus?: [number, CSSProperties["color"]][]
			diverging?: [number, CSSProperties["color"]][]
		}
		colorway?: CSSProperties["color"][]
		modebar?: {
			orientation?: "v" | "h"
			bgcolor?: CSSProperties["color"]
			color?: CSSProperties["color"]
			activecolor?: CSSProperties["color"]
			uirevision?: number | string
			add?: string | string[]
			remove?: string | string[]
		}
		hovermode?: "x" | "y" | "closest" | false | "x unified" | "y unified"
		clickmode?: "event" | "select" | "event+select" | "none"
		dragmode?: false | DragMode | `${DragMode}${"" | `+${DragMode}`}${"" | `+${DragMode}`}${"" | `+${DragMode}`}${"" | `+${DragMode}`}${"" | `+${DragMode}`}${"" | `+${DragMode}`}${"" | `+${DragMode}`}${"" | `+${DragMode}`}${"" | `+${DragMode}`}${"" | `+${DragMode}`}`
		selectdirection?: "h" | "v" | "d" | "any"
		hoverdistance?: number
		spikedistance?: number
		hoverlabel?: {
			bgcolor: CSSProperties["color"]
			bordercolor?: CSSProperties["color"]
			font?: Font
			align?: "left" | "right" | "auto"
			namelength?: number
		}
		transition?: {
			duration?: number
			easing?: "linear" | "quad" | "cubic" | "sin" | "exp" | "circle" | "elastic" | "back" | "bounce" | "linear-in" | "quad-in" | "cubic-in" | "sin-in" | "exp-in" | "circle-in" | "elastic-in" | "back-in" | "bounce-in" | "linear-out" | "quad-out" | "cubic-out" | "sin-out" | "exp-out" | "circle-out" | "elastic-out" | "back-out" | "bounce-out" | "linear-in-out" | "quad-in-out" | "cubic-in-out" | "sin-in-out" | "exp-in-out" | "circle-in-out" | "elastic-in-out" | "back-in-out" | "bounce-in-out"
			ordering?: "layout first" | "traces first"
		}
		datarevision?: number | string
		uirevision?: number | string
		editrevision?: number | string
		selectionrevision?: number | string
		template?: number | string
		meta?: number | string
		computed?: number | string
		grid?: {
			rows?: number
			roworder?: "top to bottom" | "bottom to top"
			columns?: number
			subplots?: `x${number | ""}y${number | ""}`[]
			xaxes?: `x${number | ""}`[]
			yaxes?: `y${number | ""}`[]
			pattern?: "independant" | "coupled"
			xgap?: number
			ygap?: number
			domain?: {
				x?: [number, number]
				y?: [number, number]
			}
			xside?: "bottom" | "bottom plot" | "right plot" | "right"
			yside?: "left" | "left plot" | "right plot" | "right"
		}
		calendar?: "gregorian" | "chinese" | "coptic" | "discworld" | "ethiopian" | "hebrew" | "islamic" | "julian" | "mayan" | "nanakshahi" | "nepali" | "persian" | "jalali" | "taiwan" | "thai" | "ummalqura"
		newshape?: {
			line?: {
				color?: CSSProperties["color"]
				width?: number
				dash?: "solid" | "dot" | "dash" | "longdash" | "dashdot" | "longdashdot"
			}
			fillcolor?: CSSProperties["color"]
			fillrule?: "evenodd" | "nonzero"
			opacity?: number
			layer?: "below" | "above"
			drawdirection?: "ortho" | "horizontal" | "vertical" | "diagonal"
		}
		activeshape?: {
			fillcolor?: CSSProperties["color"]
			opacity?: number
		}
		hidesources?: boolean
		barmode?: "stack" | "group" | "overlay" | "relative"
		barnorm?: "" | "fraction" | "percent"
		bargap?: number
		bargroupgap?: number
		hiddenlabels?: any[]
		piecolorway?: CSSProperties["color"][]
		extendpiecolors?: boolean
		boxmode?: "group" | "overlay"
		boxgap?: number
		boxgroupgap?: number
		violinmode?: "group" | "overlay"
		violingap?: number
		barmode?: "stack" | "group" | "overlay" | "relative"
		barnorm?: "" | "fraction" | "percent"
		bargap?: number
		bargroupgap?: number
		boxmode?: "group" | "overlay"
		boxgap?: number
		boxgroupgap?: number
		waterfallmode?: "group" | "overlay"
		waterfallgap?: number
		waterfallgroupgap?: number
	}

	type DragMode = "zoom" | "pan" | "select" | "lasso" | "drawclosedpath" | "drawopenpath" | "drawline" | "drawrect" | "drawcircle" | "orbit" | "turntable";

	interface PlotProps {
		data: ScatterPlotProps[]
		layout: Layout
	}

	export default function Plot(props: PlotProps): JSX.Element;
}