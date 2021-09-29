import React from "react";


import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import {useStyles} from "theme_locus";


const SearchTags = ({category,changeFunction,currentValue}) => {
	const classes = useStyles();
	const [tags, setTags] = React.useState([]);
	const [selectedTags, setSelectTags] = React.useState(currentValue);

	React.useEffect(() => {

		if(tags.length===0) {

			window.websocket.send({
				"queue": "tagsLoader",
				"api": "api",
				"data": {"method": "list_tags","filter" : {"category" : [category]}}
			});
		};


	});

	window.websocket.registerQueue("tagsLoader", function (json) {
		setTags(json.packet);
	});

	function handleChange(e) {
		setSelectTags(e.target.value);
	}

	function handleClose(e) {
		changeFunction(selectedTags);
	}


	if(tags.length>0) {
		return (
			<FormControl className={classes.formControl} fullWidth>

				<InputLabel id="filter-tag-select-label">Tags</InputLabel>
				<Select
					labelId="filter-tag-select-label"
					id="tag-select"
					value={selectedTags}
					onChange={handleChange}
					onClose={handleClose}
					multiple
					input={<Input/>}
					renderValue={(selected) => selected.join(', ')}
				>
					{tags.map(function (tag) {
						return (
							<MenuItem key={tag} value={tag}>
								<Checkbox checked={selectedTags.indexOf(tag) > -1}/><ListItemText
								primary={tag}></ListItemText>
							</MenuItem>)
					})}

				</Select>
			</FormControl>
		)
	} else {
		return (<p>Loading</p>)
	}
}

export default SearchTags;