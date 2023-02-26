var db={}
module.exports=db
var mysql = require("promise-mysql")
var poolPromise = mysql.createPool({
  host: "localhost",
  port:   3300,
  user: "root",
  charset: "utf8mb4",
  database:'ivri',
  timezone: "utc",
  connectionLimit: 10
})
async function createTables() {
  var dbo=await poolPromise
  await dbo.query("create database if not exists ivri")
  await dbo.query("create table if not exists users(id integer auto_increment primary key,json json) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
  await dbo.query("create table if not exists calendars(id integer auto_increment primary key,json json) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
}

async function onDbReady(){
  // var dbo=await poolPromise
  await createTables()
}
poolPromise.then(onDbReady)
db.createTables=async function(){
  var dbo=await poolPromise
  // dbo.query("create table 

}

/**
 * @param statement {string}
 * @param params {(number|string|boolean|Date)[]}
 * @returns {Promise<{insertId:number,affectedRows:number,changedRows:number}& any[]>}
 */
db.query=async function(query,params=[],log=false){
  var dbo=await poolPromise

  if(log) {
    console.log(require('mysql').format(query,params))
  }
  var res=await dbo.query(query,params)

  try {
    for (var rowIndex = 0; rowIndex < res.length; rowIndex++) {
      var row = res[rowIndex]
      if(row.json) {
        try {
          Object.assign(row,JSON.parse(row.json),{...row}) // add json into the row, but if json and row have same field (like id), use the original one
        } catch(err) { }
      }
      delete row.json
    }
  } catch(err) {}
  return res
}

db.queryRow=async function(query,params=[],log){
  var rows=await db.query('(' + query + ') limit 1',params,log)
  if(rows) return rows[0]
}

db.objectToJsonSet=function (object){
  var str='json_set(json'
  for(let key of Object.keys(object)) {
    str+=`,"$.${key}",${require('mysql').escape(object[key])}`
  }
  str += ')'
  return str
}

// db.query("select 1").then(console.log)
