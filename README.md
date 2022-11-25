# SRT - Spatial Reduction Tool
SRT is a collector and spatial reducer of data from GEE available dataset. It allows you to calculate the spatial mean and standard deviation from several dataset inside each feature of a feature collection ('MapUnit' in the example).

The dataset collected are:
- DEM: USGS/SRTMGL1_003
- temperature: MODIS/006/MOD11A1
- precipitation: UCSB-CHG/CHIRPS/DAILY
- ndvi: LANDSAT/LE07/C01/T1_32DAY_NDVI

The SRT is structured in 5 separated functions which can be run separately or simultanously:
- SRTtemperature()
- SRTgeomorphometry()
- SRTcurvature()
- SRTprecipitation()
- SRTndvi()

The SRT requires a polygons collection which represents the mapping units where the datsets have been spatially reduced to mean and std.

The outputs are 5 feature collections which contains several columns:

| Function            | Column name | Description                                                                |
|---------------------|-------------|----------------------------------------------------------------------------|
| SRTgeomorphometry   | Elev        | Elevation                                                                  |
|                     | Slope       | Slope                                                                      |
|                     | Asp         | Aspect                                                                     |
|                     | Hill        | Hillshade                                                                  |
|                     | Nss         | Northness                                                                  |
|                     | Ess         | Eastness                                                                   |
|                     | SIdx        | Shape Index                                                                |
|                     | Rlf         | Relative relief                                                            |
| SRTcurvature        | HCv         | Horizontal curvature                                                       |
|                     | VCv         | Vertical curvature                                                         |
|                     | MCv         | Mean curvature                                                             |
|                     | MinCv       | Minimal curvature                                                          |
|                     | MaxCv       | Maximal curvature                                                          |
|                     | GCv         | Gaussian curvature                                                         |
| SRTprecipitation    | RnSum       | Annual precipitation averaged over a number of years                       |
|                     | RnMax       | Max daily precipitation of one year averaged over a number of years        |
|                     | RnStd       | Std daily precipitation of one year averaged over a number of years        |
|                     | RnMed       | Average daily precipitation of one year averaged over a number of years    |
| SRTtemperature      | TMed        | Average daily mean temperature of one year averaged over a number of years |
|                     | TStd        | Std daily mean temperature of one year averaged over a number of years     |
|                     | TMax        | Max daily mean temperature of one year averaged over a number of years     |
| SRTndvi             | NDVI        | 32days NDVI averaged over a number of years                                |


Most of the variables derived from the DEM have been calculated using [TAGEE](https://github.com/zecojls/tagee) function:

Safanelli, J.L.; Poppiel, R.R.; Ruiz, L.F.C.; Bonfatti, B.R.; Mello, F.A.O.; Rizzo, R.; Demattê, J.A.M. Terrain Analysis in Google Earth Engine: A Method Adapted for High-Performance Global-Scale Analysis. ISPRS Int. J. Geo-Inf. 2020, 9, 400. DOI: https://doi.org/10.3390/ijgi9060400

# Example of application

[link to example](https://code.earthengine.google.com/cefc92f911a5a929cf6cbd992e05d6c3)


```javascript
//generate table
var geom=ee.Geometry.BBox(94.1329327392578,25.514028970276666,94.5339337158203,25.890203351903423);
var MapUnit=geom.coveringGrid(geom.projection(),1000);
Map.addLayer(MapUnit,{},'units');

//import tool
var SRT = require('users/giacomotitti/SRT:SRTfunctions');

//FUNCTIONS
//--------------------------------------------------------------------------------------------

// temperature: MODIS, https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD11A1
// values: Average daily mean temperature of one year averaged over a number of years, Std daily mean temperature of one year averaged over a number of years
// Max daily mean temperature of one year averaged over a number of years
var temperature = SRT.SRTtemperature(MapUnit,2000,2021,30);//mapping unit, start date, end date, scale

// geomorphometry: SRTM, https://cmr.earthdata.nasa.gov/search/concepts/C1000000240-LPDAAC_ECS.html
// values: Slope, Aspect, Hillshade, Northness, Eastness, Shape Index, Relative relief
var geomorphometry = SRT.SRTgeomorphometry(MapUnit,1000,30);//mapping unit, buffer radius for relief, scale

// curvature: SRTM, https://cmr.earthdata.nasa.gov/search/concepts/C1000000240-LPDAAC_ECS.html
// values: Horizontal curvature, Vertical curvature, Mean curvature, Minimal curvature,	Maximal curvature, Gaussian curvature
var curvature = SRT.SRTcurvature(MapUnit,30);//mapping unit, scale

// precipitation: CHIRPS daily, https://chc.ucsb.edu/data/chirps
// values: Annual precipitation averaged over a number of years,	Max daily precipitation of one year averaged over a number of years,
// Std daily precipitation of one year averaged over a number of years, Average daily precipitation of one year averaged over a number of years
var precipitation = SRT.SRTprecipitation(MapUnit,1991,2020,30);//mapping unit, start date, end date, scale

// NDVI: Landsat, https://developers.google.cn/earth-engine/datasets/catalog/LANDSAT_LC08_C01_T1_32DAY_NDVI
// values: 32days NDVI averaged over a number of years
var ndvi = SRT.SRTndvi(MapUnit,2011,2020,30);//mapping unit, start date, end date, scale


//DOWNLOAD TO GOOGLE DRIVE
//-------------------------------------------------------------------------------------------------------------------------------

// uncomment to export NDVI: Landsat, https://developers.google.cn/earth-engine/datasets/catalog/LANDSAT_LC08_C01_T1_32DAY_NDVI
Export.table.toDrive({
  collection: ndvi,//add the name of the table to export
  description: 'table',
  folder: 'SRTout',
  fileFormat: 'SHP',
});

// uncomment to export temperature: MODIS, https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD11A1
//Export.table.toDrive({
//  collection: temperature,//add the name of the table to export
//  description: 'table',
//  folder: 'SRTout',
//  fileFormat: 'SHP',
//});

// uncomment to export geomorphometry: SRTM, https://cmr.earthdata.nasa.gov/search/concepts/C1000000240-LPDAAC_ECS.html
//Export.table.toDrive({
//  collection: geomorphometry,//add the name of the table to export
//  description: 'table',
//  folder: 'SRTout',
//  fileFormat: 'SHP',
//});

// uncomment to export curvature: SRTM, https://cmr.earthdata.nasa.gov/search/concepts/C1000000240-LPDAAC_ECS.html
//Export.table.toDrive({
//  collection: curvature,//add the name of the table to export
//  description: 'table',
//  folder: 'SRTout',
//  fileFormat: 'SHP',
//});

// uncomment to export precipitation: CHIRPS daily, https://chc.ucsb.edu/data/chirps
//Export.table.toDrive({
//  collection: precipitation,//add the name of the table to export
//  description: 'table',
//  folder: 'SRTout',
//  fileFormat: 'SHP',
//});

```

# Contacts

For any request, comment and suggestion, please write to me: giacomotitti@gmail.com
