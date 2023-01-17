import React from 'react';
import {encodeSearchParams} from "libs/searchParams";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

function useSearchRouter() {
	const history = useHistory();

	const schema = useSelector((state) => state.searchDraw.schema);
	const currentLocation = useSelector((state) => state.userSlice.currentLocation);
	const gotoCategory = useSelector((state) => state.userSlice.gotoCategory);


	function route() {
		let encodedParams = encodeSearchParams({
			location: currentLocation.location,
			sendRecommended: true
		}, schema);

		switch (gotoCategory) {
			case 'Activities':
				history.push('/Activities/sp/Activities/' + encodedParams);
				break;
			case 'Mental Health':
				history.push('/MentalHealth/sp/Mental Health/' + encodedParams);
				break;
			case 'Healthy Eating':
				history.push('/HealthyEating/sp/Healthy Eating/' + encodedParams);
				break;
			case 'Do It At Home':
			default:
				history.push('/DoItAtHome/sp/Do It At Home/' + encodedParams);
				break;
		}
	}

	return route;
}

export default useSearchRouter;