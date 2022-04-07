import React, {forwardRef, useImperativeHandle, useRef} from "react";
import Chip from "@mui/material/Chip";
import {useStyles} from "stylesLocaria";
import AddIcon from "@mui/icons-material/Add";
import {addTag} from "../redux/slices/searchDrawerSlice";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

//const Tags = function ({tags,mode='view',category}) {
const Tags = forwardRef((props, ref) => {
	const classes = useStyles();
	const [tagList, setTagList] = React.useState([]);
	const [selectedTags, setSelectedTags] = React.useState(props.tags);


	const classIndex=props.className||'chip';
	const limit=props.limit||20;

	React.useEffect(() => {

		window.websocket.registerQueue("tagsLoader", function (json) {
			setTagList(json.packet.tags);
		});

		if (tagList.length === 0 && props.mode === 'edit') {

			window.websocket.send({
				"queue": "tagsLoader",
				"api": "api",
				"data": {"method": "list_tags", "category": [props.category]}
			});
		}
		return () => {
		}

	},[]);


	useImperativeHandle(
		ref,
		() => ({
			getTags() {
				return selectedTags;
			},
		}),
	)


	let tagsArray=[];

	if(Array.isArray(selectedTags)) {
		for (let tag in selectedTags) {
			if(props.mode === 'view') {
				tagsArray.push(
					<Chip className={classes[classIndex]}  sx={{bgcolor: "secondary.main"}} key={`tag-${selectedTags[tag]}`} label={selectedTags[tag].substring(0,limit)}></Chip>
				)
			} else {
				tagsArray.push(
					<Chip className={classes[classIndex]} sx={{bgcolor: "secondary.main"}} key={`tag-${selectedTags[tag]}`} label={selectedTags[tag].substring(0,limit)}
					      onDelete={() => {
						      let newTags=JSON.parse(JSON.stringify(selectedTags));
						      newTags.splice(parseInt(tag),1);
						      setSelectedTags([...newTags]);
					      }}></Chip>
				)
			}

		}

	}

	if(props.mode==='edit') {
		for (let tag in tagList) {
			if(selectedTags.indexOf(tagList[tag])===-1) {
				tagsArray.push(
					<Chip sx={{bgcolor: "secondary.main"}} className={classes[classIndex]} key={`tag-${tagList[tag]}`} label={tagList[tag].substring(0,limit)}
					      deleteIcon={<AddOutlinedIcon className={classes.chipIcon}/>}
					      onDelete={() => {
						      setSelectedTags([...selectedTags,...[tagList[tag]]]);
					      }}></Chip>
				)
			}
		}
	}

	return (
		<div>{tagsArray}</div>
	);
});

export default Tags;