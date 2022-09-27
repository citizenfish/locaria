import React from "react";
import {openMenuDraw} from "../../redux/slices/menuDrawerSlice";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import {useDispatch} from "react-redux";

export default function BurgerMenu({}) {
    const dispatch = useDispatch()

    return (
        <IconButton sx={{margin: "0 auto", display: "flex"}}
                    onClick={() => {
                        dispatch(openMenuDraw());
                    }}>
            <MenuIcon color="icons" fontSize="default" sx={{color: "white"}}/>
        </IconButton>
    )
}