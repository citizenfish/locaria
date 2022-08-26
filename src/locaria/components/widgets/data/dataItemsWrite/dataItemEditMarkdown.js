import React from 'react';
import EditMarkdown from "../../markdown/editMarkdown";

const DataItemEditMarkdown = ({id,name, data}) => {
	return (
		<EditMarkdown id={id} mode={"wysiwyg"}
					  documentObj={data}/>
	)
}

export default DataItemEditMarkdown;