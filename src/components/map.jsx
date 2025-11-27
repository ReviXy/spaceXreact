import * as d3 from "d3";
import * as Geo from "../geo.json";
import {useRef, useEffect} from "react";

function Map(props){
    const width = 1000;
    const height = 600;
    const margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 100
    };

    const containerRef = useRef(null);
    const launchpadPointsRef = useRef(null);
    const projectionRef = useRef(null);

    const drawLaunchpads = (launchpads) => {
        if (!launchpads) return;
        launchpadPointsRef.current.selectAll("circle").remove();
        
        launchpadPointsRef.current.selectAll("circle")
            .data(launchpads)
            .enter()
            .append("circle")
            .attr("cx", d => projectionRef.current([d.longitude, d.latitude])[0])
            .attr("cy", d => projectionRef.current([d.longitude, d.latitude])[1])
            .attr("r", 5)
            .style("fill", "red")
            .style("opacity", 0.3)
            .attr("class", "launchpad-point")
            .attr("data-id", d => d.id);
    };

    const highlightLaunchpad = (launchpadId) => {
        launchpadPointsRef.current
            .selectAll("circle")
            .style("opacity", 0.3)
            .filter(d => d.id === launchpadId)
            .style("opacity", 1)
            .style("r", 8);
    };

    const resetHighlight = () => {
        launchpadPointsRef.current
            .selectAll("circle")
            .style("opacity", 0.3)
            .style("r", 5);
    };

    useEffect(() => {
        if (!props.onMapReady) return;
        props.onMapReady({
                highlightLaunchpad,
                resetHighlight,
                drawLaunchpads
            });
    }, []);

    useEffect(()=> { const svg = d3.select(containerRef.current).append("svg");
        svg.selectAll("*").remove();
        svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom )
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)

        const projection = d3.geoMercator()
            .scale(70)
            .center([0, 20])
            .translate([width/2 - margin.left, height/2 - margin.top]);
        
        projectionRef.current = projection;

        const g = svg.append("g");
        g.selectAll("path")
            .data(Geo.features)
            .enter()
            .append("path")
            .attr("class", "topo")
            .attr("d", d3.geoPath().projection(projection))
            .style("opacity", .7);
        
        launchpadPointsRef.current = g.append("g").attr("class", "launchpads");
        
        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', function(event) {
                g.selectAll('path')
                    .attr('transform', event.transform);
                g.selectAll('.launchpads circle')
                    .attr('transform', event.transform);
            });

        svg.call(zoom); }, []);



    return(
        <div className="mapContainer map" ref={containerRef}>
        </div>
    )
}

export {Map}