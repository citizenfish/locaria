import React from 'react';
import Box from "@mui/material/Box";
import {useDispatch, useSelector} from "react-redux";
import {setTags} from "../../redux/slices/searchDrawerSlice";
import { ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {arrayToggleElement} from "../../../libs/arrayTools";
import {objectPathExists} from "../../../libs/objectTools";
import {v4 as uuidv4} from 'uuid';
import {deepOrange, grey} from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import FilterAccordion from "widgets/utils/FilterAccordion";
import StarIcon from '@mui/icons-material/Star';
import {setSavedAttribute, setToggleActiveTop} from "components/redux/slices/userSlice";

export default function SearchTags({sx, category, noCountDisplay = false}) {
	const dispatch = useDispatch()

	const searchParams = useSelector((state) => state.searchDraw.searchParams);
	const counts = useSelector((state) => state.searchDraw.counts);


	function handleCheck(id) {
		let tagCopy = JSON.parse(JSON.stringify(searchParams.tags));
		tagCopy = arrayToggleElement(tagCopy, id);
		dispatch(setTags(tagCopy));
		dispatch(setToggleActiveTop({id:"tags",value:tagCopy.length>0}))
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
								<Avatar
									sx = {{bgcolor: searchParams.tags.indexOf(tags.tags.items[i]) !== -1 ? deepOrange[500] : grey[300] }}
								>{`${tags.tags.items[i].slice(0,2)}`}</Avatar>
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
				<FilterAccordion title={tags.tags.title} Icon={StarIcon} id={"tags"}>
					{listArray}
				</FilterAccordion>
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