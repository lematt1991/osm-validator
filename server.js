var express = require('express')
var path = require('path')
var pg = require('pg')

const PORT = process.env.PORT || 8080;

var db = new pg.Client({database : 'osm-validator'})
db.connect()

var app = express()

app.get('/tile/:z/:x/:y', function (req, res) {
	res.sendFile(path.join(__dirname, `warped/${req.params.z}/${req.params.x}/${req.params.y}.png`))
})

app.get('/polygons/:ymin/:xmin/:ymax/:xmax', function (req, res) {
	const {xmin, ymin, xmax, ymax} = req.params;

	var q = `
		SELECT ST_AsGeoJSON(geom)::json as geometry, osm_id
		FROM copernicus.osm
		WHERE ST_Contains(ST_MakeEnvelope(${xmin}, ${ymin}, ${xmax}, ${ymax}, 4326), geom)
	`
	
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

app.listen(PORT, function (err) {
  if (err) {
    return console.error(err)
  }
  console.log(`Listening at http://localhost:${PORT}`)
})
