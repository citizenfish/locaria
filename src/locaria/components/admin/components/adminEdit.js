import React, {useState,useEffect} from "react"
import {DataGrid} from '@mui/x-data-grid'
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from "@mui/icons-material/Search";
import TextField from '@mui/material/TextField';
import {useCookies} from "react-cookie";
import Button from "@mui/material/Button";


export default function AdminEdit(props) {

    const [cookies, setCookies] = useCookies(['location'])
    const [featureData,setFeatureData] = useState([])
    const [searchText, setSearchText] = useState(null)
    const [searchInput, setSearchInput] = useState('')
    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(20)

    const viewGeometry = (params) => {

        return (
            <Button
                variant="contained"
                color={params.value === null ? 'error' : 'success'}
                size="small"
                onClick={ () => {
                    if(params.value !== null){

                        let geoJSON = {
                            "type": "FeatureCollection",
                            "features": [
                                {
                                    "type": "Feature",
                                    "properties": {},
                                    "geometry": params.value
                                }
                            ]
                        }
                        console.log(geoJSON)
                        //setMapData({display: true, geojson: geoJSON})
                    }
                }}
            >
                {params.value === null ? 'No Geometry': params.value.type}
            </Button>
        )
    }
    const columns = [
        {field: 'id', headerName: 'FID', width: 75},
        {field: 'title', headerName: 'Title', width: 150},
        {field: 'text', headerName: 'Description', width: 300},
        {field: 'category', headerName: 'Category', width: 150},
        {field: 'geometry', headerName: 'Geometry', renderCell: viewGeometry, width: 200},
        {field: 'tags', headerName: 'Tags', width: 100}
    ]

    useEffect(()=>{
        window.websocket.registerQueue('getFeatures', (json) => {
           // if(json.packet.features.length > 0){
                setFeatureData(json.packet.features)
            //}
        })

        setSearchText('')
    },[])

    useEffect(() => {
        window.websocket.send({
            queue: "getFeatures",
            api: "api",
            data: {
                method: "search",
                search_text: searchText,
                id_token: cookies['id_token'],
                format: "datagrid",
                offset: offset,
                limit: limit
            }
        })
    },[searchText, offset, limit])



    const searchFieldChange = (e) =>{
            setSearchInput(e.target.value)
    }

    const search = () => {
        setSearchText(searchInput)
    }

    return(
        <>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="filled-search"
                    label="Search field"
                    type="search"
                    variant="filled"
                    onChange = {searchFieldChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start"
                                            onClick={search}
                            >
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />

            </Box>
        {
            featureData.length > 0 &&
                <DataGrid columns={columns}
                          rows={featureData}
                          autoHeight
                          initialState={{
                              columns : {
                                columnVisibilityModel:{
                                    id: false
                                }
                              },
                              sorting: {
                                  sortModel: [{ field: 'id', sort: 'desc' }],
                              },
                          }}
                />
        }
        </>

    )

}