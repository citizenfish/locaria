import React from 'react';
import Typography from "@mui/material/Typography";
import RenderMarkdown from "../../markdown/renderMarkdown";

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
			}}><RenderMarkdown markdown={prompt}/></Typography>}
		</>
	)
}

export default DataItemsTypography;