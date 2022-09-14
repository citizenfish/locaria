import React from 'react';
import EditMarkdown from "../../markdown/editMarkdown";

const DataItemEditMarkdown = ({id,name, data,simple}) => {
	return (
		<EditMarkdown id={id} mode={"wysiwyg"}
					  documentObj={data} simple={simple}/>
	)
}

export default DataItemEditMarkdown;