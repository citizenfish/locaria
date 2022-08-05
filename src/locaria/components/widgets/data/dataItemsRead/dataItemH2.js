import React from 'react';
import TypographyHeader from "../../typography/typographyHeader";

const DataItemH2 = ({name, data, sx}) => {
	return (
		<TypographyHeader sx={sx} element={"h2"}>{data}</TypographyHeader>
	)
}

export default DataItemH2;