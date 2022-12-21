import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import {Checkbox, Collapse, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {arrayToggleElement, findArrayObject} from "../../../libs/arrayTools";
import {v4 as uuidv4} from "uuid";

export default function Treeview({sx,multi=true,levels=1,treeData,setFunction,selected}) {

	const [tree, setTree] = useState([]);
	const [tags, setTags] = useState([]);

	let mapper={};


	useEffect(() => {

		if(Array.isArray(selected)) {
			setTags(selected);
		}

	},[]);



	const handleCheck = (nodeIds,name) => {



		let tagsCopy=[...tags];
		tagsCopy=arrayToggleElement(tagsCopy,name);
		setTags(tagsCopy);

		console.log(tagsCopy);
		let treecopy=[...tree];
		if(treecopy.indexOf(nodeIds)!==-1) {
			treecopy.splice(treecopy.indexOf(nodeIds),1);
		} else {
			treecopy.push(nodeIds);
		}

		if(multi===true) {
			setFunction(tagsCopy);
		} else {
			setFunction(name);
		}
	};

	function SearchCategoryRecursive({ptr,idPath,path,color='white',level,maxLevel}) {
		let treeLevel=[];
		level++;
		for(let p in ptr) {
			const uuid = uuidv4();

			let newPath=`${idPath? idPath+'.':''}${ptr[p].name.replace(/[^a-zA-Z]/g,'')}`;
			let newArrayPath=[...path];
			newArrayPath.push(ptr[p].name);
			mapper[newPath]=newArrayPath;

			if(ptr[p].color)
				color=ptr[p].color;


			treeLevel.push(
				<ListItem sx={{padding:"0px",background: color}} key={uuid}>
					<ListItemButton role={undefined} onClick={()=>{handleCheck(newPath,ptr[p].name);}} dense>
						<ListItemIcon>
							<Checkbox
								edge="start"
								checked={tags.indexOf(ptr[p].name) !== -1}
								tabIndex={-1}
								disableRipple
								inputProps={{'aria-labelledby': newPath}}
							/>
						</ListItemIcon>
						<ListItemText id={newPath} primary={`${ptr[p].name}`} />
					</ListItemButton>
				</ListItem>
			);

			if(ptr[p].subs&&level<maxLevel) {
				const uuid = uuidv4();
				treeLevel.push(
					<Collapse in={tags.indexOf(ptr[p].name) !== -1} timeout="auto" unmountOnExit>
						<List sx={{padding: "0px", background: color, paddingLeft: `${level*5}px`}} key={uuid}>
							<SearchCategoryRecursive ptr={ptr[p].subs} color={color} idPath={newPath} path={newArrayPath} level={level} maxLevel={maxLevel}/>
						</List>
					</Collapse>
				)
			}
		}
		return treeLevel;
	}


	return (
		<Box sx={{
			textAlign: 'left'
		}}>
			<List sx={{ width: '100%' }} >
				<SearchCategoryRecursive ptr={treeData} idPath={""} path={[]} level={0} maxLevel={levels}/>
			</List>
		</Box>
	)
}


