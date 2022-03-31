import React from "react";

import {useStyles} from "stylesLocaria";
import {useDispatch, useSelector} from "react-redux";
import AddIcon from '@mui/icons-material/Add';

import {
	setTags,
	addTag
} from "../redux/slices/searchDrawSlice";
import Chip from "@mui/material/Chip";

const SearchTags = ({category, changeFunction, currentValue}) => {
	const classes = useStyles();
	const [tagList, setTagList] = React.useState([]);
	const [selectedTags, setSelectTags] = React.useState([]);

	const categories = useSelector((state) => state.searchDraw.categories);
	const tags = useSelector((state) => state.searchDraw.tags);

	const dispatch = useDispatch()

	React.useEffect(() => {

		window.websocket.registerQueue("tagsLoader", function (json) {
			setTagList(json.packet.tags);
		});

		if (tags.length === 0&&categories[0]) {

			window.websocket.send({
				"queue": "tagsLoader",
				"api": "api",
				"data": {"method": "list_tags", "filter": {"category": [categories[0]]}}
			});
		}
		return () => {
			window.websocket.clearQueues();
		}

	}, [categories]);


	if (tagList.length > 0) {
		return (
			<>
			{tagList.map((tag) => {
				if(tags.indexOf(tag)===-1) return (
					<Chip className={classes.chip}
						  key={`tag-${tag}`}
						  label={tag}
						  size="small"
						  sx ={{bgcolor: "selection.lighter"}}
						  deleteIcon={<AddIcon className={classes.chipIcon}/>}
						  onDelete={() => {
						  dispatch(addTag(tag));
					}}/>
				)}
			)}
			</>
		)
	} else {
		return (<></>)
	}
}

export default SearchTags;