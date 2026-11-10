const fs = require("node:fs")
const path = require("node:path")
const ts = require("typescript")

const featuresDir = path.resolve(process.argv[2] ?? path.join(__dirname, "../src/features"))
let violations = 0

function checkFile(file, feature) {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  )
  function visit(node) {
    let specifier
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      specifier = node.moduleSpecifier
    } else if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === "require"))
    ) {
      specifier = node.arguments[0]
    }
    if (specifier && ts.isStringLiteralLike(specifier)) {
      const value = specifier.text
      const target = value.startsWith("@/features/")
        ? path.join(featuresDir, value.slice("@/features/".length))
        : value.startsWith(".")
          ? path.resolve(path.dirname(file), value)
          : null
      if (target) {
        const parts = path.relative(featuresDir, target).split(path.sep)
        if (parts[0] !== ".." && parts[0] !== feature && parts.length > 1) {
          const line = source.getLineAndCharacterOfPosition(specifier.getStart()).line + 1
          console.error(
            `${path.relative(process.cwd(), file)}:${line}: import ${value} through the feature's public API`,
          )
          violations++
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
}

function walk(dir, feature) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory() && entry.name !== "__tests__") walk(file, feature)
    else if (
      entry.isFile() &&
      /\.[jt]sx?$/.test(entry.name) &&
      !/\.test\.[jt]sx?$/.test(entry.name)
    ) {
      checkFile(file, feature)
    }
  }
}

for (const entry of fs.readdirSync(featuresDir, { withFileTypes: true })) {
  if (entry.isDirectory()) walk(path.join(featuresDir, entry.name), entry.name)
}
if (violations) process.exitCode = 1
