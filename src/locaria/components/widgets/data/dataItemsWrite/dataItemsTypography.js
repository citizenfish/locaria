import React from 'react';
import Typography from "@mui/material/Typography";

const DataItemsTypography = ({name, prompt, required}) => {


	return (
		<>
			{required&& <Typography sx={{color: "red", display:"inline-block", paddingRight: "5px"}}>*</Typography>}

				<Typography sx={{
					fontWeight: "600",
					display:"inline-block"
				}}>{name}</Typography>
			{prompt && <Typography sx={{
				fontSize: "0.8em"
			}}>{prompt}</Typography>}
		</>
	)
}

export default DataItemsTypography;