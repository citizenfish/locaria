import React from "react";


import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import {useStyles} from "stylesLocaria";
import {useDispatch, useSelector} from "react-redux";

import {
	setTags
} from "../redux/slices/searchDrawSlice";

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


	function handleChange(e) {
		dispatch(setTags(e.target.value));
	}

	function handleClose(e) {
		dispatch(setTags(tags));
	}

	if (tagList.length > 0) {
		return (
			<FormControl className={classes.formControl} fullWidth>

				<InputLabel htmlFor="tag-select">Tags</InputLabel>
				<Select
					id="tag-select"
					value={tags}
					onChange={handleChange}
					onClose={handleClose}
					multiple
					input={<Input/>}
					key={`tss-control`}
					renderValue={(selected) => selected.join(', ')}
				>
					{tagList.map(function (tag, index) {
						return (
							<MenuItem key={`tsmi-${index}`} value={tag}>
								<Checkbox checked={tags.indexOf(tag) > -1}/>
								<ListItemText primary={tag}></ListItemText>
							</MenuItem>
						)
					})}

				</Select>
			</FormControl>
		)
	} else {
		return (<></>)
	}
}

export default SearchTags;