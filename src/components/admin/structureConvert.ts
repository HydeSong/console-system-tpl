/*
 * @Author: zhangwencan 
 * @Date: 2019-09-11 11:45:57 
 * @Last Modified by: zhangwencan
 * @Last Modified time: 2019-09-19 11:19:58
 */

/**
 * 用来转换json的节点数据，应付前端产生的数据和接口返回格式不同的情况比如
 * types:[1,3,4] 后端返回为 types:[{type:1},{type:3},{type:4}]
 */
class Rule {
    //users[].name
    key: string = ''
    handle: Function = (obj: any, propName: string, parent: any, path: string) => { }
    constructor(key: string, handle: Function) {
        this.key = key
        this.handle = handle
    }
    // handle(value: any, propName: string, parent: object) { }
}

export function struct2(json: object, rules: Array<Rule>) {
    const ruleMap: { [key: string]: any } = {}
    for (const rule of rules) {
        if (ruleMap[rule.key]) {
            console.warn("********* " + rule.key + " :已存在相同的处理，请检查！！***********")
        }
        ruleMap[rule.key] = rule
    }
    convert(json, null, null, '', ruleMap)
}

function convert(obj: any, parent: any, propName: any, path: string, ruleMap: { [key: string]: Rule }) {
    // if (path === 'issuers[].payModes[].cardTypes[].transTypes') {
    //     debugger
    // }
    // console.log(path)
    if (ruleMap[path]) {
        ruleMap[path].handle(obj, propName, parent, path)
    }

    const newObj = parent ? parent[propName] : obj
    if (newObj instanceof Array) {
        newObj.forEach((item: any, index: number) => {
            convert(item, obj, index, path + '[]', ruleMap)
        })
    } else if (newObj instanceof Object) {
        for (const key in obj) {
            const item = obj[key];
            convert(item, obj, key, path + (path ? '.' : '') + key, ruleMap)
        }
    } else {

    }
}

