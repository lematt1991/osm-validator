var express = require('express')
var path = require('path')
var pg = require('pg')

var db = new pg.Client({database : 'osm-verifier'})
db.connect()

var app = express()

function tile2long(x,z) { return (x/Math.pow(2,z)*360-180); }

function tile2lat(y,z) {
    var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
    return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}

app.get('/tile/:z/:x/:y', function (req, res) {
	res.sendFile(path.join(__dirname, `warped/${req.params.z}/${req.params.x}/${req.params.y}.png`))
})

app.use(express.static('static'))

app.listen(8080, function (err) {
  if (err) {
    return console.error(err)
  }
  console.log(`Listening at http://localhost:8080`)
})
