import {LaunchList} from "./launchList";
import {Map} from "./map";
import {useEffect, useState, useRef} from "react";
import {SpaceX} from "../api/spacex";

function App(){

    const [launches, setLaunches] = useState([]);
    const [launchpads, setLaunchpads] = useState([]);
    const mapFunctionsRef = useRef(null);
    const spacex = new SpaceX();

    useEffect(()=>{
        spacex.launches().then(data =>{
            setLaunches(data);
        })
        spacex.launchpads().then(data =>{
            setLaunchpads(data);
        })
    },[])

    useEffect(() => {
        mapFunctionsRef.current.drawLaunchpads(launchpads);
    }, [launchpads]);

    const onMapReady = (mapFunctions) => {
        mapFunctionsRef.current = mapFunctions;
    }

    const onLaunchHoverEnter = (launchpadId) => {
        if (!mapFunctionsRef) return;
        mapFunctionsRef.current.highlightLaunchpad(launchpadId);
    };

    const onLaunchHoverEnd = () => {
        if (!mapFunctionsRef) return;
        mapFunctionsRef.current.resetHighlight();
    };

    return(
        <main className='main'>
            <LaunchList launches = {launches} onHoverEnter = {onLaunchHoverEnter} onHoverEnd = {onLaunchHoverEnd}/>
            <Map launchpads = {launchpads} onMapReady = {onMapReady}/>
        </main>
    )
}

export {App};
