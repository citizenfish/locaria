import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {TextField} from "@mui/material";
import Button from "@mui/material/Button";

import Box from "@mui/material/Box";
import RenderMarkdown from "../markdown/renderMarkdown";
import {useFormFields, useMailChimpForm} from "use-mailchimp-form";
import Typography from "@mui/material/Typography";
import {useFormik} from "formik";
import * as yup from 'yup';


const validationSchemaEmail = yup.object({
	EMAIL: yup
		.string('Enter valid email')
		.email('Valid email')
		.required('Email is required'),
	FNAME: yup
		.string('Enter you name')
		.min(3, 'Name should be 3 of more characters')
		.required('Name is required'),
});

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

	const formik = useFormik({
		initialValues:{
			EMAIL:"",
			FNAME:""
		},
		validationSchema: validationSchemaEmail,
		onSubmit: (values) => {
			fields.EMAIL=values.EMAIL;
			fields.FNAME=values.FNAME;
			handleSubmit(fields);

		},
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
				{!success && <form onSubmit={formik.handleSubmit}>

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
						value={formik.values.FNAME}
						onChange={formik.handleChange}
						error={formik.touched.FNAME && Boolean(formik.errors.FNAME)}
						helperText={formik.touched.FNAME && formik.errors.FNAME}
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
						value={formik.values.EMAIL}
						onChange={formik.handleChange}
						error={formik.touched.EMAIL && Boolean(formik.errors.EMAIL)}
						helperText={formik.touched.EMAIL && formik.errors.EMAIL}
					/>

					<Button type={"submit"} variant={"contained"} sx={{
						marginTop: "10px",
						backgroundColor: window.systemMain.headerBackground,
						borderRadius: "0px",
						paddingLeft: "30px",
						paddingRight: "30px",
						"&:hover":{
							backgroundColor: window.systemMain.headerBackground
						}

					}}>
						Submit
					</Button>
				</form>}
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