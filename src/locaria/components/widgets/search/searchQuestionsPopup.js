import React from "react";

import Box from "@mui/material/Box";
import {Backdrop, Fade, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import {
	setCategoryChosen,
	setQuestionsOpen
} from "components/redux/slices/searchDrawerSlice";
import {useDispatch, useSelector} from "react-redux";
import {v4} from "uuid";
import List from "@mui/material/List";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

import useSearchRouter from "widgets/search/useSearchRouter";
import {setSavedAttribute} from "components/redux/slices/userSlice";



export default function SearchQuestionsPopup() {


	let route=useSearchRouter();

	const dispatch = useDispatch();

	const innerWidth = useSelector((state) => state.mediaSlice.innerWidth);

	const open = useSelector((state) => state.searchDraw.questionsOpen);

	//const [question1, setQuestion1] = useLocalStorage("question1", "");
	//const [question2, setQuestion2] = useLocalStorage("question2", []);
	//const [gotoCategory, setGotoCategory] = useLocalStorage("gotoCategory",undefined);
	const askQuestions = useSelector((state) => state.userSlice.askQuestions);
	const gotoCategory = useSelector((state) => state.userSlice.gotoCategory);
	const question1 = useSelector((state) => state.userSlice.question1);
	const question2 = useSelector((state) => state.userSlice.question2);



	function handleClose() {
		dispatch(setQuestionsOpen(false));
	}

	function handleQuestion1(newCategory, value) {
		dispatch(setSavedAttribute({attribute:"gotoCategory",value:newCategory}));
		dispatch(setSavedAttribute({attribute:"question1",value:value}));
		// run after a few seconds to add a visual update
		setTimeout(() => {
			dispatch(setSavedAttribute({attribute:"askQuestions",value:2}));
		},500);
	}

	function toggleQuestion2(value) {
		if(question2.indexOf(value)===-1)
			dispatch(setSavedAttribute({attribute:"question2",value:[...question2,...[value]]}));
		else
			dispatch(setSavedAttribute({attribute:"question2",value:question2.filter(q=>q!==value)}));
	}
	function handleQuestion2() {
		dispatch(setSavedAttribute({attribute:"askQuestions",value:3}));

		dispatch(setQuestionsOpen(false));
		dispatch(setCategoryChosen([question1,...question2]))
		route();

	}

	function RenderQuestion3() {
		return (<></>);
	}

	function RenderQuestions1() {
		let questions = [];
		let categories = window.systemCategories.getChannels();
		for (let category in categories) {
			if (categories[category].questions) {
				for (let q in categories[category].questions['category_choice']) {
					questions.push(
						<ListItem key={v4()} sx={{"&:hover": {"opacity":"0.8"},background: '#fff', borderRadius: "10px", margin:"10px",width:`${width}px`,border: "1px solid #0000008f"}} onClick={() => handleQuestion1(categories[category].key, categories[category].questions['category_choice'][q].value)}>
							<ListItemIcon>
								<RenderStarState state={question1===categories[category].questions['category_choice'][q].value}/>
							</ListItemIcon>
							<ListItemText primary={categories[category].questions['category_choice'][q].statement}/>
						</ListItem>
					)
				}
			}
		}
		return (
			<List>
				<ListItem key={v4()} sx={{background: '#cedae5', borderRadius: "10px", margin:"10px",width:`${width}px`,height:"100px",textAlign: "center",border: "1px solid #0000008f"}}>
					<ListItemText primary={"Question 1 of 2: Which best describes your situation"}></ListItemText>
					<ListItemText onClick={()=>		dispatch(setQuestionsOpen(false))} primary={"[Skip]"}></ListItemText>
				</ListItem>
				{questions}
			</List>
		)
	}

	function RenderStarState({state}) {
		if(state) {
			return (
				<Fade in={true} timeout={500}><StarIcon/></Fade>
			)
		} else {
			return (
				<StarBorderIcon />
			)
		}
	}

	function RenderQuestions2() {
		let questions = [];
		let category = window.systemCategories.getChannelProperties(gotoCategory);
		if (category&&category.questions) {
			for (let q in category.questions['category_chosen']) {
				questions.push(
					<ListItem onClick={() => toggleQuestion2(category.questions['category_chosen'][q].value)} key={v4()}
							  sx={{
								  background: '#fff',
								  borderRadius: "10px",
								  margin: "10px",
								  width: `${width}px`,
								  border: "1px solid #0000008f",
								  "&:hover": {"opacity":"0.8"}
							  }}>
						<ListItemIcon>
							<RenderStarState
								state={question2&&question2.indexOf(category.questions['category_chosen'][q].value) !== -1}/>
						</ListItemIcon>
						<ListItemText primary={category.questions['category_chosen'][q].statement}/></ListItem>
				)
			}
		}
		return (
			<>
				<List>
					<ListItem key={v4()} sx={{background: '#cedae5', borderRadius: "10px", margin:"10px",width:`${width}px`,height:"100px",textAlign: "center",border: "1px solid #0000008f"}}>
						<ListItemText primary={"Question 2 of 2: Which best describes your situation"}></ListItemText>
						<ListItemText onClick={()=>		dispatch(setQuestionsOpen(false))} primary={"[Skip]"}></ListItemText>

					</ListItem>
					{questions}
					<ListItem onClick={() => handleQuestion2()} key={v4()} sx={{"&:hover": {"opacity":"0.8"},  cursor: "pointer",background: '#cedae5', borderRadius: "10px", margin:"10px",width:`${width}px`,height:"100px",textAlign: "center",border: "1px solid #0000008f"}}>
						<ListItemText color={"primary"} sx={{"color":"#000"}} varient={"outlined"} >Find activities based on your selection</ListItemText>
					</ListItem>
				</List>
			</>
		)
	}

	function Stages() {
		switch (askQuestions) {
			case 3:
				return (<RenderQuestion3/>);
			case 2:
				return (<RenderQuestions2/>);
			case 1:
			default:
				return (<RenderQuestions1/>);

		}


	}

	let width = innerWidth;
	if (width > 700)
		width = 700;
	else width = width - 60;

	let boxSx = {
		position: "absolute",
		top: "30px",
		left: `calc( 50% - ${width / 2}px )`,
		boxShadow: 3,
		width:`${width}px`,
		zIndex:200
	}

	if(open) {
		boxSx.display='block'
	} else {
		boxSx.display='none';
	}

	return (
		<Box sx={boxSx}>
			<Backdrop open={open} sx={{pt: 0,zIndex: 201}} onClick={handleClose}>
			</Backdrop>
			<Box sx={{zIndex: 202,position:"absolute"}}>
				<Stages/>
			</Box>
		</Box>

	)
}