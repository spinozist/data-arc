import React, { useState, useEffect } from "react";
import defaults from '../../config/defaults'
import './style.css';

const DataWrapper = props => {
    const [layout, setLayout] = useState(defaults.layout)
    
    return (
        <div>
            { layout.mapView ? <div>Map Component</div> : null }
            { layout.tableView ? <div>Table Component</div> : null }
            { layout.chartView ? <div>Chart Component</div> : null }
        </div>);
}

export default DataWrapper;