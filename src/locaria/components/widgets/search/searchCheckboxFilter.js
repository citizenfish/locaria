import {Checkbox, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import React from "react";
import List from "@mui/material/List";
import {useDispatch, useSelector} from "react-redux";
import {objectPathExists} from "../../../libs/objectTools";
import {clearFilterItem, setFilterItem} from "../../redux/slices/searchDrawerSlice";

export default function SearchCheckboxFilter({sx,values,title}) {

	const searchParams = useSelector((state) => state.searchDraw.searchParams);
	const dispatch = useDispatch()

	function handleCheck(item) {
		if(objectPathExists(searchParams.filters,item.path)) {
			dispatch(clearFilterItem({path: item.path}));
		} else {
			dispatch(setFilterItem({path: item.path, value: item.filter}));

		}
	}

	function MakeListItems() {
		let listItems=[];
		for(let v in values) {
			listItems.push(
				<ListItem sx={{padding:"0px"}}>
					<ListItemButton onClick={()=>{handleCheck(values[v])}} dense>
						<ListItemIcon>
							<Checkbox
								edge="start"
								checked={objectPathExists(searchParams.filters,values[v].path)}
								tabIndex={-1}
								disableRipple
							/>
						</ListItemIcon>
						<ListItemText primary={values[v].name}/>
					</ListItemButton>
				</ListItem>
			)
		}
		return listItems;
	}

	return (
		<List sx={{ width: '100%' }} >
			<ListItem sx={{padding:"0px"}}>
				<ListItemText primary={title} />
			</ListItem>
			<MakeListItems></MakeListItems>
		</List>
	)
}