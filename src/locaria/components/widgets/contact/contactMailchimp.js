import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {TextField} from "@mui/material";
import Button from "@mui/material/Button";

import UrlCoder from "../../../libs/urlCoder";
import Box from "@mui/material/Box";
import RenderMarkdown from "../markdown/renderMarkdown";
import {useFormFields, useMailChimpForm} from "use-mailchimp-form";
import Typography from "@mui/material/Typography";


const ContactMailchimp = ({url}) => {



	const {
		loading,
		error,
		success,
		message,
		handleSubmit
	} = useMailChimpForm(url);
	const {fields, handleFieldChange} = useFormFields({
		EMAIL: "",
		FNAME: ""
	});

	return (
		<Grid container key={"contactFull"} spacing={2} sx={{
			display: "flex",
			alignItems: "top",
			justifyContent: "center"
		}}>
			<Grid item md={4} sx={{
				textAlign: "left"
			}}>

				<RenderMarkdown markdown={window.systemLang.contactLeft}/>

			</Grid>
			<Grid item md={4} sx={{
				textAlign: "left"
			}}>


				<RenderMarkdown markdown={window.systemLang.contactTitle}/>
				{!success && <>
					<TextField
						id={"FNAME"}
						sx={{
							marginTop: "10px",
							"& input": {
								color: window.systemMain.fontInput,
								fontFamily: window.systemMain['fontInputFont']
							}
						}}
						label={"Your name"}
						fullWidth={true}
						value={fields.FNAME}
						onChange={handleFieldChange}
					/>

					<TextField
						sx={{
							marginTop: "10px",
							"& input": {
								color: window.systemMain.fontInput,
								fontFamily: window.systemMain['fontInputFont']
							}
						}}
						id={"EMAIL"}
						label={"email address"}
						fullWidth={true}
						value={fields.EMAIL}
						onChange={handleFieldChange}
					/>

					<Button variant={"contained"} sx={{
						marginTop: "10px",
						backgroundColor: window.systemMain.headerBackground,
						borderRadius: "0px",
						paddingLeft: "30px",
						paddingRight: "30px",
						"&:hover":{
							backgroundColor: window.systemMain.headerBackground
						}

					}}
							onClick={(e) => {
								e.preventDefault();
								handleSubmit(fields);
							}}>
						Submit
					</Button>
				</>}
				{success &&
					<>
						<Typography variant="h2" sx={{
							fontSize: "1rem",
							color: window.systemMain.fontH2
						}}>
							{message}
						</Typography>
					</>
				}
			</Grid>
			<Grid item md={4} sx={{
				textAlign: "left"
			}}>
				<Box sx={{

					padding: "20px"

				}}>
					<RenderMarkdown markdown={window.systemLang.contactRight}/>
				</Box>

			</Grid>

		</Grid>
	);
}

export default ContactMailchimp;