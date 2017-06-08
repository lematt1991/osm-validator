import React from 'react'
import 'leaflet-editable/src/Leaflet.Editable'
import { Map, TileLayer, FeatureGroup, Circle } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import L from 'leaflet'

class Home extends React.Component{
	componentDidMount(){
		const position = [51.505, -0.09];
		this.map = L.map('map', {editable : true})
		const tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')
		tileLayer.addTo(this.map);
		this.map.setView(position, 13)

		L.EditControl = L.Control.extend({
      options: {
        position: 'topleft',
        callback: null,
        kind: '',
        html: ''
      },
      onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
        var link = L.DomUtil.create('a', '', container);
        link.href = '#';
        link.title = 'Create a new ' + this.options.kind;
        link.innerHTML = this.options.html;
        L.DomEvent.on(link, 'click', L.DomEvent.stop)
                  .on(link, 'click', function () {
                    window.LAYER = this.options.callback.call(map.editTools);
                  }, this);
        return container;
      }
    })
		L.NewPolygonControl = L.EditControl.extend({
      options: {
        position: 'topleft',
        callback: this.map.editTools.startPolygon,
        kind: 'polygon',
        html: '▰'
      }
    });

		this.map.addControl(new L.NewPolygonControl())
	}

	render(){
		
		return(
			<div id='map' style={styles.container}>

			</div>

		)
	}
}

export default Home;

const styles = {
	container : {
		position : 'absolute',
		top : 0,
		bottom : 0,
		left : 0,
		right : 0
	}
}