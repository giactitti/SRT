# SRT


[link to example](https://code.earthengine.google.com/8a8e3a15badb223b564e3efd071ca008





```javascript
//generate table
var geom=ee.Geometry.BBox(94.1329327392578,25.514028970276666,94.5339337158203,25.890203351903423);
var MapUnit=geom.coveringGrid(geom.projection(),10000);
Map.addLayer(table,{},'units');

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
