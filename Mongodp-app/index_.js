var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var app = express();

// Module calling
const MongoClient = require("mongodb").MongoClient;
// Server path
const url = 'mongodb://localhost:27017/';
// Name of the database
const MongoDbname = "GrafanaDataTables";
//Name Of Collections
const DataTableCollection = "test";
const AnnotationCollection = "AnnotationCollection";

let MongoDbClientObject = null;

MongoClient.connect(url , {useUnifiedTopology : true , useNewUrlParser : true } , function(err,client){
    if(err) {
		console.log("Error in the connectivity");  
    }
    else{
		MongoDbClientObject=client.db(MongoDbname);
		console.log("successful connection with the server");
	}
        
});

app.use(bodyParser.json());

//for Annotations
var annotation = {
  name : "annotation name",
  enabled: true,
  datasource: "generic datasource",
  showLine: true,
}
var annotations = [
  { annotation: annotation, "title": "Donlad trump is kinda funny", "time": 1450754160000, text: "teeext", tags: "taaags" },
  { annotation: annotation, "title": "Wow he really won", "time": 1450754160000, text: "teeext", tags: "taaags" },
  { annotation: annotation, "title": "When is the next ", "time": 1450754160000, text: "teeext", tags: "taaags" }
];
var now = Date.now();
var decreaser = 0;
for (var i = 0;i < annotations.length; i++) {
  var anon = annotations[i];
  anon.time = (now - decreaser);
  decreaser += 1000000
}

var tagKeys = [
  {"type":"string","text":"Country"}
];

var countryTagValues = [
  {'text': 'SE'},
  {'text': 'DE'},
  {'text': 'US'}
];

function setCORSHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "accept, content-type");  
}

app.all('/', function(req, res) {
  setCORSHeaders(res);
  res.send('I have a quest for you!');
  res.end();
});

app.all('/search', function(req, res){
  setCORSHeaders(res);
  var result = ["upper_25" , "upper_50"];

  res.json(result);
  res.end();
});

app.all('/annotations', function(req, res) {
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  res.json(annotations);
  res.end();
});

app.get('/query', function(req, res){
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  var tsResult = [];
  //console.log(req.body.targets);
  //console.log(req.body.targets[0].type);
  
  
    //if (req.body.targets[0].type === 'table') {
	   MongoDbClientObject.collection(DataTableCollection).find({}).toArray(function(err, table) {
		if (err){
			console.log(tsResult);
			res.json(tsResult);
			res.end();
			throw err;
		}else{
			/*
			var decreaser = 0;
			var now = Date.now();
			for (var i = 0;i < table[0].rows.length; i++) {
				var anon = table[0].rows[i];
				anon[0] = (now - decreaser);
				decreaser += 1000000
			}
			*/
			console.log(table);
			//tsResult.push(table);
			//console.log(tsResult);
			res.json(table);
			res.end();
		}
		});
    //} 
  //});
});

app.all('/tag[\-]keys', function(req, res) {
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  res.json(tagKeys);
  res.end();
});

app.all('/tag[\-]values', function(req, res) {
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  if (req.body.key == 'City') {
    res.json(cityTagValues);
  } else if (req.body.key == 'Country') {
    res.json(countryTagValues);
  }
  res.end();
});

app.listen(3333);

console.log("Server is listening to port 3333");
