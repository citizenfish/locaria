import React from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AppBar from "@mui/material/AppBar";

/**
 * @param {Object} props
 * @constructor
 */
export default function FooterBackToTop({}) {
	return (
		<AppBar position="fixed" color="primary" sx={{top: 'auto', bottom: 0}}>
			<KeyboardArrowUpIcon onClick={() => {
				window.scrollTo(0, 0);
			}}/>
		</AppBar>
	);

}