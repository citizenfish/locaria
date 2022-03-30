import React, {useEffect,useState} from "react"
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from 'axios';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Checkbox from '@mui/material/Checkbox';
import {useCookies} from "react-cookie";
import Typography from "@mui/material/Typography";

export default function AdminPlanningLoader(props) {

    const [authorities,setAuthorities] = useState(null)
    const [chosenLA,setChosenLA] = useState({id:0})
    const [cookies, setCookies] = useCookies(['location'])
    const [recency,setRecency] = useState(60)
    const [autoUpdate,setAutoUpdate] = useState('')

    useEffect(() =>{

        window.websocket.registerQueue("addPlanningFile", function (json) {
            props.forceRefresh(Date.now())
        })

        //TODO in database
        const url = 'https://www.planit.org.uk/api/areas/json?select=area_name,area_id&pg_sz=500'

        //Get list of planning authorities
        axios.get(url).then((res) =>{
            //Sort them alphabetically on area_name
            res.data.records.push({area_id:0, area_name: '-- Select Planning Area --'})
            res.data.records.sort(function(a, b) {
                var textA = a.area_name.toUpperCase();
                var textB = b.area_name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            })

            setAuthorities(res.data.records)
        })


    },[])


    const authorityList = (arr) => {

        return arr.map((key) =>(
            <MenuItem key = {key.area_id} value={key.area_id} name={key.area_name}>{key.area_name}</MenuItem>
        ))

    }

    const handleLAChosen = (e,name) => {
        setChosenLA({id: e.target.value, name:name.props.name})
    }

    const handleRecencyChosen = (e) => {
        setRecency(e.target.value)
    }

    const handleAutoUpdateChosen = (e) => {
        setAutoUpdate(e.target.checked)
    }

    const loadPlanningData = () => {
        window.websocket.send({
            "queue" : 'addPlanningFile',
            "api" : "lapi",
            "data" : {
                "method": "add_file",
                "file_attributes" : {
                    "custom_loader" : 'planning_loader',
                    "name" : `${chosenLA.name} - Planning`,
                    "authority" : chosenLA.id,
                    //TODO get this out of here!
                    "url" : 'https://www.planit.org.uk/api/applics/json',
                    "ext" : 'json',
                    "file_type" : 'json',
                    "recency" : recency,
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
                    loadPlanningData()
                }}
                component="span"
                disabled={chosenLA.id === 0 ? true : false}
            >
                Load Planning Data
            </Button>

            &nbsp;&nbsp;
            <Select
                id="laSelectControl"
                value={chosenLA.id}
                label={chosenLA.id}

                onChange={handleLAChosen}
            >
                {
                    authorities && authorityList(authorities)
                }
            </Select>
            {chosenLA.id !== 0 && <>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Recency (Days):&nbsp;
                        <Select
                            id="recencySelect"
                            value={recency}
                            label={"Recency (Days)"}
                            onChange={handleRecencyChosen}
                            >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={60}>60</MenuItem>
                        </Select>

                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Auto Update:&nbsp;
                        <Checkbox
                            id="autoUpdate"
                            onChange={handleAutoUpdateChosen}
                        >

                        </Checkbox>
            </>}
        </Box>
    )
}