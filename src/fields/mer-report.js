
exports.merTableColumns = [

  { label: '内部商户号', prop: 'merInnerNo' },
  { label: '子商户号', prop: 'subMchId' },
  { label: '交易子商户号', prop: 'subMchIdBank' },
  { label: '渠道号', prop: 'channelId' },
  { label: '从业机构号', prop: 'receOrgNo' },
  { label: '报备渠道', prop: 'registerChannelText' },
  { label: '报备类型', prop: 'registerTypeText' },
  { label: '报备时间', prop: 'rowCreateTm' },
  { label: '返回码', prop: 'resultCode' },
  { label: '返回结果', prop: 'resultMessage' }
];
exports.merFilterFields = [
  { label: '内部商户号', prop: 'merInnerNo' },
  { label: '报备时间', format: 'YYYYMMDD', startProp: 'startDate', endProp: 'endDate', type: 'range-date' },
  { label: '子商户号', prop: 'subMchId' },
  {
    label: '报备渠道',
    prop: 'registerChannel',
    choice: require('./fieldOptions').registerChannels
  },
  {
    label: '报备类型',
    prop: 'registerType',
    choice: [
      { label: '支付宝', value: 'ZFBZF' },
      { label: '微信', value: 'WXZF' },
      { label: '苏宁钱包', value: 'SNZF' },
      { label: '翼支付', value: 'YZF' }]
  },
  { label: '是否成功', prop: 'resultCode', choice: [{ label: '成功', value: 'SUCCESS' }, { label: '失败', value: 'FAIL' }] }
];
exports.merEditFields = [
  { label: '商户号', prop: 'shopNo' },
  { label: '账户端子商户号', prop: 'subMchId' },
  { label: '交易子商户号', prop: 'subMchIdBank' },
  { label: '报备类型', prop: 'regiserType' },
  { label: '报备渠道', prop: 'regiserChannel' },
  { label: '渠道号', prop: 'channelId' },
  { label: '从业机构号', prop: 'receOrgNo' },
  { label: '结果返回码', prop: 'resultCode' },
  { label: '返回结果描述', prop: 'resultMessage' },
  { label: '状态', prop: 'rowStatus' }
];

/**
 * 微信公众号
 */
exports.wxTableColumns = [
  { label: '内部商户号', prop: 'merInnerNo' },
  { label: '子商户号', prop: 'subMerId' },
  { label: '受理机构号', prop: 'receOrgNo' },
  {
    label: '配置详情',
    prop: 'jsapiPath',
    render (h, text, row) {
      return (
        <span>
          <div>JSAPI授权目录：{text || '无'}</div>
          <div>SubAPPID：{row.subAppid || '无'}</div>
          <div>APPID：{row.subscribeAppid || '无'}</div>
        </span>
      );
    }
  },
  // { label: 'JSAPI授权目录', prop: 'jsapiPath' },
  // { label: 'SubAPPID', prop: 'subAppid' },
  // { label: 'APPID', prop: 'subscribeAppid' },
  {
    label: '验证结果',
    prop: 'resultCode',
    render (h, text, row) {
      return (
        <span>
          <div>返回码：{text}</div>
          <div>描述：{row.resultMessage}</div>
        </span>
      );
    }
  },
  // { label: '返回码描述', prop: 'resultMessage', width: 200 },
  { label: '配置时间', prop: 'rowCreateTm', width: 220 }
];

exports.wxFilters = [
  { label: '内部商户号', prop: 'merInnerNo' },
  { label: '子商户号', prop: 'subMerId' },
  {
    label: '受理机构号',
    prop: 'receOrgNo',
    // component: require('@/components/a-selects/org').default,
    formatter (val) {
      return { label: val.orgName, value: val.orgId };
    }
  }
];
exports.wxEditFields = [
  { label: '编号', prop: 'detailId' },
  { label: '商户号', prop: 'shopNo' },
  { label: '受理机构编号渠道号', prop: 'receOrgNo' },
  { label: '报备的子商户号', prop: 'subMerId' },
  { label: '商户公众账号JSAPI支付授权目录', prop: 'jsapiPath' },
  { label: '商户 SubAPPID', prop: 'subAppid' },
  { label: '商户推荐关注公众账号APPID', prop: 'subscribeAppid' },
  { label: '内部商户号', prop: 'merInnerNo' }
];
