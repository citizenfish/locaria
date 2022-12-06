import React, {useEffect, useRef} from 'react';
import Box from "@mui/material/Box";
import {useDispatch, useSelector} from "react-redux";
import {setTags} from "../../redux/slices/searchDrawerSlice";
import List from "@mui/material/List";
import {Checkbox, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {arrayToggleElement} from "../../../libs/arrayTools";
import {objectPathExists} from "../../../libs/objectTools";
import {v4 as uuidv4} from 'uuid';

export default function SearchTags({sx, category, noCountDisplay = false}) {
	const dispatch = useDispatch()

	const searchParams = useSelector((state) => state.searchDraw.searchParams);
	const counts = useSelector((state) => state.searchDraw.counts);


	function handleCheck(id) {
		let tagCopy = JSON.parse(JSON.stringify(searchParams.tags));
		tagCopy = arrayToggleElement(tagCopy, id);
		dispatch(setTags(tagCopy));

	}


	function DisplayTags() {
		let tags = window.systemCategories.getChannelProperties(category);

		let listArray = [];
		// loop the tags and push list items for ones that have counts
		for (let i in tags.tags.items) {
			let count = '';
			if (objectPathExists(counts, `tags['${tags.tags.items[i]}']`)) {
				count = `(${counts.tags[tags.tags.items[i]]})`;
				listArray.push(
					<ListItem sx={{padding: "0px"}} key={uuidv4()}>
						<ListItemButton role={undefined} onClick={() => {
							handleCheck(tags.tags.items[i])
						}} dense>
							<ListItemIcon>
								<Checkbox
									edge="start"
									checked={searchParams.tags.indexOf(tags.tags.items[i]) !== -1}
									tabIndex={-1}
									disableRipple
								/>
							</ListItemIcon>
							<ListItemText primary={`${tags.tags.items[i]}`}/>
							<ListItemIcon edge={"end"}>
								<ListItemText primary={`${count}`}/>
							</ListItemIcon>
						</ListItemButton>
					</ListItem>
				)
			} else {
				if (noCountDisplay === true) {
					listArray.push(
						<ListItem sx={{padding: "0px"}} key={uuidv4()}>
							<ListItemButton role={undefined} onClick={() => {
								handleCheck(tags.tags.items[i])
							}} dense>
								<ListItemIcon>

								</ListItemIcon>
								<ListItemText primary={`${tags.tags.items[i]}`}/>
							</ListItemButton>
						</ListItem>
					)
				}
			}
		}

		if (listArray.length > 0) {
			return (
				<List sx={{width: '100%'}} dense={true}>
					<ListItem sx={{padding: "0px"}}>
						<ListItemText primary={tags.tags.title} key={uuidv4()}/>
					</ListItem>
					{listArray}

				</List>
			)
		}
		return (<></>);

	}

	return (
		<Box sx={{marginTop: "20px"}}>
			<DisplayTags></DisplayTags>
		</Box>
	)
}