import React, {useState} from 'react';
import TokenCheck from "../components/utils/tokenCheck";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Box from "@mui/material/Box";
import StyleSelector from "../components/selectors/styleSelector";
import Button from "@mui/material/Button";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	InputLabel,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {setStyle, updateStyle} from "../redux/slices/adminPagesSlice";
import FormControl from "@mui/material/FormControl";
import {useCookies} from "react-cookie";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RenderMarkdown from "../../widgets/markdown/renderMarkdown";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";

const sxElements = ["backgroundColor", "fontFamily", "fontWeight", "color","textAlign"];

export default function AdminSettingsAppearanceEdit() {
	const history = useHistory();
	const dispatch = useDispatch()

	const style = useSelector((state) => state.adminPages.style);
	const [sxElement, setSxElement] = useState();
	const [sxValue, setSxValue] = useState();
	const [cookies, setCookies] = useCookies(['id_token']);

	const StyleValues = () => {
		let values = [];
		for (let s in window.systemMain.styles[style]) {
			values.push(
				<TableRow
					key={s}
					sx={{'&:last-child td, &:last-child th': {border: 0}}}
				>
					<TableCell component="th" scope="row">
						{s}
					</TableCell>
					<TableCell component="th" scope="row">
						{window.systemMain.styles[style][s]}
					</TableCell>
					<TableCell component="th" scope="row" align={"right"}>
						<EditIcon onClick={()=>{
							setSxValue(window.systemMain.styles[style][s]);
							setSxElement(s);
						}}></EditIcon>
						<DeleteForeverIcon onClick={()=>{
							dispatch(updateStyle({style: style, delete: s, token: cookies["id_token"]}));
							setSxValue("");
							setSxElement("");
						}}></DeleteForeverIcon>
					</TableCell>
				</TableRow>
			)
		}
		return values;
	}

	const SxSelector = () => {

		let sxList = [];
		for (let s in sxElements) {
			sxList.push(<MenuItem key={sxElements[s]} value={sxElements[s]}>{sxElements[s]}</MenuItem>)
		}
		return (
			<Select labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={sxElement}
					label="Style"
					onChange={(e) => {
						setSxElement(e.target.value);
					}}>
				{sxList}
			</Select>
		);
	}

	const makeStyle = () => {
		let data={};
		data[sxElement]=sxValue;
		let json=JSON.stringify({...window.systemMain.styles[style],...data});
		return json;
	}

	return (
		<Box sx={{display: 'flex'}}>
			<TokenCheck></TokenCheck>
			<AdminAppBar title={`Settings - Appearance`}/>
			<LeftNav isOpenSettings={true}/>
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '40px'}}
			>
				<h1>Edit Appearance - [{style}]</h1>
				<TableContainer>
					<Table sx={{minWidth: 650}} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Style</TableCell>
								<TableCell>Value</TableCell>
								<TableCell align="right">Action</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<StyleValues></StyleValues>
						</TableBody>
					</Table>
				</TableContainer>
				<FormControl fullWidth>
					<InputLabel id="demo-simple-select-label">Select style</InputLabel>
					<SxSelector></SxSelector>
					<TextField
						margin="dense"
						id="title"
						label="Value"
						type="text"
						fullWidth
						variant="standard"
						value={sxValue}
						onChange={(e) => {
							setSxValue(e.target.value)
						}}
						autoFocus={true}
					/>
				</FormControl>
				<Box sx={{paddingTop: "10px"}}>
					<Button variant={"contained"} color="success" onClick={() => {
						let data={};
						data[sxElement]=sxValue;
						dispatch(updateStyle({style: style, data: data, token: cookies["id_token"]}));
						setSxValue("");
						setSxElement("");
					}}>Save</Button>
					<Button variant={"contained"} color="error" onClick={() => {
						history.push(`/Admin/Settings/Appearance`);
					}}>Back</Button>
				</Box>
				<RenderMarkdown markdown={`${makeStyle()}# H1 Heading\n${makeStyle()}# H2 Heading\n${makeStyle()}# H3 Heading\n${makeStyle()}Normal Paragraph`}></RenderMarkdown>
			</Box>
		</Box>
	)
}