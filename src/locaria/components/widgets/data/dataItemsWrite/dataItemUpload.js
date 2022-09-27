import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {useDispatch} from "react-redux";
import {setFieldValue, setupField} from "../../../redux/slices/formSlice";
import SimpleUploadWidget from "../simpleUploadWidget";
import DataItemsTypography from "./dataItemsTypography";

const DataItemUpload = ({id,name,data,prompt,required}) => {

    const dispatch = useDispatch()

    const handleSelect = (images) => {
        console.log(images);
        dispatch(setFieldValue({index:id,value:images}))
    };

    useEffect(() => {
        dispatch(setupField({index: id, value: data,required:required}))
    },[]);


    return (
        <Grid container spacing = {2}>
            <Grid item md={4}>
                <DataItemsTypography name={name} prompt={prompt} required={required}/>
            </Grid>
            <Grid item md={8}>
                <SimpleUploadWidget sx={{height: '100%'}}
                                    images={data? [...data]:[]}
                                    setFunction={handleSelect}
                                    />
            </Grid>

    </Grid>

    )
}



export default DataItemUpload;