import React, {useEffect,useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import StripedDataGrid from "../../../widgets/data/stripedDataGrid";
import {setModerations} from "../../redux/slices/featureSlice";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AdminDialogConfirm from "../../dialogues/adminDialogueConfirm";
import {objectPathGet} from "libs/objectTools";
import {useHistory} from "react-router-dom";
import {setFeature} from "../../redux/slices/adminPagesSlice";


export default function AdminModerationSelector(){

    const dispatch = useDispatch()
    const moderationItems = useSelector((state) => state.featureState.moderations)
    const idToken = useSelector((state) => state.userSlice.idToken);

    const [dialogProps, setDialogueProps] = useState({open : false});
    const [refresh, setRefresh] = useState(false);
    const history = useHistory();

    const deleteModeration = (fid) =>{
        window.websocket.send({
            queue: 'moderationActions',
            api: "sapi",
            data: {
                method: "delete_item",
                fid : fid,
                id_token: idToken
            }
        })
    }

    const publishModeration = (params) => {
        window.websocket.send({
            queue: 'moderationActionPublish',
            api: "sapi",
            data: {
                method: "update_item",
                fid : params.fid,
                moderation_id: params.id,
                id_token: idToken,
                //An item becomes published by having the acl "PUBLIC" on view
                acl: {view:['PUBLIC']}
            }
        })
    }

    const editModeration = (fid) => {
        dispatch(setFeature(fid));
        history.push(`/Admin/Content/Moderation/View/${fid}`);
    }

    const moderationActions = (params) => {
        let mID = params.row.id
        let mFID = params.row.fid
        let type = params.row.type
        let title = params.row.title
        return(
            <Grid container spacing={4}>
                <Grid item md={4}>
                    <Button variant="outlined"
                            color="success"
                            size="small"
                            onClick={() => {
                                setDialogueProps({
                                    open: true,
                                    title: 'Publish Item',
                                    text: `Are you sure you want to publish this item [${title}]?`,
                                    dismissText: 'Cancel',
                                    confirmText: 'Publish',
                                    confirmFunction: publishModeration,
                                    confirmParams: {fid: mFID, id: mID},
                                    openSet: setDialogueProps
                                })

                            }}>
                        Publish
                    </Button>
                </Grid>
                {type === 'ADD' &&
                <Grid item md={4}>
                    <Button variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => {
                                setDialogueProps({
                                    open: true,
                                    title: 'Delete Item',
                                    text: `Are you sure you want to delete this item [${title}]?`,
                                    dismissText: 'Cancel',
                                    confirmText: 'Delete',
                                    confirmFunction: deleteModeration,
                                    confirmParams: mFID,
                                    openSet: setDialogueProps
                                })
                            }}>
                        Delete
                    </Button>
                </Grid>
                }
                <Grid item md={4}>
                    <Button variant="outlined"
                            color="error"
                            size="small"
                            onClick={ () => {
                                //TODO at the moment this does not show the update that need moderating, only the original data
                                editModeration(mFID)
                            }}>
                        View
                    </Button>
                </Grid>
            </Grid>
        )
    }

    const columns = [
        {field: 'id', headerName: 'ID', width: 50},
        {field: 'fid', hide: true},
        {field: 'category', headerName: 'Category', width: 200},
        {field: 'title', headerName: 'Title', width: 300},
        {field: 'userEmail', headerName: 'User', width:300},
        {field:'type', headerName: 'Actions', width: 300, renderCell: moderationActions}
    ]

    useEffect(() => {
        window.websocket.registerQueue('moderationItems', (json) =>{
            if(json.packet.moderation_items){
                let rows = []
                let mi = json.packet.moderation_items
                for(let i in mi){
                    let item = mi[i]
                    rows.push({
                        id: item.id,
                        fid: item.fid,
                        category: item.attributes.category,
                        type: objectPathGet(item,'attributes.type'),
                        title: objectPathGet(item,'attributes.parameters.attributes.description.title'),
                        userEmail: objectPathGet(item,'attributes.parameters.acl._email')
                    })
                }
                dispatch(setModerations(rows))
            }
        })


        window.websocket.registerQueue('moderationActions', (json) =>{

            //update the count shown in leftNav this queue is set up there
            window.websocket.send({
                "queue": "getTotals",
                "api": "sapi",
                "data": {
                    "method": "view_report",
                    "id_token": idToken
                }
            });

            setRefresh(!refresh)
        });

        window.websocket.registerQueue('moderationActionPublish', (json) =>{
            window.websocket.send({
                "queue": "moderationActions",
                "api": "sapi",
                "data": {
                    "method": "refresh_search_view",
                    "id_token": idToken
                }
            });
        })

    },[])

    useEffect(() => {
        if(idToken) {
            window.websocket.send({
                queue: 'moderationItems',
                api: "sapi",
                data: {
                    method: "get_moderation_items",
                    id_token: idToken
                }
            })
        }
    },[refresh,idToken])

    return (
        <div>
            <AdminDialogConfirm
                p = {dialogProps}
            />

            <Box sx={{ height: '800px', width: 1, mt: '40px'}}>
            {moderationItems &&

            <StripedDataGrid
                    columns={columns}
                    rows={moderationItems}
                    initialState={{
                        sorting: { sortModel: [{ field: "id", sort: "desc" }] }
                    }}/>
            }

            </Box>
        </div>
    )
}