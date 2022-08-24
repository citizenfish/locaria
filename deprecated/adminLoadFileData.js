import React, {useEffect, useState} from "react"
import LinearProgressWithLabel from '../locaria/components/admin/components/utils/LinearProgress';
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import {useCookies} from "react-cookie";
import Grid from "@mui/material/Grid";

export default function AdminLoadFileData(props) {

    const [cookies, setCookies] = useCookies(['location'])
    const [dataLoading,setDataLoading] = useState(true)
    const [loadResult, setLoadResult] = useState({loaded: false, percentage: 0})

    useEffect(() =>{
        //Register the initial ws queue for getting details of files, only fired once on render
        window.websocket.registerQueue("loadFileData", function(json){
           console.log(json)

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
                setDataLoading(false)
            }


        })

    },[])

    useEffect(() => {
        window.websocket.send({
            queue: 'loadFileData',
            api: "sapi",
            data: {
                id_token: cookies['id_token'],
                method: "load_preview_file_data",
                table: props.fileDetails.imported_table_name,
                title_field: props.fileDetails.title_field,
                text_field : props.fileDetails.text_field,
                url_field: props.fileDetails.link_field,
                _geocoder_type: props.fileDetails._geocoder_type,
                x_field :props.fileDetails.x_field,
                y_field : props.fileDetails.y_field,
                postcode_field: props.fileDetails.postcode_field,
                id: props.fileDetails.id,
                category: props.fileDetails.category
            }
        })
    },[loadResult])

    return(<Box component="div" sx={{
        p: 2,
        mt: 2,
        border: '1px solid grey',
        borderRadius: '5px'
    }}>
        {dataLoading &&
            <LinearProgressWithLabel value={loadResult.percentage} />
        }

        {
            !dataLoading &&

            <Grid container spacing={2}>
                <Grid item xs={3}>
                    {loadResult.status !== 'ERROR' &&
                    <Typography variant="subtitle1" noWrap>
                        Data has loaded successfully
                    </Typography>
                    }

                    {loadResult.status === 'ERROR' &&
                        <Typography variant="subtitle1" noWrap>
                        Error in data load
                    </Typography>
                    }
                </Grid>
                <Grid item xs={3}>
                    <Typography variant="subtitle1" noWrap>
                        <Button variant='outlined'
                                color='error'
                                onClick={() => {
                                    props.open(null)
                                }}
                        >
                            Exit
                        </Button>
                    </Typography>
                </Grid>
            </Grid>
        }
    </Box>)
}