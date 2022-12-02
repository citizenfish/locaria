import React from 'react';
import {clearFilterItem, setFilterItem, setSubCategory} from "../../redux/slices/searchDrawerSlice";
import {useDispatch, useSelector} from "react-redux";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import {Checkbox, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {arrayToggleElement} from "../../../libs/arrayTools";
import {objectPathExists} from "../../../libs/objectTools";


export default function SearchSubCategory({sx,multi=true,levels=1,category,noCountDisplay=false}) {
	const dispatch = useDispatch()
	const searchParams = useSelector((state) => state.searchDraw.searchParams);
	const counts = useSelector((state) => state.searchDraw.counts);


	function handleCheck(sub,id) {
		let path=`data.${sub}.${id}`;
		if(objectPathExists(searchParams.filters,path)) {
			dispatch(clearFilterItem({path: path}));
		} else {
			dispatch(setFilterItem({path: path, value: "true"}));

		}

	}

	function DisplaySubCategorySubs({sub,subArray}) {
		let renderArray=[];



		for(let a in subArray) {
			if(objectPathExists(counts,`${sub}.${subArray[a]}`)) {
				let count = `(${counts[sub][subArray[a]]})`;
				renderArray.push(
					<ListItem sx={{padding: "0px"}}>
						<ListItemButton role={undefined} onClick={() => {
							handleCheck(sub, subArray[a])
						}} dense>
							<ListItemIcon>
								<Checkbox
									edge="start"
									checked={objectPathExists(searchParams.filters ,`data.${sub}.${subArray[a]}`)}
									tabIndex={-1}
									disableRipple
								/>
							</ListItemIcon>
							<ListItemText primary={`${subArray[a]}`}/>
							<ListItemIcon edge={"end"}>
								<ListItemText primary={`${count}`} />
							</ListItemIcon>
						</ListItemButton>
					</ListItem>
				);
			} else {
				if(noCountDisplay===true) {
					renderArray.push(
						<ListItem sx={{padding: "0px"}}>
							<ListItemButton dense>
								<ListItemText primary={`${subArray[a]}`}/>
							</ListItemButton>
						</ListItem>
					);
				}
			}
		}
		return renderArray;
	}

	function DisplaySubCategory({sub}) {
		let categorySubs=window.systemCategories.getChannelProperties(category);
		let subs=categorySubs[sub].items;
		for(let i in subs) {
			// Move Other to the end
			if(subs[i]==="Other") {
				subs.splice(i,1);
				subs.push("Other");
			}

		}

		return (
			<List sx={{ width: '100%' }} >
				<ListItem sx={{padding:"0px"}}>
					<ListItemText primary={categorySubs[sub].title} />
				</ListItem>
				<DisplaySubCategorySubs sub={sub} subArray={categorySubs[sub].items}></DisplaySubCategorySubs>
			</List>
		)

	}

	return (
		<Box>
			<DisplaySubCategory sub={"subCategory1"}/>
			<DisplaySubCategory sub={"subCategory2"}/>
		</Box>

	)

}