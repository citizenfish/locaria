import React, {useRef, useState} from "react"
import Button from "@mui/material/Button";

let file;

export default function UploadWidget(props) {
    const [fileProgress,setFileProgress] = useState(0)
    const fileInput = useRef(null)

    const handleFileInput = (e) => {
        // TODO handle validations etc...
        file = e.target.files[0]

        let extension = file.name.split(".").pop().toLowerCase()
        let contentType = file.type
        window.websocket.send({
            "queue" : 'addFile',
            "api" : "api",
            "data" : {
                "method": "add_file",
                "file_attributes" : {
                    "file_type" : contentType,
                    "name" : file.name,
                    "ext" : extension
                },
                "contentType" : contentType
            }
        })

    }

    return (
        <>
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
        </>
    )
}