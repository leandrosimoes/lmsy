#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

const params = process.argv.slice(2)

function showHelp() {
  console.log(`Usage: lmsy "<project-name>"
Create a basic HTML, CSS, and Javascript boilerplate project with the specified name.

Options:
  -h, --help    Show this help message
  -v, --version Show the version of LMSY
  
`)
}

if (params.length < 1) {
  console.error("No project name provided.")
  showHelp()
  process.exit(1)
}

if (params.includes("-h") || params.includes("--help")) {
  console.log(`
    
LMSY or Let Me Show You is a CLI tool to create a basic HTML, CSS, and Javascript boilerplate project. 
Use it for those "let me show you how" moments that you have with your colleagues where you need a quick basic HTML, CSS, and JavaScript project setup.
    
    `)
  showHelp()
  process.exit(0)
}

if (params.includes("-v") || params.includes("--version")) {
  const version = require("./package.json").version
  console.log(`v${version}`)
  process.exit(0)
}

if (params.length > 1) {
  console.error(
    "Too many arguments provided. Please provide only the project name."
  )
  showHelp()
  process.exit(1)
}

if (params[0].startsWith("-")) {
  console.error("Invalid argument. Please provide a valid project name.")
  showHelp()
  process.exit(1)
}

function formatProjectName(name = "") {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, "-")
}

function copyFiles(src, dest) {
  const files = fs.readdirSync(src)
  files.forEach((file) => {
    const srcFile = path.join(src, file)
    const destFile = path.join(dest, file)
    if (fs.statSync(srcFile).isDirectory()) {
      fs.mkdirSync(destFile, { recursive: true })
      copyFiles(srcFile, destFile)
    } else {
      fs.copyFileSync(srcFile, destFile)
      let content = fs.readFileSync(destFile, "utf8")
      content = content.replace(/{{projectName}}/g, projectName)
      fs.writeFileSync(destFile, content, "utf8")
    }
  })
}

const boilerplateDir = path.join(__dirname, "boilerplate")
const projectName = formatProjectName(process.argv[2])

if (!projectName) {
  console.error("Please provide a project name.")
  process.exit(1)
}

const projectDir = path.join(process.cwd(), projectName)
if (!fs.existsSync(boilerplateDir)) {
  console.error("Boilerplate directory does not exist.")
  process.exit(1)
}

if (fs.existsSync(projectDir)) {
  console.error(`Project directory "${projectName}" already exists.`)
  process.exit(1)
}

fs.mkdirSync(projectDir, { recursive: true })

try {
  copyFiles(boilerplateDir, projectDir)
} catch (error) {
  console.error("Error copying files:", error.message)
  process.exit(1)
}

console.log(`Project "${projectName}" created successfully in ${projectDir}`)
console.log(`Open the project: cd ${projectDir}`)
console.log(`Then run the project: npm start`)
