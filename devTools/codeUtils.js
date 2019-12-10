const str = `6	内部商户号	merInnerNo
7	商户注册名称	merRegName
8	商户经营名称	merOptName
9	进件日期	contractDate
10	进件状态	rowStatusText
11	注册地址	merRegAddr
12	注册地址全路径	fullAddress
13	法人姓名	larName
14	法人证件号码	larIdcard
15	商户注册地址	merRegAddr`
// console.log(str.split('\n'))
const result = []
str.split('\n').forEach(row => {
  const rowData = row.split('\t')
  //   let type = ''
  //   switch (rowData[3]) {
  //     case 'datetime':
  //       type = 'date'
  //       break
  //     default:
  //       break
  //   }
  const prop = rowData[2]
  const label = rowData[1]
  result.push({ label, prop })
  console.log(`const COL_${prop.toLocaleUpperCase()} = {label:'${label}',prop:'${prop}'}`)
})

console.log(JSON.stringify(result))
