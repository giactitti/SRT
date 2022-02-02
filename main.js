//generate table
var geom=ee.Geometry.BBox(94.1329327392578,25.514028970276666,94.5339337158203,25.890203351903423);
var MapUnit=geom.coveringGrid(geom.projection(),1000);
Map.addLayer(MapUnit,{},'units');

//import tool
var SRT = require('users/giacomotitti/SRT:SRTfunctions');

//temperature
var temperature = SRT.SRTtemperature(MapUnit,2000,2021,30);//mapping unit, start date, end date, scale
print(temperature,'temperature');

geomorphometry
var geomorphometry = SRT.SRTgeomorphometry(MapUnit,1000,30);//mapping unit, buffer radius for relief, scale
print(geomorphometry,'geomorphometry');

//geomorph
var curvature = SRT.SRTcurvature(MapUnit,30);//mapping unit, scale
print(curvature,'curvature');

// precipitation
var precipitation = SRT.SRTprecipitation(MapUnit,1991,2020,30);//mapping unit, start date, end date, scale
print(precipitation,'precipitation');

//ndvi
var ndvi = SRT.SRTndvi(MapUnit,2011,2020,30);//mapping unit, start date, end date, scale
print(ndvi,'ndvi');

//Display
Map.setCenter(94.33, 25.74, 10);
var display = function(collection,name){
var imaged = collection.reduceToImage({
properties: [name],
reducer: ee.Reducer.first()});
Map.addLayer(imaged,{},name)};

display(ndvi,'NDVI_mean');
//display(geomorphometry,'Slope');
display(precipitation,'RnMax_mean');
display(temperature,'TMax_mean');
  max: 1,
  palette: ['FCFDBF', 'FDAE78', 'EE605E', 'B63679', '711F81', '2C105C']
},name)};

display(ndvi,'NDVI_mean');
