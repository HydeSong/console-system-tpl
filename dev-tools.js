var fs = require('fs')

let FILES = []
fs.readdir('./src/fields', function(err, files) {
  if (err) {
    console.error(err.message)
  }
  FILES = files
})

const codeFormatter = {
  /**
   * 替换方法体内容
   * @param {*} text
   */
  replaceFunction(text, body) {
    const renderChar = this.searchCharIndexs(text, body[0])
    const left = this.searchCharIndexs(text, body[1])
    const right = this.searchCharIndexs(text, body[2])

    const result = []
    renderChar.forEach(index => {
      result.push([0, index])
    })
    left.forEach(index => {
      result.push([1, index])
    })
    right.forEach(index => {
      result.push([2, index])
    })

    result.sort((a, b) => {
      return a[1] - b[1]
    })

    const blockList = []

    let isStartRender = false
    let sum = 0
    let startLeftIndex = 0
    let endRightIndex = 0
    for (const item of result) {
      if (item[0] === 0) {
        isStartRender = true
        // console.log('isStartRender', isStartRender);
      }

      if (isStartRender) {
        if (item[0] === 1) {
          if (sum === 0) {
            startLeftIndex = item[1]
            // console.log('startLeftIndex', startLeftIndex);
          }
          sum += 1
        } else if (item[0] === 2 && sum > 0) {
          sum -= 1
          if (sum === 0) {
            endRightIndex = item[1]
            isStartRender = false
            // console.log('endRightIndex', endRightIndex);
          }
        }
      }
      if (!isStartRender && startLeftIndex && endRightIndex) {
        blockList.push([startLeftIndex, endRightIndex])
        startLeftIndex = 0
        endRightIndex = 0
      }
    }
    let outText = text
    for (let index = blockList.length - 1; index >= 0; index--) {
      const item = blockList[index]
      outText = this.insertStr(outText, item[1], '`')
      outText = this.insertStr(outText, item[0] + 1, 'return `')
    }

    //   console.log(outText);
    return outText
  },
  /**
   * 插入字符到指定位置
   * @param {*} soure
   * @param {*} start
   * @param {*} newStr
   */
  insertStr(soure, start, newStr) {
    return soure.slice(0, start) + newStr + soure.slice(start)
  },
  /**
   * 查找指定字符位置
   * @param {*} str
   * @param {*} subStr
   */
  searchCharIndexs(str, subStr) {
    const positions = []
    let pos = str.indexOf(subStr)
    while (pos > -1) {
      positions.push(pos)
      pos = str.indexOf(subStr, pos + 1)
    }
    return positions
  },
  getDefaultSchema() {
    return {
      $schema: 'http://json-schema.org/draft-04/schema#',
      type: 'object',
      properties: {}
    }
  },
  /**
   * 解析规则缩写
   */
  parseShortRule(text) {
    if (text) {
      const result = []

      for (const rule of text.split('|')) {
        let params = null
        const validator = rule.replace(/\[(.*)\]/g, function() {
          // console.log(arguments[0])
          if (arguments[0]) {
            params = arguments[1].split(',')
          }
          // 查找数字后，可以对数字进行其他操作
          return ''
        })

        result.push({ validator, value: params })
      }
      return result
    }
    return null
  },
  code2schema(text) {
    let outText = this.replaceFunction(text, ['render', '{', '}'])
    outText = this.replaceFunction(outText, ['formatter', '{', '}'])
    // eslint-disable-next-line no-new-func
    const func = new Function('exports', 'require', outText)

    const module = {}
    const _require = (path) => {
      return { default: `require('${path}').default` }
    }
    func(module, _require)
    // console.log(module);
    this.module = module
    this.moduleProps = []
    //   console.log(module.merTableColumns);
    this.schemas = {}
    for (const key in module) {
      this.moduleProps.push(key)

      const newSchema = this.getDefaultSchema()
      this.schemas[key] = newSchema
      for (const fieldConfig of module[key]) {
        let type = fieldConfig.type
        debugger
        if (!type) {
          if (fieldConfig.choice) {
            type = 'select'
          } else {
            type = 'string'
          }
        }
        if (fieldConfig.component) {
          type = 'component'
        }
        // console.log(fieldConfig.type)
        newSchema.properties[fieldConfig.prop] = {
          type,
          label: fieldConfig.label,
          showProp: fieldConfig.showProp,
          component: fieldConfig.component,
          show: fieldConfig.show,
          render: fieldConfig.render ? fieldConfig.render().trim() : null,
          formatter: fieldConfig.formatter ? fieldConfig.formatter().trim() : null,
          choice: fieldConfig.choice,
          rules: this.parseShortRule(fieldConfig.rules)
        }
        // console.log(fieldConfig.label)
      }
      // console.log(this.schemas);
    }
    return this.schemas
  }
}

exports.register = function(app) {
  app.all('/devTools/**', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')// 允许所有来源访问
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,WG-Token,Content-Type,Access-Token')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')// 允许访问的方式
    res.header('X-Powered-By', ' 3.2.1')
    res.header('Content-Type', 'application/json;charset=utf-8')
    next()
  })
  /**
   * 获取指定文件
   */
  app.get('/devTools/getFile', async function name(req, res) {
    var file = req.query.file
    const data = fs.readFileSync('./src/fields/' + file, 'utf-8')
    res.send(data)
  })
  /**
   * 获取json
   */
  app.get('/devTools/getJson', async function name(req, res) {
    var file = req.query.file
    const data = fs.readFileSync('./src/fields/' + file, 'utf-8')
    const outJson = codeFormatter.code2schema(data)
    // console.log(JSON.stringify(outJson))
    res.json(outJson)
  })
  /**
  * 保存文件
  */
  app.post('/devTools/saveFile', async function name(req, res) {
    req.on('data', function(data) {
      const obj = JSON.parse(data)
      // console.log(obj);
      fs.writeFile('./src/fields/' + obj.fileName, obj.content, error => {
        if (error) return console.log('写入文件失败,原因是' + error.message)
        console.log('写入成功')
      })
      res.json({ status: 'ok' })
    })
    // console.log(JSON.stringify(outJson))
    // res.json({ status: 'ok' })
  })
  /**
   * 获取文件
   */
  app.get('/devTools/files', async function(req, res) {
    // var data = fs.readFileSync('./src/pages/mer-report/config.json', 'utf8')
    await fs.readdir('./src/fields', function(err, files) {
      if (err) {
        console.error(err.message)
      }
      FILES = files
    })
    res.json(FILES)
  })
}

// const m = require('./src/fields/core-database.js')
// console.log(m)
const data = fs.readFileSync('./src/fields/core-database.js', 'utf-8')
const outJson = codeFormatter.code2schema(data)
console.log(JSON.stringify(outJson))
