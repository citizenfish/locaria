import React, {useEffect, useState} from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AppBar from "@mui/material/AppBar";
import {useSelector} from "react-redux";
import {Fade} from "@mui/material";
import Toolbar from '@mui/material/Toolbar';
import Button from "@mui/material/Button";

/**
 * @param {Object} props
 * @constructor
 */
export default function FooterBackToTop({timeout=2000}) {

	const [show, setShow] = useState(false);
	const innerHeight = useSelector((state) => state.mediaSlice.innerHeight);

	const handleScroll = () => {
		const position = window.pageYOffset;
		if (position > innerHeight) {
			setShow(true);
		} else {
			setShow(false);
		}
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll, {passive: true});

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<Fade in={show} timeout={timeout}>
			<AppBar position="fixed" height={"40px"} color="primary" sx={{width:"200px",top: 'auto', bottom: 0, borderRadius: "10px 0px 0px 0px"}} onClick={() => {
				window.scrollTo(0, 0);
			}}>
				<Toolbar>
					<KeyboardArrowUpIcon/>
					<Button sx={{color: 'white'}}>
						Back to the top
					</Button>
				</Toolbar>
			</AppBar>
		</Fade>
	);

}