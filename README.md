# SRT - Spatial Reduction Tool
SRT is a collector and spatial reducer of data from GEE available dataset. It allows you to calculate the spatial mean and standard deviation from several dataset inside each feature of a feature collection ('MapUnit' in the example).

The dataset collected are:
- DEM: USGS/SRTMGL1_003
- temperature: MODIS/006/MOD11A1
- precipitation: UCSB-CHG/CHIRPS/DAILY
- ndvi: LANDSAT/LE07/C01/T1_32DAY_NDVI

The SRT is structured in 5 separated functions which can be run separately or simultanously:
- SRTtemperature()
- SRTgeomorphology()
- SRTcurvature()
- SRTprecipitation()
- SRTndvi()

The SRT requires a polygons collection which represents the mapping units where the datsets have been spatially reduced to mean and std.

The outputs are 5 feature collections which contains several columns:

| Function            | Column name | Description                                                                |
|---------------------|-------------|----------------------------------------------------------------------------|
| SRTgeomorphology    | Elev        | Elevation                                                                  |
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

[link to example](https://code.earthengine.google.com/8a8e3a15badb223b564e3efd071ca008)


```javascript
//generate table
var geom=ee.Geometry.BBox(94.1329327392578,25.514028970276666,94.5339337158203,25.890203351903423);
var MapUnit=geom.coveringGrid(geom.projection(),10000);
Map.addLayer(MapUnit,{},'units');

//import tool
var SRT = require('users/giacomotitti/SRT:SRTfunctions');

//temperature
var temperature = SRT.SRTtemperature(MapUnit,2000,2021);//mapping unit, start date, end date
print(temperature,'temperature');

//geomorph
var geomorphology = SRT.SRTgeomorphology(MapUnit,1000);//mapping unit, buffer radius for relief
print(geomorphology,'geomorphology');

//geomorph
var curvature = SRT.SRTcurvature(MapUnit);//mapping unit
print(curvature,'curvature');

// precipitation
var precipitation = SRT.SRTprecipitation(MapUnit,1991,2020);//mapping unit, start date, end date
print(precipitation,'precipitation');

//ndvi
var ndvi = SRT.SRTndvi(MapUnit,2011,2020);//mapping unit, start date, end date
print(ndvi,'ndvi');

//Display
Map.setCenter(94.33, 25.74, 10);
var display = function(collection,name){
var imaged = collection.reduceToImage({
properties: [name],
reducer: ee.Reducer.first()});
Map.addLayer(imaged, {
  min: -1,
  max: 1,
  palette: ['FCFDBF', 'FDAE78', 'EE605E', 'B63679', '711F81', '2C105C']
},name)};

display(ndvi,'NDVI_mean');
```
