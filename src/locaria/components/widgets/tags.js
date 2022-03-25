import React from "react";
import Chip from "@mui/material/Chip";


const Tags = function ({tags}) {
	let tagsArray=[];
	if(Array.isArray(tags)) {
		for (let tag in tags) {
			tagsArray.push(
				<Chip key={`tag-${tags[tag]}`} label={tags[tag]}></Chip>
			)

		}
	}
	return (
		<div>{tagsArray}</div>
	);
}

export default Tags;