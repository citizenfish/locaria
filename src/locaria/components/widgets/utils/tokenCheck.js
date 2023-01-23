import React, {useState} from 'react';
import {useLocation} from "react-router-dom";

import {resources} from "themeLocaria";
import {useDispatch, useSelector} from "react-redux";
import { setUser} from "../../admin/redux/slices/adminPagesSlice";
import {setSavedAttribute, setValidUser} from "components/redux/slices/userSlice";

export default function TokenCheck({adminMode=false}) {

	const location = useLocation();

	const dispatch = useDispatch()

	const [haveChecked, setHaveChecked] = useState(false);
	const idToken = useSelector((state) => state.userSlice.idToken);


	React.useEffect(() => {
		let hash = window.location.hash;

		if (hash&&hash.match(/#id_token/)) {
			hash = hash.replace(/#id_token=/, '');
			hash = hash.replace(/&.*/, '');
		} else {
			hash = undefined;
		}

		window.websocket.registerQueue("tokenCheck", function (json) {
			setHaveChecked(true);
			if (json.packet.email) {
				// if its has its new, if not just keep the old one
				dispatch(setUser(true));

				if (hash) {
					dispatch(setSavedAttribute({attribute: 'idToken', value: hash}));
					dispatch(setValidUser({groups:json.packet['cognito:groups'],id:json.packet['cognito:username']}));

					const start = Date.now();
					const exp = (parseInt(json.packet.exp) * 1000)
					const diff = exp - (start + 60000);
					console.log(`Expires ${diff / 60000}`);
					setTimeout(function () {
						window.location = `https://${resources.cognitoURL}/login?response_type=token&client_id=${resources.poolClientId}&redirect_uri=${location.protocol}//${location.host}/`;
					}, diff);
				}
			} else {
				dispatch(setSavedAttribute({attribute: 'idToken', value: null}));
				// This is bad token so lets go home
				dispatch(setUser(false));
				if(adminMode)
					window.location = `https://${resources.cognitoURL}/login?response_type=token&client_id=${resources.poolClientId}&redirect_uri=${window.location.protocol}//${window.location.host}/Admin/`;
				else
					window.location = `/`;

			}
		});

		if (haveChecked === false) {
		/*	if (hash===undefined) {
				if (idToken===undefined&&adminMode) {
					debugger;
					window.location = `https://${resources.cognitoURL}/login?response_type=token&client_id=${resources.poolClientId}&redirect_uri=${window.location.protocol}//${window.location.host}/Admin/`;
				}
			}*/




			if (hash) {
				setHaveChecked(true);

				window.websocket.send({
					"queue": "tokenCheck",
					"api": "token",
					"data": {"id_token": hash}
				});
			} else {

				if (idToken !== undefined) {
					setHaveChecked(true);
					window.websocket.send({
						"queue": "tokenCheck",
						"api": "token",
						"data": {
							"id_token": idToken
						}
					});
				} else {
					dispatch(setUser(false));
				}
			}
		}
	},[haveChecked,idToken]);

	return (<></>);
}