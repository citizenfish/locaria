import React from "react";
import Chip from "@mui/material/Chip";
import {useStyles} from "stylesLocaria";


const Tags = function ({tags}) {
	const classes = useStyles();

	let tagsArray=[];
	if(Array.isArray(tags)) {
		for (let tag in tags) {
			tagsArray.push(
				<Chip className={classes.chip} key={`tag-${tags[tag]}`} label={tags[tag]}></Chip>
			)

		}
	}
	return (
		<div>{tagsArray}</div>
	);
}

export default Tags;