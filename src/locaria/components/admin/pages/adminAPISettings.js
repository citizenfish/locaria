import React from 'react';
import TokenCheck from "widgets/utils/tokenCheck";
import Box from "@mui/material/Box";
import AdminAppBar from "../adminAppBar";
import LeftNav from "../components/navs/leftNav";
import ApiSelector from "../components/selectors/apiSelector";

export default function AdminAPISettings() {

    return(
        <Box sx={{display: 'flex'}}>
            <TokenCheck adminMode={true}/>
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