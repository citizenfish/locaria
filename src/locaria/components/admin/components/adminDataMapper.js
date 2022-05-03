import React, {useEffect, useState} from "react"
import {DataGrid} from '@mui/x-data-grid'
import {useCookies} from "react-cookie";
import LinearProgress from '@mui/material/LinearProgress';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import AdminLoadFileData from "./adminLoadFileData";
import AdminViewItemsMap from "./adminViewItemsMap";
import AdminRowEditor from "./adminRowEditor";


export default function AdminDataMapper(props) {

    const [dataFetching, setDataFetching] = useState(true)
    const [tableData,setTableData] = useState([])
    const [categories, setCategories] = useState([])
    const [category,setCategory] = useState('')
    const [cookies, setCookies] = useCookies(['location'])
    const [dataOffset,setDataOffset] = useState(0)
    const [titleField, setTitleField] = useState('name')
    const [textField, setTextField] = useState('description')
    const [linkField, setLinkField] = useState('url')
    const [geocoder,setGeocoder] = useState('postcode')
    const [xField,setXField] = useState('')
    const [yField,setYField] = useState('')
    const [postcodeField,setPostcodeField] = useState('postcode')
    const [load,setLoad] = useState(false)
    const [mapData,setMapData] = useState({display: false})
    const [rowEditor,setRowEditor] = useState(null)

    const dataLimit = 100

    let fileDetails = props.fileDetails

    useEffect(() => {
        if(fileDetails.continueLoad === true){
            setLoad(true)
        }
    },[])


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
                        setMapData({display: true, geojson: geoJSON})
                    }
                }}
            >
                {params.value === null ? 'No Geometry': params.value.type}
            </Button>
        )
    }

    const columns = [
        {field: 'id', headerName: 'ID', width: 50},
        {field : "title", headerName  : "Title", width: 300},
        {field : "text", headerName:   "Text", width : 200},
        {field : "url", headerName:   "Link", width : 400},
        {field : "geometry", headerName:   "Geocoded", renderCell: viewGeometry, width : 200}
    ]



    useEffect(() =>{
        //Register the initial ws queue for getting details of files, only fired once on render
        window.websocket.registerQueue("getPreviewData", function(json){
            setDataFetching(false)
            setTableData(json.packet)

        })
        //We need a list of categories for category selection
        window.websocket.registerQueue("listCategories", function(json){
            setCategories(json.packet.categories)
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
    },[])

    useEffect(
        () => {
            window.websocket.send({
                queue: 'getPreviewData',
                api: "sapi",
                data: {
                    method: "preview_file_data",
                    table: fileDetails.imported_table_name,
                    id_token: cookies['id_token'],
                    limit : dataLimit,
                    offset : dataOffset,
                    title_field: titleField,
                    text_field : textField,
                    url_field: linkField,
                    _geocoder_type: geocoder,
                    x_field :xField,
                    y_field : yField,
                    postcode_field: postcodeField
                }
            })
        },[dataOffset,titleField,textField,linkField,geocoder,xField,yField,postcodeField]
    )

    const handleTitleChange = (e) => {
        setTitleField(e.target.value)
    }

    const handleTextChange = (e) => {
        setTextField(e.target.value)
    }

    const handleLinkChange = (e) => {
        setLinkField(e.target.value)
    }

    const handleGeoCoderChange = (e) =>{
        setGeocoder(e.target.value)
    }

    const handlexCoordChange = (e)=> {
        setXField(e.target.value)
    }

    const handleyCoordChange = (e) => {
        setYField(e.target.value)
    }

    const handlePostcodeChange = (e) => {
        setPostcodeField(e.target.value)
    }

    const handleCategoryChange = (e) => {
        setCategory(e.target.value)
    }

    const fieldList = (arr) => {
        return arr.map((key) =>(
            <MenuItem value={key}>{key}</MenuItem>
        ))
    }

    const handleMapClose = () => {
        setMapData({display: false})
    }

    const handleRowEditorClose = () => {
        setRowEditor({display: false})
    }

    const mapAllItems = () => {
        let features = []
        for(let f in tableData.items) {
            if(tableData.items[f].geometry !== null) {
                features.push({
                    type : 'Feature',
                    properties: {title : tableData.items[f].title},
                    geometry : tableData.items[f].geometry
                })
            }
        }

        if(features.length > 0) {
            setMapData({
                display: true,
                geojson: {
                    "type": "FeatureCollection",
                    "features": features
                }})
        }

    }

    return(
        <div>
            <Box
                component="div"
                sx={{
                    p: 2,
                    mb: 2,
                    border: '1px solid grey',
                    borderRadius: '5px'
                }}>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <Typography variant="subtitle1" noWrap>
                            File Name
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="subtitle1" noWrap>
                            {fileDetails.name}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        {
            load === false && mapData.display === true &&
            <div>
                <Dialog
                    open={mapData.display}
                    fullwidth='true'
                    maxWidth='xl'
                >
                    <DialogContent>
                        <AdminViewItemsMap
                            mapData = {mapData}
                            setMapData = {setMapData}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleMapClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        }
        {
            load === false && rowEditor !== null &&
            <div>
                <Dialog
                    open={rowEditor.display}
                    fullwidth='true'
                    maxWidth='xl'
                >
                    <DialogContent>
                        <AdminRowEditor
                            rowData={rowEditor}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleRowEditorClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        }
        {
            load === false &&
                <div>
                    <Box
                        component="div"
                        sx={{
                            p: 2,
                            mb: 2,
                            border: '1px solid grey',
                            borderRadius: '5px'
                        }}>
                        <Box component="div" sx={{mb: 2}}>
                            <Grid container spacing={1}>
                                <Grid item xs={2}>
                                    <Typography variant="subtitle1" noWrap>
                                        Title Field
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Box sx={{minWidth: 150}}>
                                        <Select
                                            id="titleSelectControl"
                                            value={titleField}
                                            label={titleField}
                                            onChange={handleTitleChange}
                                        >
                                            {
                                                tableData.data_keys && fieldList(tableData.data_keys)
                                            }
                                        </Select>

                                    </Box>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="subtitle1" noWrap>
                                        Text Field
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Box sx={{minWidth: 150}}>
                                        <Select
                                            id="textSelectControl"
                                            value={textField}
                                            label={textField}
                                            onChange={handleTextChange}
                                        >
                                            {
                                                tableData.data_keys && fieldList(tableData.data_keys)
                                            }
                                        </Select>

                                    </Box>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="subtitle1" noWrap>
                                        Link Field
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Box sx={{minWidth: 150}}>
                                        <Select
                                            id="linkSelectControl"
                                            value={linkField}
                                            label={linkField}
                                            onChange={handleLinkChange}
                                        >
                                            {
                                                tableData.data_keys && fieldList(tableData.data_keys)
                                            }
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="subtitle1" noWrap>
                                        Geocoder
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Box sx={{minWidth: 150}}>
                                        <Select
                                            id="geocoderSelectControl"
                                            value={geocoder}
                                            label={geocoder}
                                            onChange={handleGeoCoderChange}
                                        >
                                            <MenuItem value={''}>No Geocoder</MenuItem>
                                            <MenuItem value={'postcode'}>Postcode</MenuItem>
                                            <MenuItem value={'full_text_postcode'}>Postcode (Free Text)</MenuItem>
                                            <MenuItem value={'lonlat'}>Longitude/Latitude</MenuItem>
                                            <MenuItem value={'osgrid'}>OS Grid (easting/northing</MenuItem>
                                        </Select>
                                    </Box>
                                </Grid>
                                {
                                    geocoder === 'postcode' &&
                                    <>
                                        <Grid item xs={3}>
                                            <Typography variant="subtitle1" noWrap>
                                                Postcode Field
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Box sx={{minWidth: 150}}>
                                                <Select
                                                    id="postcodeSelectControl"
                                                    value={postcodeField}
                                                    label={postcodeField}
                                                    onChange={handlePostcodeChange}
                                                >
                                                    {
                                                        tableData.data_keys && fieldList(tableData.data_keys)
                                                    }
                                                </Select>
                                            </Box>
                                        </Grid>
                                    </>
                                }
                                {
                                    (geocoder === 'lonlat' || geocoder === 'osgrid') &&
                                    <>
                                        <Grid item xs={2}>
                                            <Typography variant="subtitle1" noWrap>
                                                X Field:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Box sx={{minWidth: 150}}>
                                                <Select
                                                    id="xSelectControl"
                                                    value={xField}
                                                    label={xField}
                                                    onChange={handlexCoordChange}
                                                >
                                                    {
                                                        tableData.data_keys && fieldList(tableData.data_keys)
                                                    }
                                                </Select>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography variant="subtitle1" noWrap>
                                                Y Field:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Box sx={{minWidth: 150}}>
                                                <Select
                                                    id="ySelectControl"
                                                    value={yField}
                                                    label={yField}
                                                    onChange={handleyCoordChange}
                                                >
                                                    {
                                                        tableData.data_keys && fieldList(tableData.data_keys)
                                                    }
                                                </Select>
                                            </Box>
                                        </Grid>
                                    </>
                                }
                            </Grid>
                        </Box>

                        <Divider variant="middle"/>

                        <Box component="div" sx={{m: 2, mx: 'auto'}}>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Button variant='outlined' color='success'>
                                        Category
                                    </Button>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{minWidth: 150}}>
                                        <Select
                                            id="categorySelectControl"
                                            value={category}
                                            label={category}
                                            onChange={handleCategoryChange}
                                        >
                                            {
                                                categories.length > 0 && fieldList(categories)
                                            }
                                        </Select>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider variant="middle"/>

                        <Box component="div" sx={{mt: 2, mx: 'auto'}}>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Button variant='contained' color='success'
                                            onClick={() => {
                                                setLoad(true)
                                            }}
                                    >
                                        Import Data
                                    </Button>
                                </Grid>
                                {dataOffset >= 100 &&
                                    <Grid item xs={2}>
                                        <Typography variant="subtitle1" noWrap>
                                            <Button variant='outlined'
                                                    onClick={() => {

                                                        setDataOffset(dataOffset - 100)
                                                    }
                                                    }
                                            >
                                                &lt;&lt;
                                            </Button>
                                        </Typography>
                                    </Grid>
                                }
                                <Grid item xs={2}>
                                    <Typography variant="subtitle1" noWrap>
                                        <Button variant='outlined'
                                                onClick={() => {

                                                    setDataOffset(dataOffset + 100)
                                                }
                                                }
                                        >
                                            &gt;&gt;
                                        </Button>
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="subtitle1" noWrap>
                                        <Button variant='outlined'
                                                onClick={mapAllItems}
                                        >
                                            Map View
                                        </Button>
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="subtitle1" noWrap>
                                        <Button variant='outlined'
                                                onClick={() => {
                                                    props.open(null)
                                                }}
                                        >
                                            Exit
                                        </Button>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>


                    {dataFetching &&
                    <Box component="div" sx={{
                        p: 2,
                        mt: 2,
                        border: '1px solid grey',
                        borderRadius: '5px'
                    }}
                    >
                        <LinearProgress/>
                    </Box>
                    }

                    {
                        tableData.items &&
                        <div>

                            <DataGrid style={{width: '100%'}}
                                      rows={tableData.items}
                                      columns={columns}
                                      autoHeight
                                      rowHeight={35}
                                      onCellDoubleClick={(params) => {
                                            setRowEditor({
                                                data: params.row.data,
                                                display: true,
                                                fileDetails: fileDetails
                                            })
                                        }
                                      }
                                      initialState={{
                                          sorting: {
                                              sortModel: [{field: 'id', sort: 'asc'}],
                                          },
                                      }}
                            />
                        </div>
                    }
                </div>
        }

        {
            load === true &&
                <AdminLoadFileData
                    fileDetails = {{
                        ...props.fileDetails,
                        title_field: titleField,
                        text_field : textField,
                        url_field: linkField,
                        _geocoder_type: geocoder,
                        x_field :xField,
                        y_field : yField,
                        postcode_field: postcodeField,
                        category : category
                    }}

                    open = {props.open}
                />
        }
        </div>
    )
}
