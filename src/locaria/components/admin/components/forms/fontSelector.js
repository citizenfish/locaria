import {useDispatch, useSelector} from "react-redux";
import {InputLabel, Select} from "@mui/material";
import {ColorPicker} from "mui-color";
import {setSystemConfigValue} from "../../redux/slices/systemConfigDrawerSlice";
import React from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

export default function FontSelector({name, detail, sx})  {
    const dispatch = useDispatch()
    const config = useSelector((state) => state.systemConfigDrawer.config);


    return (
        <Box sx={{
            padding: "10px",
            ...sx,
        }}>
            <InputLabel id={name+"-label"}>{detail}</InputLabel>
            <div className={"colour-picker-container"}>
                <ColorPicker value={config[name]} defaultValue="transparent" onChange={(color) => {
                    dispatch(setSystemConfigValue({key:name,value:color.css.backgroundColor}));
                }}/>
            </div>

            <FormControl sx={{marginTop: 1}}>
                <InputLabel id={name+"-fontLabel"}>Font</InputLabel>
                <Select
                    labelId={name+"-fontLabel"}
                    id={name+"-font"}
                    value={config[name+'Font']}
                    onChange={(e)=>{
                        dispatch(setSystemConfigValue({key:name+'Font',value:e.target.value}));
                    }}
                    sx={{minWidth: '150px'}}
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