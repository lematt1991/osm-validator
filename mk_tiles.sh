#!/bin/bash

if [ $# -ne "1" ]; then
	echo "Usage: ./mk_tiles.sh <geotiff>"
	exit 1;
fi

GDAL_DATA=$(gdal-config --datadir)

GDAL_DATA=$GDAL_DATA gdalwarp -co TILED=YES -co COMPRESS=DEFLATE -t_srs EPSG:3857 $1 warped.tif

gdal2tiles.py -z 18 warped.tif