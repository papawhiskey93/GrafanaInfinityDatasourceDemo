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
const DataTableCollectionTest1 = "DummyTestData1";
const DataTableCollectionTest2 = "DummyTestData2";

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

function setCORSHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "accept, content-type");  
}

app.all('/queryForJsonObject', function(req, res) {
    setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  var tsResult = [];  
  
	   MongoDbClientObject.collection(DataTableCollectionTest2).find({}).toArray(function(err, table) {
		if (err){
			console.log(tsResult);
			res.json(tsResult);
			res.end();
			throw err;
		}else{
			
			console.log(table);
			res.json(table);
			res.end();
		}
		});
});

app.get('/queryForNestedJsonValue', function(req, res){
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  var tsResult = [];  
  
	   MongoDbClientObject.collection(DataTableCollectionTest1).find({}).toArray(function(err, table) {
		if (err){
			console.log(tsResult);
			res.json(tsResult);
			res.end();
			throw err;
		}else{
			
			console.log(table);
			res.json(table);
			res.end();
		}
		});
});

app.listen(3333);

console.log("Server is listening to port 3333");
