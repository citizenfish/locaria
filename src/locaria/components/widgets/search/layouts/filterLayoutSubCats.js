import React from 'react';

import SearchSubCategory from "widgets/search/searchSubCategory";
import SearchTags from "widgets/search/searchTags";
import SearchToggleBox from "widgets/search/searchToggleBox";
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';

export default function FilterLayoutSubCats({category}) {
	return (
		<>



			<SearchToggleBox path={"data.free"} name={"Free"} Icon={CurrencyPoundIcon}/>

			<SearchSubCategory category={category}/>
			<SearchTags category={category}/>
		</>

	)

}