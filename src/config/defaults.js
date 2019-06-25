export default {
    layout: {
        mapView: false,
        tableView: true,
        chartView: false,
    },
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
        },        {
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
    ]
}