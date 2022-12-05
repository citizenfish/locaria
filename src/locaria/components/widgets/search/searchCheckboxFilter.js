import {Badge, Checkbox, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack} from "@mui/material";
import React from "react";
import List from "@mui/material/List";
import {useDispatch, useSelector} from "react-redux";
import {objectPathExists, objectPathGet} from "../../../libs/objectTools";
import {clearFilterItem, setFilterItem} from "../../redux/slices/searchDrawerSlice";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function SearchCheckboxFilter({sx,values,title,formatter="list"}) {

	const searchParams = useSelector((state) => state.searchDraw.searchParams);
	const dispatch = useDispatch();
	const counts = useSelector((state) => state.searchDraw.counts);


	function handleCheck(item) {
		if(objectPathExists(searchParams.filters,item.path)) {
			dispatch(clearFilterItem({path: item.path}));
		} else {
			dispatch(setFilterItem({path: item.path, value: item.filter}));

		}
	}

	function MakeStackItems() {
		let stackItems=[];
		for(let v in values) {
			let count=objectPathGet(counts,values[v].counts)||0;
			stackItems.push(
				<Badge badgeContent={count} color="secondary" showZero={true}>
					<Button sx={{minWidth: "30px","padding":"2px",borderRadius:"0px",fontSize:"0.5rem"}} size={"small"} variant={objectPathExists(searchParams.filters,values[v].path)? "contained":"outlined"} onClick={()=>{handleCheck(values[v])}}>{values[v].name}</Button>
				</Badge>
			)
		}
		return (
			<Stack direction="row" spacing={1}>
				{stackItems}
			</Stack>
		)
	}

	function MakeListItems() {
		let listItems=[];
		for(let v in values) {
			let count=objectPathGet(counts,values[v].counts)
			listItems.push(
				<ListItem sx={{padding:"0px"}}>
					<ListItemButton onClick={()=>{handleCheck(values[v])}} dense>
						<ListItemIcon>

							<Checkbox
								edge="start"
								checked={objectPathExists(searchParams.filters,values[v].path)}
								tabIndex={-1}
								disableRipple
								icon={values[v].icon}
								checkedIcon={values[v].checkedIcon}
							/>
						</ListItemIcon>
						{values[v].name &&
							<ListItemText primary={values[v].name}/>
						}
						{count &&
							<ListItemIcon edge={"end"}>
								<ListItemText primary={`${count}`}/>
							</ListItemIcon>
						}
					</ListItemButton>
				</ListItem>
			)
		}
		return listItems;
	}

	return (
		<List sx={{ width: '100%' }} >
			{title &&
				<ListItem sx={{padding: "0px"}}>
					<ListItemText primary={title}/>
				</ListItem>
			}
			{formatter === 'list' &&
				<MakeListItems/>
			}
			{formatter === 'stack'&&
				<MakeStackItems/>

			}
		</List>
	)
}