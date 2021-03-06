var utils = require('opbeat-test/webdriverio-utils')
describe('minified_module_app', function () {
  beforeEach(utils.verifyNoBrowserErrors)

  it('should have correct number of transactions and traces', function () {
    return browser.url('/angular/index.e2e.html')
      .executeAsync(function (cb) {
        window.e2eUtils.runFixture('./minified_module_app/minified_module_app.js', ['../../dist/dev/opbeat-angular.e2e.min.js', 'offline-js', 'angular', 'angular-ui-router'], {
          beforeInit: function (app, deps) {
            window.e2e.getTransactions(function (trs) {
              cb(trs)
            }, 0, 1)
            app.init({
              debug: true,
              orgId: '7f9fa667d0a349dd8377bc740bcfc33e',
              appId: '6664ca4dfc',
              performance: {
                enable: true,
                enableStackFrames: true,
                groupSimilarTraces: true
              }
            })
          },
          useNgApp: false,
          uiRouter: true
        })
      })
      .then(function (response) {
        var transactions = response.value

        transactions[0].traces.groups.forEach(function (g) {
          var frames = g.extra._frames
          if (typeof frames !== 'undefined') {
            expect(frames.length).toBeGreaterThan(0)
          }
        })
        expect(transactions.length).toBe(1)

        var first = transactions[0]

        expect(first.traces.groups.length).toBeGreaterThan(11)
        utils.expectTraceInGroups('transaction', 1, first.traces.groups)
        expect(first.traces.raw[0].length).toBeGreaterThan(15)
        expect(first.transactions.length).toBe(1)
        expect(first.transactions[0].transaction).toBe('minified_module_app_exponentialstate')
      }, function (error) {
        console.log(error)
      })
  })

  afterEach(utils.allowSomeBrowserErrors.bind(this, ['angular/common/non-existing 0:0 Failed to load resource: the server responded with a status of 404 (Not Found)']))
})
