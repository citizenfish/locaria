import React, {useEffect, useRef} from 'react';
import {clearFilterItem, setFilterItem} from "../../redux/slices/searchDrawerSlice";
import {useDispatch, useSelector} from "react-redux";
import List from "@mui/material/List";
import {
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText
} from "@mui/material";
import {objectPathExists} from "libs/objectTools";
import {v4} from "uuid";
import Avatar from "@mui/material/Avatar";
import { deepOrange, grey } from '@mui/material/colors';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import FilterAccordion from "widgets/utils/FilterAccordion";
import {setSavedAttribute, setToggleActiveTop} from "components/redux/slices/userSlice";
export default function SearchSubCategory({category,noCountDisplay=false}) {
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
			dispatch(setToggleActiveTop({id:sub,value:Object.keys(searchParams.filters&&searchParams.filters.data&&searchParams.filters.data[sub]?searchParams.filters.data[sub]:{}).length>1}))
		} else {
			dispatch(setFilterItem({path: path, value: "true"}));
			dispatch(setToggleActiveTop({id:sub,value:Object.keys(searchParams.filters&&searchParams.filters.data&&searchParams.filters.data[sub]?searchParams.filters.data[sub]:{}).length>=0}))
		}
	}

	function DisplaySubCategorySubs({sub,subArray,categorySubs,Icon}) {


		let renderArray=[];
		let mergedData=[];

		//  Merge the count data
		for(let a in subArray) {
			if (objectPathExists(counts, `${sub}['${subArray[a]}']`)) {
				mergedData.push({"name":subArray[a],count:counts[sub][subArray[a]]});
			} else {
				mergedData.push({"name":subArray[a],count:0});
			}
		}

		// Sort the merged data
		mergedData.sort((a,b) => {
			if(a.count < b.count) return 1;
			if(a.count > b.count) return -1;
			return 0;
		});



		for(let a in mergedData) {
			if(mergedData[a].count > 0) {
				renderArray.push(
					<ListItem sx={{padding: "0px"}} key={v4()}>
						<ListItemButton role={undefined} onClick={(e) => {
							handleCheck(sub, mergedData[a].name);
						}} dense>
							<ListItemIcon>
								<Avatar
								sx = {{bgcolor: objectPathExists(searchParams.filters ,`data.${sub}['${mergedData[a].name}']`) ? deepOrange[500] : grey[300] }}
								>{`${mergedData[a].name.slice(0,2)}`}</Avatar>
							</ListItemIcon>
							<ListItemText primary={`${mergedData[a].name}`}/>
							<ListItemIcon edge={"end"}>
								<ListItemText primary={`(${mergedData[a].count})`} />
							</ListItemIcon>
						</ListItemButton>
					</ListItem>
				);
			} else {
				if(noCountDisplay===true) {
					renderArray.push(
						<ListItem sx={{padding: "0px"}} key={v4()}>
							<ListItemButton dense>
								<ListItemText primary={`${mergedData[a].name}`}/>
							</ListItemButton>
						</ListItem>
					);
				}
			}
		}
		if(renderArray.length>0) {
			return (
				<FilterAccordion title={categorySubs[sub].title} Icon={Icon} id={sub}>
					<List sx={{ width: '100%' }} >
						{renderArray}
					</List>
				</FilterAccordion>
			)
		}
		return (<></>);
	}

	function DisplaySubCategory({sub,Icon}) {
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
				<DisplaySubCategorySubs sub={sub} subArray={categorySubs[sub].items} categorySubs={categorySubs} Icon={Icon}></DisplaySubCategorySubs>
		)

	}

	return (
		<>
			<DisplaySubCategory sub={"subCategory1"} Icon={EmojiPeopleIcon}/>
			<DisplaySubCategory sub={"subCategory2"} Icon={DirectionsRunIcon}/>
		</>

	)

}