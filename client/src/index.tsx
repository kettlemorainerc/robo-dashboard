import React from "react";
import ReactDOM from "react-dom";
import {App} from "./App";
import "./css/index.css"

ReactDOM.render(
	<App />,
	document.getElementById("root")
);

// This isn't currently usable. If you're interested in getting this working, you could look at using Snowpack
// it's a javascript bundler with a built-in dev server that's compatible with the following snippet
// // Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// // Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
// if ((import.meta as any).hot) {
//   (import.meta as any).hot.accept();
// }