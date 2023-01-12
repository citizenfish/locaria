import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setPage} from "../../redux/slices/searchDrawerSlice";
import { Pagination } from '@mui/material'
export default function SearchPagination({}) {
	const totalPages = useSelector((state) => state.searchDraw.totalPages);
	const loading = useSelector((state) => state.searchDraw.loading);
	const searchParams = useSelector((state) => state.searchDraw.searchParams);

	const dispatch = useDispatch()

	function pageChange(e, page) {
		window.scrollTo(0, 0);
		dispatch(setPage(page));
	}

	if (loading === false&&totalPages>1) {
		return (
			<Pagination sx={{marginTop:"10px",marginBottom:"100px"}} count={totalPages} defaultPage={searchParams.page} variant="outlined" onChange={pageChange}/>
		)
	} else {
		return (<></>)
	}
};