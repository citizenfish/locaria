import React from 'react';
import Box from "@mui/material/Box";
import {useDispatch, useSelector} from "react-redux";
import {setTags} from "../../redux/slices/searchDrawerSlice";
import List from "@mui/material/List";
import {Checkbox, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {arrayToggleElement} from "../../../libs/arrayTools";

export default function SearchTags({sx,category}) {
	const dispatch = useDispatch()

	const searchParams = useSelector((state) => state.searchDraw.searchParams);

	function handleCheck(id) {
		let tagCopy=JSON.parse(JSON.stringify(searchParams.tags));
		tagCopy=arrayToggleElement(tagCopy,id);
		dispatch(setTags(tagCopy))
	}


	function DisplayTags({sub}) {
		let tags=window.systemCategories.getChannelProperties(category);

		return (
			<List sx={{ width: '100%' }} >
				<ListItem sx={{padding:"0px"}}>
					<ListItemText primary={tags.tags.title} />
				</ListItem>
				{tags.tags.items.map((item)=> {
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
							</ListItemButton>
						</ListItem>
					)
				})
				}
			</List>
		)

	}
	return (
		<Box sx={{marginTop:"20px"}}>
			<DisplayTags></DisplayTags>
		</Box>
	)
}