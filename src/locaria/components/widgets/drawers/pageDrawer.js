import React, {useRef} from 'react';

import {pages} from 'themeLocaria';
import {useStyles} from "stylesLocaria";


import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {closePageDialog} from "../../redux/slices/pageDialogSlice";
import Slide from "@mui/material/Slide";
import {closeViewDraw} from "../../redux/slices/viewDrawerSlice";
import {closeMultiSelect} from "../../redux/slices/multiSelectSlice";
import Button from "@mui/material/Button";
import {Drawer} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {openSearchDrawer} from "../../redux/slices/searchDrawerSlice";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const PageDrawer = () => {
	const classes = useStyles();
	const dispatch = useDispatch()
	const history = useHistory();

	const open = useSelector((state) => state.pageDialog.open);
	const page = useSelector((state) => state.pageDialog.page);
	const [pageData, setPageData] = React.useState(undefined);

	const isInitialMount = useRef(true);

	React.useEffect(() => {
			if(page) {
				setPageData(pages.getPage(page));
			}
	}, [page]);

	React.useEffect(() => {
		if(open)
			history.push(`/Page/${page}`);

	},[open]);

	if(pageData) {
		return (
			<Drawer
				anchor="bottom"
				open={open}
				className={classes.pageDraw}
				variant="persistent"
			>
				<div className={classes.searchDrawHeader}>
					<Typography className={classes.viewDrawTitle} variant={'h5'}>{pageData.options.title}</Typography>
					<IconButton onClick={() => {
						dispatch(closePageDialog());
					}} className={classes.viewDrawClose} type="submit"
					            aria-label="search">
						<CloseIcon className={classes.icons}/>
					</IconButton>
				</div>
				{pageData.data}
			</Drawer>

		)
	} else {
		return <></>
	}
};


export default PageDrawer;