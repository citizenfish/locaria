import React from 'react';
import List from "@mui/material/List";
import {ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import LensIcon from '@mui/icons-material/Lens';
import Box from "@mui/material/Box";
import TypographyHeader from "../typography/typographyHeader";

export default function SearchCategory() {


	return (
		<Box sx={{
			textAlign: 'left'
		}}>
			<SearchCategoryRecursive levels={window.dataMap}/>
		</Box>
	)
}

function SearchCategoryRecursive({levels}) {
	let items = [];

	for (let level in levels) {
		let subLevels = [];
		if (levels[level].subs) {
			subLevels = <SearchCategoryRecursive levels={levels[level].subs}/>;
		}

		items.push(
			<Box sx={{padding: "5px"}}>
				<TypographyHeader sx={{color: levels[level].color}}
								  element={"h3"}>{levels[level].name}</TypographyHeader>
				<Box>
					{subLevels}
				</Box>
			</Box>
		)
	}

	return items;

}