import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import {TreeItem, TreeView} from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {setSearch, setSubCategoryList, toggleSubCategoryItem} from "../../redux/slices/searchDrawerSlice";
import {useDispatch, useSelector} from "react-redux";
import List from "@mui/material/List";
import {Checkbox, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";

export default function SearchCategory({id="search",sx,multi=true,levels=1}) {
	const dispatch = useDispatch()

	const [searchId, setSearchId] = useState(undefined);
	const subCategories = useSelector((state) => state.searchDraw.subCategories);

	let mapper={};

	useEffect(() => {
		if (id !== searchId) {
			setSearchId(id);
			dispatch(setSearch({search: '', refresh: false, subCategories:[]}));
		}
	}, [id]);


	const handleCheck = (nodeIds) => {
		console.log(nodeIds);

		if(multi===true)
			dispatch(toggleSubCategoryItem(nodeIds));
		else
			dispatch(setSubCategoryList([nodeIds]));
	};

	function SearchCategoryRecursive({ptr,idPath,path,color='white'},level,maxLevel) {
		let treeLevel=[];
		level++;
		for(let p in ptr) {
			let newPath=`${idPath? idPath+'.':''}${ptr[p].name.replace(/[^a-zA-Z]/g,'')}`;
			let newArrayPath=[...path];
			newArrayPath.push(ptr[p].name);
			mapper[newPath]=newArrayPath;
			if(ptr[p].color)
				color=ptr[p].color;
			treeLevel.push(
				/*<TreeItem label={ptr[p].name} nodeId={newPath} sx={{
					background: color
				}}>*/
				<ListItem sx={{padding:"0px",background: color}}>

					<ListItemButton role={undefined} onClick={()=>{handleCheck(newPath)}} dense>
						<ListItemIcon>
							<Checkbox
								edge="start"
								checked={subCategories.indexOf(newPath) !== -1}
								tabIndex={-1}
								disableRipple
								inputProps={{ 'aria-labelledby': newPath }}
							/>
						</ListItemIcon>
						<ListItemText id={newPath} primary={`${ptr[p].name}`} />
					</ListItemButton>

					{ptr[p].subs&&level<maxLevel &&
						<SearchCategoryRecursive ptr={ptr[p].subs} color={color} idPath={newPath} path={newArrayPath}/>
					}
				</ListItem>
/*
				</TreeItem>
*/
			);
		}
		return treeLevel;
	}


	return (
		<Box sx={{
			textAlign: 'left'
		}}>
			<List sx={{ width: '100%' }} >
			{/*<TreeView
				aria-label="file system navigator"
				defaultCollapseIcon={<ExpandMoreIcon />}
				defaultExpandIcon={<ChevronRightIcon />}
				sx={{  flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
				selected={selected}
				onNodeSelect={handleSelect}
				multiSelect={true}
			>*/}
				<SearchCategoryRecursive ptr={window.dataMap} idPath={""} path={[]} level={0} maxLevel={levels}/>
{/*
			</TreeView>
*/}
			</List>
		</Box>
	)
}


