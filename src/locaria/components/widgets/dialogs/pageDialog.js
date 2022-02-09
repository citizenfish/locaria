import React, {useRef} from 'react';

import {pages} from 'themeLocaria';
import {useStyles} from "stylesLocaria";

import Dialog from '@mui/material/Dialog';

import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {closePageDialog} from "../../redux/slices/pageDialogSlice";
import Slide from "@mui/material/Slide";
import {closeViewDraw} from "../../redux/slices/viewDrawSlice";
import {closeMultiSelect} from "../../redux/slices/multiSelectSlice";
import Button from "@mui/material/Button";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const PageDialog = () => {
	const classes = useStyles();
	const dispatch = useDispatch()

	const open = useSelector((state) => state.pageDialog.open);
	const page = useSelector((state) => state.pageDialog.page);
	const [pageData, setPageData] = React.useState([]);

	const isInitialMount = useRef(true);

	React.useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			setPageData(pages.getPageData(page));

		}
	}, [page]);

	return (
		<Dialog
			open={open}
			TransitionComponent={Transition}
			keepMounted
			maxWidth="md"
			fullWidth={true}
			onClose={()=>{dispatch(closePageDialog())}}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
			className={classes.pageDialog}
		>
				{pageData}

			<Button onClick={()=>{dispatch(closePageDialog())}} color="secondary" variant="outlined">
				Dismiss
			</Button>
		</Dialog>

	);
};


export default PageDialog;