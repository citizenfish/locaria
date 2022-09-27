import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import TokenCheck from "../components/utils/tokenCheck";
import {useCookies} from "react-cookie";
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import ApiSelector from "../components/selectors/apiSelector";

export default function AdminAPISettings() {

    const [cookies, setCookies] = useCookies(['location']);
    const history = useHistory();

    return(
        <Box sx={{display: 'flex'}}>
            <TokenCheck></TokenCheck>
            <AdminAppBar title={`API Settings`}/>
            <LeftNav isOpenImport={true}/>

            <Box
                component="main"
                sx={{flexGrow: 1, bgcolor: 'background.default', p: 3, marginTop: '60px'}}
            >

                <ApiSelector/>

            </Box>
        </Box>
    )
}