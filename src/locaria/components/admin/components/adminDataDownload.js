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
        console.log(e)
        window.websocket.send({
            "queue" : 'addFile',
            "api" : "lapi",
            "data" : {
                "method": "add_file",
                "file_attributes" : {
                    "file_type" : contentType,
                    "name" : file.name,
                    "ext" : extension
                },
                "contentType" : contentType,
                "id_token": cookies['id_token']
            }
        })
    }

    return (
        <Box component="div" sx={{
            p:2,
            mt:2,
            border: '1px solid grey',
            borderRadius: '5px' }}
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