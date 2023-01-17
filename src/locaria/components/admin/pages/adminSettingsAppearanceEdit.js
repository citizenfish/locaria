import React, {useState,useEffect} from 'react';
import TokenCheck from "widgets/utils/tokenCheck";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {useCookies} from "react-cookie";
import RenderMarkdown from "../../widgets/markdown/renderMarkdown";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import StripedDataGrid from "../../widgets/data/stripedDataGrid";


const sxElements = ["backgroundColor", "fontFamily", "fontWeight", "color", "textAlign"];

export default function AdminSettingsAppearanceEdit() {
	const history = useHistory();

	const style = useSelector((state) => state.adminPages.style);
	const [sxElement, setSxElement] = useState();
	const [sxValue, setSxValue] = useState();
	const [styleRows,setStyleRows] = useState([])


	const cssValue = (params) => {
		let value = params.row.value
		let cStyle = params.row.style

		if(/[Cc]olor/.test(cStyle) && value !== '') {
			return(
				<div style={{ color: value }}>
					{value}
				</div>
			)
		}

		if(cStyle === 'fontFamily') {
			return(
				<div style={{ fontFamily: value }}>
					{value}
				</div>
			)
		}

		if(cStyle === 'fontWeight') {
			return(
				<div style={{ fontWeight: value }}>
					{value}
				</div>
			)
		}

		return(<>{value}</>)
	}

	const actions = (params) => {
		return(
			<Grid container>
				<Grid item md={4}>
					<Button variant="outlined"
							color="error"
							size="small"
							onClick={() => {
								delete window.systemMain.styles[style][params.row.style]
								setSxElement(params.row.style)
								setSxValue('')
							}}>
						Clear
					</Button>
				</Grid>

			</Grid>
		)
	}

	const cellEditCommit = (params,e) =>{


		let cStyle = styleRows[params.id].style
		window.systemMain.styles[style][cStyle] = params.value
		console.log(window.systemMain.styles[style])
		setSxElement(cStyle);
		setSxValue(params.value);


	}

	const columns = [
		{field: 'style', headerName: 'CSS Element', width: 300},
		{field: 'value', headerName: 'CSS Value', width: 200, renderCell: cssValue, editable: true},
		{field: 'actions', headerName: 'Actions', width: 300, renderCell: actions}
	]

	useEffect( () => {

		let rows = []
		let count = 0
		for(let f in sxElements) {
			rows.push({
				id: count++,
				style: sxElements[f],
				value: window.systemMain.styles[style][sxElements[f]] || ''
			})
		}

		setStyleRows(rows)

	},[sxElement,sxValue])

	const makeStyle = () => {
		let data={};
		data[sxElement]=sxValue;
		let json=JSON.stringify({...window.systemMain.styles[style],...data});
		return json;
	}

	return (
		<Box sx={{display: 'flex'}}>
			<TokenCheck></TokenCheck>
			<AdminAppBar title={`Settings - Styles`}/>
			<LeftNav isOpenSettings={true}/>
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '60px'}}
			>

				<Grid container spacing={2}>
					<Grid item md={2}>
						<Button sx={{marginRight:"5px"}}
								variant="outlined"
								color="warning"
								onClick={() => {
									history.push(`/Admin/Settings/Appearance`);
								}}>
							Back
						</Button>
					</Grid>
					<Grid item md={2}>
						<Button sx={{marginRight:"5px"}}
								variant="outlined"
								color="success"
								onClick={() => {
									//history.push(`/Admin/Settings/Appearance`);
								}}>
							Save Changes
						</Button>
					</Grid>
					<Grid item md={8}>
						<Typography>Currently editing style {style}. Stuff about a style goes here and more waffle</Typography>

						<RenderMarkdown markdown={`${makeStyle()}This is an example of how ${style} will appear`}></RenderMarkdown>
					</Grid>
				</Grid>

				<StripedDataGrid rows={styleRows}
								 columns={columns}
								 autoHeight
								 onCellEditCommit={cellEditCommit}
				/>

				<RenderMarkdown markdown={`${makeStyle()}# H1 Heading\n${makeStyle()}## H2 Heading\n${makeStyle()}### H3 Heading\n${makeStyle()}Normal Paragraph`}></RenderMarkdown>
			</Box>
		</Box>
	)
}

/*

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
<RenderMarkdown markdown={`${makeStyle()}# H1 Heading\n${makeStyle()}# H2 Heading\n ${makeStyle()}# H3 Heading\n${makeStyle()}Normal Paragraph`}></RenderMarkdown>
*/