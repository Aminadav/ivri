var dbJSON = {}
var fs = require('fs')
module.exports = dbJSON

dbJSON.create = (filename) => {
  var value
  return {
    get: async function (_default=null) {
      var temp
      if (value) return value
      if (fs.existsSync(filename)) {
        temp = fs.readFileSync(filename).toString()
        value = JSON.parse(temp)
      } else {
        value = _default
      }
      return value
    },
    set: async function (newValue) {
      value = newValue
      //@ts-ignore
      fs.writeFileSync(filename, JSON.stringify(newValue,'\t',2))
    }
  }
}