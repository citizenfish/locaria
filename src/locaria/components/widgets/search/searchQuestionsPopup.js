import React from "react";

import Box from "@mui/material/Box";
import {Backdrop, Button, Fade, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import {
	setCategoryChosen,
	setQuestionsOpen
} from "components/redux/slices/searchDrawerSlice";
import {useDispatch, useSelector} from "react-redux";
import {v4} from "uuid";
import List from "@mui/material/List";
import useSearchRouter from "widgets/search/useSearchRouter";
import {setSavedAttribute} from "components/redux/slices/userSlice";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Avatar from '@mui/material/Avatar';
import { teal} from '@mui/material/colors';

//Questions panel
let panelSX = {
	zIndex: 202,
	position:"absolute",
	border: "1px solid",
	padding: "50px",
	borderRadius: "5px",
	backgroundImage: "linear-gradient(5deg, rgb(141, 203, 204), rgb(102, 204, 153) 87.14%);",
	borderColor: "rgba(163, 163, 163, 0.3)"
}

//Question text
let questionSx = {
	color: "white"
}

const divider_sx ={borderColor: "#FFF"}

export default function SearchQuestionsPopup() {


	let route=useSearchRouter();

	const dispatch = useDispatch();
	const innerWidth = useSelector((state) => state.mediaSlice.innerWidth);
	const open = useSelector((state) => state.searchDraw.questionsOpen);
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

	function BottomPanel(props) {

		if(props.type === "go"){
			return (
				<>
					<Divider sx = {divider_sx}></Divider>
					<Button variant = "outlined"
							sx = {{marginTop: "10px", backgroundColor: "white", color: "black"}}
							onClick = {() => handleQuestion2()}>
						Let's Go!
					</Button>
				</>)
		}

		return (
			<>
				<Divider sx = {divider_sx}></Divider>
				<Button variant = "outlined"
						sx = {{marginTop: "10px", backgroundColor: "white", color: "black"}}
						onClick = { () =>	dispatch(setQuestionsOpen(false))}>
					Skip
				</Button>
			</>)
	}

	function TopPanel(props) {

		return(
			<Box>
				<Typography variant={"h6"} sx = {questionSx}>{props.hq}</Typography>
				<Typography variant={"body1"} sx={{...questionSx, paddingBottom:"10px", fontWeight: "bold"}}>{props.sq}</Typography>
				<Divider sx = {divider_sx}></Divider>
			</Box>
		)
	}

	function RenderQuestions1() {
		let questions = [];
		let categories = window.systemCategories.getChannels();
		for (let category in categories) {
			if (categories[category].questions) {
				for (let q in categories[category].questions['category_choice']) {
					let state = question1 === categories[category].questions['category_choice'][q].value
					let bgc = (state === true ? '#e0f2f1' : '#FFF')
					questions.push(
						<ListItem key={v4()} sx={{
									"&:hover": {"opacity":"0.8"},
									background: `${bgc}`,
									borderRadius: "10px",
									margin:"10px",
									width:`${width}px`,
									border: "1px solid #0000008f"}}
								  onClick={() => handleQuestion1(categories[category].key, categories[category].questions['category_choice'][q].value)}>
							<ListItemIcon>
								<RenderQState state = {state} letter = {questions.length}/>
							</ListItemIcon>
							<ListItemText primary={categories[category].questions['category_choice'][q].statement}/>
						</ListItem>
					)
				}
			}
		}
		return (
			<>
				{/*TODO make text configurable*/}
				<TopPanel hq={"Question 1 of 2"} sq = {"Which of the following best describes your situation?"} />
				<List>
					{questions}
				</List>
				<BottomPanel/>
			</>

		)
	}

	function RenderQState(props) {

		let letters = ['A','B','C','D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
		let asx = {}
		if(props.state) {
			asx = {bgcolor: teal[200]}
		}

		return (
			<Avatar sx = {asx}>{letters[props.letter]}</Avatar>
		)
	}

	function RenderQuestions2() {
		let questions = [];
		let category = window.systemCategories.getChannelProperties(gotoCategory);
		if (category&&category.questions) {
			for (let q in category.questions['category_chosen']) {
				let state = question2&&question2.indexOf(category.questions['category_chosen'][q].value) !== -1
				let bgc = (state === true ? '#e0f2f1' : '#FFF')
				questions.push(
					<ListItem onClick={() => toggleQuestion2(category.questions['category_chosen'][q].value)} key={v4()}
							  sx={{
								  background: `${bgc}`,
								  borderRadius: "10px",
								  margin: "10px",
								  width: `${width}px`,
								  border: "1px solid #0000008f",
								  "&:hover": {"opacity":"0.8"}
							  }}>
						<ListItemIcon>
							<RenderQState
								state={state}
								letter = {questions.length}
							/>
						</ListItemIcon>
						<ListItemText primary={category.questions['category_chosen'][q].statement}/></ListItem>
				)
			}
		}
		return (
			<>
				{/*TODO make text configurable*/}
				<TopPanel hq={"Question 2 of 2"} sq = {"Tell us one further thing?"} />
				<List>
					{questions}
				</List>
				<BottomPanel type = "go"/>
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
		left: `calc( 50% - ${(width / 2) + 50 }px )`,
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
		<Box sx={boxSx} >
			<Backdrop open={open} sx={{pt: 0,zIndex: 201}} onClick={handleClose}>
			</Backdrop>
			<Box sx={panelSX}>
				<Stages/>
			</Box>
		</Box>

	)
}