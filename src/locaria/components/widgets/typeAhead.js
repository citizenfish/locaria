import React from "react";
import {ListItemText, List, ListItem, Popover, ListItemIcon} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {closeTypeAhead} from "../redux/slices/typeAheadSlice";
import {useStyles} from "stylesLocaria";
import {openSearchDrawer} from "../redux/slices/searchDrawerSlice";
import AdjustIcon from '@mui/icons-material/Adjust';

function TypeAhead({anchorId}) {

	const dispatch = useDispatch()
	const classes = useStyles();

	const [anchorEl, setAnchorEl] = React.useState(null);

	const open = useSelector((state) => state.typeAhead.open);
	const results = useSelector((state) => state.typeAhead.results);

	React.useEffect(() => {
		const element=document.getElementById(anchorId);
		setAnchorEl(element);
	}, [open]);

	function handleClose() {
		dispatch(closeTypeAhead());
	}


	function MakeSubs({item}) {
		let subs = [];

		item.jsonb_agg.map((item2, index2) => {
				subs.push(
					<ListItem key={index2} onClick={() => {
						dispatch(closeTypeAhead());
						dispatch(openSearchDrawer({categories: (item.category!=='Location')? [item.category]:[], search: item2.text}));
					}}>
						<ListItemIcon>
							<AdjustIcon />
						</ListItemIcon>
						<ListItemText primary={item2.text}/>
					</ListItem>);

			}
		)
		return subs;
	}

	return (
		<Popover
			id={'typeAheadPopover'}
			open={open}
			onClose={handleClose}
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			className={classes.typeAheadPopover}
			disableAutoFocus={true}
			disableEnforceFocus={true}
		>
			<List className={classes.list}>
				{results.map((item, index) => (
					<>
						<ListItem key={index} onClick={() => {
							dispatch(closeTypeAhead());
							dispatch(openSearchDrawer({
								categories: (item.category!=='Location')? [item.category]:[],
								search: document.getElementById(anchorId).value
							}));
						}}>
							<ListItemText primary={`(${item.count}) ${item.category}`}/>
						</ListItem>
						<MakeSubs item={item}></MakeSubs>
					</>
					))}

					</List>
					</Popover>
					)

				}

				export default TypeAhead;
