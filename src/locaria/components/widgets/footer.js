import React, {useRef} from 'react';

import { configs,pages} from 'themeLocaria';
import {useStyles} from "stylesLocaria";

import {useHistory} from "react-router-dom";


const Footer = () => {
	const classes = useStyles();
	const history = useHistory();

	return (
		<div className={classes.footer}>
			<div className={classes.footerLogo} style={{backgroundImage: `url(${configs.siteFooter})`}}></div>
			{/*<ul>
				{pages.listPages().map(function (page) {
					return (
						<li className={classes.footerLi} onClick={()=>{
							if(page.type==="link") {
								window.location=page.link;
							} else {
								history.push(`/Page/${page.id}`);
							}
						}} key={page.id}>
							{page.title}
						</li>
					)
				})}
			</ul>*/}
			<p className={classes.footerBy}>Powered by <a href={"https://github.com/nautoguide/locaria"}>Locaria</a></p>
		</div>
	)
}

export {Footer}
