import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import TokenCheck from "../components/utils/tokenCheck";
import {useCookies} from "react-cookie";
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import Typography from "@mui/material/Typography";
import CategorySelector from "../components/selectors/categorySelector";
import {DataGrid} from "@mui/x-data-grid";

export default function AdminImportUpload() {

    const dispatch = useDispatch()
    const history = useHistory();

    return(
        <Box sx={{display: 'flex'}}>
            <TokenCheck></TokenCheck>
            <AdminAppBar title={`API Settings`}/>
            <LeftNav isOpenContent={true}/>

            <Box
                component="main"
                sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '60px'}}
            >
                <Typography variant = "h4" mb={1}>Import</Typography>
                <Typography mb={1}>Sort out file Import here</Typography>


            </Box>
        </Box>
    )
}