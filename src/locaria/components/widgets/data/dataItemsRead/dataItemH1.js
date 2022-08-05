import React from 'react';
import TypographyHeader from "../../typography/typographyHeader";

const DataItemH1 = ({name, data, sx}) => {
	return (
		<TypographyHeader sx={sx} element={"h1"}>{data}</TypographyHeader>
	)
}

export default DataItemH1;