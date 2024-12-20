const equip = {

    潜行者: {
        type: '防具-皮甲',
        力量: 30 + 24 + 30 + 18 + 18,
        智力: 30 + 24 + 30 + 18 + 18,
        黄字: 8 + 5 + 5,
        技能攻击力: 13,
        暴击: 100 + 50 + 50 + 50,
        暴击伤害: 40 + 5 + 18 + 5 + 10 + 10,
    },
    火焰赫瑞克: {
        type: '防具-皮甲',
        力量: 30 + 24 + 30 + 18 + 18,
        智力: 30 + 24 + 30 + 18 + 18,
        黄字: 8 + 7,
        技能攻击力: 11,
        暴击: 275,
        攻击力百分比: 10,
        力智加成: 7,
        白字: 38,
    }

}

const person = {
    剑宗: {
        攻击力百分比: 18.2,
        暴击率: 6.5,
        暴击伤害: 23,
        技能攻击力: 21,
        精通: '轻甲',
    },
    狂战: {
        攻击力百分比: 31,
        暴击率: 12,
        力量: 215,
        技能攻击力: 10,
        精通: '重甲',
    },
    武神: {
        暴击率: 15,
        力量: 144,
        暴击伤害: 5,
        技能攻击力: 25,
        精通: '轻甲',
    },
    剑豪: {
        攻击力百分比: 18.2,
        技能攻击力: 21,
        精通: '皮甲',
    },
    漫游: {
        暴击伤害: 27,
        技能攻击力: 32,
        暴击率: 5.5 + 5,
        精通: '皮甲',
    }
}
const base = {
    物理攻击力: 819,
    魔法攻击力: 819,
    独立攻击力: 600,
    攻击加成: 8,
    力量: 3079,
    智力: 3079,
    力智加成: 0,
    黄字: 31,
    白字: 21,
    属强: 178,//178
    属白: 0,
    暴击: 922,//922
    暴击率: 14,
    暴伤: 50,
    技攻: 0,
    其它: 0,
}
const baseTags = [
    {
        name: '剑宗',
        type: '职业-物理',
        精通: '轻甲',
        精通加成: [{ name: '力量', value: 123 },],
        被动: [
            { name: '攻击加成', value: 18.2 },
            { name: '暴击率', value: 6.5 },
            { name: '暴伤', value: 23 },
            { name: '技攻', value: 21 },
        ]
    },
    {
        name: '狂战',
        type: '职业-物理',
        精通: '重甲',
        精通加成: [{ name: '力量', value: 123 },],
        被动: [
            { name: '攻击加成', value: 31 },
            { name: '暴击率', value: 12 },
            { name: '力量', value: 215 },
            { name: '技攻', value: 10 },
        ]
    },
    {
        name: '武神',
        type: '职业-物理',
        精通: '轻甲',
        精通加成: [{ name: '力量', value: 123 },],
        被动: [
            { name: '暴伤', value: 5 },
            { name: '暴击率', value: 15},
            { name: '力量', value: 144 },
            { name: '技攻', value: 25 },
        ]
    },
    {
        name: '剑豪',
        type: '职业-物理',
        精通: '皮甲',
        精通加成: [{ name: '力量', value: 123 },],
        被动: [
            { name: '攻击加成', value: 18.2 },
            { name: '技攻', value: 21 },
        ]
    },
    {
        name: '冥玉惊魂刀',
        type: '武器',
        被动: [
            { name: '物理攻击力', value: 787 },
            { name: '魔法攻击力', value: 787 },
            { name: '力量', value: 50 },
            { name: '暴击率', value: 5 },
            { name: '暴伤', value: 60 },
            { name: '力智加成', value: 22.5  },
        ]
    },
    {
        name: '绝灭之刃',
        type: '武器',
        被动: [
            { name: '物理攻击力', value: 787 },
            { name: '魔法攻击力', value: 787 },
            { name: '力量', value: 50 },
            { name: '暴击率', value: 5 },
            { name: '白字', value: 50 },
            { name: '力智加成', value: 7 },
        ]
    },
    {
        name: '千年-剑豪',
        type: '武器',
        被动: [
            { name: '物理攻击力', value: 791 },
            { name: '力量', value: 50 },
            { name: '暴击率', value: 5 },
            { name: '属强', value: 50 },
            { name: '属白', value: 17 },
            { name: '攻击加成', value: 2.8 },
        ]
    },
    {
        name: '无轩',
        type: '武器',
        被动: [
            { name: '物理攻击力', value: 791 },
            { name: '力量', value: 50 },
            { name: '暴击', value: 143 },
            { name: '暴击率', value: 5 },
            { name: '白字', value: 33 },
            { name: '攻击加成', value: 20 },
        ]
    },
    {
        name: '极皇',
        type: '武器',
        被动: [
            { name: '物理攻击力', value: 791 },
            { name: '力量', value: 75 },
            { name: '暴击率', value: 5 },
            { name: '白字', value: 30 },
            { name: '黄字', value: 4 },
        ]
    },
    {
        name: '巨象',
        type: '武器',
        被动: [
            { name: '物理攻击力', value: 791 },
            { name: '力量', value: 50 },
            { name: '暴击', value: 133 },
            { name: '暴击率', value: 5 },
            { name: '黄字', value: 12 },
            { name: '力智加成', value: 45 },
        ]
    },
    {
        name: '英雄的荣耀',
        type: '武器',
        被动: [
            { name: '物理攻击力', value: 857 },
            { name: '力量', value: 273 },
            { name: '暴击率', value: 2 },
            { name: '白字', value: 50 },
        ]
    },
    {
        name: '无轩',
        type: '武器',
        被动: [
            { name: '物理攻击力', value: 791 },
            { name: '力量', value: 50 },
            { name: '暴击', value: 143 },
            { name: '暴击率', value: 5 },
            { name: '白字', value: 33 },
            { name: '攻击加成', value: 20 },
        ]
    },
    {
        name: '克罗姆',
        type: '防具-轻甲',
        被动: [
            { name: '力量', value: 36 + 29 + 36 + 22 + 22 + 250 },
            { name: '智力', value: 24 + 19 + 24 + 14 + 14 + 250 },
            { name: '黄字', value: 8 + 12 + 5 + 7 + 7 + 25 },
            { name: '技攻', value: 21 },
            { name: '暴击', value: 220 },
        ]
    },
    {
        name: '千钧之羽',
        type: '防具-轻甲',
        被动: [
            { name: '力量', value: 36 + 29 + 36 + 22 + 22 },
            { name: '智力', value: 24 + 19 + 24 + 14 + 14 },
            { name: '黄字', value: 10 + 14 + 10 + 8 + 33 },
            { name: '技攻', value: 11 },
            { name: '力智加成', value: 8 },
            { name: '属强', value: 15 },
        ]
    },
    {
        name: '达丽雅',
        type: '防具-轻甲',
        被动: [
            { name: '力量', value: 36 + 29 + 36 + 22 + 22 },
            { name: '智力', value: 24 + 19 + 24 + 14 + 14 },
            { name: '攻击加成', value: 10 + 10 },
            { name: '技攻', value: 16.6 },
            { name: '力智加成', value: 24 },
            { name: '白字', value: 28 },
        ]
    },
    {
        name: '深海',
        type: '防具-重甲',
        被动: [
            { name: '力量', value: 33 + 26 + 33 + 17 + 129 },
            { name: '智力', value: 24 + 19 + 24 + 14 + 14 },
            { name: '黄字', value: 10 },
            { name: '白字', value: 9 + 7 + 6 + 4 + 4 + 45 },
            { name: '技攻', value: 10 },
            { name: '暴击', value: 100 },
            { name: '其它', value: 5 },
        ]
    },
    {
        name: '潜行者',
        type: '防具-皮甲',
        被动: [
            { name: '力量', value: 30 + 24 + 30 + 18 + 18 },
            { name: '智力', value: 30 + 24 + 30 + 18 + 18 },
            { name: '黄字', value: 8 + 5 + 5 },
            { name: '暴伤', value: 40 + 5 + 18 + 5 + 10 + 10},
            { name: '技攻', value: 13 },
            { name: '暴击', value: 100 + 50 + 50 + 50 },
        ]
    },
    {
        name: '火焰赫瑞克',
        type: '防具-皮甲',
        被动: [
            { name: '力量', value: 30 + 24 + 30 + 18 + 18 },
            { name: '智力', value: 30 + 24 + 30 + 18 + 18 },
            { name: '黄字', value: 8 + 7 },
            { name: '技攻', value: 11 },
            { name: '暴击', value: 275 },
            { name: '攻击加成', value: 10 },
            { name: '力智加成', value: 7 },
            { name: '白字', value: 38 },
        ]
    },
    {
        name: '团魂骨',
        type: '首饰',
        被动: [
            { name: '力量', value: 29 + 31 },
            { name: '智力', value: 30 + 31 },
            { name: '力智加成', value: 10 },
            { name: '攻击加成', value: 30 },
            { name: '黄字', value: 50 },
            { name: '暴击', value: -46 },
            { name: '属强', value: -8 },
        ]
    },

    {
        name: '黎明',
        type: '首饰',
        被动: [
            { name: '力量', value: 30 + 45 },
            { name: '智力', value: 30 + 45 },
            { name: '属强', value: 60 },
            { name: '属白', value: 10 },
            { name: '技攻', value: 22 },
            { name: '其它', value: -2 },

        ]
    },
    {
        name: '波动',
        type: '首饰',
        被动: [
            { name: '力量', value: 30 + 45 },
            { name: '智力', value: 30 + 45 },
            { name: '属强', value: 7 },
            { name: '暴伤', value: 13 },
            { name: '暴击', value: 120 },
            { name: '技攻', value: 25 },
            { name: '攻击加成', value: 18 },

        ]
    },
    {
        name: '审判者',
        type: '首饰',
        被动: [
            { name: '力量', value: 30 + 45 },
            { name: '智力', value: 30 + 45 },
            { name: '属强', value: 40 },
            { name: '力智加成', value: 10 },
            { name: '攻击加成', value: 3 },
            { name: '技攻', value: 17 },
            { name: '白字', value: 11 },

        ]
    },
    {
        name: '布万加',
        type: '护符',
        被动: [
            { name: '力量', value: 396 },
            { name: '智力', value: 396 },

        ]
    },
    {
        name: '斗者之护符',
        type: '护符',
        被动: [
            { name: '力量', value: 29 },
            { name: '智力', value: 29 },
            { name: '黄字', value: 5 },
            { name: '力智加成', value: 5 },
            { name: '白字', value: 5 },

        ]
    },
]
export { base, baseTags }