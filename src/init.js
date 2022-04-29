const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const semver = require('semver')
const validate = require('validate-npm-package-name')

const packageJson = require('../package.json')
const { replaceFileContent } = require('./utils/file-replace')
const { getJson } = require('./utils/http')
const { execCommand } = require('./utils/child')

module.exports = async function () {
  const ora = (await import('ora')).default
  const spinner = ora('Checking EsaHime version...').start()

  try {
     const latest = execSync(`npm view ${packageJson.name} version`)
     .toString()
     .trim()

    if (latest && semver.lt(packageJson.version, latest)) {
      console.log(`Current version: ${packageJson.version}, latest version: ${latest}`)
      console.log('Please consider to update to the latest.')
    }
  } catch (error) {
    console.warn('Unable to check Esahime version, skipped.')
  }

  spinner.start('Fetching config...')

  let templateConfig = {}
  try {
    templateConfig = await getJson('https://raw.githubusercontent.com/EsaHime/config/main/lib/template.json')
    spinner.succeed('Fetching config...Done')
  } catch (error) {
    spinner.fail('Failed to fetch template data, please check your network.')
    console.error(error)
    process.exit(1)
  }

  spinner.stop()

  const answers = await inquirer.prompt([
    {
      name: 'templateSelect',
      type: 'list',
      message: 'Choose your template:',
      choices: templateConfig.map(item => `[${item.name}] - ${item.description}`),
    },
    {
      name: 'projectName',
      type: 'input',
      message: 'Enter a project name:',
      validate: validateProjectName,
    },
    {
      name: 'projectDescription',
      type: 'input',
      message: 'Enter description:',
    },
  ])

  const projectName = answers.projectName
  const root = path.resolve(projectName)
  const projectDescription = answers.projectDescription
  const selectedTemplate = templateConfig.find(
    (item) => answers.templateSelect.includes(`[${item.name}]`),
  )

  if (!selectedTemplate) {
    console.error('Unable to locale selection, please contact maintainer.')
    return
  }

  const { git: gitPath } = selectedTemplate
  if (!gitPath) {
    console.error('The template you selected is incorrect, please contact the maintainer.')
    return
  }

  spinner.start('Cloning git repo...')
  try {
    await execCommand('git', ['clone', gitPath, projectName])
    spinner.succeed('Cloning git repo...Done')
  } catch (error) {
    spinner.fail('Failed to clone repo, please ensure git has been installed on your computer.')
    console.error(error)
    return
  }
  spinner.stop()

  process.chdir(root)

  spinner.start('Filling the information...')
  try {
    replaceFileContent(root, 'esahime_project_name', projectName)
    replaceFileContent(root, 'esahime_description', projectDescription)

    const date = new Date()
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const dateString = `${year}-${month}-${day}`

    replaceFileContent(root, 'esahime_create_date', dateString)

    spinner.succeed('Filling the information...Done')
  } catch (error) {
    spinner.fail('Filling the information...Failed')
  }

  console.log()
  spinner.stopAndPersist({
    symbol: '🚀',
    text: `${projectName} has been created successfully.`,
  })
}

function validateProjectName (input) {
  const { validForNewPackages: valid } = validate(input)
  if (!valid) {
    return 'Please provide a valid name.'
  }
  if (fs.existsSync(path.resolve(input))) {
    return 'Name exists, please select an another one.'
  }
  return true
}
