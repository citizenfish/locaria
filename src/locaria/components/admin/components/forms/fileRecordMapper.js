import React, {useEffect,useState, useRef} from 'react'

import Map from "../../../widgets/maps/map";
import {
    FormControl,
    InputLabel,
    Select,
    Grid,
    Box,
    Typography,
    FormLabel,
    RadioGroup,
    Radio,
    FormControlLabel,
    Input,
    Button,
    Tab,
    Tabs
} from "@mui/material"
import {useCookies} from "react-cookie";
import MenuItem from "@mui/material/MenuItem";
import StripedDataGrid from "../../../widgets/data/stripedDataGrid";
import AdminRowEditor from "../../widgets/adminRowEditor";
import AdminLoadFileData from "../../widgets/adminLoadFileData";

const boxStyle = {
    p: 2,
    mt: 2,
    border: '1px solid grey',
    borderRadius: '5px'
}

const pagerBox = {
    p: 2,
    mt: 2,
    border: '1px solid grey',
    borderRadius: '5px'
}

const mapBoxStyle = {
    p: 2,
    m: 1,
    border: '1px solid grey',
    borderRadius: 2,
    height: 700,
    minWidth: 500
}

const itemMapBoxStyle = {
    p: 2,
    m: 1,
    border: '1px solid grey',
    borderRadius: 2,
    height: 300,
    minWidth: 500
}

const selectStyles = {
    title : {minWidth:300, m:1},
    text : {minWidth:300, m:1},
    link : {minWidth:300, m:1},
    postcode: {minWidth: 275, m:1},
    category: {minWidth:300, m:1}
}

//TODO overide from settings
const dataLimit = 100
const mapURL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"

