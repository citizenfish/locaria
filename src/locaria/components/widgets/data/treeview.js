import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import {Checkbox, Collapse, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {setupField} from "../../redux/slices/formSlice";
import {arrayToggleElement, findArrayObject} from "../../../libs/arrayTools";

export default function Treeview({sx,multi=true,levels=1,treeData,setFunction,selected}) {

	const [tree, setTree] = useState([]);
	const [tags, setTags] = useState([]);

	let mapper={};


	useEffect(() => {

		if(Array.isArray(selected)) {
			setTags(selected);
			/*let newOpens={};
			let tree;
			if (selected[0]) {
				tree=findArrayObject(treeData,"name",selected[0]);
				if(tree&&tree.subs)
					newOpens[selected[0].replace(/[^a-zA-Z]/g, '')] = true;
				else
					setTree([selected[0].replace(/[^a-zA-Z]/g,'')]);
			}
			if (selected[1]) {
				tree=findArrayObject(tree.subs,"name",selected[1]);

				if (tree&&tree.subs)
					newOpens[selected[0].replace(/[^a-zA-Z]/g, '') + '.' + selected[1].replace(/[^a-zA-Z]/g, '')] = true;
				else
					setTree([selected[0].replace(/[^a-zA-Z]/g,'')+'.'+selected[1].replace(/[^a-zA-Z]/g,'')]);
			}
			if (selected[2]) {
				setTree([selected[0].replace(/[^a-zA-Z]/g,'')+'.'+selected[1].replace(/[^a-zA-Z]/g,'')+'.'+selected[2].replace(/[^a-zA-Z]/g,'')]);
			}
			setOpens(newOpens);*/

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

		/*let selectedArray={};
		for(let t in treecopy) {
			selectedArray=
		}*/

		if(multi===true) {
			//setTree(treecopy);
			setFunction(tagsCopy);
		} else {
			//setTree([nodeIds]);
			setFunction(name);
		}
	};

	function SearchCategoryRecursive({ptr,idPath,path,color='white',level,maxLevel}) {
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
				<ListItem sx={{padding:"0px",background: color}}>
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
				treeLevel.push(
					<Collapse in={tags.indexOf(ptr[p].name) !== -1} timeout="auto" unmountOnExit>
						<List sx={{padding: "0px", background: color, paddingLeft: `${level*5}px`}}>
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


