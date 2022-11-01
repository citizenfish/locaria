import React, {useEffect, useState} from "react"
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import {useCookies} from "react-cookie";
import Grid from "@mui/material/Grid";
import LinearProgressWithLabel from "../components/utils/LinearProgress";
import {setFile,setVisible,setRefresh} from "../redux/slices/fileSelectSlice";
import {useDispatch} from "react-redux";

const loadBoxStyle = {
    p: 2,
    mt: 2,
    border: '1px solid grey',
    borderRadius: '5px'
}
export default function AdminLoadFileData(props) {

    const [cookies, setCookies] = useCookies(['location'])
    const [dataLoading,setDataLoading] = useState(true)
    const [loadResult, setLoadResult] = useState({loaded: false, percentage: 0})
    const dispatch = useDispatch()

    let fileDetails = props.fileDetails

    useEffect(() =>{
        //Register the initial ws queue for getting details of files, only fired once on render
        window.websocket.registerQueue("loadFileData", function(json){

            if(json.packet.status === undefined) {
                json.packet['status'] = 'ERROR'
            }

            if(json.packet.status === 'IMPORTING') {

                setLoadResult({
                    loaded: false,
                    status : 'IMPORTING',
                    count : json.packet.processed,
                    total: json.packet.record_count,
                    percentage: 100*(json.packet.processed/json.packet.record_count)
                })
            }

            if(json.packet.status === 'IMPORTED') {
                setLoadResult({loaded: true, percentage: 100})
                setDataLoading(false)
            }

        })

    },[])

    useEffect(() => {
        if(dataLoading && loadResult.percentage < 100) {
            window.websocket.send({
                queue: 'loadFileData',
                api: "sapi",
                data: {
                    id_token: cookies['id_token'],
                    method: "load_preview_file_data",
                    table: fileDetails.attributes.imported_table_name,
                    title_field: fileDetails.title_field,
                    text_field: fileDetails.text_field,
                    url_field: fileDetails.link_field,
                    _geocoder_type: fileDetails._geocoder_type,
                    x_field: fileDetails.x_field,
                    y_field: fileDetails.y_field,
                    postcode_field: fileDetails.postcode_field,
                    id: fileDetails.id,
                    category: fileDetails.category
                    //TODO tags
                }
            })
        }

   },[loadResult])

    return(<Box sx={loadBoxStyle}>
        <Grid container spacing={2}>
            <Grid item md={4}>
                <Typography>Loading {fileDetails.name}</Typography>
            </Grid>
            <Grid item md={6}>
                <LinearProgressWithLabel value = {loadResult.percentage || 0}/>
            </Grid>
            <Grid item md={2}>
                <Button variant={"contained"}
                        onClick = {()=>{

                            if(dataLoading) {
                                //Stop the loading process
                                setDataLoading(false)
                            } else {
                                //Show the file selector screen and make it update status
                                dispatch(setVisible(true))
                                dispatch(setRefresh())
                                dispatch(setFile({}))
                            }
                        }}>
                    {dataLoading && 'Cancel'}
                    {!dataLoading && 'Done'}
                </Button>
            </Grid>
        </Grid>
    </Box>)

}