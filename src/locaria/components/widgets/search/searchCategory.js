import React from 'react';
import { setTags} from "../../redux/slices/searchDrawerSlice";
import {useDispatch} from "react-redux";

import Treeview from "../data/treeview";

export default function SearchCategory({sx,multi=true,levels=1,category}) {

	const dispatch = useDispatch()

	let categorySubs=window.systemCategories.getChannelSubs(category);


	const handleCheck = (nodeIds) => {
		dispatch(setTags(nodeIds));
	}

	return (
		<Treeview multi={true} levels={1} setFunction={handleCheck} treeData={categorySubs}/>
	)

}


