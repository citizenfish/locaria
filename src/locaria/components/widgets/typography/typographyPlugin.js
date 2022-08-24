import React from "react";
import ArgsSerialize from "../../../libs/argsSerialize";


export default function TypographyPlugin({index, clickFunction, plugin, params}) {
	const ARGS = new ArgsSerialize();

	return (
		<div contentEditable={false} onClick={(e) => clickFunction(e)} style={{
			border: "1px solid black",
			padding: "5px",
			borderRadius: "5px",
			margin: "10px",
			background: "lightblue"
		}} data-oid={index} data-plugin={plugin} data-params={ARGS.stringify(params)}>{plugin}</div>
	)
}