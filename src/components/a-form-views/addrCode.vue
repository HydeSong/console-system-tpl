<template>
  <span>
    <!-- <a-cascader placeholder="省市县" v-model="selectData" :options="citys" @change="handleChange" /> -->
    <a-select
      :style="{width:'calc('+width+' )'}"
      v-model="mValue"
      :filterOption="filterOption"
      :mode="meta.multi?'multiple':undefined"
    >
      <a-select-option v-for="item in citys" :key="item.value">{{item.label}} {{item.value}}</a-select-option>
    </a-select>
  </span>
</template>

<script>
const data = [
  {
    districtId: 1000,
    districtName: '北京市'
  },
  {
    districtId: 1100,
    districtName: '天津市'
  },
  {
    districtId: 1210,
    districtName: '石家庄市'
  },
  {
    districtId: 1240,
    districtName: '唐山市'
  },
  {
    districtId: 1260,
    districtName: '秦皇岛市'
  },
  {
    districtId: 1270,
    districtName: '邯郸市'
  },
  {
    districtId: 1310,
    districtName: '邢台市'
  },
  {
    districtId: 1340,
    districtName: '保定市'
  },
  {
    districtId: 1380,
    districtName: '张家口市'
  },
  {
    districtId: 1410,
    districtName: '承德市'
  },
  {
    districtId: 1430,
    districtName: '沧州市'
  },
  {
    districtId: 1460,
    districtName: '廊坊市'
  },
  {
    districtId: 1480,
    districtName: '衡水市'
  },
  {
    districtId: 1610,
    districtName: '太原市'
  },
  {
    districtId: 1620,
    districtName: '大同市'
  },
  {
    districtId: 1650,
    districtName: '阳泉市'
  },
  {
    districtId: 1660,
    districtName: '长治市'
  },
  {
    districtId: 1680,
    districtName: '晋城市'
  },
  {
    districtId: 1690,
    districtName: '朔州市'
  },
  {
    districtId: 1710,
    districtName: '忻州市'
  },
  {
    districtId: 1730,
    districtName: '吕梁市'
  },
  {
    districtId: 1750,
    districtName: '晋中市'
  },
  {
    districtId: 1770,
    districtName: '临汾市'
  },
  {
    districtId: 1810,
    districtName: '运城市'
  },
  {
    districtId: 1910,
    districtName: '呼和浩特市'
  },
  {
    districtId: 1920,
    districtName: '包头市'
  },
  {
    districtId: 1930,
    districtName: '乌海市'
  },
  {
    districtId: 1940,
    districtName: '赤峰市'
  },
  {
    districtId: 1960,
    districtName: '呼伦贝尔市'
  },
  {
    districtId: 1980,
    districtName: '兴安盟'
  },
  {
    districtId: 1990,
    districtName: '通辽市'
  },
  {
    districtId: 2010,
    districtName: '锡林郭勒盟'
  },
  {
    districtId: 2030,
    districtName: '乌兰察布市'
  },
  {
    districtId: 2050,
    districtName: '鄂尔多斯市'
  },
  {
    districtId: 2070,
    districtName: '巴彦淖尔市'
  },
  {
    districtId: 2080,
    districtName: '阿拉善盟'
  },
  {
    districtId: 2210,
    districtName: '沈阳市'
  },
  {
    districtId: 2220,
    districtName: '大连市'
  },
  {
    districtId: 2230,
    districtName: '鞍山市'
  },
  {
    districtId: 2240,
    districtName: '抚顺市'
  },
  {
    districtId: 2250,
    districtName: '本溪市'
  },
  {
    districtId: 2260,
    districtName: '丹东市'
  },
  {
    districtId: 2270,
    districtName: '锦州市'
  },
  {
    districtId: 2280,
    districtName: '营口市'
  },
  {
    districtId: 2290,
    districtName: '阜新市'
  },
  {
    districtId: 2310,
    districtName: '辽阳市'
  },
  {
    districtId: 2320,
    districtName: '盘锦市'
  },
  {
    districtId: 2330,
    districtName: '铁岭市'
  },
  {
    districtId: 2340,
    districtName: '朝阳市'
  },
  {
    districtId: 2360,
    districtName: '葫芦岛市'
  },
  {
    districtId: 2410,
    districtName: '长春市'
  },
  {
    districtId: 2420,
    districtName: '吉林市'
  },
  {
    districtId: 2430,
    districtName: '四平市'
  },
  {
    districtId: 2440,
    districtName: '辽源市'
  },
  {
    districtId: 2450,
    districtName: '通化市'
  },
  {
    districtId: 2460,
    districtName: '白山市'
  },
  {
    districtId: 2470,
    districtName: '白城市'
  },
  {
    districtId: 2490,
    districtName: '延边朝鲜族自治州'
  },
  {
    districtId: 2510,
    districtName: '松原市'
  },
  {
    districtId: 2610,
    districtName: '哈尔滨市'
  },
  {
    districtId: 2640,
    districtName: '齐齐哈尔市'
  },
  {
    districtId: 2660,
    districtName: '鸡西市'
  },
  {
    districtId: 2670,
    districtName: '鹤岗市'
  },
  {
    districtId: 2680,
    districtName: '双鸭山市'
  },
  {
    districtId: 2690,
    districtName: '大庆市'
  },
  {
    districtId: 2710,
    districtName: '伊春市'
  },
  {
    districtId: 2720,
    districtName: '佳木斯市'
  },
  {
    districtId: 2740,
    districtName: '七台河市'
  },
  {
    districtId: 2750,
    districtName: '牡丹江市'
  },
  {
    districtId: 2760,
    districtName: '绥化市'
  },
  {
    districtId: 2780,
    districtName: '黑河市'
  },
  {
    districtId: 2790,
    districtName: '大兴安岭地区'
  },
  {
    districtId: 2900,
    districtName: '上海市'
  },
  {
    districtId: 3010,
    districtName: '南京市'
  },
  {
    districtId: 3020,
    districtName: '无锡市'
  },
  {
    districtId: 3030,
    districtName: '徐州市'
  },
  {
    districtId: 3040,
    districtName: '常州市'
  },
  {
    districtId: 3050,
    districtName: '苏州市'
  },
  {
    districtId: 3060,
    districtName: '南通市'
  },
  {
    districtId: 3070,
    districtName: '连云港市'
  },
  {
    districtId: 3080,
    districtName: '淮安市'
  },
  {
    districtId: 3110,
    districtName: '盐城市'
  },
  {
    districtId: 3120,
    districtName: '扬州市'
  },
  {
    districtId: 3140,
    districtName: '镇江市'
  },
  {
    districtId: 3160,
    districtName: '泰州市'
  },
  {
    districtId: 3180,
    districtName: '宿迁市'
  },
  {
    districtId: 3310,
    districtName: '杭州市'
  },
  {
    districtId: 3320,
    districtName: '宁波市'
  },
  {
    districtId: 3330,
    districtName: '温州市'
  },
  {
    districtId: 3350,
    districtName: '嘉兴市'
  },
  {
    districtId: 3360,
    districtName: '湖州市'
  },
  {
    districtId: 3370,
    districtName: '绍兴市'
  },
  {
    districtId: 3380,
    districtName: '金华市'
  },
  {
    districtId: 3410,
    districtName: '衢州市'
  },
  {
    districtId: 3420,
    districtName: '舟山市'
  },
  {
    districtId: 3430,
    districtName: '丽水市'
  },
  {
    districtId: 3450,
    districtName: '台州市'
  },
  {
    districtId: 3610,
    districtName: '合肥市'
  },
  {
    districtId: 3620,
    districtName: '芜湖市'
  },
  {
    districtId: 3630,
    districtName: '蚌埠市'
  },
  {
    districtId: 3640,
    districtName: '淮南市'
  },
  {
    districtId: 3650,
    districtName: '马鞍山市'
  },
  {
    districtId: 3660,
    districtName: '淮北市'
  },
  {
    districtId: 3670,
    districtName: '铜陵市'
  },
  {
    districtId: 3680,
    districtName: '安庆市'
  },
  {
    districtId: 3710,
    districtName: '黄山市'
  },
  {
    districtId: 3720,
    districtName: '阜阳市'
  },
  {
    districtId: 3740,
    districtName: '宿州市'
  },
  {
    districtId: 3750,
    districtName: '滁州市'
  },
  {
    districtId: 3760,
    districtName: '六安市'
  },
  {
    districtId: 3770,
    districtName: '宣城市'
  },
  {
    districtId: 3780,
    districtName: '巢湖市'
  },
  {
    districtId: 3790,
    districtName: '池州市'
  },
  {
    districtId: 3810,
    districtName: '亳州市'
  },
  {
    districtId: 3910,
    districtName: '福州市'
  },
  {
    districtId: 3930,
    districtName: '厦门市'
  },
  {
    districtId: 3940,
    districtName: '莆田市'
  },
  {
    districtId: 3950,
    districtName: '三明市'
  },
  {
    districtId: 3970,
    districtName: '泉州市'
  },
  {
    districtId: 3990,
    districtName: '漳州市'
  },
  {
    districtId: 4010,
    districtName: '南平市'
  },
  {
    districtId: 4030,
    districtName: '宁德市'
  },
  {
    districtId: 4050,
    districtName: '龙岩市'
  },
  {
    districtId: 4210,
    districtName: '南昌市'
  },
  {
    districtId: 4220,
    districtName: '景德镇市'
  },
  {
    districtId: 4230,
    districtName: '萍乡市'
  },
  {
    districtId: 4240,
    districtName: '九江市'
  },
  {
    districtId: 4260,
    districtName: '新余市'
  },
  {
    districtId: 4270,
    districtName: '鹰潭市'
  },
  {
    districtId: 4280,
    districtName: '赣州市'
  },
  {
    districtId: 4310,
    districtName: '宜春市'
  },
  {
    districtId: 4330,
    districtName: '上饶市'
  },
  {
    districtId: 4350,
    districtName: '吉安市'
  },
  {
    districtId: 4370,
    districtName: '抚州市'
  },
  {
    districtId: 4510,
    districtName: '济南市'
  },
  {
    districtId: 4520,
    districtName: '青岛市'
  },
  {
    districtId: 4530,
    districtName: '淄博市'
  },
  {
    districtId: 4540,
    districtName: '枣庄市'
  },
  {
    districtId: 4550,
    districtName: '东营市'
  },
  {
    districtId: 4560,
    districtName: '烟台市'
  },
  {
    districtId: 4580,
    districtName: '潍坊市'
  },
  {
    districtId: 4610,
    districtName: '济宁市'
  },
  {
    districtId: 4630,
    districtName: '泰安市'
  },
  {
    districtId: 4650,
    districtName: '威海市'
  },
  {
    districtId: 4660,
    districtName: '滨州市'
  },
  {
    districtId: 4680,
    districtName: '德州市'
  },
  {
    districtId: 4710,
    districtName: '聊城市'
  },
  {
    districtId: 4730,
    districtName: '临沂市'
  },
  {
    districtId: 4750,
    districtName: '菏泽市'
  },
  {
    districtId: 4770,
    districtName: '日照市'
  },
  {
    districtId: 4790,
    districtName: '莱芜市'
  },
  {
    districtId: 4910,
    districtName: '郑州市'
  },
  {
    districtId: 4920,
    districtName: '开封市'
  },
  {
    districtId: 4930,
    districtName: '洛阳市'
  },
  {
    districtId: 4950,
    districtName: '平顶山市'
  },
  {
    districtId: 4960,
    districtName: '安阳市'
  },
  {
    districtId: 4970,
    districtName: '鹤壁市'
  },
  {
    districtId: 4980,
    districtName: '新乡市'
  },
  {
    districtId: 5010,
    districtName: '焦作市'
  },
  {
    districtId: 5020,
    districtName: '濮阳市'
  },
  {
    districtId: 5030,
    districtName: '许昌市'
  },
  {
    districtId: 5040,
    districtName: '漯河市'
  },
  {
    districtId: 5050,
    districtName: '三门峡市'
  },
  {
    districtId: 5060,
    districtName: '商丘市'
  },
  {
    districtId: 5080,
    districtName: '周口市'
  },
  {
    districtId: 5110,
    districtName: '驻马店市'
  },
  {
    districtId: 5130,
    districtName: '南阳市'
  },
  {
    districtId: 5150,
    districtName: '信阳市'
  },
  {
    districtId: 5210,
    districtName: '武汉市'
  },
  {
    districtId: 5220,
    districtName: '黄石市'
  },
  {
    districtId: 5230,
    districtName: '十堰市'
  },
  {
    districtId: 5250,
    districtName: '宜昌市'
  },
  {
    districtId: 5270,
    districtName: '随州市'
  },
  {
    districtId: 5280,
    districtName: '襄樊市'
  },
  {
    districtId: 5310,
    districtName: '鄂州市'
  },
  {
    districtId: 5320,
    districtName: '荆门市'
  },
  {
    districtId: 5330,
    districtName: '黄冈市'
  },
  {
    districtId: 5350,
    districtName: '孝感市'
  },
  {
    districtId: 5360,
    districtName: '咸宁市'
  },
  {
    districtId: 5370,
    districtName: '荆州市'
  },
  {
    districtId: 5410,
    districtName: '恩施土家族苗族自治州'
  },
  {
    districtId: 5510,
    districtName: '长沙市'
  },
  {
    districtId: 5520,
    districtName: '株洲市'
  },
  {
    districtId: 5530,
    districtName: '湘潭市'
  },
  {
    districtId: 5540,
    districtName: '衡阳市'
  },
  {
    districtId: 5550,
    districtName: '邵阳市'
  },
  {
    districtId: 5570,
    districtName: '岳阳市'
  },
  {
    districtId: 5580,
    districtName: '常德市'
  },
  {
    districtId: 5590,
    districtName: '张家界市'
  },
  {
    districtId: 5610,
    districtName: '益阳市'
  },
  {
    districtId: 5620,
    districtName: '娄底市'
  },
  {
    districtId: 5630,
    districtName: '郴州市'
  },
  {
    districtId: 5650,
    districtName: '永州市'
  },
  {
    districtId: 5670,
    districtName: '怀化市'
  },
  {
    districtId: 5690,
    districtName: '湘西土家族苗族自治州'
  },
  {
    districtId: 5810,
    districtName: '广州市'
  },
  {
    districtId: 5820,
    districtName: '韶关市'
  },
  {
    districtId: 5840,
    districtName: '深圳市'
  },
  {
    districtId: 5850,
    districtName: '珠海市'
  },
  {
    districtId: 5860,
    districtName: '汕头市'
  },
  {
    districtId: 5880,
    districtName: '佛山市'
  },
  {
    districtId: 5890,
    districtName: '江门市'
  },
  {
    districtId: 5910,
    districtName: '湛江市'
  },
  {
    districtId: 5920,
    districtName: '茂名市'
  },
  {
    districtId: 5930,
    districtName: '肇庆市'
  },
  {
    districtId: 5950,
    districtName: '惠州市'
  },
  {
    districtId: 5960,
    districtName: '梅州市'
  },
  {
    districtId: 5970,
    districtName: '汕尾市'
  },
  {
    districtId: 5980,
    districtName: '河源市'
  },
  {
    districtId: 5990,
    districtName: '阳江市'
  },
  {
    districtId: 6010,
    districtName: '清远市'
  },
  {
    districtId: 6020,
    districtName: '东莞市'
  },
  {
    districtId: 6030,
    districtName: '中山市'
  },
  {
    districtId: 6040,
    districtName: '潮州市'
  },
  {
    districtId: 6050,
    districtName: '揭阳市'
  },
  {
    districtId: 6060,
    districtName: '云浮市'
  },
  {
    districtId: 6110,
    districtName: '南宁市'
  },
  {
    districtId: 6140,
    districtName: '柳州市'
  },
  {
    districtId: 6170,
    districtName: '桂林市'
  },
  {
    districtId: 6210,
    districtName: '梧州市'
  },
  {
    districtId: 6230,
    districtName: '北海市'
  },
  {
    districtId: 6240,
    districtName: '玉林市'
  },
  {
    districtId: 6260,
    districtName: '百色市'
  },
  {
    districtId: 6280,
    districtName: '河池市'
  },
  {
    districtId: 6310,
    districtName: '钦州市'
  },
  {
    districtId: 6320,
    districtName: '防城港市'
  },
  {
    districtId: 6330,
    districtName: '贵港市'
  },
  {
    districtId: 6340,
    districtName: '贺州市'
  },
  {
    districtId: 6350,
    districtName: '来宾市'
  },
  {
    districtId: 6360,
    districtName: '崇左市'
  },
  {
    districtId: 6410,
    districtName: '海口市'
  },
  {
    districtId: 6420,
    districtName: '三亚市'
  },
  {
    districtId: 6510,
    districtName: '成都市'
  },
  {
    districtId: 6550,
    districtName: '自贡市'
  },
  {
    districtId: 6560,
    districtName: '攀枝花市'
  },
  {
    districtId: 6570,
    districtName: '泸州市'
  },
  {
    districtId: 6580,
    districtName: '德阳市'
  },
  {
    districtId: 6590,
    districtName: '绵阳市'
  },
  {
    districtId: 6610,
    districtName: '广元市'
  },
  {
    districtId: 6620,
    districtName: '遂宁市'
  },
  {
    districtId: 6630,
    districtName: '内江市'
  },
  {
    districtId: 6650,
    districtName: '乐山市'
  },
  {
    districtId: 6670,
    districtName: '眉山市'
  },
  {
    districtId: 6690,
    districtName: '广安市'
  },
  {
    districtId: 6710,
    districtName: '宜宾市'
  },
  {
    districtId: 6730,
    districtName: '南充市'
  },
  {
    districtId: 6750,
    districtName: '达州市'
  },
  {
    districtId: 6770,
    districtName: '雅安市'
  },
  {
    districtId: 6790,
    districtName: '阿坝藏族羌族自治州'
  },
  {
    districtId: 6810,
    districtName: '甘孜藏族自治州'
  },
  {
    districtId: 6840,
    districtName: '凉山彝族自治州'
  },
  {
    districtId: 6870,
    districtName: '巴中市'
  },
  {
    districtId: 6880,
    districtName: '资阳市'
  },
  {
    districtId: 6900,
    districtName: '重庆市'
  },
  {
    districtId: 7004,
    districtName: '贵安新区'
  },
  {
    districtId: 7010,
    districtName: '贵阳市'
  },
  {
    districtId: 7020,
    districtName: '六盘水市'
  },
  {
    districtId: 7030,
    districtName: '遵义市'
  },
  {
    districtId: 7050,
    districtName: '铜仁地区'
  },
  {
    districtId: 7070,
    districtName: '黔西南布依族苗族自治州'
  },
  {
    districtId: 7090,
    districtName: '毕节地区'
  },
  {
    districtId: 7110,
    districtName: '安顺市'
  },
  {
    districtId: 7130,
    districtName: '黔东南苗族侗族自治州'
  },
  {
    districtId: 7150,
    districtName: '黔南布依族苗族自治州'
  },
  {
    districtId: 7310,
    districtName: '昆明市'
  },
  {
    districtId: 7340,
    districtName: '昭通市'
  },
  {
    districtId: 7360,
    districtName: '曲靖市'
  },
  {
    districtId: 7380,
    districtName: '楚雄彝族自治州'
  },
  {
    districtId: 7410,
    districtName: '玉溪市'
  },
  {
    districtId: 7430,
    districtName: '红河哈尼族彝族自治州'
  },
  {
    districtId: 7450,
    districtName: '文山壮族苗族自治州'
  },
  {
    districtId: 7470,
    districtName: '普洱市'
  },
  {
    districtId: 7490,
    districtName: '西双版纳傣族自治州'
  },
  {
    districtId: 7510,
    districtName: '大理白族自治州'
  },
  {
    districtId: 7530,
    districtName: '保山市'
  },
  {
    districtId: 7540,
    districtName: '德宏傣族景颇族自治州'
  },
  {
    districtId: 7550,
    districtName: '丽江市'
  },
  {
    districtId: 7560,
    districtName: '怒江傈僳族自治州'
  },
  {
    districtId: 7570,
    districtName: '迪庆藏族自治州'
  },
  {
    districtId: 7580,
    districtName: '临沧市'
  },
  {
    districtId: 7710,
    districtName: '拉萨市'
  },
  {
    districtId: 7720,
    districtName: '昌都地区'
  },
  {
    districtId: 7740,
    districtName: '山南地区'
  },
  {
    districtId: 7760,
    districtName: '日喀则地区'
  },
  {
    districtId: 7790,
    districtName: '那曲地区'
  },
  {
    districtId: 7810,
    districtName: '阿里地区'
  },
  {
    districtId: 7830,
    districtName: '林芝地区'
  },
  {
    districtId: 7904,
    districtName: '西咸新区'
  },
  {
    districtId: 7910,
    districtName: '西安市'
  },
  {
    districtId: 7920,
    districtName: '铜川市'
  },
  {
    districtId: 7930,
    districtName: '宝鸡市'
  },
  {
    districtId: 7950,
    districtName: '咸阳市'
  },
  {
    districtId: 7970,
    districtName: '渭南市'
  },
  {
    districtId: 7990,
    districtName: '汉中市'
  },
  {
    districtId: 8010,
    districtName: '安康市'
  },
  {
    districtId: 8030,
    districtName: '商洛市'
  },
  {
    districtId: 8040,
    districtName: '延安市'
  },
  {
    districtId: 8060,
    districtName: '榆林市'
  },
  {
    districtId: 8210,
    districtName: '兰州市'
  },
  {
    districtId: 8220,
    districtName: '嘉峪关市'
  },
  {
    districtId: 8230,
    districtName: '金昌市'
  },
  {
    districtId: 8240,
    districtName: '白银市'
  },
  {
    districtId: 8250,
    districtName: '天水市'
  },
  {
    districtId: 8260,
    districtName: '酒泉市'
  },
  {
    districtId: 8270,
    districtName: '张掖市'
  },
  {
    districtId: 8280,
    districtName: '武威市'
  },
  {
    districtId: 8290,
    districtName: '定西市'
  },
  {
    districtId: 8310,
    districtName: '陇南市'
  },
  {
    districtId: 8330,
    districtName: '平凉市'
  },
  {
    districtId: 8340,
    districtName: '庆阳市'
  },
  {
    districtId: 8360,
    districtName: '临夏回族自治州'
  },
  {
    districtId: 8380,
    districtName: '甘南藏族自治州'
  },
  {
    districtId: 8510,
    districtName: '西宁市'
  },
  {
    districtId: 8520,
    districtName: '海东地区'
  },
  {
    districtId: 8540,
    districtName: '海北藏族自治州'
  },
  {
    districtId: 8550,
    districtName: '黄南藏族自治州'
  },
  {
    districtId: 8560,
    districtName: '海南藏族自治州'
  },
  {
    districtId: 8570,
    districtName: '果洛藏族自治州'
  },
  {
    districtId: 8580,
    districtName: '玉树藏族自治州'
  },
  {
    districtId: 8590,
    districtName: '海西蒙古族藏族自治州'
  },
  {
    districtId: 8710,
    districtName: '银川市'
  },
  {
    districtId: 8720,
    districtName: '石嘴山市'
  },
  {
    districtId: 8730,
    districtName: '吴忠市'
  },
  {
    districtId: 8740,
    districtName: '固原市'
  },
  {
    districtId: 8750,
    districtName: '中卫市'
  },
  {
    districtId: 8810,
    districtName: '乌鲁木齐市'
  },
  {
    districtId: 8820,
    districtName: '克拉玛依市'
  },
  {
    districtId: 8830,
    districtName: '吐鲁番地区'
  },
  {
    districtId: 8840,
    districtName: '哈密地区'
  },
  {
    districtId: 8850,
    districtName: '昌吉回族自治州'
  },
  {
    districtId: 8870,
    districtName: '博尔塔拉蒙古族自治州'
  },
  {
    districtId: 8880,
    districtName: '巴音郭楞蒙古族自治州'
  },
  {
    districtId: 8890,
    districtName: '铁门关市（自治区直辖）'
  },
  {
    districtId: 8910,
    districtName: '阿克苏地区'
  },
  {
    districtId: 8930,
    districtName: '克孜勒苏柯尔克孜自治州'
  },
  {
    districtId: 8940,
    districtName: '喀什地区'
  },
  {
    districtId: 8960,
    districtName: '和田地区'
  },
  {
    districtId: 8980,
    districtName: '伊犁哈萨克自治州'
  },
  {
    districtId: 9010,
    districtName: '塔城地区'
  },
  {
    districtId: 9020,
    districtName: '阿勒泰地区'
  },
  {
    districtId: 9044,
    districtName: '北屯市（自治区直辖）'
  },
  {
    districtId: 9045,
    districtName: '双河市（自治区直辖）'
  },
  {
    districtId: 9046,
    districtName: '可克达拉市(自治区直辖)'
  },
  {
    districtId: 9047,
    districtName: '昆玉市(自治区直辖)'
  }
]
export default {
  props: ['value', 'meta', 'width'],
  data() {
    return {
      citys: data.map(item => ({ label: item.districtName, value: item.districtId })),
      selectData: [],
      mValue: this.meta.multi ? [] : null
    }
  },
  watch: {
    mValue(nValue) {
      this.$emit('input', nValue)
    },
    value(n, o) {
      this.mValue = n
    }
  },
  created() {
    if (this.value) {
      this.mValue = this.value
    }
  },
  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // handleChange(value) {
    //   //   debugger
    //   // this.$emit('validate', this.value)
    //   if (value.length > 2) {
    //     this.$emit('input', value[2])
    //   } else {
    //     this.$emit('input', null)
    //   }
    // },
    validate() {
      return true
    }
  }
}
</script>

<style>
</style>
