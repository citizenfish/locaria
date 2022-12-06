import React, {useEffect, useRef} from 'react';
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


	// Add unique key using a ref
	const key=useRef(0);

	useEffect(() => {
		key.current++;
	},[]);

	function handleCheck(sub,id) {
		let path=`data.${sub}['${id}']`;
		if(objectPathExists(searchParams.filters,path)) {
			dispatch(clearFilterItem({path: path}));
		} else {
			dispatch(setFilterItem({path: path, value: "true"}));

		}

	}

	function DisplaySubCategorySubs({sub,subArray,categorySubs}) {
		let renderArray=[];
		for(let a in subArray) {
			if(objectPathExists(counts,`${sub}['${subArray[a]}']`)) {
				let count = `(${counts[sub][subArray[a]]})`;
				renderArray.push(
					<ListItem sx={{padding: "0px"}} key={sub+'subcheckboxes_'+key.current+a}>
						<ListItemButton role={undefined} onClick={() => {
							handleCheck(sub, subArray[a])
						}} dense>
							<ListItemIcon>
								<Checkbox
									edge="start"
									checked={objectPathExists(searchParams.filters ,`data.${sub}['${subArray[a]}']`)}
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
						<ListItem sx={{padding: "0px"}} key={sub+'subcheckboxes_'+key.current+a}>
							<ListItemButton dense>
								<ListItemText primary={`${subArray[a]}`}/>
							</ListItemButton>
						</ListItem>
					);
				}
			}
		}
		if(renderArray.length>0) {
			return (
				<List sx={{ width: '100%' }} >
					<ListItem sx={{padding:"0px"}} key={sub+'subcheckboxes_'+key.current}>
						<ListItemText primary={categorySubs[sub].title} />
					</ListItem>
					{renderArray}
				</List>
			)
		}
		return (<></>);
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
				<DisplaySubCategorySubs sub={sub} subArray={categorySubs[sub].items} categorySubs={categorySubs}></DisplaySubCategorySubs>
		)

	}

	return (
		<Box>
			<DisplaySubCategory sub={"subCategory1"}/>
			<DisplaySubCategory sub={"subCategory2"}/>
		</Box>

	)

}