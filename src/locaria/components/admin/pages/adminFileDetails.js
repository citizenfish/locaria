import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"


export default function AdminFileDetails(props) {
    const fileSelected = useSelector((state) => state.fileSelect.currentSelected)
    console.log(fileSelected)

    return(<p>Admin file details</p>)
}