import React, {useEffect} from 'react';
import {setFeatures} from "../../redux/slices/searchDrawerSlice";
import {useDispatch} from "react-redux";

export default function SearchProxy() {

	const dispatch = useDispatch();

	useEffect(() => {
		window.websocket.registerQueue("searchFeatures", function (json) {
			dispatch(setFeatures(json.packet.geojson.features));
		});

	}, []);

	return (<></>)
}