import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Button from "@mui/material/Button";
import {useHistory, useParams} from "react-router-dom";
import TokenCheck from "widgets/utils/tokenCheck";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid"
import Chip from "@mui/material/Chip";


import {cognitoGroups} from "libs/cognitoGroups"
import {useSelector} from "react-redux";

export default function AdminUsersManageEdit() {

	const history = useHistory();
	let {user} = useParams();
	const idToken = useSelector((state) => state.userSlice.idToken);


	const [userDetails,setUserDetails] = useState(undefined);

	useEffect(() => {
		window.websocket.registerQueue('userDetail', (json) => {
			setUserDetails(json.packet);
		});

		window.websocket.registerQueue('updateGroup', (json) => {
			getUser();
		});

			getUser();
	},[user]);

	const getUser = (values) => {

		window.websocket.send({
			"queue": "userDetail",
			"api": "sapi",
			"data": {
				"method": "user_details",
				id_token: idToken,
				"id":user
			}
		});

	}

	const handleDeleteGroup = (group) => {
		window.websocket.send({
			"queue": "updateGroup",
			"api": "sapi",
			"data": {
				"method": "delete_group",
				id_token: idToken,
				"id":user,
				"group":group
			}
		});
	}

	const handleAddGroup = (group) => {
		window.websocket.send({
			"queue": "updateGroup",
			"api": "sapi",
			"data": {
				"method": "add_group",
				id_token: idToken,
				"id":user,
				"group":group
			}
		});
	}

	const MakeGroups = () => {
		let groupReturn=[];
		//const groups=["Admins","Registered","Moderator","Loader"]
		for(let group in cognitoGroups['index']) {
			if(userDetails.groups.indexOf(cognitoGroups['index'][group])!==-1) {
			groupReturn.push(
				<Chip color={"success"} label={cognitoGroups['index'][group]} onDelete={()=>handleDeleteGroup(cognitoGroups['index'][group])}></Chip>
			)
			} else {
				groupReturn.push(
					<Chip label={cognitoGroups['index'][group]} onClick={()=>handleAddGroup(cognitoGroups['index'][group])}></Chip>
				)
			}
		}
		return groupReturn;
	}



	return (
		<Box sx={{display: 'flex'}}>
			<TokenCheck adminMode={true}/>
			<AdminAppBar title={`User - Manager`}/>

			<LeftNav isOpenUsers={true}/>
			<Box
				component="main"
				sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '60px'}}
			>

				<Grid container spacing={2}>
					<Grid item md={4}>
						<Button sx={{marginRight:"5px"}}
								variant="outlined"
								color="warning"
								onClick={() => {
									//TODO are you sure dialogue
									history.push(`/Admin/User/Manager`);
								}}>
							Back
						</Button>
					</Grid>
					<Grid item md={6}>
						<Typography>Edit user</Typography>
					</Grid>
				</Grid>
				{userDetails &&
					<>
					<Typography>{userDetails.email}</Typography>
					<MakeGroups/>
					</>
				}

			</Box>
		</Box>
	)
}