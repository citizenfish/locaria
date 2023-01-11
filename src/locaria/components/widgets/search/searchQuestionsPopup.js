import React, {useState} from "react";

import Box from "@mui/material/Box";
import {Backdrop, Fade, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import {
	setAskQuestions,
	setCategoryChosen,
	setQuestionsOpen
} from "components/redux/slices/searchDrawerSlice";
import {useDispatch, useSelector} from "react-redux";
import {v4} from "uuid";
import List from "@mui/material/List";
import {encodeSearchParams} from "libs/searchParams";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

import {useHistory} from "react-router-dom";
export default function SearchQuestionsPopup() {
	const currentLocation = useSelector((state) => state.searchDraw.currentLocation);

	const dispatch = useDispatch();
	const askQuestions = useSelector((state) => state.searchDraw.askQuestions);
	const history = useHistory();

	const innerWidth = useSelector((state) => state.mediaSlice.innerWidth);
	const schema = useSelector((state) => state.searchDraw.schema);

	const open = useSelector((state) => state.searchDraw.questionsOpen);

	const [question1, setQuestion1] = useState("");
	const [question2, setQuestion2] = useState([]);
	const [gotoCategory, setGotoCategory] = useState("");

	function handleClose() {
		dispatch(setQuestionsOpen(false));
	}

	function handleQuestion1(newCategory, value) {
		setGotoCategory(newCategory);
		setQuestion1(value);
		// run after a few seconds to add a visual update
		setTimeout(() => {
			dispatch(setAskQuestions(2));
		},500);
	}

	function toggleQuestion2(value) {
		if(question2.indexOf(value)===-1)
			setQuestion2([...question2,...[value]]);
		else
			setQuestion2(question2.filter(q=>q!==value));
	}
	function handleQuestion2() {
		dispatch(setAskQuestions(0));
		dispatch(setQuestionsOpen(false));
		dispatch(setCategoryChosen([question1,...question2]))


		let encodedParams = encodeSearchParams({
			location: currentLocation.location,
			sendRecommended:  true
		}, schema);

		switch (gotoCategory) {
			case 'Activities':
				history.push('/Activities/sp/Activities/' + encodedParams);
				break;
			case 'Mental Health':
				history.push('/MentalHealth/sp/Mental Health/' + encodedParams);
				break;
			case 'Healthy Eating':
				history.push('/HealthyEating/sp/Healthy Eating/' + encodedParams);
				break;
			case 'Do It At Home':
			default:
				history.push('/DoItAtHome/sp/Do It At Home/' + encodedParams);
				break;
		}

	}

	function RenderQuestions1() {
		let questions = [];
		let categories = window.systemCategories.getChannels();
		for (let category in categories) {
			if (categories[category].questions) {
				for (let q in categories[category].questions['category_choice']) {
					questions.push(
						<ListItem key={v4()} sx={{background: '#fff', borderRadius: "10px", margin:"10px",width:`${width}px`,border: "1px solid #0000008f"}} onClick={() => handleQuestion1(categories[category].key, categories[category].questions['category_choice'][q].value)}>
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
		for (let q in category.questions['category_chosen']) {
			questions.push(
				<ListItem onClick={() => toggleQuestion2(category.questions['category_chosen'][q].value)} key={v4()} sx={{background: '#fff', borderRadius: "10px", margin:"10px",width:`${width}px`,border: "1px solid #0000008f"}}>
					<ListItemIcon>
						<RenderStarState state={question2.indexOf(category.questions['category_chosen'][q].value) !== -1}/>
					</ListItemIcon>
					<ListItemText primary={category.questions['category_chosen'][q].statement}/></ListItem>
			)
		}
		return (
			<>
				<List>
					<ListItem key={v4()} sx={{background: '#cedae5', borderRadius: "10px", margin:"10px",width:`${width}px`,height:"100px",textAlign: "center",border: "1px solid #0000008f"}}>
						<ListItemText primary={"Question 2 of 2: Which best describes your situation"}></ListItemText>
					</ListItem>
					{questions}
					<ListItem  key={v4()} sx={{background: '#cedae5', borderRadius: "10px", margin:"10px",width:`${width}px`,height:"100px",textAlign: "center",border: "1px solid #0000008f"}}>
						<ListItemText color={"primary"} sx={{"color":"#000"}} varient={"outlined"} onClick={() => handleQuestion2()}>Find activities based on your selection</ListItemText>
					</ListItem>
				</List>
			</>
		)
	}

	function Stages() {
		switch (askQuestions) {
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