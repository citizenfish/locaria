import Box from "@mui/material/Box";
import React, {useContext} from "react";
import {Button, FormControlLabel, FormGroup, Modal} from "@mui/material";
import {useStyles} from "stylesLocaria";
import {configs} from "themeLocaria";
import Checkbox from '@mui/material/Checkbox';
import {useCookies} from "react-cookie";
import LocariaContext from "../context/locariaContext";
import Grid from "@mui/material/Grid";

const IntroModal = () => {
	const myContext = useContext(LocariaContext);

	const classes = useStyles();

	let useIntro = configs.intro !== undefined;

	if (useIntro === true)
		useIntro = !myContext.introModal;

	const [cookies, setCookies] = useCookies(['location']);

	if (cookies.dismiss === "true")
		useIntro = false;

	const [introOpen, setIntroOpen] = React.useState(useIntro);

	const [checked, setChecked] = React.useState(false);

	const handleChange = (event) => {
		setChecked(event.target.checked);
	};


	const closeIntro = () => {
		setIntroOpen(false);
		if (checked === true)
			setCookies('dismiss', "true", {path: '/', sameSite: true});
		myContext.seenIntroModal(true);
	}

	return (
		<Modal
			keepMounted
			open={introOpen}
			onClose={closeIntro}
			aria-labelledby="keep-mounted-modal-title"
			aria-describedby="keep-mounted-modal-description"
			className={classes.modal}
		>
			<Box className={classes.navIntroBox}>
				<Grid
					container
					spacing={0}
					direction="column"
					alignItems={"center"} justifyContent={"center"}
				>
					{configs.intro}

				</Grid>
				<FormGroup>
					<FormControlLabel control={<Checkbox color="secondary" id={"dismiss"} onChange={handleChange}/>}
					                  label="Don't show again"/>
					<Button size="small" color="secondary" variant="outlined" onClick={closeIntro}>Get
						Started</Button>
				</FormGroup>
			</Box>
		</Modal>
	)
}

export {IntroModal}