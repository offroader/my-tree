function createMap (config) {
    var view = new ol.View({
      center: ol.proj.fromLonLat([44, 42]),
      zoom: 8
    })
    
    var map = new ol.Map({
        target: config.target.id,
        layers: [new ol.layer.Tile({
            source: new ol.source.OSM()
        })],
        view: view
    })
    
    var myTreesLayer = new ol.layer.Vector({
      source: new ol.source.Vector()
    })
        
    map.addLayer(myTreesLayer)
    
    var selectInteraction = new ol.interaction.Select()
    map.addInteraction(selectInteraction)
    
    selectInteraction.getFeatures().on('add', function (e) {
        var feature = e.element
        feature.setStyle(getSelectedStyle())
    })
    
    selectInteraction.getFeatures().on('remove', function (e) {
        var feature = e.element
        feature.setStyle(getNormalStyle())
    })
    
    setTimeout(function () {
        config.getRandomPoints(function (points) {
            var features = []
            points.forEach(function (point) {
                features.push(createFeature('tree', point))
            })
            myTreesLayer.getSource().clear()
            myTreesLayer.getSource().addFeatures(features)
        })
    }, 10)
    
    function createFeature (name, data) {
        var f = new ol.Feature({
            name: name,
            geometry: new ol.geom.Point(ol.proj.fromLonLat([data.lon, data.lat]))
        })
        
        f.setStyle(getNormalStyle())
        
        return f
    }
    
    function getNormalStyle () {
        return new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 48],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'static/icons/white-tree.png'
          })
        })
    }
    
    function getSelectedStyle () {
        return new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 48],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'static/icons/white-tree-selected.png'
          })
        })
    }
    
    return map
}
