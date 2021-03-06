'use strict'

const BaseTest = require('../../../../base-test')
const ConsoleKernel = require('../../../../src/foundation/console/kernel')

class ConsoleKernelTest extends BaseTest {
  async bootstrapsConsole (t) {
    this.muteConsole()

    const kernel = new ConsoleKernel()

    process.argv = ['node']
    await kernel.bootstrap()

    const { stdout, stderr } = this.consoleOutput()
    t.true(stdout.includes('Available Commands'))
    t.falsy(stderr)
  }
}

module.exports = new ConsoleKernelTest()
