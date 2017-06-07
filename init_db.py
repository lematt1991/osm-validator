#!/usr/bin/env python

import os, fnmatch, pdb, pandas, sqlalchemy, mercantile
from sqlalchemy import create_engine
from shapely.geometry import shape


engine = create_engine('postgresql://localhost:5432/osm-validator')


matches = []
for root, dirnames, filenames in os.walk('warped'):
    for filename in fnmatch.filter(filenames, '*.png'):
        matches.append(os.path.join(root, filename))

df = pandas.DataFrame(matches, columns=['filename'])

df['done'] = False

def file2bounds(row):
	file = row[0]
	split = file.split('/')
	z = int(split[1])
	x = int(split[2])
	y = int(split[3].split('.')[0])

	bounds = mercantile.bounds(x, y, z)

	#[west, south, east, north]
	return list(bounds)

bounds = df.apply(file2bounds, axis=1)
bounds = pandas.DataFrame(list(bounds.values))
bounds.columns = ['west', 'south', 'east', 'north']

df = pandas.concat([df, bounds], axis=1)

df.to_sql('tiles', engine, index=False, if_exists='replace')

engine.execute("ALTER TABLE tiles ADD COLUMN geom geometry('Polygon', 4326)")
engine.execute("UPDATE tiles SET geom=ST_MakeEnvelope(west, south, east, north, 4326);")
engine.execute("CREATE INDEX ON tiles USING GIST(geom)")



