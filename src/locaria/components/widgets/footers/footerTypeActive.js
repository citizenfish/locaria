import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
const head_sx = {fontFamily: "Montserrat", color: "#FFF", fontWeight:700}
const divider_sx ={m:2, borderColor: "#FFF"}
const typ_sx = {fontFamily: "Montserrat", color: "#FFF", fontWeight:300, mt:1, display: "block"}

const FooterTypeActive = function () {


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
					  backgroundImage: "linear-gradient(5deg, #66cc99, #8dcbcc 87.14%)",
					  marginTop: "5px",
					  display: "flex",
					  justifyContent: "center"
				  }}
			>
				<Grid item md={4} sx={{
					textAlign: "center",
					padding: "10px"
				}}>
					<Link sx={head_sx} href={"/About/"}>About Active Prescription</Link>
					<Divider sx = {divider_sx}/>
					<Link sx = {typ_sx} href={"/About/#Aim"}>Our aim</Link>
					<Link sx = {typ_sx} href={"/About/#Locaria"}>Locaria</Link>
					<Link sx = {typ_sx} href={"/About/#GetInTouch"}>Get in touch</Link>
					<Link sx = {typ_sx} href={"/About/#Nautoguide"}>(c) Nautoguide Ltd.</Link>
				</Grid>
				<Grid item md={4} sx={{
					textAlign: "center",
					padding: "10px",
					cursor: "pointer"
				}}>
					<Link sx={head_sx} href={"/ProviderForm/"}>Submit Your Event</Link>
					<Divider sx = {divider_sx}/>
					<Link sx = {typ_sx} href={"/ProviderForm/#Register"}>Register</Link>
					<Link sx = {typ_sx} href={"/ProviderForm/#SignIn"}>Sign in and submit</Link>
				</Grid>
					<Grid item md={4} sx={{
						textAlign: "center",
						padding: "10px"
					}}>
						<Link sx={head_sx} href={"/Learn/"}>Learn More</Link>
						<Divider sx = {divider_sx}/>
						<Link sx = {typ_sx} href={"/Learn/#Activities"}>Activities</Link>
						<Link sx = {typ_sx} href={"/Learn/#Mental"}>Mental Health</Link>
						<Link sx = {typ_sx} href={"/Learn/#Healthy"}>Healthy Eating</Link>
						<Link sx = {typ_sx} href={"/Learn/#Home"}>Do it at home</Link>

				</Grid>

			</Grid>
		</Box>
	)
}

export default FooterTypeActive;