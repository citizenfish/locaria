import React from "react";


import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import {useStyles} from "stylesLocaria";


const SearchTags = ({category, changeFunction, currentValue}) => {
	const classes = useStyles();
	const [tags, setTags] = React.useState([]);
	const [selectedTags, setSelectTags] = React.useState(currentValue);

	React.useEffect(() => {

		window.websocket.registerQueue("tagsLoader", function (json) {
			setTags(json.packet.tags);
		});

		if (tags.length === 0) {

			window.websocket.send({
				"queue": "tagsLoader",
				"api": "api",
				"data": {"method": "list_tags", "filter": {"category": [category]}}
			});
		}
		return () => {
			window.websocket.clearQueues();
		}

	}, [tags]);


	function handleChange(e) {
		setSelectTags(e.target.value);
	}

	function handleClose(e) {
		changeFunction(selectedTags);
	}

	if (tags.length > 0) {
		return (
			<FormControl className={classes.formControl} fullWidth>

				<InputLabel htmlFor="tag-select">Tags</InputLabel>
				<Select
					id="tag-select"
					value={selectedTags}
					onChange={handleChange}
					onClose={handleClose}
					multiple
					input={<Input/>}
					key={`tss-control`}
					renderValue={(selected) => selected.join(', ')}
				>
					{tags.map(function (tag, index) {
						return (
							<MenuItem key={`tsmi-${index}`} value={tag}>
								<Checkbox checked={selectedTags.indexOf(tag) > -1}/>
								<ListItemText primary={tag}></ListItemText>
							</MenuItem>
						)
					})}

				</Select>
			</FormControl>
		)
	} else {
		return (<p>Loading</p>)
	}
}

export default SearchTags;