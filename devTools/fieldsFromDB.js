/* eslint-disable */
/* jshint esversion: 6 */

var mysql = require('mysql')
var connection = mysql.createConnection({
  host: '10.177.93.150',
  user: 'app',
  password: 'app',
  database: 'mms_task_db'
})

// 下划线转换驼峰
function toHump(name) {
  return name.toLowerCase().replace(/\_(\w)/g, function(all, letter) {
    return letter.toUpperCase()
  })
}
// 驼峰转换下划线
function toLine(name) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase()
}

function queryTable(tableName) {
  connection.connect()

  connection.query(`SELECT column_name as prop,COLUMN_COMMENT as label FROM information_schema.columns WHERE TABLE_NAME="${tableName}";`, function(error, results, fields) {
    if (error) throw error
    console.log('The solution is: ', results)
    const list = results.map(({ prop, label }) => {
      return { label, prop: toHump(prop) }
    })

    console.log(JSON.stringify(list))
  })

  connection.end()
}

queryTable('mms_merchant_publicno_conf_detail')
