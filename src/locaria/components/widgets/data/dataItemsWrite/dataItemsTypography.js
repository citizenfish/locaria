import React from 'react';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {Badge} from "@mui/material";

const DataItemsTypography = ({name, prompt, required}) => {


	return (
		<>

			<Badge color="error"  badgeContent={"Required"} sx={{
				"& .MuiBadge-badge": {
					opacity: "0.5"
				}
			}} anchorOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}} invisible={!required}>
				<Typography sx={{
					fontWeight: "600"
				}}>{name}</Typography>
			</Badge>
			{prompt && <Typography sx={{
				fontSize: "0.8em"
			}}>{prompt}</Typography>}
		</>
	)
}

export default DataItemsTypography;