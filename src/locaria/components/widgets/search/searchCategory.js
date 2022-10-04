import React, {useEffect, useState} from 'react';
import List from "@mui/material/List";
import {ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import LensIcon from '@mui/icons-material/Lens';
import Box from "@mui/material/Box";
import TypographyHeader from "../typography/typographyHeader";
import {TreeItem, TreeView} from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {setFieldValue} from "../../redux/slices/formSlice";
import {setSearch, setSubCategoryList} from "../../redux/slices/searchDrawerSlice";
import {useDispatch} from "react-redux";

export default function SearchCategory({id="search",sx}) {
	const dispatch = useDispatch()

	const [selected, setSelected] = React.useState([]);
	const [searchId, setSearchId] = useState(undefined);

	useEffect(() => {
		if (id !== searchId) {
			setSearchId(id);
			dispatch(setSearch({search: '', refresh: false, subCategories:[]}));
		}
	}, [id]);


	const handleSelect = (event, nodeIds) => {
		console.log(nodeIds);
		dispatch(setSubCategoryList({search: nodeIds}))
	};


	function SearchCategoryRecursive({ptr,color='white'}) {
		let treeLevel=[];
		for(let p in ptr) {
			if(ptr[p].color)
				color=ptr[p].color;
			treeLevel.push(
				<TreeItem label={ptr[p].name} nodeId={ptr[p].id} sx={{
					background: color
				}}>
					{ptr[p].subs &&
						<SearchCategoryRecursive ptr={ptr[p].subs} color={color}/>
					}
				</TreeItem>
			);
		}
		return treeLevel;
	}

	return (
		<Box sx={{
			textAlign: 'left'
		}}>
{/*
			<SearchCategoryRecursive levels={window.dataMap}/>
*/}
			<TreeView
				aria-label="file system navigator"
				defaultCollapseIcon={<ExpandMoreIcon />}
				defaultExpandIcon={<ChevronRightIcon />}
				sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
				selected={selected}
				onNodeSelect={handleSelect}
			>
				<SearchCategoryRecursive ptr={window.dataMap}/>
			</TreeView>
		</Box>
	)
}

/*
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

}*/
