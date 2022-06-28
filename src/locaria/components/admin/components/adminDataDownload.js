import React, {useEffect, useRef,useState} from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {useCookies} from "react-cookie";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";
import TagSelect from '../../widgets/selectors/tagSelect'
import {useDispatch,useSelector} from "react-redux";
import {setCategoryList} from "../../redux/slices/searchDrawerSlice";

export default function AdminDataDownload(props) {

    const [categories,setCategories] = useState([])
    const [filters,setFilters] = useState({})
    const [format,setFormat] = useState('xlsx')
    const [cookies, setCookies] = useCookies(['location']);
    const [disabled,setDisabled] = useState(false)
    const [open,setOpen] = useState(false)
    const dispatch = useDispatch()

    const tags = useSelector((state) => state.searchDraw.tags);

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

    useEffect(() => {
        window.websocket.registerQueue("downLoadData", function (json) {
            setDisabled(true)
        })
    },[])


    const triggerDownload = () => {

        //TODO add additional filters at present only tags
        window.websocket.send({
            "queue" : 'downLoadData',
            "api" : "sapi",
            "data" : {
                "method": "request_download_data",
                "file_attributes" : {
                    "format" : format,
                    "filters": { 'tags' : tags},
                    "categories": categories,
                    "type" : "all_data"
                },
                "status" : "DOWNLOAD_REQUESTED",
                "id_token": cookies['id_token']
            }
        })

        props.setFetchList(true)
    }

    //TODO I think we may have them already in STATE
    useEffect(() =>{
        //We need a list of categories for category selection
        window.websocket.registerQueue("getCategories", function(json){
            setCategories(json.packet.categories)
            dispatch(setCategoryList(json.packet.categories))
        })
    },[])

    useEffect(() => {
        window.websocket.send({
            queue: 'getCategories',
            api: "api",
            data: {
                method: "list_categories",
            }
        })
    },[])

    const handleClose = () => {
        //Close dialogue
        setOpen(false)
        //enable file list fetching
        props.setFetchList(true)
    };

    const handleConfirm = () => {
        setOpen(false)
        triggerDownload()
        props.setFetchList(true)
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

    const formatCategories = (arr) => {
        return arr.map((key) =>(
            <MenuItem value={key}>{key}</MenuItem>
        ))
    }

    const handleFormatChange = (e) => {
        setFormat(e.target.value)
    }

    const handleCategoryChange = (e) => {
        setCategories(e.target.value)
    }


    const showDialog = () => {
        props.setFetchList(false)
        setOpen(true)
    }

    //TODO change all text to be from language file
    return (
        <Box
            component="div"
            sx={{
                p:2,
                mt:2,
            }}
        >
            <Button variant="contained"
                    onClick={showDialog}
                    disabled={disabled}
                    component="span">
                Download Data
            </Button>
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Data Download Settings
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">

                        </DialogContentText>
                        <Grid container spacing = {1}>
                            <Grid item md={4}>
                                Format
                            </Grid>
                            <Grid item md = {8}>
                                <Select
                                    id = 'formatSelect'
                                    value = {format}
                                    onChange={handleFormatChange}>
                                    {formatItems(formats)}
                                </Select>
                            </Grid>
                            <Grid item md={4}>
                                Categories
                            </Grid>
                            <Grid item md = {8}>
                                <Select
                                    id="categorySelectControl"
                                    value={categories}
                                    multiple = {true}
                                    onChange={handleCategoryChange}
                                >
                                    {
                                        categories.length > 0 && formatCategories(categories)
                                    }
                                </Select>
                            </Grid>
                            <Grid item md={4}>
                                Tags
                            </Grid>
                            <Grid item md = {8}>
                                <TagSelect/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleConfirm} autoFocus>
                            Request Download
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Box>
    )
}