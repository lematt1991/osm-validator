import React from 'react'
import L from 'leaflet'
import 'leaflet-editable/src/Leaflet.Editable'
import { Map, TileLayer, FeatureGroup, Circle } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import {connect} from 'react-redux'
import * as MapActions from '../actions/MapActions';

class Home extends React.Component{

  submit = () => {
    console.log('Done editing...')
  }

  componentDidMount(){
    const map = this.refs.map.leafletElement

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
        callback: map.editTools.startPolygon,
        kind: 'polygon',
        html: '⬠'
      }
    });

    map.addControl(new L.NewPolygonControl())

    map.on('editable:drawing:end', e => {
      const polygon = e.layer.toGeoJSON()
      this.props.dispatch(MapActions.addFeature(polygon));
    })
  }

  render(){
    return(
      <Map editable={true} ref='map' style={styles.container} center={[51, -.09]} zoom={13}> 
        <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' />
        <button style={styles.button} onClick={this.submit}>
          Done Editing
        </button>
      </Map>  
    )
  }
}

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => ({dispatch})

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = {
  button : {
    zIndex : 50000,
    position : 'absolute',
    top : 20,
    right : 20,
    height : 40,
    width : 120,
    borderRadius : 10,
    backgroundColor : '#337AB7',
    color : 'white'
  },
	container : {
		position : 'absolute',
		top : 0,
		bottom : 0,
		left : 0,
		right : 0
	}
}














