import React, {useEffect, useRef,useState} from 'react'
import Box from '@mui/material/Box';
import {Button, Grid, Select, FormControl, InputLabel, Input} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {useCookies} from "react-cookie";

const selectStyles = {
    category: {minWidth:300, m:1},
    format: {minWidth:350, m:1}
}

let formats = [
    {
        format: 'geopackage',
        title : 'GeoPackage',
        default: false
    },
    {
        format: 'xlsx' ,
        title : 'Microsoft Excel',
        default: true
    },
    {   format: 'json',
        title: 'JSON',
        default: false
    }];

export default function FileDownloader(props) {

    const [categories, setCategories] = useState([])
    const [categorySelected, setCategorySelected] = useState([])
    const [format,setFormat] = useState('xlsx')
    const [fileName,setFileName] = useState('')
    const [cookies, setCookies] = useCookies(['location']);
    //TODO repeated code in fileRecordManager.js
    useEffect(()=>{
        window.websocket.registerQueue("listCategories", function (json) {
            setCategories(json.packet.categories)
        })

        window.websocket.registerQueue("downLoadData", function (json) {
            setDisabled(true)
        })

    },[])

    useEffect(() => {
        window.websocket.send({
            queue: 'listCategories',
            api: "api",
            data: {
                method: "list_categories",
            }
        })
    }, [])

    const fieldList = (arr) => {
        return arr.map((key) => (
            <MenuItem key = {key} value={key}>{key}</MenuItem>
        ))
    }

    const formatItems = (formats) => {

        return formats.map((format) => (
            <MenuItem
                key = {format.format}
                value = {format.format}
                selected = {format.default}
            >{format.title}</MenuItem>
        ))
    }
    //END TODO

    const requestDownload = () =>{
        window.websocket.send({
            queue : 'downLoadData',
            api : "sapi",
            data : {
                method: "request_download_data",
                file_attributes : {
                    format : format,
                    //"filters": { 'tags' : tags},
                    categories: categorySelected,
                    type : "all_data",
                    download : true,
                    name : fileName
                },
                status : "DOWNLOAD_REQUESTED",
                id_token: cookies['id_token']
            }
        })

        props.show(false)
    }
    return(
        <Box
            component="div"
            sx={{
                p:2,
                mt:2,
                border: '2px dashed #c3c4c7',
                borderRadius: 1,
                display: "flex",

            }}
        >
            <Grid container spacing={2}>
                <Grid item md={6}>

                    <FormControl sx = {{mt:2}}>
                        <InputLabel htmlFor="categorySelect">Category</InputLabel>
                        <Select
                                id="categorySelect"
                                sx={selectStyles.category}
                                value = {categorySelected}
                                label = {categorySelected}
                                multiple = {true}
                                onChange={(e) => {
                                setCategorySelected(e.target.value)
                            }}>
                            {
                                categories.length > 0 && fieldList(categories)
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md = {6}>
                    <FormControl sx = {{mt:2}}>
                        <InputLabel htmlFor="formatSelect">Download Format</InputLabel>
                    <Select
                        sx={selectStyles.format}
                        id = 'formatSelect'
                        value = {format}
                        onChange={(e) => {
                            setFormat(e.target.value)
                        }}>
                        {formatItems(formats)}
                    </Select>
                    </FormControl>
                </Grid>
                <Grid item md ={6}>
                    <FormControl sx = {{mt:2}}>
                        <InputLabel htmlFor="fileName">File name</InputLabel>
                        <Input value={fileName} onChange={(e)=>{setFileName(e.target.value)}}></Input>
                    </FormControl>
                </Grid>
                <Grid item md={6}>
                   <Button variant="contained"
                           onClick={() =>{

                               requestDownload()

                           }}
                   >
                       Request Download
                   </Button>
                </Grid>
            </Grid>
        </Box>
    )
}