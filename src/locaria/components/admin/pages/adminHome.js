import React from 'react';
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Box from "@mui/material/Box";
import TokenCheck from "widgets/utils/tokenCheck";
import {Typography, Grid, CardContent, Card,CardActionArea} from "@mui/material";
import {useHistory} from "react-router-dom";

export default function AdminHome() {

	const history = useHistory();
	return (
		<Box sx={{display: 'flex'}}>
			<TokenCheck></TokenCheck>
			<AdminAppBar title={"Home"}/>
			<LeftNav/>
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '60px'}}
			>
				<Grid container spacing={2}>
					<Grid item md={12}>
						<Typography mt={2}>
							The Locaria Administration portal allows you to manage the settings, content and data stored within the system. Use the Page Manager to add or edit fixed pages on your website, the Data Manager to edit any articles or data items displayed in searches or on the map and the Site Manager to change the colours and look-and-feel of the site.
						</Typography>
					</Grid>
					<Grid item md={4}>
						<Card
							style={{backgroundColor: '#074fa1', margin: "20px"}}
							sx={{
								'.MuiCardContent-root': {
									':last-child': {
										paddingBottom: 1,
									}
								}
							}}
						>
							<CardActionArea onClick={() => {
								history.push(`/Admin/Content/Pages`);
							}}>
							<CardContent sx={{
								display: 'flex',
								flexDirection: 'column',
								height: '100%',
								justifyContent: 'space-between',
								width: '100%',
								color: 'white',
								//padding: 1,
								margin: 'auto'
							}}>
								<Typography variant="h4">
									Page Manager
								</Typography>
								<Typography>
									Add, edit or delete pages
								</Typography>
							</CardContent>
							</CardActionArea>
						</Card>
					</Grid>
					<Grid item md={4}>
						<Card
							style={{backgroundColor:'#074fa1', margin: "20px"}}
							sx={{
								'.MuiCardContent-root': {
									':last-child': {
										paddingBottom: 1,
									}
								}
							}}
						>
							<CardActionArea onClick={() => {
								history.push(`/Admin/Content/Data`);
							}}>
								<CardContent sx={{
									display: 'flex',
									flexDirection: 'column',
									height: '100%',
									justifyContent: 'space-between',
									width: '100%',
									color: 'white',
									//padding: 1,
								}}>
									<Typography variant="h4">
										Data Manager
									</Typography>
									<Typography>
										Add, edit or delete articles or data
									</Typography>

								</CardContent>
							</CardActionArea>
						</Card>
					</Grid>
					<Grid item md={4}>
						<Card
							style={{backgroundColor:"rgb(189,123,41)", margin: "20px"}}
							sx={{
								'.MuiCardContent-root': {
									':last-child': {
										paddingBottom: 1,
									}
								}
							}}
						>
							<CardActionArea onClick={() => {
								history.push(`/Admin/Settings/Appearance`);
							}}>
								<CardContent sx={{
									display: 'flex',
									flexDirection: 'column',
									height: '100%',
									justifyContent: 'space-between',
									width: '100%',
									color: 'white',
									//padding: 1,
								}}>
									<Typography variant="h4">
										Site Manager
									</Typography>
									<Typography>
										Change site appearance
									</Typography>

								</CardContent>
							</CardActionArea>
						</Card>
					</Grid>
				</Grid>
			</Box>
		</Box>
	)
}