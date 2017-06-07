var express = require('express')
var path = require('path')
var pg = require('pg')
var SphericalMercator = require('sphericalmercator')


var db = new pg.Client({database : 'osm-validator'})
db.connect()

var app = express()


var projection = new SphericalMercator({
  size: 256
})

// Compute the bounding box of a tile
function getBBox (x, y, z) {
  var tile = {}
  tile.bounds = projection.bbox(x, y, z, false, '900913')
  tile.bbox = `ST_SetSRID(ST_MakeBox2D(ST_MakePoint(${tile.bounds[0]},${tile.bounds[1]}), 
ST_MakePoint(${tile.bounds[2]}, ${tile.bounds[3]})), 3857)`
  tile.bbox_4326 = `ST_Transform(${tile.bbox}, 4326)`
  tile.geom_hash = 'Substr(MD5(ST_AsBinary(the_geom)), 1, 10)'
  return tile
}

app.get('/tile/:z/:x/:y', function (req, res) {
	res.sendFile(path.join(__dirname, `warped/${req.params.z}/${req.params.x}/${req.params.y}.png`))
})

app.get('/polygons/:z/:x/:y', function (req, res) {
	const {z, x, y} = req.params;
	const tile = getBBox(x, y, z)
	var q = `SELECT ST_AsGeoJSON(geom)::json, filename FROM tiles WHERE ST_Intersects(geom, ${tile.bbox_4326})`
	db.query(q, (err, result) => {
		if(err){
			console.log(err)
			res.status(500).send(err)
		}else{
			res.json(result.rows)
		}
	})
})

app.use(express.static('static'))

app.listen(8080, function (err) {
  if (err) {
    return console.error(err)
  }
  console.log(`Listening at http://localhost:8080`)
})
