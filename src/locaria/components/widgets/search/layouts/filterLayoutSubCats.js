import React from 'react';

import SearchSubCategory from "widgets/search/searchSubCategory";
import SearchTags from "widgets/search/searchTags";
import TodayIcon from "@mui/icons-material/Today";
import SearchCheckboxFilter from "widgets/search/searchCheckboxFilter";
import AddCardIcon from "@mui/icons-material/AddCard";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";

export default function FilterLayoutSubCats({category}) {
	return (
		<>
			<SearchCheckboxFilter values={[{
				filter: true,
				path: "data.free",
				icon: <AddCardIcon/>,
				checkedIcon: <CreditCardOffIcon/>,
				counts: "free"
			}]}/>
			<SearchCheckboxFilter formatter={"stack"} values={[
				{
					icon: <TodayIcon/>,
					checkedIcon: <TodayIcon/>,
					name: "Su",
					filter: "true",
					path: "data.days.Sunday",
					counts: "days.Sunday"

				},
				{
					icon: <TodayIcon/>,
					checkedIcon: <TodayIcon/>,
					name: "M",
					filter: "true",
					path: "data.days.Monday",
					counts: "days.Monday"
				}, {
					icon: <TodayIcon/>,
					checkedIcon: <TodayIcon/>, name: "T", filter: "true", path: "data.days.Tuesday",
					counts: "days.Tuesday"

				}, {
					icon: <TodayIcon/>,
					checkedIcon: <TodayIcon/>,
					name: "W",
					filter: "true",
					path: "data.days.Wednesday",
					counts: "days.Wednesday"

				}, {
					icon: <TodayIcon/>,
					checkedIcon: <TodayIcon/>, name: "Th", filter: "true", path: "data.days.Thursday",
					counts: "days.Thursday"

				}, {
					icon: <TodayIcon/>,
					checkedIcon: <TodayIcon/>,
					name: "F",
					filter: "true",
					path: "data.days.Friday",
					counts: "days.Friday"

				}, {
					icon: <TodayIcon/>,
					checkedIcon: <TodayIcon/>, name: "Sa", filter: "true", path: "data.days.Saturday",
					counts: "days.Saturday"

				}]}/>
			<SearchSubCategory category={category}/>
			<SearchTags category={category}/>
		</>

	)

}