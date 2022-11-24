import React from 'react';
import Box from "@mui/material/Box";
import {useDispatch, useSelector} from "react-redux";
import {setTags} from "../../redux/slices/searchDrawerSlice";
import List from "@mui/material/List";
import {Checkbox, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {arrayToggleElement} from "../../../libs/arrayTools";
import {objectPathExists} from "../../../libs/objectTools";

export default function SearchTags({sx,category,noCountDisplay=false}) {
	const dispatch = useDispatch()

	const searchParams = useSelector((state) => state.searchDraw.searchParams);
	const counts = useSelector((state) => state.searchDraw.counts);

	function handleCheck(id) {
		let tagCopy=JSON.parse(JSON.stringify(searchParams.tags));
		tagCopy=arrayToggleElement(tagCopy,id);
		dispatch(setTags(tagCopy));

	}


	function DisplayTags() {
		let tags=window.systemCategories.getChannelProperties(category);

		return (
			<List sx={{ width: '100%' }} dense={true}>
				<ListItem sx={{padding:"0px"}}>
					<ListItemText primary={tags.tags.title} />
				</ListItem>
				{tags.tags.items.map((item)=> {
					let count='';
					if(objectPathExists(counts,`tags.${item}`)) {
						count=`(${counts.tags[item]})`;
						return (
							<ListItem sx={{padding:"0px"}}>
								<ListItemButton role={undefined} onClick={()=>{handleCheck(item)}} dense>
									<ListItemIcon>
										<Checkbox
											edge="start"
											checked={searchParams.tags.indexOf(item) !== -1}
											tabIndex={-1}
											disableRipple
										/>
									</ListItemIcon>
									<ListItemText primary={`${item}`} />
									<ListItemIcon edge={"end"}>
										<ListItemText primary={`${count}`} />
									</ListItemIcon>
								</ListItemButton>
							</ListItem>
						)
					} else {
						if(noCountDisplay===true) {
							return (
								<ListItem sx={{padding: "0px"}}>
									<ListItemButton role={undefined} onClick={() => {
										handleCheck(item)
									}} dense>
										<ListItemIcon>

										</ListItemIcon>
										<ListItemText primary={`${item}`}/>
									</ListItemButton>
								</ListItem>
							)
						}
				}}
				)}
			</List>
		)

	}
	return (
		<Box sx={{marginTop:"20px"}}>
			<DisplayTags></DisplayTags>
		</Box>
	)
}