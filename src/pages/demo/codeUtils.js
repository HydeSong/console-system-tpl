const str = `ZERO	0点
ONE	1点
TWO	2点
THREE	3点
FOUR	4点
FIVE	5点
SIX	6点
SEVEN	7点
EIGHT	8点
NINE	9点
TEN	10点
ELEVEN	11点
TWELVE	12点
THIRTEEN	13点
FOURTEEN	14点
FIFTEEN	15点
SIXTEEN	16点
SEVENTEEN	17点
EIGHTEEN	18点
NINETEEN	19点
TWENTY	20点
TWENTY_ONE	21点
TWENTY_TWO	22点
TWENTY_THREE	23点`
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
  const prop = rowData[0]
  const label = rowData[1]
  result.push({ label, value: prop })
  console.log(`const COL_${prop.toLocaleUpperCase()} = {label:'${label}',prop:'${prop}'}`)
})

console.log(JSON.stringify(result))
