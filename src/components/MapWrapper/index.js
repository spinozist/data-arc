import React, { useState, useEffect } from 'react';
import { Map as LeafletMap, TileLayer, LayersControl, ZoomControl } from 'react-leaflet';
import Control from 'react-leaflet-control';
import GeoJSONLayer from '../MapLayers/GeoJSONLayer';
import OverlayLayer from '../MapLayers/OverlayLayer';
import BaseMapLegend from '../Legends/BaseMapLegend';
import BoundaryLayerLegend from '../Legends/BoundaryLayerLegend';
import DataLayerLegend from '../Legends/DataLayerLegend';

// import { Dropdown } from 'semantic-ui-react';
// import L from 'leaflet';
// import Loader from 'react-loader-spinner';
import { FiHome } from "react-icons/fi";
import API from '../../utils/API.js';
import defaults from '../../config/defaults';
import { Icon } from '@iconify/react';
import table from '@iconify/icons-mdi/table';
import chartScatterPlot from '@iconify/icons-mdi/chart-scatter-plot';
import chartBar from '@iconify/icons-mdi/chart-bar';
// import chartLine from '@iconify/icons-mdi/chart-line';
// import LayoutWrapper from '../LayoutWrapper';




const Map = props => {

  const iconStyle = {backgroundColor: 'white', borderRadius: '5px', padding: '5px'}
  const iconSize = '50px';
  const iconColor = 'black';
  const iconPosition = 'bottomright';

  const icons = [
    {ref: table}, 
    {ref: chartScatterPlot},
    {ref: chartBar}, 
    // {ref: chartLine}
  ];

  const [overLayers, setOverLayers] = useState(
    {
      Counties: defaults.data.overlayLayers.find(layer => layer.name === 'Counties').checked,
      Cities: defaults.data.overlayLayers.find(layer => layer.name === 'Cities').checked,
      NPUs: defaults.data.overlayLayers.find(layer => layer.name === 'NPUs').checked
    }
  )


  const [overlayData, setOverlayData] = useState(),
        [bounds , setBounds] = useState(),
        [baseMap, setBaseMap] = useState('tile-layer-mono');

  const handleBounds = boundingGEO => {
    const pointArray = boundingGEO ? 
            boundingGEO.features[0].geometry.type === 'MultiPolygon' ?
              boundingGEO.features[0].geometry.coordinates[0][0]
              : boundingGEO.features[0].geometry.coordinates[0]
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

  const handleOverlayData = overlayArray => {
    var dataArray = [];
      const getLayers = () => overlayArray.map(overlay =>
        API.getData(overlay.url)
        .then(res => {
          const name = overlay.name;

          dataArray.push([name, res.data.features])
          // console.log(overlayData);
          // const data = res.data.features;
          // setOverlayData({
          //   ...overlayData,
          //   [name]: res.data.features
          // })
        })
        .catch(err => console.log(err))
      )
    getLayers();
    console.log(dataArray)
    // const dataObj = Object.fromEntries(dataArray);
    setOverlayData(dataArray)
  };

  useEffect(() => handleOverlayData(defaults.data.overlayLayers), [props.primaryField])

  useEffect(() => handleBounds(props.boundingGEO), [props.boundingGEO])

  return (
    <LeafletMap
      key={'leaflet-map'}
      // center={[33.8, -84.4]}
      // zoom={10.5}
      bounds={bounds}
      boundsOptions={{padding: [50, 50]}}
      maxZoom={18}
      attributionControl={true}
      zoomControl={false}
      doubleClickZoom={true}
      scrollWheelZoom={true}
      dragging={true}
      animate={false}
      // onViewportChange={(viewport: Viewport) => setViewport(viewport)}
      onViewportChange={() => setBounds()}

    > 
        {/* <div 
          style={{
            border: 'solid grey .8px', 
            backgroundColor: 'white', 
            textAlign: 'center', 
            width: '70%', 
            borderRadius: '5px', 
            padding: '10px', 
            position: 'absolute', 
            top: '12px', 
            left: '15%', 
            zIndex: '998',
            opacity: '.9',
          }}>
            <h2 style={{ lineHeight: '20px' }}>
              {
                props.data && props.primaryField && props.labelManifest ?
                OpenDataManifest[props.labelManifest].find(item => item.Variable === props.primaryField) ?
                OpenDataManifest[props.labelManifest].find(item => item.Variable === props.primaryField).Long :
                'No Variable Selected'
                // DataManifest.map(item => item.Variable === props.primaryField ? item.Long : null)
                : 'No Variable Selected'
              }
            </h2>
            <p style={{ lineHeight: '10px' }}> 
              {
                props.data && props.primaryField && props.labelManifest ?
                OpenDataManifest[props.labelManifest].find(item => item.Variable === props.primaryField) ?
                OpenDataManifest[props.labelManifest].find(item => item.Variable === props.primaryField).Source :
                null
                // DataManifest.map(item => item.Variable === props.primaryField ? item.Long : null)
                : null
              }
            </p>
        </div> */}
        <ZoomControl position="topright" />
        <Control position='topleft'>
          <BaseMapLegend
            legendInfo={defaults.data.tileLayers} 
            setBaseMap={setBaseMap}
            baseMap={baseMap}
          />

        </Control>
        <Control position='topleft'>
          <BoundaryLayerLegend
            legendInfo={defaults.data.overlayLayers}
            setOverLayers={setOverLayers}
            overLayers={overLayers}

          />
        </Control>
        <Control position='topleft'>
          <DataLayerLegend
            geoLabel={defaults.geoOptions.find(option => option.value === props.geo)}
            primaryField={props.primaryField}
            labelManifest={props.labelManifest}
            browseDataButton={props.dataButton}
            colorRamp={props.colorRamp}
          />
        </Control>
        <Control position="topright" >

         <FiHome style={{height: '40px', width: '40px', padding: '5px', backgroundColor: 'white', borderRadius: '5px'}} onClick={() => {
            console.log('Reset View Button Clicked');
            handleBounds(props.boundingGEO)
          }} />
        </Control>
        {
          icons.map(icon => 
          <Control position={iconPosition}>
            <Icon 
              style={iconStyle}
              height={iconSize} 
              width={iconSize} 
              color={iconColor} 
              icon={icon.ref}
              onClick={() =>
                props.setLayout({
                ...props.layout,
                mapWidth: {sm: 12, lg: 8},
                sideBarWidth: {sm: 12, lg: 4},
                tableVisible: icon.ref === table && props.layout.tableVisible === false ?
                   true : icon.ref !== table ? props.layout.tableVisible : false,
                scatterPlotVisible: icon.ref === chartScatterPlot && props.layout.scatterPlotVisible === false ?
                true : icon.ref !== chartScatterPlot ? props.layout.scatterPlotVisible : false,
                barChartVisible: icon.ref === chartBar && props.layout.barChartVisible === false ?
                true : icon.ref !== chartBar ? props.layout.barChartVisible : false,
                })
              }/>
          </Control>)
        }

 
      {
        overlayData ? 
        // console.log(overlayData)

        overlayData.map(layer => {
          const layerName = layer[0];
          const layerData = layer[1];
          const visible = overLayers[layerName];
          const borderWeight = defaults.data.overlayLayers.find(layer =>
            layer.name === layerName).style.borderWeight;
          const borderColor = defaults.data.overlayLayers.find(layer =>
              layer.name === layerName).style.borderColor
  

          return (visible ?

           <OverlayLayer 
            borderWeight={borderWeight}
            borderColor={borderColor}
            data={layerData}/> 

          : null)
        })

        // defaults.data.overlayLayers.map(layer => 

        //   overlayData[layer.name] && overLayers[layer.name] ?
        //     <OverlayLayer 
        //     borderWeight={layer.style.borderWeight}
        //     borderColor={layer.style.borderColor}
        //     data={overlayData[layer.name]}/> : null
  

        // ) 
        : null
      }
      
      { props.data ?
        <GeoJSONLayer {...props}/> 
        : null 
      }

      <TileLayer
            key={baseMap}
            attribution={defaults.data.tileLayers.find(layer =>
              layer.key === baseMap).attribution}
            url={defaults.data.tileLayers.find(layer =>
              layer.key === baseMap).url}
      />


      




    {/* <LayersControl position="topleft"> */}
      {/* {
        defaults.data.tileLayers.map(tileLayer => 
          <LayersControl.BaseLayer name={tileLayer.name}>
            <TileLayer
              key={tileLayer.key} 
              attribution={tileLayer.attribution}
              url={tileLayer.url}
            />
          </LayersControl.BaseLayer>
      )} */}
      {/* { overlayData ?
        defaults.data.overlayLayers.map(layer => 
          <LayersControl.Overlay 
          name={layer.name}
          checked={layer.checked}>
          { overlayData[layer.name] ?
            <OverlayLayer 
            borderWeight={layer.style.borderWeight}
            borderColor={layer.style.borderColor}
            data={overlayData[layer.name]}/> : null } 
        </LayersControl.Overlay>

        ) : null
      } */}
    {/* </LayersControl>       */}

    </LeafletMap>

  );
};

export default Map;