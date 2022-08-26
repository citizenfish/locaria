import React from "react";
import {Link} from "@mui/material";
import UrlCoder from "../../../libs/urlCoder";
import {useHistory} from "react-router-dom";

export default function TypographyLink({children,sx,link}) {
	const url = new UrlCoder();
	const history = useHistory();

	const localSx={
		fontSize: "0.8rem",
		fontWeight: 600,
		paddingTop: "2px",
		paddingBottom: "2px",
		fontFamily: window.systemMain['fontLinkFont'],
		color: window.systemMain['fontLink'],
		cursor: "pointer",
		textDecorationColor:window.systemMain['fontLink']
	};

	let elementSx={...localSx,...sx||{}};
	const actualUrl=url.decode(link,true);
	// Commented because this was cusing issues with relative links...history should match local oaths some how
	/*let match=actualUrl.match(/^\//);
	if(match)
	return (
		<Link sx={elementSx}  onClick={()=>{
				history.push(actualUrl);
		}}>{children}</Link>
	)*/
	return (<Link sx={elementSx}
				  href={actualUrl}>
					{children}
			</Link>)
}