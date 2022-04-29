module.exports = function () {
  const content = [
    '',
    'EsaHime CLI toolkit.',
    '',
    'Usage: esahime <command>',
    '',
    'Commands:',
    '  - init: Create project by using specificed template.',
    '  - version: Get version.',
    '  - help: Get help.',
    '',
  ]

  content.forEach((item) => console.log(item))
}
