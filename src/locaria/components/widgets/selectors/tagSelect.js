import React from 'react';

import {
    deleteTag,
    resetTags
} from "../../redux/slices/searchDrawerSlice";

import {configs} from 'themeLocaria';
import {useStyles} from "stylesLocaria";

import Typography from "@mui/material/Typography";

import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Divider} from "@mui/material";

import SearchTags from "../../search/SearchTags";
import Chip from "@mui/material/Chip";


const TagSelect = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch()

    const tags = useSelector((state) => state.searchDraw.tags);

    return (
        <div sx={ {mw:300}}>
            <Typography className={classes.tagSelectText}>
                {tags.length > 0 && configs.tagSelectText}
                {tags.length ===0 && configs.noTagsSelectedText }

                </Typography>
            {
                tags.length > 0 &&
                    <div>
                        {tags.map((tag) => (
                            <Chip className={classes.chip}
                                  key={`tag-${tag}`}
                                  label={tag}
                                  sx ={{bgcolor: "secondary.main"}}
                                  onDelete={() => {
                                      dispatch(deleteTag(tag));
                                  }}
                            />))}
                    </div>
            }
            {
                tags.length === 0 &&
                    <div>
                        <Typography className={classes.tagSelectText}>{configs.tagNoSelectText}</Typography>
                    </div>
            }
            <Divider/>
        <SearchTags/>
            <Divider/>
            <Typography variant="body1"
                        className={classes.resetCategorySelectText}
                        onClick={() => {dispatch(resetTags(false))}}
                        sx={{m:1}}
            >
                {configs.resetTagsText}
            </Typography>
        </div>
    )
}

export default TagSelect;