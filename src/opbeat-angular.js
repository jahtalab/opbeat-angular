var opbeatCore = require('opbeat-js-core')
var ServiceFactory = opbeatCore.ServiceFactory
var angularInitializer = require('./angularInitializer')

function init () {
  var serviceFactory = new ServiceFactory()
  if (window.opbeatApi && window.opbeatApi.serviceFactory) {
    serviceFactory = window.opbeatApi.serviceFactory
  }
  var serviceContainer = serviceFactory.getPerformanceServiceContainer()
  // should require zone.js after ZoneSerivce is created but before initialization
  require('zone.js')
  angularInitializer(serviceFactory)
}

init()
