import React, {useEffect,useState} from "react"
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from 'axios';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Checkbox from '@mui/material/Checkbox';
import {useCookies} from "react-cookie";


export default function AdminCrimeLoader(props) {

    const [forces,setForces] = useState(null)
    const [chosenForce,setChosenForce] = useState({id:0})
    const [cookies, setCookies] = useCookies(['location'])
    const [autoUpdate,setAutoUpdate] = useState('')

    useEffect(() =>{

        window.websocket.registerQueue("addCrimeFile", function (json) {
            props.forceRefresh(Date.now())
        })

        //TODO in database
        const url = 'https://data.police.uk/api/forces'

        //Get list of crime forces
        axios.get(url).then((res) =>{
            //Sort them alphabetically on name
            res.data.push({id:0, name: '-- Select Police Force --'})
            res.data.sort(function(a, b) {
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            })

            setForces(res.data)

        })


    },[])


    const forcesList = (arr) => {

        return arr.map((key) =>(
            <MenuItem key = {key.id} value={key.id} name={key.name}>{key.name}</MenuItem>
        ))

    }

    const handleForceChosen = (e,name) => {
        setChosenForce({id: e.target.value, name:name.props.name})
    }


    const handleAutoUpdateChosen = (e) => {
        setAutoUpdate(e.target.checked)
    }

    const loadCrimeData = () => {
        window.websocket.send({
            "queue" : 'addCrimeFile',
            "api" : "lapi",
            "data" : {
                "method": "add_file",
                "file_attributes" : {
                    "custom_loader" : 'crime_loader',
                    "name" : `${chosenForce.name} - Crime`,
                    "force" : chosenForce.id,
                    "ext" : 'json',
                    "file_type" : 'json',
                    "flatten" : "true",
                    "auto_update" : autoUpdate
                },
                "contentType" : '',
                "id_token": cookies['id_token']
            }
        })
        setChosenLA({id:0})
    }

    return(
        <Box
            component="div" sx={{
            p:2,
            mt:2,
            border: '1px solid grey',
            borderRadius: '5px' }}>

            <Button
                variant="outlined"
                onClick={() => {
                    loadCrimeData()
                }}
                component="span"
                disabled={chosenForce.id === 0 ? true : false}
            >
                Load Crime Data
            </Button>

            &nbsp;&nbsp;
            <Select
                id="laSelectControl"
                value={chosenForce.id}
                label={chosenForce.name}

                onChange={handleForceChosen}
            >
                {
                    forces && forcesList(forces)
                }
            </Select>
            {chosenForce.id !== 0 &&
                <>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Auto Update:&nbsp;
                    <Checkbox
                    id="autoUpdate"
                    onChange={handleAutoUpdateChosen}
                    />
                </>

            }
        </Box>
    )
}