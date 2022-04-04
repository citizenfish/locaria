import React, {useState} from "react";
import {useSelector} from "react-redux";

import Fab from '@mui/material/Fab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Popover from '@mui/material/Popover';
import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";

import CategorySelect from '../selectors/categorySelect'

import {useStyles} from "stylesLocaria";
import TagSelect from "../selectors/tagSelect";
import DistanceSelect from "../selectors/distanceSelect";

const NavFabFilter = () => {

    const classes = useStyles();
    const open = useSelector((state) => state.searchDraw.open)
    const [popoverOpen,setPopoverOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)

    const [popType, setPopType] = useState(null)

    if(!open){
        return null
    }

    const handleOpen = (e) => {
        console.log(e.currentTarget.id)
        setPopType(e.currentTarget.id)
        setAnchorEl(e.currentTarget)
        setPopoverOpen(true)
    }

    const handleClose = () => {
        setAnchorEl(null)
        setPopoverOpen(false)
    };

    return(
        <div>

            <Box
                sx={{mt:"80px", ml:"420px", top:0}}
                style={{position:"absolute"}}
            >
                <Fab id="categoryFab"
                     variant="extended"
                     size="small"
                     aria-label="add"
                     className={classes.navfab}
                     sx={{mr:1}}
                     onClick={handleOpen}
                >
                    <Typography variant="body2">Category</Typography>
                    <ExpandMoreIcon sx={{ mr: 1 }} />
                </Fab>
                <Fab id="tagsFab"
                     variant="extended"
                     size="small"
                     aria-label="add"
                     className={classes.navfab}
                     sx={{mr:1}}
                     onClick={handleOpen}
                >
                    <Typography variant="body2">Tags</Typography>
                    <ExpandMoreIcon sx={{ mr: 1 }} />
                </Fab>
                <Fab id="distanceFab"
                     variant="extended"
                     size="small"
                     aria-label="add"
                     className={classes.navfab}
                     onClick={handleOpen}
                >
                    <Typography variant="body2">Distance</Typography>
                    <ExpandMoreIcon sx={{ mr: 1 }} />
                </Fab>
            </Box>
            <Popover open={popoverOpen}
                     anchorEl={anchorEl}
                     onClose={handleClose}
                     anchorOrigin={{
                         vertical: 'bottom',
                         horizontal: 'left'
                     }}
                     sx={{mt:1}}

            >
                {
                    popType === 'categoryFab' &&
                    <Box sx={{minWidth:200,maxWidth:300}}>
                        <CategorySelect mode ={"list"}/>
                    </Box>
                }
                {
                    popType === 'tagsFab' &&
                    <Box sx={{minWidth:200,maxWidth:300,p:1}}>
                        <TagSelect/>
                    </Box>
                }
                {
                    popType === 'distanceFab' &&
                    <Box sx={{minWidth:200,maxWidth:300, p:1, minHeight:100}}>
                        <DistanceSelect/>
                    </Box>

                }
            </Popover>
        </div>
    )
}

export default NavFabFilter