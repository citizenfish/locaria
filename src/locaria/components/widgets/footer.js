import React from 'react';

import {configs, pages} from 'themeLocaria';
import {useStyles} from "stylesLocaria";

import {useHistory} from "react-router-dom";
import {openPageDialog} from "../redux/slices/pageDialogSlice";
import {useDispatch} from "react-redux";


const Footer = () => {
	const classes = useStyles();
	const history = useHistory();
	const dispatch = useDispatch();


	return (
		<div className={classes.footer}>
			<div className={classes.footerLogo} style={{backgroundImage: `url(${configs.siteFooter})`}}></div>
			{<ul className={classes.footerList}>
				{window.systemPages.map(function (page) {
					return (
						<li className={classes.footerLi} onClick={()=>{
							if(page.type==="link") {
								window.location=page.link;
							} else {
							dispatch(openPageDialog(page.id));
						}
						}} key={page.id}>
							{page.name}
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
