import React, {useEffect, useState} from 'react';
import {setSearch, setSubCategory, setSubCategoryList} from "../../redux/slices/searchDrawerSlice";
import {useDispatch, useSelector} from "react-redux";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import {Checkbox, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {arrayToggleElement} from "../../../libs/arrayTools";


export default function SearchSubCategory({sx,multi=true,levels=1,category}) {
	const dispatch = useDispatch()

	const [subCats, setSubCats] = useState([]);


	function handleCheck(sub,id) {
		let catCopy=[...subCats];
		catCopy=arrayToggleElement(catCopy,id);
		setSubCats(catCopy);
		dispatch(setSubCategory({sub:sub,data:catCopy}))
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
								checked={subCats.indexOf(subArray[a]) !== -1}
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