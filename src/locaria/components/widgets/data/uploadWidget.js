import React, {useEffect, useRef, useState} from "react"
import Button from "@mui/material/Button";
import axios from "axios";
import {Card, CardActions, CardContent, ImageList, ImageListItem, InputLabel, Select} from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import UrlCoder from "libs/urlCoder";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {arrayToggleElement} from "libs/arrayTools";
import {useSelector} from "react-redux";

const url = new UrlCoder();
let files={};

// We need unique queue ids as this component can be used multiple tiles
let uniqueId = 0;
const getUniqueId = () => uniqueId++;

export default function UploadWidget({uuids,images,usageFilterInitial="Gallery",sx,title,setFunction,mode="single"}) {


    const idRef = useRef(null);
    if (idRef.current === null) {
        idRef.current = getUniqueId()
    }
    const idToken = useSelector((state) => state.userSlice.idToken);

    const [fileProgress, setFileProgress] = useState(0)
    const fileInput = useRef(null)
    const [list, setList] = useState([]);
    const [usageFilter, setUsageFilter] = useState(usageFilterInitial);
    let uuidActual;
    //console.log(uuid);
  /*  if (uuids) {
        const decode = url.decode(uuids);
        if (Array.isArray(decode))
            uuidActual = decode[0];
    }*/
    //console.log(uuidActual);
    const [selected, setSelected] = useState(uuids?uuids:[]);


    useEffect(() => {
        window.websocket.registerQueue(`${idRef.current}listAssets`, function (json) {
            setList(json.packet.assets);
        });

        window.websocket.registerQueue(`${idRef.current}deleteAsset`, function (json) {
            updateList();
        });

        window.websocket.registerQueue(`${idRef.current}addAsset`, function (json) {

            let url = json.packet.url
            let config = {
                onUploadProgress: function (progressEvent) {
                    let completed = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    setFileProgress(completed)
                },
                headers: {
                    'Content-Type': files[idRef.current].type
                }
            }

            axios.put(url, files[idRef.current], config)
                .then(function (res) {
                    setFileProgress(0);
                    debugger;
                    updateList(json.packet.uuid);
                })
                .catch(function (err) {
                    console.log(err);
                    setFileProgress(-1)
                })

        });
    }, [])

    useEffect(() => {
        updateList();
    }, [usageFilter]);


    const updateList = (add) => {
        if(images) {
            let imagesActual=images;
            if(add)
                imagesActual=arrayToggleElement(imagesActual,add);

            window.websocket.send({
                "queue": `${idRef.current}listAssets`,
                "api": "api",
                "data": {
                    "method": "get_asset",
                    "uuid":imagesActual
                }
            })
        } else {
            window.websocket.send({
                "queue": `${idRef.current}listAssets`,
                "api": "api",
                "data": {
                    "method": "get_asset",
                    "filter": {"usage": usageFilter}
                }
            })
        }
    }

    const deleteAsset = (uuid) => {
        window.websocket.send({
            "queue": `${idRef.current}deleteAsset`,
            "api": "api",
            "data": {
                "method": "delete_asset",
                "uuid": uuid,
                "id_token": idToken
            }
        })
    }

    const handleFileInput = (e) => {
        // TODO handle validations etc...
        files[idRef.current] = e.target.files[0];
        e.preventDefault();

        let extension = files[idRef.current].name.split(".").pop().toLowerCase()
        let contentType = files[idRef.current].type
        window.websocket.send({
            "queue": `${idRef.current}addAsset`,
            "api": "api",
            "data": {
                "method": "add_asset",
                "attributes": {
                    "file_type": contentType,
                    "name": files[idRef.current].name,
                    "ext": extension,
                    "usage": usageFilter
                },
                "contentType": contentType,
                "id_token": idToken
            }
        })

    }

    return (
        <Card sx={sx}>
            <CardContent>
                <CardHeader title={title}
                            subheader="Select or upload an image">
                </CardHeader>
                <ImageList sx={{width: "100%", height: '100%', paddingBottom: 2}} cols={10}>
                    {list.map((item) => (
                        <ImageListItem
                            sx={{
                                "border": `${selected.indexOf(item.uuid) !== -1 ? 2 : 0}px solid red`,
                                boxShadow: '0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%)',
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'box-shadow .2s ease-out',
                                ':hover': {
                                    boxShadow: '0 1px 2px rgb(50 50 93 / 11%), 0 0px 1px rgb(0 0 0 / 8%)',
                                }
                            }}
                            key={item.uuid}
                            cols={1}
                            rows={1}
                            onClick={(e) => {
                                const uuid = e.target.getAttribute('data-uuid');
                                let newList=arrayToggleElement(selected,uuid)
                                setSelected(newList);
                                //setFunction(url.encode(`${item.url}`, uuid));
                                setFunction(newList);
                                e.target.parentElement.style.border=`${newList.indexOf(uuid) !== -1 ? 2 : 0}px solid red`;

                                //setSelected(uuid);
                            }}
                        >

                            <img
                                src={url.decode(`~uuid:${item.uuid}~url:/${item.url}`,true)}
                                alt={item.name}
                                loading="lazy"
                                data-uuid={item.uuid}
                                style={{"objectFit": "scale-down"}}
                            />
                            <DeleteForeverIcon
                                sx={{
                                    position: 'absolute',
                                    right: 2,
                                    top: 2,
                                    color: '#d35252',
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '100%',
                                    cursor: 'pointer',
                                    transition: 'background-color .2s ease-out',
                                    ':hover': {
                                        backgroundColor: '#d3B0A1',
                                    }
                                }}
                                onClick={e => {
                                    e.stopPropagation();
                                    deleteAsset(item.uuid);
                                }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </CardContent>
            <CardActions sx={{alignItems: 'stretch', maxWidth: '400px'}}>
                <FormControl fullWidth>
                    <InputLabel id="filterUsageLabel">Usage Filter</InputLabel>
                    <Select
                        labelId="filterUsageLabel"
                        id="filterUsage"
                        value={usageFilter}
                        label="Usage"
                        onChange={(e) => {
                            setUsageFilter(e.target.value);
                        }}
                    >
                        <MenuItem value={"Logo"}>Logos</MenuItem>
                        <MenuItem value={"Icon"}>Icons</MenuItem>
                        <MenuItem value={"IconMap"}>Map Icons</MenuItem>
                        <MenuItem value={"IconSocial"}>Social Icons</MenuItem>
                        <MenuItem value={"Gallery"}>Gallery</MenuItem>
                        <MenuItem value={"Feature"}>Feature</MenuItem>
                    </Select>
                </FormControl>

                <input type="file"
                       id={`fileUploadButton${idRef.current}`}
                       style={{display: 'none'}}
                       onChange={handleFileInput}/>
                <label
                  htmlFor={`fileUploadButton${idRef.current}`}
                  style={{
                      marginLeft: 8
                  }}
                >
                    {fileProgress == 0 && <Button
                        variant="contained"
                        onClick={(e) => {
                            if (fileInput.current) {
                                fileInput.current.click();
                            }
                        }}
                        component="span"
                        sx={{
                            width: 'max-content',
                            height: '100%',
                        }}>
                            Upload File
                        </Button>
                    }
                    {fileProgress > 0 && <Button variant="contained">Uploading ..</Button>}
                    {fileProgress === -1 && <Button variant={"contained"}
                                                    onClick={() => {
                                                        setFileProgress(0)
                                                    }}>Upload ERROR</Button>}
                </label>
            </CardActions>
        </Card>
    )
}