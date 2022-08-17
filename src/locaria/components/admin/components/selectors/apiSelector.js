import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {setApis} from "../../redux/slices/apiSelectSlice";
import {useCookies} from "react-cookie";

export default function ApiSelector() {

    const apis = useSelector((state) => state.apiSelect.apis)
    const despatch = useDispatch()
    const [cookies, setCookies] = useCookies(['location'])

    useEffect(() => {
        window.websocket.registerQueue('getAPIs', (json) => {
            if (json.packet.parameters){
                dispatch(setApis(json.packet.parameters))
            }

        })

        window.websocket.send({
            "queue": "getAPIs",
            "api": "sapi",
            "data": {
                "method": "get_parameters",
                "parameter_name": "installed_apis",
                "id_token": cookies['id_token']
            }
        })
    },[])

    return (
        <p>API selector</p>
    )
}