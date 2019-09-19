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
                url: 'https://cors-anywhere.herokuapp.com/https://arcgis.atlantaregional.com/arcgis/rest/services/ACSAllGeo2017/FeatureServer/',
            }
        },
        dataAPIs: {
            OpenDataMain : {
                url: 'https://cors-anywhere.herokuapp.com/https://arcgis.atlantaregional.com/arcgis/rest/services/ACSAllGeo2017/FeatureServer/',
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
                url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
            },
            {
                name: 'OpenStreetMap Mono',
                key: 'tile-layer-mono',
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                url: 'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
            },
            {
                name: 'OpenStreetMap Color',
                key: 'tile-layer-color',
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            },
            {
                name: 'ArcGIS Light Grey',
                key: 'tile-arcgis-grey',
                attribution: '',
                url: 'http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
            },
            {
                name: 'ArcGIS Satellite',
                key: 'tile-arcgis-satellite',
                attribution: '',
                url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            },
            {
                name: 'ArcGIS Street Map Color',
                key: 'tile-arcgis-color',
                attribution: '',
                url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
            },
            {
                name: 'National Geographic Color',
                key: 'tile-natgeo',
                attribution: '',
                url: 'http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'
            },
            {
                name: 'Wikimedia',
                key: 'tile-wiki',
                attribution: '',
                url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'
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
                url: 'https://opendata.arcgis.com/datasets/91911cd123624a6b9b88cbf4266a2309_4.geojson'
            }

        }
    },
    geoOptions : [
        {
            key: 'geo-0',
            text: 'State of Georgia',
            value: 'State',
            boundingGeo: 'State' 
        },
        {
            key: 'geo-1',
            text: 'County',
            value: 'County',
            boundingGeo: 'State'  
        },        
        {
            key: 'geo-2',
            text: 'City',
            value: 'City',
            boundingGeo: 'State' 
        },
        {
            key: 'geo-3',
            text: 'GA House Districts',
            value: 'GAHouse',
            boundingGeo: 'State'  
        },
        {
            key: 'geo-4',
            text: 'GA Senate Districts',
            value: 'GASenate',
            boundingGeo: 'State'  
        },
        {
            key: 'geo-5',
            text: 'Atlanta Neighborhood Planning Units (NPUs)',
            value: 'NPU',
            boundingGeo: 'COA'  
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
            boundingGeo: 'COA' 
        },
        {
            key: 'geo-12',
            text: 'Atlanta City Council Districts',
            value: 'AtlCityCouncil',
            boundingGeo: 'COA'  
        },
        {
            key: 'geo-9',
            text: 'Regional Commissions',
            value: 'RC',
            boundingGeo: 'State' 
        },
        {
            key: 'geo-10',
            text: 'Super Districts',
            value: 'SuperDistrict',
            boundingGeo: 'ARC20' 
        },
        {
            key: 'geo-7',
            text: 'US Congressional Districts',
            value: 'Congress',
            boundingGeo: 'State' 
        },
        // {
        //     key: 'geo-11',
        //     text: 'Zip Code Tabulation Areas (ZCTAs)',
        //     value: 'ZCTA',
        //     boundingGeo: 'State' 
        // }
        // {
        //     key: 'geo-11',
        //     text: 'Census Tracts',
        //     value: 'Tract',
        // }
    ],
    boundingGeoURL: {
        State: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/2/query?where=GEOID=13&f=geojson',
        COA: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2019/MapServer/28/query?where=GEOID%3D1304000&f=geojson',
        ARC20: 'https://services1.arcgis.com/Ug5xGQbHsD8zuZzM/ArcGIS/rest/services/Opendata2/FeatureServer/560/query?where=1%3D1&outFields=*&outSR=4326&f=geojson',
        ARC10: 'https://arcgis.atlantaregional.com/arcgis/rest/services/OpenData/FeatureServer/103/query?where=1%3D1&outFields=*&f=geojson'
    }
}