import React, { useState, useEffect } from 'react';
import { Map as LeafletMap, TileLayer, ZoomControl } from 'react-leaflet';
import Control from 'react-leaflet-control';
import GeoJSONLayer from '../MapLayers/GeoJSONLayer';
import OverlayLayer from '../MapLayers/OverlayLayer';
import BaseMapLegend from '../Legends/BaseMapLegend';
import BoundaryLayerLegend from '../Legends/BoundaryLayerLegend';
import DataLayerLegend from '../Legends/DataLayerLegend';
import { FiHome } from "react-icons/fi";
import API from '../../utils/API.js';
import defaults from '../../config/defaults';
import { Icon } from '@iconify/react';
import table from '@iconify/icons-mdi/table';
import chartScatterPlot from '@iconify/icons-mdi/chart-scatter-plot';
import chartBar from '@iconify/icons-mdi/chart-bar';




const Map = props => {

  const iconStyle = {backgroundColor: 'white', borderRadius: '5px', padding: '5px'}
  const iconSize = '70px';
  const iconColor = 'teal';
  const iconPosition = 'bottomright';

  const [icons, setIcons] = useState({
    table: {
      visible: props.layout.tableVisible,
      ref: table
    }, 
    scatterPlot : {
      visible: props.layout.scatterPlotVisible,
      ref: chartScatterPlot
    },
    barChart: {
      visible: props.layout.barChartVisible,
      ref: chartBar
    }, 
  });

  const [boundaryLayerInfo, setBoundaryLayerInfo] = useState(defaults.data.overlayLayerInfo)

  const [legendStyle, setLegendStyle] = useState({
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    width: '300px'
  })

  const [overlayData, setOverlayData] = useState(),
        [bounds , setBounds] = useState(),
        [baseMap, setBaseMap] = useState('tile-layer-mono');

  const handleBounds = boundingGEO => {
    const boundingGeometry = boundingGEO ? boundingGEO.features[0].geometry : null;
    const pointArray = boundingGEO ? 
            boundingGeometry.type === 'MultiPolygon' ?
              boundingGeometry.coordinates[0][0]
              : boundingGeometry.coordinates[0]
                : defaults.data.bounds,
        
          lngArray = pointArray.map(point => parseFloat(point[0])),
          latArray = pointArray.map(point => parseFloat(point[1])),
          maxLng = Math.max.apply(Math, lngArray),
          maxLat = Math.max.apply(Math,latArray),
          minLng = Math.min.apply(Math,lngArray),
          minLat = Math.min.apply(Math,latArray),
          bounds = [[maxLat, minLng],[minLat,maxLng]]

    setBounds(bounds)
  };

  const handleOverlayData = obj => {
    const dataArray = [];
    const getLayers = () => Object.entries(obj)
      .map(([key,data]) =>
        API.getData(data.url)
        .then(res => dataArray.push([key, res.data.features]))
        .catch(err => console.log(err))
      )
    getLayers();
    setOverlayData(dataArray)
  };

  const closeSideBar = () => {
    const status = Object.entries(icons).map(([key, value]) =>
      value.visible);
    const close = () => !status[0] && !status[1] && !status[2] ? props.setLayout({
      ...props.layout,
      mapWidth: {sm: 12, lg: 12},
      sideBarWidth: {sm: 0, lg: 0}
    }) : null;
    close();
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => handleOverlayData(boundaryLayerInfo), []);
  useEffect(() => {}, [boundaryLayerInfo]);
  useEffect(() => handleBounds(props.boundingGEO), [props.boundingGEO]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => closeSideBar(), [icons]);

  return (
    <LeafletMap
      key={'leaflet-map'}
      // center={[33.8, -84.4]}
      // zoom={10.5}
      // zoomDelta={.5}
      zoomSnap={.3}
      zoomDelta={.3}
      bounds={bounds}
      boundsOptions={{padding: [50, 50]}}
      maxZoom={15}
      attributionControl={true}
      zoomControl={false}
      doubleClickZoom={true}
      scrollWheelZoom={true}
      dragging={true}
      animate={false}
      // onViewportChange={(viewport: Viewport) => setViewport(viewport)}
      onViewportChange={() => setBounds()}

    > 
      <ZoomControl position="topright" />
      <Control position='topleft'>
        <BaseMapLegend
          legendInfo={defaults.data.tileLayers} 
          setBaseMap={setBaseMap}
          baseMap={baseMap}
          style={legendStyle}
        />

      </Control>

      <Control position='topleft'>
        <BoundaryLayerLegend
          legendInfo={boundaryLayerInfo}
          style={legendStyle}
          setBoundaryLayerInfo={setBoundaryLayerInfo}
        />

      </Control>
      <Control position='topleft'>
        <DataLayerLegend
          {...props}
          setLayout={props.setLayout}
          layout={props.layout}
          geoLabel={defaults.geoOptions.find(option => option.value === props.geo)}
          primaryField={props.primaryField}
          labelManifest={props.labelManifest}
          browseDataButton={props.dataButton}
          colorRamp={props.colorRamp}
          style={legendStyle}
        />
      </Control>
      <Control position="topright" >

        <FiHome style={{height: '40px', width: '40px', padding: '5px', backgroundColor: 'white', borderRadius: '5px'}} onClick={() => {
          console.log('Reset View Button Clicked');
          handleBounds(props.boundingGEO)
        }} />
      </Control>

      {
        Object.entries(icons).map(([key, value]) => 
        <Control position={iconPosition}>
          <Icon 
            style={{
              ...iconStyle,
              opacity: value.visible ? .7 : 1
            }}
            height={iconSize} 
            width={iconSize} 
            color={value.visible ? 'grey' : iconColor} 
            icon={value.ref}
            onClick={() => {
              props.setLayout({
                ...props.layout,
                mapWidth: {sm: 12, lg: 8},
                sideBarWidth: {sm: 12, lg: 4},
                tableVisible: value.ref === table && props.layout.tableVisible === false ?
                true : value.ref !== table ? props.layout.tableVisible : false,
                scatterPlotVisible: value.ref === chartScatterPlot && props.layout.scatterPlotVisible === false ?
                true : value.ref !== chartScatterPlot ? props.layout.scatterPlotVisible : false,
                barChartVisible: value.ref === chartBar && props.layout.barChartVisible === false ?
                true : value.ref !== chartBar ? props.layout.barChartVisible : false,
              })
              setIcons({
                ...icons,
                [key]: {
                  ...value,
                  visible: value.visible ? false : true
                }
              })  
            }}
            />
        </Control>
        )
      }
      
      {
        overlayData ? 
        // console.log(overlayData)

        overlayData.map(layer => {
          const layerName = layer[0];
          const layerData = layer[1];
          const visible = boundaryLayerInfo[layerName].checked;
          const style = boundaryLayerInfo[layerName].style;
  

          return (visible ?

           <OverlayLayer 
            style={style}
            data={layerData}/> 

          : null)
        })
        : null
      }
      
      { props.data &&
        props.geoJSON &&
        props.primaryField &&  
        props.dataLoaded ?
        <GeoJSONLayer {...props} baseMap={baseMap}/> 
        : null 
      }

      <TileLayer
            key={baseMap}
            attribution={defaults.data.tileLayers.find(layer =>
              layer.key === baseMap).attribution}
            url={defaults.data.tileLayers.find(layer =>
              layer.key === baseMap).url}
      />

    </LeafletMap>

  );
};

export default Map;