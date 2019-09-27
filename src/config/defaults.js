export default {
    layout: {
        mapVisible: true,
        tableVisible: false,
        scatterPlotVisible: false,
        barChartVisible: false,
        // chartVisible: false,
        colorMap: 'portland',
        numberOfBins: 72,
        colorMapReverse: false,
        chartType: 'bar-chart',
        colorOpacity: .8,
        tableBanding: ['#c8e4d6', '#f3eeeb'],
        mapWidth: {sm: 12, lg: 12},
        sideBarWidth: {sm: 0, lg: 0}
    },
    data: {
        tray: {
            TotPop_00: {
                category: "Change since 2000",
                text: "# Total population, 2000",
                value: "TotPop_00",
                api: 'OpenDataMain',
                api_param: 0,
            },
            TotalHH_00: {
                category: "Change since 2000",
                text: "# Total Households, 2000",
                value: "TotalHH_00",
                api: 'OpenDataMain',
                api_param: 0,
            },
            pHHwChild_e : {
                category: 'Social',
                text: '% Households with one or more people under 18 years, 2017',
                value: 'pHHwChild_e',
                api: 'OpenDataMain',
                api_param: 7,
            }

        },
        geoAPIs: {
            OpenDataMain : {
                url: 'https://services1.arcgis.com/Ug5xGQbHsD8zuZzM/arcgis/rest/services/ACSAllGeo2017/FeatureServer/',
                joinField: 'GEOID',
                otherFields: ['NAME', 'PlanningRegion'],
                // url: 'https://arcgis.atlantaregional.com/arcgis/rest/services/ACSAllGeo2017/FeatureServer/',
            },
            HighSchools15to17: {
                url: 'https://arcgis.atlantaregional.com/arcgis/rest/services/OpenData/FeatureServer/248/',
                joinField: 'SCHOOL_ID',
                otherFields: ['SCHOOL_NAME', 'SYSTEM_NAME'],
            }
        },
        dataAPIs: {
            OpenDataMain : {
                url: 'https://services1.arcgis.com/Ug5xGQbHsD8zuZzM/arcgis/rest/services/ACSAllGeo2017/FeatureServer/',
                joinField: 'GEOID',
                otherFields: ['NAME', 'PlanningRegion'],
                apiParam: true,
                // url: 'https://arcgis.atlantaregional.com/arcgis/rest/services/ACSAllGeo2017/FeatureServer/',
                geographies: ['State', 'County', 'City', 'Tract', 'ZCTA', 'GAHouse', 'GASenate', 'NPU', 'NSA', 'AtlCityCouncil', 'RC', 'SuperDistrict', 'Congress']
            },
            HighSchools15to17: {
                url: 'https://arcgis.atlantaregional.com/arcgis/rest/services/OpenData/FeatureServer/248/',
                joinField: 'SCHOOL_ID',
                otherFields: ['SCHOOL_NAME', 'SYSTEM_NAME'],
                geographies: ['GAHighSchools']


            }
        },
        hoverField: 'GEOID',
        selectedFields: ['NAME', 'GEOID'],
        sumLevel: 'NSA',
        MOE: false,
        bounds: [[-85.4, 34.8],[-83.4, 32.8],[-84, 33]],
        tileLayers : [
            {
                name: 'OpenStreetMap Dark',
                key: 'tile-layer-dark',
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap: "Map tiles by Carto, under CC BY 3.0.</a> contributors',
                url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
                thumbUrl: 'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/14/4351/6557.png'
            },
            // {
            //     name: 'OpenStreetMap Mono',
            //     key: 'tile-layer-mono',
            //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            //     url: 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
            // },
            {
                name: 'OpenStreetMap Color',
                key: 'tile-layer-color',
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                thumbUrl: 'https://a.tile.openstreetmap.org/14/4351/6557.png'

            },
            {
                name: 'ArcGIS Light Grey',
                key: 'tile-arcgis-grey',
                attribution: '',
                url: 'http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
                thumbUrl: 'http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/13/3279/2174'
            },
            {
                name: 'ArcGIS Satellite',
                key: 'tile-arcgis-satellite',
                attribution: '',
                url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                thumbUrl: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/3279/2174'
            },
            {
                name: 'ArcGIS Street Map Color',
                key: 'tile-arcgis-color',
                attribution: '',
                url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
                thumbUrl: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/13/3279/2174'
            },
            {
                name: 'National Geographic Color',
                key: 'tile-natgeo',
                attribution: '',
                url: 'http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
                thumbUrl: 'http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/13/3279/2174'
            },
            {
                name: 'Wikimedia',
                key: 'tile-wiki',
                attribution: '',
                url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
                thumbUrl: 'https://maps.wikimedia.org/osm-intl/13/2174/3279.png'
            }

        ],
        overlayLayerInfo: {
            Counties: {
                name: 'Counties',
                style: {
                    borderWeight: 2,
                    borderColor: 'black',
                    borderType: 'solid'
                },
                checked: true,
                labelValue: 'Name',
                url: 'https://opendata.arcgis.com/datasets/63996663b8a040438defe56ef7ce31e3_0.geojson'
            },
            Cities: {
                name: 'Cities',
                style: {
                    borderWeight: 1,
                    borderColor: 'purple',
                    borderType: 'dashed'
                },
                checked: true,
                labelValue: 'NAME',
                url: 'https://opendata.arcgis.com/datasets/0248805ea42145d3b7d7194beafcc3d7_55.geojson'
            },
            NPUs: {
                name: 'NPUs',
                style: {
                    borderWeight: 1,
                    borderColor: 'red',
                    borderType: 'solid'
                },
                checked: false,
                labelValue: 'NAME',
                // url: 'https://opendata.arcgis.com/datasets/91911cd123624a6b9b88cbf4266a2309_4.geojson'
                url: 'https://gis.atlantaga.gov/dpcd/rest/services/OpenDataService/FeatureServer/4/query?where=1%3D1&outFields=NAME,NPU&returnCentroid=true&outSR=4326&f=geojson'
            }

        }
    },
    geoOptions : [
        {
            key: 'geo-0',
            text: 'State of Georgia',
            value: 'State',
            boundingGeo: 'State',
            boundingGeoOffSet: -2,
            geoAPI: 'OpenDataMain'
        },
        {
            key: 'geo-1',
            text: 'Counties',
            value: 'County',
            boundingGeo: 'State',
            boundingGeoOffSet: -2,
            geoAPI: 'OpenDataMain'   
        },        
        {
            key: 'geo-2',
            text: 'Cities',
            value: 'City',
            boundingGeo: 'State',
            boundingGeoOffSet: -2,
            geoAPI: 'OpenDataMain'    
        },
        {
            key: 'geo-3',
            text: 'GA House Districts',
            value: 'GAHouse',
            boundingGeo: 'State',
            boundingGeoOffSet: -2,
            geoAPI: 'OpenDataMain'   
        },
        {
            key: 'geo-4',
            text: 'GA Senate Districts',
            value: 'GASenate',
            boundingGeo: 'State',
            boundingGeoOffSet: -2,
            geoAPI: 'OpenDataMain'     
        },
        {
            key: 'geo-5',
            text: 'Atlanta Neighborhood Planning Units (NPUs)',
            value: 'NPU',
            boundingGeo: 'COA',
            boundingGeoOffSet: -.09,
            geoAPI: 'OpenDataMain'  
        },
        // {
        //     key: 'geo-6',
        //     text: 'ARC 20 County',
        //     value: 'ARC20',
        //     boundingGeo: 'ARC10' 
        // },
        {
            key: 'geo-8',
            text: 'Atlanta Neighborhood Statistical Areas (NSAs)',
            value: 'NSA',
            boundingGeo: 'COA',
            boundingGeoOffSet: -.09,
            geoAPI: 'OpenDataMain'
   
        },
        {
            key: 'geo-12',
            text: 'Atlanta City Council Districts',
            value: 'AtlCityCouncil',
            boundingGeo: 'COA',
            boundingGeoOffSet: -.09,
            geoAPI: 'OpenDataMain'     
        },
        {
            key: 'geo-9',
            text: 'Regional Commissions',
            value: 'RC',
            boundingGeo: 'State',
            boundingGeoOffSet: -2,
            geoAPI: 'OpenDataMain'
        },
        {
            key: 'geo-10',
            text: 'Super Districts',
            value: 'SuperDistrict',
            boundingGeo: 'ARC20',
            boundingGeoOffSet: -.9,
            geoAPI: 'OpenDataMain'  
        },
        {
            key: 'geo-7',
            text: 'US Congressional Districts',
            value: 'Congress',
            boundingGeo: 'State',
            boundingGeoOffSet: -2,
            geoAPI: 'OpenDataMain'   
        },
        {
            key: 'geo-11',
            text: 'Zip Code Tabulation Areas (ZCTAs)',
            value: 'ZCTA',
            boundingGeo: 'State',
            boundingGeoOffSet: -2,
            geoAPI: 'OpenDataMain'   
        },
        {
            key: 'geo-13',
            text: 'Census Tracts',
            value: 'Tract',
            boundingGeo: 'State',
            boundingGeoOffSet: -2,
            geoAPI: 'OpenDataMain'   
        },
        // {
        //     key: 'geo-14',
        //     text: 'Georgia High Schools',
        //     value: 'GAHighSchools',
        //     boundingGeo: 'State',
        //     boundingGeoOffSet: -2,
        //     geoAPI: 'HighSchools15to17'
   
        // }
    ],
    boundingGeoURL: {
        State: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/2/query?where=GEOID=13&f=geojson',
        COA: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2019/MapServer/28/query?where=GEOID%3D1304000&f=geojson',
        ARC20: 'https://services1.arcgis.com/Ug5xGQbHsD8zuZzM/ArcGIS/rest/services/Opendata2/FeatureServer/560/query?where=1%3D1&outFields=*&outSR=4326&f=geojson',
        ARC10: 'https://arcgis.atlantaregional.com/arcgis/rest/services/OpenData/FeatureServer/103/query?where=1%3D1&outFields=*&f=geojson'
    }
}