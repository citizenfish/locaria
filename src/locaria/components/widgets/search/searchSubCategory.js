import React from 'react';
import {setSubCategory} from "../../redux/slices/searchDrawerSlice";
import {useDispatch, useSelector} from "react-redux";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import {Checkbox, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {arrayToggleElement} from "../../../libs/arrayTools";


export default function SearchSubCategory({sx,multi=true,levels=1,category}) {
	const dispatch = useDispatch()

	//const subCategories = useSelector((state) => state.searchDraw.subCategories);
	const searchParams = useSelector((state) => state.searchDraw.searchParams);


	function handleCheck(sub,id) {
		let catCopy=JSON.parse(JSON.stringify(searchParams.subCategories));
		catCopy[sub]=arrayToggleElement(catCopy[sub],id);
		dispatch(setSubCategory({sub:sub,data:catCopy[sub]}))
	}

	function DisplaySubCategorySubs({sub,subArray}) {
		let renderArray=[];
		for(let a in subArray) {
			renderArray.push(
				<ListItem sx={{padding:"0px"}}>
					<ListItemButton role={undefined} onClick={()=>{handleCheck(sub,subArray[a])}} dense>
						<ListItemIcon>
							<Checkbox
								edge="start"
								checked={searchParams.subCategories[sub].indexOf(subArray[a]) !== -1}
								tabIndex={-1}
								disableRipple
							/>
						</ListItemIcon>
						<ListItemText primary={`${subArray[a]}`} />
					</ListItemButton>
				</ListItem>
			);
		}
		return renderArray;
	}

	function DisplaySubCategory({sub}) {
		let categorySubs=window.systemCategories.getChannelProperties(category);

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