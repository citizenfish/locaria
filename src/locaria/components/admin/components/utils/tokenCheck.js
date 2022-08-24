import React, {useState} from 'react';
import {useLocation} from "react-router-dom";
import {useCookies} from "react-cookie";

import {resources} from "themeLocaria";
import {useDispatch} from "react-redux";
import {setUser} from "../../redux/slices/adminPagesSlice";

export default function TokenCheck() {

	const location = useLocation();

	const [cookies, setCookies] = useCookies(['id_token']);

	const dispatch = useDispatch()

	const [haveChecked, setHaveChecked] = useState(false);


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
					setCookies('id_token', hash, {path: '/', sameSite: true});
					setCookies('groups', json.packet['cognito:groups'], {path: '/', sameSite: true});
					const start = Date.now();
					const exp = (parseInt(json.packet.exp) * 1000)
					const diff = exp - (start + 60000);
					console.log(`Expires ${diff / 60000}`);
					setTimeout(function () {
						window.location = `https://${resources.cognitoURL}/login?response_type=token&client_id=${resources.poolClientId}&redirect_uri=${location.protocol}//${location.host}/`;
					}, diff);
				}

			} else {
				setCookies('id_token', null, {path: '/', sameSite: true});
				setCookies('groups', [], {path: '/', sameSite: true});
				// This is bad token so lets go home
				dispatch(setUser(false));
				window.location = `/Admin/`;

			}
		});

		if (haveChecked === false) {
			if (hash===undefined) {
				if (cookies['id_token'] === undefined ||
					cookies['id_token'] === "null") {
					window.location = `https://${resources.cognitoURL}/login?response_type=token&client_id=${resources.poolClientId}&redirect_uri=${window.location.protocol}//${window.location.host}/Admin/`;
				}
			}




			if (hash) {
				window.websocket.send({
					"queue": "tokenCheck",
					"api": "token",
					"data": {"id_token": hash}
				});
			} else {
				if (cookies['id_token'] !== 'null') {
					window.websocket.send({
						"queue": "tokenCheck",
						"api": "token",
						"data": {
							"id_token": cookies['id_token']
						}
					});
				} else {
					dispatch(setUser(false));
				}
			}
		}
	},[haveChecked]);

	return (<></>);
}