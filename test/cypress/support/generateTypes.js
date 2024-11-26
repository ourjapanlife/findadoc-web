import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { basename, extname } from 'path'
import { sync } from 'glob'

// Source directories
const srcDirs = ['./pages', './components']
// Folder for separated files
const outputDir = './test/cypress/support/testIds'
// Main type file
const mainOutputFile = './test/cypress/support/generated.d.ts'

// Regular expression to match `data-testid` attributes
const dataTestIdRegex = /data-testid="([^"]+)"/g

// Utility to create directories if they don't exist
const ensureDir = dir => {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

// Step 1: Extract `data-testid` attributes
const extractDataTestIds = () => {
    const testIds = {}

    for (const srcDir of srcDirs) {
        // Find all files in the source directory
        const files = sync(`${srcDir}/**/*.vue`, { nodir: true })

        // Extract `data-testid` attributes and group by file
        files.forEach(file => {
            const content = readFileSync(file, 'utf8')

            // Extract file name
            const componentName = basename(file, extname(file))
            let match

            while ((match = dataTestIdRegex.exec(content)) !== null) {
                if (!testIds[componentName]) testIds[componentName] = new Set()
                testIds[componentName].add(match[1])
            }
        })
    }

    return testIds
}

// Step 2: Generate separated files
const generateSeparatedFiles = testIds => {
    ensureDir(outputDir)

    Object.entries(testIds).forEach(([componentName, ids]) => {
        const templates = []
        const typeFileContent = `
            export type ${componentName}TestIds =
            ${Array.from(ids)
                .map(id => {
                    if (id.includes('`')) {
                        let templateId = id
                        id = id.replace(/\${index \+ 1}|'|"/g, '').replace(/[`]/g, '\'')
                        templateId = templateId.replace('index + 1', 'number')
                        templates.push(templateId)
                    } else id = `'${id}'`
                    return id
                })
                .concat(templates)
                .join(' | ') || 'never'}
            `
            .trim()

        writeFileSync(`${outputDir}/${componentName}TestIds.ts`, typeFileContent)
    })
}

// Step 3: Generate main type definition file
const generateMainTypeDefinition = testIds => {
    const imports = Object.keys(testIds)
        .map(componentName => `import type { ${componentName}TestIds } from './testIds/${componentName}TestIds'`)
        .join('\n')

    const typeDefinition = `
        ${imports}
type DataTestId = ${Object.keys(testIds)
    .map(componentName => `${componentName}TestIds`)
    .join(' | ')}
        `
        .trim()

    writeFileSync(mainOutputFile, typeDefinition)
    console.log(`✅ Main Cypress type definitions updated: ${mainOutputFile}`)
}

// Step 4: Run the generation
const testIds = extractDataTestIds()
generateSeparatedFiles(testIds)
generateMainTypeDefinition(testIds)
