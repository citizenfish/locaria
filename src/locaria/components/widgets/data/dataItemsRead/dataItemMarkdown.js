import React from 'react';
import RenderMarkdown from "../../markdown/renderMarkdown";

const DataItemTitle = ({name, data}) => {
	return (
		<RenderMarkdown markdown={data}/>
	)
}

export default DataItemTitle;