var h = require('virtual-dom/h')
var vraf = require('virtual-raf')
var createMap = require('./index')

function render (state) {
  return h('div#map', createMap(state.geojson, {
    zoom: 12,
    setView: true,
    center: [47.621958, -122.33636]
  }))
}

var initialState = {
  geojson: { type: 'FeatureCollection', features: [] }
}

var tree = vraf(initialState, render, require('virtual-dom'))
document.body.appendChild(tree())
