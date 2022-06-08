import {useDispatch, useSelector} from "react-redux";
import {InputLabel, Select} from "@mui/material";
import {ColorPicker} from "mui-color";
import {setSystemConfigValue} from "../../redux/slices/systemConfigDrawerSlice";
import React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

export default function FontSelector({name,detail})  {
    const dispatch = useDispatch()
    const config = useSelector((state) => state.systemConfigDrawer.config);


    return (
        <Box sx={{
            padding: "10px"
        }}>
            <InputLabel id={name+"-label"}>{detail}</InputLabel>
            <ColorPicker value={config[name]} defaultValue="transparent" onChange={(color) => {
                dispatch(setSystemConfigValue({key:name,value:color.css.backgroundColor}));
            }}/>

            <FormControl>
                <InputLabel id={name+"-fontLabel"}>Font</InputLabel>
                <Select
                    labelId={name+"-fontLabel"}
                    id={name+"-font"}
                    value={config[name+'Font']}
                    onChange={(e)=>{
                        dispatch(setSystemConfigValue({key:name+'Font',value:e.target.value}));
                    }}
                >
                    <MenuItem value={"Roboto"}>Roboto</MenuItem>
                    <MenuItem value={"Montserrat"}>Montserrat</MenuItem>
                    <MenuItem value={"Merriweather"}>Merriweather</MenuItem>
                    <MenuItem value={"Caveat"}>Caveat</MenuItem>

                </Select>
            </FormControl>

        </Box>
    )
}