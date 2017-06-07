OSM Validator
-------------

A simple tool for overlaying OSM data on actual GeoTIFF satellite data.  

### Tile the GeoTIFF

```bash
./mk_tiles.sh <img>.tif
```

This will create a directory called `warped` full of `png` files

### Populate the database

```
createdb osm-validator
./init_db.py
```

This will create a `tiles` table with a row for each tile file along with its bounding box.




