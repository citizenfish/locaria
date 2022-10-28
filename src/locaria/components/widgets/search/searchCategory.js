import React, {useEffect, useState} from 'react';
import {setSearch, setSubCategoryList} from "../../redux/slices/searchDrawerSlice";
import {useDispatch, useSelector} from "react-redux";

import Treeview from "../data/treeview";

export default function SearchCategory({id="search",sx,multi=true,levels=1,category}) {
	const dispatch = useDispatch()

	const [searchId, setSearchId] = useState(undefined);

	let categorySubs=window.systemCategories.getChannelSubs(category);

	useEffect(() => {
		if (id !== searchId) {
			setSearchId(id);
			dispatch(setSearch({search: '', refresh: false, subCategories:[]}));
		}
	}, [id]);


	const handleCheck = (nodeIds) => {
		//dispatch(setSubCategoryList(nodeIds));
	}


	return (
		<Treeview multi={true} levels={1} setFunction={handleCheck} treeData={categorySubs}/>
	)

}


