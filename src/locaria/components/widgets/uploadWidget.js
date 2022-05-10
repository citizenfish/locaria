import React, {useEffect, useRef, useState} from "react"
import Button from "@mui/material/Button";
import axios from "axios";
import {useCookies} from "react-cookie";
import {Card, CardActions, CardContent, ImageList, ImageListItem} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
import CardHeader from "@mui/material/CardHeader";
import {configs, resources} from "themeLocaria";

let file;

export default function UploadWidget(props) {
    const [fileProgress, setFileProgress] = useState(0)
    const fileInput = useRef(null)
    const [cookies, setCookies] = useCookies(['location']);
    const [list,setList] = useState([]);

    useEffect(() => {
        window.websocket.registerQueue("listAssets", function (json) {
            setList(json.packet.assets);
        });

        window.websocket.registerQueue("addAsset", function (json) {

            let url = json.packet.url
            let config = {
                onUploadProgress: function (progressEvent) {
                    let completed = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    setFileProgress(completed)
                },
                headers: {
                    'Content-Type': file.type
                }
            }

            axios.put(url, file, config)
                .then(function (res) {
                    setFileProgress(0);
                    updateList();
                })
                .catch(function (err) {
                    console.log(err);
                    setFileProgress(-1)
                })

        });

        updateList();

    }, [])

    const updateList = () => {
        window.websocket.send({
            "queue": 'listAssets',
            "api": "api",
            "data": {
                "method": "get_asset",
                "filter": { "usage":"icon" }
            }
        })
    }

    const handleFileInput = (e) => {
        // TODO handle validations etc...
        file = e.target.files[0]

        let extension = file.name.split(".").pop().toLowerCase()
        let contentType = file.type
        window.websocket.send({
            "queue": 'addAsset',
            "api": "api",
            "data": {
                "method": "add_asset",
                "attributes": {
                    "file_type": contentType,
                    "name": file.name,
                    "ext": extension,
                    "usage":"icon"
                },
                "contentType": contentType,
                "id_token": cookies['id_token']
            }
        })

    }

    return (
        <Card>
            <CardContent>
                <h1>Content</h1>
                <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                    {list.map((item)=>(
                        <ImageListItem key={item.uuid}>
                            <img
                                src={`${resources.url}${item.url}`}
                                alt={item.name}
                                loading="lazy"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </CardContent>
            <CardActions>
                <input type="file"
                       id="fileUploadButton"
                       style={{display: 'none'}}
                       onChange={handleFileInput}/>
                <label htmlFor={'fileUploadButton'}>
                    {
                        fileProgress == 0 && <Button variant="contained"
                                                     onClick={e => fileInput.current && fileInput.current.click()}
                                                     component="span">
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