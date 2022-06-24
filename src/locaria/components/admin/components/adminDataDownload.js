import React, {useEffect, useRef,useState} from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import {useCookies} from "react-cookie";

export default function AdminDataDownload(props) {

    const [categories,setCategories] = useState(null)
    const [filters,setFilters] = useState({})
    const [format,setFormat] = useState('xlsx')
    const [cookies, setCookies] = useCookies(['location']);
    const [disabled,setDisabled] = useState(false)

    useEffect(() => {
        window.websocket.registerQueue("downLoadData", function (json) {
            setDisabled(true)
        })
    },[])

    const downLoadData = (e) => {
        //TODO add json/geopackage options and filters/category selection
        window.websocket.send({
            "queue" : 'downLoadData',
            "api" : "sapi",
            "data" : {
                "method": "request_download_data",
                "file_attributes" : {
                    "format" : format,
                    "filters": filters,
                    "categories": categories,
                    "type" : "all_data"
                },
                "status" : "DOWNLOAD_REQUESTED",
                "id_token": cookies['id_token']
            }
        })
    }

    return (
        <Box
            component="div"
            sx={{
                p:2,
                mt:2,
            }}
        >
            <Button variant="contained"
                    onClick={downLoadData}
                    disabled={disabled}
                    component="span">
                Download Data
            </Button>
        </Box>
    )
}