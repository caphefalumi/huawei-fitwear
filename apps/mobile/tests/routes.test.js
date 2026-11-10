const fs = require("node:fs")
const path = require("node:path")
const { getExactRoutes } = require("expo-router/build/getRoutes")

test("grouped routes remain at the root navigator with their original URLs", () => {
  const appDir = path.resolve(__dirname, "../app")
  const files = []
  function collect(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name)
      if (entry.isDirectory()) collect(file)
      else if (/\.tsx?$/.test(entry.name)) files.push(`./${path.relative(appDir, file)}`)
    }
  }
  collect(appDir)
  const context = () => ({ default: () => null })
  context.keys = () => files
  const tree = getExactRoutes(context, { ignoreEntryPoints: true, platform: "web" })
  const routes = tree.children.map((child) => child.route)
  expect(routes).toEqual(
    expect.arrayContaining([
      "(details)/ble-sync",
      "(details)/injuries",
      "(details)/meal",
      "(details)/nutrition",
      "(details)/progress",
      "(modals)/add-item",
      "(modals)/capture",
      "(modals)/replace-food",
      "(modals)/review-item",
      "(settings)/account-data",
      "(settings)/developer-options",
      "(workout)/chest-plan",
      "(workout)/exercise-guide",
      "(workout)/exercise-preferences",
      "(workout)/plan",
      "(workout)/session",
    ]),
  )
})
