import React from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import TokenCheck from "widgets/utils/tokenCheck";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid"
import ConfigSelector from "../components/selectors/configSelector";

export default function AdminConfig() {



	return (
		<Box sx={{display: 'flex'}}>
			<TokenCheck adminMode={true}/>
			<AdminAppBar title={`Config - Parameters`}/>

			<LeftNav isOpenConfig={true}/>
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '60px'}}
			>

				<Grid container spacing={2}>

					<Grid item md={6}>
						<Typography>The page manager allows you to edit the config parameters of your Locaria site. </Typography>
					</Grid>
				</Grid>

				<ConfigSelector/>

			</Box>
		</Box>
	)
}