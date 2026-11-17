const fs = require("node:fs")
const path = require("node:path")
const { parse } = require("@babel/parser")

const featuresDir = path.resolve(process.argv[2] ?? path.join(__dirname, "../src/features"))
let violations = 0

function checkFile(file, feature) {
  const source = parse(fs.readFileSync(file, "utf8"), {
    sourceType: "unambiguous",
    plugins: ["typescript", "jsx"],
  })
  function visit(node) {
    let specifier
    if (
      node.type === "ImportDeclaration" ||
      node.type === "ExportNamedDeclaration" ||
      node.type === "ExportAllDeclaration"
    ) {
      specifier = node.source
    } else if (
      node.type === "ImportExpression" ||
      (node.type === "CallExpression" &&
        (node.callee.type === "Import" ||
          (node.callee.type === "Identifier" && node.callee.name === "require")))
    ) {
      specifier = node.type === "ImportExpression" ? node.source : node.arguments[0]
    }
    if (
      specifier?.type === "StringLiteral" ||
      (specifier?.type === "TemplateLiteral" && specifier.expressions.length === 0)
    ) {
      const value =
        specifier.type === "StringLiteral"
          ? specifier.value
          : (specifier.quasis[0].value.cooked ?? specifier.quasis[0].value.raw)
      const target = value.startsWith("@/features/")
        ? path.join(featuresDir, value.slice("@/features/".length))
        : value.startsWith(".")
          ? path.resolve(path.dirname(file), value)
          : null
      if (target) {
        const parts = path.relative(featuresDir, target).split(path.sep)
        if (parts[0] !== ".." && parts[0] !== feature && parts.length > 1) {
          console.error(
            `${path.relative(process.cwd(), file)}:${specifier.loc.start.line}: import ${value} through the feature's public API`,
          )
          violations++
        }
      }
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) {
        for (const child of value) {
          if (child?.type) visit(child)
        }
      } else if (value?.type) {
        visit(value)
      }
    }
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
