import React from 'react';

import SearchSubCategory from "widgets/search/searchSubCategory";
import SearchTags from "widgets/search/searchTags";
import SearchCheckboxFilter from "widgets/search/searchCheckboxFilter";


export default function FilterLayoutSubCats({category}) {
	return (
		<>



			<SearchCheckboxFilter values={[{
				filter: true,
				path: "data.free",
				name: "Free",
				counts: "free"
			}]}/>

			<SearchSubCategory category={category}/>
			<SearchTags category={category}/>
		</>

	)

}