import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {useHistory} from "react-router-dom";
const head_sx = {fontFamily: "Montserrat", color: "#FFF", fontWeight:700}
const divider_sx ={m:2, borderColor: "#FFF"}
const typ_sx = {fontFamily: "Montserrat", color: "#FFF", fontWeight:300, mt:1}

const FooterTypeActive = function () {
	const history = useHistory();


	return (
		<Box key={"footerTypeSimple"} sx={{
			width: "100%",
			justifyContent: 'space-between',
			backgroundColor: window.systemMain.headerBackground,
			marginTop: "10px"
		}}>
			<Grid container
				  sx={{
					  width: "100%",
					  height: "200px",
					  backgroundImage: "linear-gradient(5deg, #fa8080, #ffdf62 87.14%, #f7ec94 91.18%)",
					  marginTop: "5px",
					  display: "flex",
					  justifyContent: "center"
				  }}
			>
				<Grid item md={4} sx={{
					textAlign: "center",
					padding: "10px"
				}}>
					<Typography sx={head_sx}>About Active Prescription</Typography>
					<Divider sx = {divider_sx}/>
					<Typography sx = {typ_sx} >Our aim</Typography>
					<Typography sx = {typ_sx} >(c) Nautoguide Ltd.</Typography>
					<Typography sx = {typ_sx} >Locaria</Typography>
					<Typography sx = {typ_sx} >Get in touch</Typography>
				</Grid>
				<Grid item md={4} onClick={()=>{history.push('/ProviderForm/')}} sx={{
					textAlign: "center",
					padding: "10px",
					cursor: "pointer"
				}}>
					<Typography sx={head_sx}>Submit Your Event</Typography>
					<Divider sx = {divider_sx}/>
					<Typography sx = {typ_sx} >Register</Typography>
					<Typography sx = {typ_sx} >Sign in and submit</Typography>
				</Grid>
					<Grid item md={4} sx={{
						textAlign: "center",
						padding: "10px"
					}}>
						<Typography sx={head_sx}>Learn More</Typography>
						<Divider sx = {divider_sx}/>
						<Typography sx = {typ_sx} >Activities</Typography>
						<Typography sx = {typ_sx} >Mental Health</Typography>
						<Typography sx = {typ_sx} >Healthy Eating</Typography>
						<Typography sx = {typ_sx} >Do it at home</Typography>

				</Grid>

			</Grid>
		</Box>
	)
}

export default FooterTypeActive;