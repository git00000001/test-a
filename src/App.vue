<script setup>
import { ref, reactive, computed } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { equip, base, person } from './assets/config'

const zy = ref("")
const fj = ref("")
const wq = ref("")
const hf = ref("")
const ss = ref("")
const zyList = reactive([])
Object.keys(person).forEach(key => {
  zyList.push({
    name: key,
    ...equip[key]
  })
});
const equipList = reactive([])
Object.keys(equip).forEach(key => {
  equipList.push({
    name: key,
    ...equip[key]
  })
});
console.log(equipList, equip, base);
const addAll = (arr, key) => {
  let res = 0
  arr.forEach(v => {
    res += v[key] || 0
  })
  return res
}
const allData = computed(() => {
  const wqData = equip[wq.value] || {}
  const fjData = equip[fj.value] || {}
  const ssData = equip[ss.value] || {}
  const hfData = equip[hf.value] || {}
  const personData = person[zy.value] || {}
  const dataList = [wqData, fjData, ssData, hfData, personData, base]
  const isProficientIn = fjData.type && personData['精通'] && fjData.type.includes(personData['精通'])
  return {
    物理攻击力: addAll(dataList, '物理攻击力'),
    独立攻击力: 600,
    攻击力百分比: addAll(dataList, '攻击力百分比'),
    力量: addAll(dataList, '力量') + (isProficientIn ? 123 : 0),
    智力: addAll(dataList, '智力'),
    力智加成: addAll(dataList, '力智加成'),
    黄字: addAll(dataList, '黄字'),
    白字: addAll(dataList, '白字'),
    属强: addAll(dataList, '属强'),
    暴击: addAll(dataList, '暴击'),
    暴击率: addAll(dataList, '暴击率'),
    暴击伤害: addAll(dataList, '暴击伤害'),
    其它: addAll(dataList, '其它'),
    技能攻击力: ((personData['技能攻击力'] || 0)) +
      (((wqData['技能攻击力'] || 0) + 100) / 100 *
        ((fjData['技能攻击力'] || 0) + 100) / 100 *
        ((ssData['技能攻击力'] || 0) + 100) / 100 *
        ((hfData['技能攻击力'] || 0) + 100) / 100 - 1) * 100,

    甲精通: isProficientIn ? '是' : '否',
  }
})
const personInfo = computed(() => {
  return person[zy.value] || {}
})

const maxData = computed(() => {
  const data = allData.value
  const qw = (((data['暴击'] / 20.6 + data['暴击率']) * data['暴击伤害']) / 10000 + 1) * 10000
  const bj = (data['暴击'] / 20.6 + data['暴击率']) / 100
  let arr = []
  while (arr.length < 10000) {
    let demage = 10000
    let isBJ = Math.random() <= bj
    demage = isBJ ? demage * (1 + data['暴击伤害'] / 100) : demage
    demage = (0.9 + Math.random() * 0.2) * demage
    arr.push(demage)
  }
 arr.sort((a,b)=>a-b)
  return {
    十把最强: arr[9000] / qw,
    百把最强: arr[9900] / qw
  }
})

const scoreBlock = computed(() => {
  const data = allData.value
  const res = {
    攻击区: (data['物理攻击力'] * (1 + data['攻击力百分比'] / 100) + data['独立攻击力']),
    力量区: (data['力量'] * (1 + data['力智加成'] / 100) / 250 + 1),
    黄字区: (data['黄字'] / 100 + 1),
    白字区: (data['白字'] / 100 + 1),
    属强区: ((data['属强'] * 0.45) / 100 + 1.05),
    暴击区: (((data['暴击'] / 20.6 + data['暴击率']) * data['暴击伤害']) / 10000 + 1),
    技攻区: (data['技能攻击力'] / 100 + 1),
    其它: (data['其它'] / 100 + 1),
  }
  return res
})
const score = computed(() => {
  const data = scoreBlock.value
  const res = Object.keys(data).reduce((t, key) => {
    if (key === '属强区') {
      t.综合评分 = t.综合评分 * data[key]
      t.世界boss = t.世界boss * (data[key] - 0.45)
    } else {
      t.综合评分 = t.综合评分 * data[key]
      t.世界boss = t.世界boss * data[key]
    }

    return t
  }, { 综合评分: 1, 世界boss: 1 })
  return res
})

</script>

<template>
  <div class="block">
    <h3>当前职业：
      <el-select v-model="zy" placeholder="Select" style="width: 240px">
        <el-option v-for="item in zyList" :key="item.name" :label="item.name" :value="item.name" />
      </el-select>
    </h3>
    <el-row style="margin-top: 20px;text-align: left;">
      <el-col v-for="item in Object.keys(personInfo) " :key="item" :span="4">
        <span>{{ item }}:</span>
        <span style="color: red;padding-left: 5px;">{{ personInfo[item] }}</span>
      </el-col>
    </el-row>
  </div>

  <div class="block">
    <h3>装备选择</h3>
    <el-select v-model="wq" placeholder="Select" style="width: 240px">
      <el-option v-for="item in equipList.filter(v => v.type === '武器')" :key="item.name" :label="item.name"
        :value="item.name" />
    </el-select>
    <el-select v-model="fj" placeholder="Select" style="width: 240px">
      <el-option v-for="item in equipList.filter(v => v.type.includes('防具'))" :key="item.name" :label="item.name"
        :value="item.name" />
    </el-select>
    <el-select v-model="ss" placeholder="Select" style="width: 240px">
      <el-option v-for="item in equipList.filter(v => v.type === '首饰')" :key="item.name" :label="item.name"
        :value="item.name" />
    </el-select>
    <el-select v-model="hf" placeholder="Select" style="width: 240px">
      <el-option v-for="item in equipList.filter(v => v.type === '护符')" :key="item.name" :label="item.name"
        :value="item.name" />
    </el-select>
  </div>

  <h3>基础数据展示</h3>
  <el-row class="block">
    <el-col v-for="item in Object.keys(allData) " :key="item" :span="12">
      <span>{{ item }}:</span>
      <span style="color: red;padding-left: 5px;">{{ allData[item] }}</span>
    </el-col>
  </el-row>

  <h3>加成展示</h3>
  <el-row class="block">
    <el-col v-for="item in Object.keys(scoreBlock) " :key="item" :span="12">
      <span>{{ item }}:</span>
      <span style="color: red;padding-left: 5px;">{{ scoreBlock[item].toFixed(2) }}</span>
    </el-col>
  </el-row>

  <h3 style="margin-top: 20px;">搭配评分：</h3>
  <el-col v-for="item in Object.keys(score) " :key="item" :span="12">
    <span>{{ item }}:</span>
    <span style="color: red;padding-left: 5px;">{{ score[item].toFixed(2) }}</span>
  </el-col>
  <el-col v-for="item in Object.keys(maxData) " :key="item" :span="12">
    <span>{{ item }}:</span>
    <span style="color: red;padding-left: 5px;">{{ maxData[item].toFixed(2) }}倍期望</span>
  </el-col>

</template>

<style scoped>
h3 {
  margin: 8px 0;
}

.block {
  padding-bottom: 12px;
}
</style>