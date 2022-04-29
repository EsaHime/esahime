#!/usr/bin/env node

const cmd = process.argv[2]
switch (cmd) {
  case 'init':
    require('../src/init')()
    break

  case 'version':
    require('../src/version')()
    break

  default:
    require('../src/help')()
    break
}
