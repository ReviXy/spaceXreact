function LaunchList(props) {

    const handleMouseEnter = (launch) => {
        props.onHoverEnter(launch.launchpad);
    };

    const handleMouseLeave = () => {
        props.onHoverEnd();
    };
    
    return (
        <aside className="aside" id="launchesContainer">
            <h3>Launches</h3>
            <div id="listContainer">
                <ul>
                    {props.launches.map(launch => {
                        return (
                            <li 
                                key={launch.id}
                                onMouseEnter={() => handleMouseEnter(launch)}
                                onMouseLeave={handleMouseLeave}
                            >
                            {
                                launch.name
                            }
                            </li>)
                    })}
                </ul>
            </div>
        </aside>
    )
}

export {LaunchList}