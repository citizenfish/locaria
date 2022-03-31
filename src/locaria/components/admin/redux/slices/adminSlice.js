import React from 'react';

import { createSlice } from '@reduxjs/toolkit'
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined';
import AdminUpload from '../../components/adminUpload'
import AdminEdit from '../../components/adminEdit'
import AdminModerate from "../../components/adminModerate";
import AdminExport from "../../components/adminExport";
import AdminUsers from "../../components/adminUsers";
import AdminReports from "../../components/adminReports";

export const adminSlice = createSlice({
	name: 'adminSlice',
	initialState: {
		selectedComponent: {id:"upload",name:"Upload Data",icon:<DriveFolderUploadOutlinedIcon />,component:AdminUpload},
		components: [
			{id:"upload",name:"Upload Data",icon:<DriveFolderUploadOutlinedIcon />,component:AdminUpload},
			{id:"edit",name:"Edit Data",icon:<EditOutlinedIcon />,component:AdminEdit},
			{id:"moderate",name:"Moderate",icon:<AssignmentTurnedInOutlinedIcon/>,component:AdminModerate},
			{id:"export",name:"Export",icon:<GetAppOutlinedIcon />,component:AdminExport},
		]
	},
	reducers: {
		openComponent: (state,action) => {
			for(let c in state.components) {
				if(state.components[c].id===action.payload) {
					state.selectedComponent = state.components[c];
					return;
				}
			}
		}
	},
})

// Action creators are generated for each case reducer function
export const { openComponent } = adminSlice.actions

export default adminSlice.reducer