var L = require('leaflet')

module.exports = LeafletWidget

function LeafletWidget (state, options) {
  if (!(this instanceof LeafletWidget)) return new LeafletWidget(state, options)
  var defaultState = { type: 'FeatureCollection', features: [] }

  if (!state || typeof state !== 'object') {
    this.data = defaultState
  } else if (state.type === 'Feature') {
    defaultState.features.push(state)
    this.data = defaultState
  } else if (state.type === 'FeatureCollection') {
    this.data = state
  }

  L.Icon.Default.imagePath = options.assetPath || 'assets/'
  this.type = 'Widget'
  this.map = null
  this.features = null
  this.tiles = options.tileLayer || L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' })
  this.onclick = options.onclick
  delete options.tiles
  delete options.onclick
  this.options = options
}

LeafletWidget.prototype.refresh = function () {
  this.map.invalidateSize()
}

LeafletWidget.prototype.init = function () {
  var self = this
  var el = document.createElement('div')
  this.map = L.map(el, this.options)
  this.tiles.addTo(this.map)
  this.features = L.geoJson(this.data)
  this.map.addLayer(this.features)

  this.features.on('click', function (e) {
    self.onclick(e)
  })

  window.addEventListener('load', function (e) {
    self.map.invalidateSize()
  })

  return el
}

LeafletWidget.prototype.update = function (previous, el) {
  this.map = this.map || previous.map
  this.features = this.features || previous.features
  this.features.clearLayers()
  this.features.addData(this.data)
}

LeafletWidget.prototype.destroy = function (el) {}