export default function FileRecordMapper(props) {

    let fileDetails = props.details
    console.log(fileDetails)
    const totalRecords = fileDetails.attributes.record_count

    const mapRef = useRef()
    const itemMapRef = useRef()
    const [tableData, setTableData] = useState([])
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState('')
    const [cookies, setCookies] = useCookies(['location'])
    const [titleField, setTitleField] = useState('name')
    const [textField, setTextField] = useState('description')
    const [linkField, setLinkField] = useState('url')
    const [geocoder, setGeocoder] = useState('postcode')
    const [xField, setXField] = useState('')
    const [yField, setYField] = useState('')
    const [postcodeField, setPostcodeField] = useState('postcode')
    const [dataOffset, setDataOffset] = useState(0)
    const [tagType, setTagType] = useState('fixed')
    const [tags, setTags] = useState([])
    const [tagField, setTagField] = useState([])
    const [selectedItem, setSelectedItem] = useState({})
    const [tabIndex, setTabIndex] = useState(0)
    const tagValue = useRef('')
    const [loading, setLoading] = useState(false)


    const handleTabChange = (event, newTabIndex) => {
        setTabIndex(newTabIndex);
    };

    //Load file preview data
    useEffect(() => {
        //Register the initial ws queue for getting details of files, only fired once on render
        window.websocket.registerQueue("getPreviewData", function (json) {

            let features = []
            for (let f in json.packet.items) {
                if (json.packet.items[f].geometry !== null) {
                    features.push({
                        type: 'Feature',
                        properties: {title: json.packet.items[f].title},
                        geometry: json.packet.items[f].geometry
                    })
                }
            }

            json.packet['geojson'] = {
                "type": "FeatureCollection",
                "features": features
            }

            setTableData(json.packet)

        })
        //We need a list of categories for category selection
        window.websocket.registerQueue("listCategories", function (json) {
            setCategories(json.packet.categories)
        })

    }, [])

    //Get category list
    useEffect(() => {
        window.websocket.send({
            queue: 'listCategories',
            api: "api",
            data: {
                method: "list_categories",
            }
        })
    }, [])

    //Update preview data after changes
    useEffect(() => {

                window.websocket.send({
                    queue: 'getPreviewData',
                    api: "sapi",
                    data: {
                        method: "preview_file_data",
                        table: fileDetails.attributes.imported_table_name,
                        id_token: cookies['id_token'],
                        limit: dataLimit,
                        offset: dataOffset,
                        title_field: titleField,
                        text_field: textField,
                        url_field: linkField,
                        _geocoder_type: geocoder,
                        x_field: xField,
                        y_field: yField,
                        postcode_field: postcodeField
                    }
                })

        }, [dataOffset, titleField, textField, linkField, geocoder, xField, yField, postcodeField])

    const fieldList = (arr) => {
        return arr.map((key) => (
            <MenuItem key = {key} value={key}>{key}</MenuItem>
        ))
    }

    const listValue = (item) => {
        if(! tableData.data_keys) {
            return('')
        }
        return(tableData.data_keys.indexOf(item) !== -1 ? item : '')
    }

    const GeocoderParams = () => {

        if (geocoder === 'postcode' || geocoder === 'full_text_postcode') {
            return (
                <FormControl sx={{mt: 2}}>
                    <InputLabel htmlFor="postcodeSelect">Postcode Field</InputLabel>
                    <Select
                        sx={selectStyles.postcode}
                        id="postcodeSelect"
                        value={listValue(postcodeField)}
                        label={postcodeField}
                        onChange={(e) => {
                            setPostcodeField(e.target.value)
                        }}>
                        {
                            tableData.data_keys && fieldList(tableData.data_keys)
                        }
                    </Select>
                </FormControl>
            )
        }

        if (geocoder === 'lonlat' || geocoder === 'osgrid') {
            return (
                <>
                    <FormControl sx={{mt: 2}}>
                        <InputLabel
                            htmlFor="xSelect">{geocoder === 'lonlat' ? 'Longitude Field' : 'Easting'}</InputLabel>
                        <Select
                            id="xSelect"
                            sx={selectStyles.x}
                            value={xField}
                            label={xField}
                            onChange={(e) => {
                                setXField(e.target.value)
                            }}>
                            {
                                tableData.data_keys && fieldList(tableData.data_keys)
                            }
                        </Select>
                    </FormControl>
                    <FormControl sx={{mt: 2}}>
                        <InputLabel
                            htmlFor="ySelect">{geocoder === 'lonlat' ? 'Longitude Field' : 'Northing'}</InputLabel>
                        <Select
                            id="ySelect"
                            sx={selectStyles.x}
                            value={yField}
                            label={yField}
                            onChange={(e) => {
                                setYField(e.target.value)
                            }}>
                            {
                                tableData.data_keys && fieldList(tableData.data_keys)
                            }
                        </Select>
                    </FormControl>
                </>
            )
        }

        return (<></>)
    }

    const TagEntry = () => {
        if (tagType === 'fixed') {
            return (

                <FormControl sx={{mt: 2}}>
                    <InputLabel htmlFor="tagFixed">Tags</InputLabel>
                    <Input id="tagsFixed"
                           aria-describedby="tags-Fixed"
                           ref = {tagValue}
                    />
                </FormControl>

            )
        }

        return (
            <FormControl sx={{mt: 2}}>
                <InputLabel htmlFor="tagSelect">Tag Field</InputLabel>
                <Select
                    id="tagSelect"
                    sx={selectStyles.tag}
                    value={listValue(tagField)}
                    label={tagField}
                    onChange={(e) => {
                        setTagField(e.target.value)
                    }}>
                    {
                        tableData.data_keys && fieldList(tableData.data_keys)
                    }
                </Select>

            </FormControl>
        )
    }

    const setFileMapping = () => {

        setLoading(true)
    }

    const FileRecordMapperTab = () => {

        return (
            <Box component="div" sx={boxStyle}>

                <Grid container sx={{mt: 2}}>
                    <Grid item md={4}>
                        <Typography>File Import Settings</Typography>
                        <FormControl sx={{mt: 2}}>
                            <InputLabel htmlFor="titleSelect">Title Field</InputLabel>
                            <Select id="titleSelect"
                                    value={listValue(titleField)}
                                    label={titleField}
                                    onChange={(e) => {
                                        setTitleField(e.target.value)
                                    }}
                                    sx={selectStyles.title}>
                                {
                                    tableData.data_keys && fieldList(tableData.data_keys)
                                }
                            </Select>
                        </FormControl>
                        <FormControl sx={{mt: 2}}>
                            <InputLabel htmlFor="textSelect">Description Field</InputLabel>
                            <Select id="textSelect"
                                    value={listValue(textField)}
                                    label={textField}
                                    onChange={(e) => {
                                        setTextField(e.target.value)
                                    }}
                                    sx={selectStyles.text}>
                                {
                                    tableData.data_keys && fieldList(tableData.data_keys)
                                }
                            </Select>
                        </FormControl>
                        <FormControl sx={{mt: 2}}>
                            <InputLabel htmlFor="linkSelect">Url Field</InputLabel>
                            <Select id="linkSelect"
                                    value={listValue(linkField)}
                                    label={linkField}
                                    onChange={(e) => {
                                        setLinkField(e.target.value)
                                    }}
                                    sx={selectStyles.link}>
                                {
                                    tableData.data_keys && fieldList(tableData.data_keys)
                                }
                            </Select>
                        </FormControl>
                        <FormControl sx={{mt: 2}}>
                            <InputLabel htmlFor="geocoderSelect">Geocoder</InputLabel>
                            <Select id="geocoderSelect"
                                    value={geocoder}
                                    label={geocoder}
                                    onChange={(e) => {
                                        setGeocoder(e.target.value)
                                    }}
                                    sx={selectStyles.link}>
                                <MenuItem key ={"G1"} value={''}>No Geocoder</MenuItem>
                                <MenuItem key ={"G2"} value={'postcode'}>Postcode</MenuItem>
                                <MenuItem key ={"G3"} value={'full_text_postcode'}>Postcode (Free Text)</MenuItem>
                                <MenuItem key ={"G4"} value={'lonlat'}>Longitude/Latitude</MenuItem>
                                <MenuItem key ={"G5"} value={'osgrid'}>OS Grid (easting/northing</MenuItem>
                            </Select>
                            <GeocoderParams/>
                        </FormControl>

                        <FormControl sx={{mt: 2}}>
                            <InputLabel htmlFor="categorySelect">Category</InputLabel>
                            <Select
                                id="categorySelect"
                                sx={selectStyles.category}
                                value={category}
                                label={category}
                                onChange={(e) => {
                                    setCategory(e.target.value)
                                }}
                            >
                                {
                                    categories.length > 0 && fieldList(categories)
                                }
                            </Select>
                        </FormControl>
                        <FormControl sx={{mt: 2}}>
                            <FormLabel id="tag">Tags</FormLabel>
                            <RadioGroup row defaultValue={tagType} onChange={(e) => {
                                setTagType(e.target.value)
                            }}>
                                <FormControlLabel  control={<Radio key = "fixed"/>} label="Fixed" value="fixed"/>
                                <FormControlLabel key = "field" control={<Radio  key = "field"/>} label="Field" value="field"/>
                            </RadioGroup>
                            <TagEntry/>
                        </FormControl>
                        <FormControl sx={{mt: 2}}>
                            <Button variant={"contained"}
                                    color="success"
                                    onClick ={() => {
                                        setFileMapping()
                                    }}>Set File Mapping</Button>
                        </FormControl>
                    </Grid>
                    <Grid item md={8}>
                        <Box component="div" sx={mapBoxStyle}>
                            <Map ref={mapRef}
                                 id={"filerecordmapper"}
                                 className={"mapView"}
                                 zoom={15}
                                 initialGeojson={tableData.geojson}
                                 mapSource = {mapURL}
                                 buffer = {50000}
                                 maxZoom={18}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        )
    }

    const AdminFileRecordTab = () => {

        const viewGeometry = (params) => {

            if(params.value === null) {
                return(<Button variant ={"contained"} color={"error"} disabled>No</Button>)
            }
            return(<Button variant = {"contained"} color={"success"} disabled >Yes</Button>)
        }

        const viewItem = (params) => {
            return(
                <Button
                    variant ={"contained"}
                    onClick={()=>{
                    setSelectedItem(params.row)
                    setTabIndex(2)
                }}>View Item</Button>
            )
        }

        const columns = [
            {field: 'id', headerName: 'ID', width: 50},
            {field : "title", headerName  : "Title", width: 200},
            {field : "text", headerName:   "Text", width : 300},
            {field : "geometry", headerName:   "Geocoded", width : 150, renderCell: viewGeometry},
            {field : "viewItem", headerName:   "View", width : 150, renderCell: viewItem}
        ]

        return(
            <>
                <StripedDataGrid columns = {columns}
                                 rows = {tableData.items}
                                 autoHeight
                                 initialState={{
                                     sorting: { sortModel: [{ field: "id", sort: "desc" }] }
                                 }}/>
            </>)
    }

    const DataPager = () => {
       return (
           <Box sx={pagerBox}>
            <Grid container spacing = {2}>
                <Grid item md = {4}>
                    Records {dataOffset} of {totalRecords}
                </Grid>
                <Grid item md = {2}>
                    <Button variant={"contained"}
                            disabled={tabIndex === 2}
                            onClick ={()=>{
                                if(dataOffset - dataLimit > 0){
                                    setDataOffset(dataOffset - dataLimit)
                                } else {

                                }
                            }}>&lt;&lt;
                    </Button>
                </Grid>
                <Grid item md = {2}>
                    <Button variant={"contained"}
                            disabled={tabIndex === 2}
                            onClick ={()=>{
                                if(dataOffset + dataLimit < totalRecords){
                                    setDataOffset(dataOffset + dataLimit)
                                }
                            }}>&gt;&gt;
                    </Button>
                </Grid>

            </Grid>
           </Box>)
    }

    const ItemViewer = () => {

        let geojson = selectedItem.geometry ?
            {"type" : "FeatureCollection", "features" : [{"type" : "Feature", "geometry": selectedItem.geometry}]} : undefined

        return(
            <>
                <Box sx = {itemMapBoxStyle}>
                    <Map ref={itemMapRef}
                         id={"itemmapper"}
                         className={"itemMapView"}
                         zoom={8}
                         maxZoom={18}
                         initialGeojson={geojson}
                         mapSource = {mapURL}
                         buffer = {50000}
                    />
                </Box>
                <AdminRowEditor rowData = {selectedItem}/>
            </>)
    }

    if(!loading) {
        return (
            <>
                <DataPager/>
                <Tabs value={tabIndex} onChange={handleTabChange}>
                    <Tab label="Settings"/>
                    <Tab label="Preview"/>
                    {selectedItem['id'] && <Tab label="Selected Item"/>}
                </Tabs>

                {tabIndex === 0 && <FileRecordMapperTab/>}
                {tabIndex === 1 && <AdminFileRecordTab/>}
                {tabIndex === 2 && <ItemViewer/>}

            </>
        )
    }

    return (<AdminLoadFileData
        fileDetails = {{
            ...fileDetails,
            title_field: titleField,
            text_field : textField,
            url_field: linkField,
            _geocoder_type: geocoder,
            x_field :xField,
            y_field : yField,
            postcode_field: postcodeField,
            category : category
        }}

        loadShow = {setLoading}
    />)



}