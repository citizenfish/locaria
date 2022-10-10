import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import {TreeItem, TreeView} from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {setSearch, setSubCategoryList} from "../../redux/slices/searchDrawerSlice";
import {useDispatch} from "react-redux";

export default function SearchCategory({id="search",sx,multi=true}) {
	const dispatch = useDispatch()

	const [selected, setSelected] = React.useState([]);
	const [searchId, setSearchId] = useState(undefined);
	let mapper={};

	useEffect(() => {
		if (id !== searchId) {
			setSearchId(id);
			dispatch(setSearch({search: '', refresh: false, subCategories:[]}));
		}
	}, [id]);


	const handleSelect = (event, nodeIds) => {
		console.log(nodeIds);
		if(multi)
			dispatch(setSubCategoryList(nodeIds));
		else
			dispatch(setSubCategoryList([nodeIds]));
	};

	function SearchCategoryRecursive({ptr,idPath,path,color='white'}) {
		let treeLevel=[];
		for(let p in ptr) {
			let newPath=`${idPath? idPath+'.':''}${ptr[p].name.replace(/[^a-zA-Z]/g,'')}`;
			let newArrayPath=[...path];
			newArrayPath.push(ptr[p].name);
			mapper[newPath]=newArrayPath;
			if(ptr[p].color)
				color=ptr[p].color;
			treeLevel.push(
				<TreeItem label={ptr[p].name} nodeId={newPath} sx={{
					background: color
				}}>
					{ptr[p].subs &&
						<SearchCategoryRecursive ptr={ptr[p].subs} color={color} idPath={newPath} path={newArrayPath}/>
					}
				</TreeItem>
			);
		}
		return treeLevel;
	}
/*	function SearchCategoryRecursive({ptr,color='white'}) {
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
	}*/

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
				sx={{  flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
				selected={selected}
				onNodeSelect={handleSelect}
				multiSelect={true}
			>
				<SearchCategoryRecursive ptr={window.dataMap} idPath={""} path={[]}/>
			</TreeView>
		</Box>
	)
}

function categorySubTicks() {
	return (
		<Box sx={{border:"1px solid black"}}>


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
