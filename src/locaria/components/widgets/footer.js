import React from 'react';

import {configs, pages} from 'themeLocaria';
import {useStyles} from "stylesLocaria";

import {useHistory} from "react-router-dom";


const Footer = () => {
	const classes = useStyles();
	const history = useHistory();

	return (
		<div className={classes.footer}>
			<div className={classes.footerLogo} style={{backgroundImage: `url(${configs.siteFooter})`}}></div>
			{<ul className={classes.footerList}>
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
			</ul>}
			<p className={classes.footerBy}>
				<a href={configs.copyrightLink}>{configs.copyrightCompany}</a>
				&nbsp;|&nbsp;
				<a href={configs.poweredByLink}>{configs.poweredByText}</a>
				&nbsp;|&nbsp;
				<a href={configs.licensedLink}>{configs.licensedText}</a>
			</p>
		</div>
	)
}

export {Footer}
