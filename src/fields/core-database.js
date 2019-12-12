exports.merTableColumns = [
  {
    'label': '注册/经营名称',
    'prop': 'merRegName',
    'type': 'string',
    'render': function (h, text, record) {
      return h('div');
    }
  },
  {
    'label': '商户号',
    'prop': 'render',
    'type': 'string',
    'render': function (h, text, record) {
      return ([
        <div title="内部商户号" style="cursor:pointer" > {record.merInnerNo || '--'}</div>,
        <div title="银联商户号" style="cursor:pointer" > {record.merCupNo || '--'} </div>
      ]);
    }
  },
  {
    'label': '营业执照',
    'prop': 'merBlisName',
    'type': 'string',
    'render': function (h, text, record) {
      return [
        <div title="营业执照名称" style="cursor:pointer" > {record.merBlisName || '--'}</div>,
        <div title="营业执照号码" style="cursor:pointer" > {record.merBlis || '--'} </div>
      ];
    }
  },
  {
    'label': '创建/修改人员',
    'prop': 'modifyUserName',
    'type': 'string'
  },
  {
    'label': '创建/修改时间',
    'prop': 'rowCreateTm',
    'type': 'select',
    'choice': [
      {
        'label': '测试',
        'value': 1
      },
      {
        'label': '策士',
        'value': 2
      }
    ]
  }
];
exports.merchantFields = [
  {
    'label': '营业执照名称',
    'prop': 'merBlisName',
    'type': 'select',
    'choice': [
      {
        'label': '122',
        'value': '222'
      },
      {
        'label': '33',
        'value': '44'
      },
      {
        'label': '222',
        'value': '333'
      }
    ]
  },
  {
    'label': '商户经营名称',
    'prop': 'merOptName',
    'type': 'string',
    rules: 'rangeCharLength[4,26]',
    'choice': [

    ]
  },
  {
    'label': '商户注册名称',
    'prop': 'merRegName',
    'type': 'string',
    'choice': [

    ]
  },
  {
    'label': '营业执照号码',
    'prop': 'merBlis',
    'type': 'string',
    'choice': [

    ]
  },
  {
    'label': '确认营业执照',
    'prop': 'merBlisConfirm',
    'type': 'string',
    'choice': [

    ]
  },
  {
    'label': '营业执照有效期',
    'prop': 'merBlisExpDt',
    'type': 'date',
    'choice': [

    ]
  },
  {
    'label': '商户经营内容',
    'prop': 'merBusiContent',
    'type': 'select',
    'choice': [
      {
        'label': '餐饮、宾馆、娱乐、珠宝金饰、工艺美术品',
        'value': '640'
      },
      {
        'label': '房地产汽车类',
        'value': '641'
      },
      {
        'label': '百货、中介、培训、景区门票等',
        'value': '642'
      },
      {
        'label': '批发类商户',
        'value': '643'
      },
      {
        'label': '加油、超市类',
        'value': '644'
      },
      {
        'label': '交通运输售票',
        'value': '645'
      },
      {
        'label': '水电气缴费',
        'value': '646'
      },
      {
        'label': '政府类',
        'value': '647'
      },
      {
        'label': '便民类',
        'value': '648'
      },
      {
        'label': '公立医院、公立学校、慈善',
        'value': '649'
      },
      {
        'label': '宾馆餐饮娱乐类',
        'value': '650'
      },
      {
        'label': '房产汽车类',
        'value': '651'
      },
      {
        'label': '批发类',
        'value': '652'
      },
      {
        'label': '超市加油类',
        'value': '653'
      },
      {
        'label': '一般类商户',
        'value': '654'
      },
      {
        'label': '三农商户',
        'value': '655'
      }
    ]
  },
  {
    'label': '商户类别',
    'prop': 'mccCode',
    'type': 'string',
    'formatter': function (val) {
      return {
        label: val.mccName,
        value: val.mccId
      };
    },
    'component': require('@/components/MccModal/index2.vue').default
  },
  {
    'label': '商户英文名称',
    'prop': 'merEname',
    'type': 'string'
  },
  {
    'label': '商户拓展机构',
    'prop': 'merDeveloperOrgId',
    'type': 'string',
    'formatter': function (val) {
      return {
        label: val.orgName,
        value: val.orgId
      };
    },
    'choice': [

    ],
    'component': require('@/components/a-selects/org').default
  },
  {
    'label': '经营地址',
    'prop': '0000',
    'type': 'string',
    'choice': [

    ]
  },
  {
    'label': '商户联系人',
    'prop': 'merContactName',
    'type': 'string'
  },
  {
    'label': '联系人手机号',
    'prop': 'merContactMobile',
    'type': 'component',
    'choice': [

    ]
  }
];
