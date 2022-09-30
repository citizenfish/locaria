import React, {useEffect} from 'react';
import EditMarkdown from "../../markdown/editMarkdown";
import {setFieldValue, setupField} from "../../../redux/slices/formSlice";
import {useDispatch} from "react-redux";

const DataItemEditMarkdown = ({id,name, data,simple,required}) => {

	const dispatch = useDispatch()


	useEffect(() => {
		dispatch(setupField({index: id, value: data,required:required}))
	},[]);

	function updateFunction(obj) {
		console.log(obj);
		dispatch(setFieldValue({index: id, value: obj}))


	}

	return (
		<EditMarkdown id={id} mode={"wysiwyg"}
					  documentObj={data} simple={simple} updateFunction={updateFunction}/>
	)
}

export default DataItemEditMarkdown;