export default {
    mapView: { visible: true, x: 0, y: 2, w: 8, h: 4, minW: 4, maxH: 10 },
    tableView: { visible: true, x: 6, y: 2, w: 4, h: 4, minW: 4, maxH: 10 },
    chartView: { visible: false },
    dataSelector: { visivle: true,  x: 0, y: 0, w: 8, h: 2, minW: 2, maxH: 5 },
    data: {
        baseUrl: 'https://arcgis.atlantaregional.com/arcgis/rest/services/ACSAllGeo2017/FeatureServer/'
    },
    categoryOptions: [
        {
            key: "serviceID-0",
            text: "Change since 2000",
            value: 0
        },
        {
            key: "serviceID-1",
            text: "Demography",
            value: 1
        },
        {
            key: "serviceID-2",
            text: "Demography by Race & Ethnicity",
            value: 2
        },
        {
            key: "serviceID-3",
            text: "Economy",
            value: 3
        },
        {
            key: "serviceID-4",
            text: "Economy by Race & Ethnicity",
            value: 4
        },
        {
            key: "serviceID-5",
            text: "Housing",
            value: 5
        },
        {
            key: "serviceID-6",
            text: "Housing by Race & Ehtnicity",
            value: 6
        },
        {
            key: "serviceID-7",
            text: "Social",
            value: 7
        },
        {
            key: "serviceID-8",
            text: "Social by Race & Ethnicity",
            value: 8
        }
    ],
    geoOptions : [
        {
            key: "geo-0",
            text: "State of Georgia",
            value: 'State' 
        },
        {
            key: "geo-1",
            text: "County",
            value: 'County' 
        },        
        {
            key: "geo-2",
            text: "City",
            value: 'City' 
        },
        {
            key: "geo-3",
            text: "GA House Districts",
            value: 'GAHouse' 
        },
        {
            key: "geo-4",
            text: "GA Senate Districts",
            value: 'GASenate' 
        },
        {
            key: "geo-5",
            text: "Neighborhood Planning Units (NPU)",
            value: 'NPU' 
        },
        {
            key: "geo-6",
            text: "ARC 20 County",
            value: "ARC20"
        },
        {
            key: "geo-7",
            text: "US Congressional Districts",
            value: "Congress"
        },
        {
            key: "geo-8",
            text: "Neighborhood Statistical Areas",
            value: "NSA"
        },
        {
            key: "geo-9",
            text: "Regional Commissions",
            value: "RC"
        },
        {
            key: "geo-10",
            text: "Super Districts",
            value: "SuperDistrict"
        }
    ]
}