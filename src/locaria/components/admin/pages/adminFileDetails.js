import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import Grid from "@mui/material/Grid";
import AdminDialogConfirm from "../dialogues/adminDialogueConfirm";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FileRecordMapper from "../components/forms/fileRecordMapper";

export default function AdminFileDetails(props) {
    const fileSelected = useSelector((state) => state.fileSelect.currentSelected)

    const [dialogProps, setDialogueProps] = React.useState({open : false});

    const Registered = (details) => {
        return(<Grid container spacing = {1}>
            <Grid item md={2}>
                <Typography variant="subtitle1" noWrap>
                    File Status:
                </Typography>
            </Grid>
            <Grid item md={10}>
                <Typography variant="subtitle1" noWrap>
                    File is awaiting processing by the Locaria file processor
                </Typography>
            </Grid>

        </Grid>)
    }

    const FargateProcessed = (details) => {
        return(<Grid container spacing = {1}>
            <Grid item xs={2}>
                <Typography variant="subtitle1" noWrap>
                    File Status:
                </Typography>
            </Grid>
            <Grid item xs={10}>
                <Typography variant="subtitle1" noWrap>
                    File has been processed  by the Locaria file processor and is awaiting configuration for data mapping and import
                </Typography>
            </Grid>
            <Grid item md = {12}>
                <FileRecordMapper {...details}/>
            </Grid>
        </Grid>)
    }
    return(<div>
        <AdminDialogConfirm
            p = {dialogProps}
        />

        <Box sx={{ height: '800px', width: 1, mt: '40px'}}>
            <Grid container spacing = {1}>
                <Grid item xs={2}>
                    <Typography variant="subtitle1" noWrap>
                        File Name:
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography variant="subtitle1" noWrap>
                        <b>{fileSelected.name}</b>
                    </Typography>
                </Grid>
            </Grid>

            {fileSelected['status'] === 'REGISTERED' && <Registered details={fileSelected}/>}
            {fileSelected['status'] === 'FARGATE_PROCESSED' && <FargateProcessed details={fileSelected}/>}
        </Box>
    </div>)
}