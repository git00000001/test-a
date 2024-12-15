<script setup>
import { ref, computed } from 'vue'
import { base, baseTags } from './assets/config'

const collocation = ref([])
const tags = ref([...baseTags])

const selectData = computed(() => {
  const data = collocation.value.map(v => {
    return tags.value.find(item => item.name === v) || { type: '' }
  })
  const 职业 = data.find(v => v.type.includes('职业')) || { 被动: [], 精通: '无', type: '' }
  const 武器 = data.find(v => v.type === '武器') || { 被动: [] }
  const 防具 = data.find(v => v.type.includes('防具')) || { 被动: [], type: '' }
  const 首饰 = data.find(v => v.type === '首饰') || { 被动: [] }
  const 护符 = data.find(v => v.type === '护符') || { 被动: [] }
  return {
    职业, 武器, 防具, 首饰, 护符
  }
})

const allData = computed(() => {
  const { 职业, 武器, 防具, 首饰, 护符 } = selectData.value
  const res = { ...base }
  const arr = [武器, 防具, 首饰, 护符]
  arr.forEach(v => {
    v.被动.forEach(item => {
      switch (item.name) {
        case '技攻':
          res[item.name] = res[item.name] * item.value
          break;
        default:
          res[item.name] += item.value
          break;
      }
    })
  })
  职业.被动.forEach(v => {
    res[v.name] += v.value
  })
  const isProficientIn = 防具.type.includes(职业.精通)
  if (isProficientIn) {
    职业.精通加成.forEach(v => {
      res[v.name] += v.value
    })
  }
  console.log(arr, res, 职业, isProficientIn)
  return {
    ...res,
    精通加成: isProficientIn ? '是' : '否',
  }
})

const scoreBlock = computed(() => {
  const data = allData.value
  const denageType = selectData.value.职业.type.includes('魔法')
  const res = {
    攻击区: (data[!denageType ? '物理攻击力' : '魔法攻击力'] * (1 + data['攻击加成'] / 100) + data['独立攻击力']),
    力量区: (data[!denageType ? '力量' : '智力'] * (1 + data['力智加成'] / 100) / 250 + 1),
    黄字区: (data['黄字'] / 100 + 1),
    白字区: (data['白字'] / 100 + 1),
    属强区: ((data['属强'] * 0.45) / 100 + 1.05 - 0.45),
    暴击区: (((data['暴击'] / 20.6 + data['暴击率']) * data['暴伤']) / 10000 + 1),
    技攻区: (data['技攻'] / 100 + 1),
    其它: (data['其它'] / 100 + 1),
  }
  if (data.属白 > 0) {
    const 额外白字 = data.属白 * ((data['属强'] - 100) * 0.45 + 100) / 10000
    res.白字区 += 额外白字
    console.log(额外白字)
  }
  console.log(res)

  return res
})

const maxData = computed(() => {
  const data = allData.value
  const 技能组 = [20000, 10000, 10000, 10000, 1700, 1700, 1700, 1700, 1700, 1700, 1700, 1700, 1700, 1700, 10000,
    4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000,
    3600, 4000, 3600, 4000, 3600, 4000, 3600, 4000, 3600, 4000, 6500, 6500, 6500, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400,
    400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400
  ]
  const qw = (((data['暴击'] / 20.6 + data['暴击率']) * data['暴伤']) / 10000 + 1)
  let qwDemage = 0
  技能组.forEach(percen => {
    qwDemage += qw * percen
  })
  const bj = (data['暴击'] / 20.6 + data['暴击率']) / 100
  let arr = []
  while (arr.length < 10000) {
    let t = 0
    技能组.forEach(percen => {
      let isBJ = Math.random() <= bj
      let demage = isBJ ? percen * (1 + data['暴伤'] / 100) : percen
      demage = (0.9 + Math.random() * 0.2) * demage
      t += demage
    })
    arr.push(t)
  }
  arr.sort((a, b) => a - b)
  return {
    凹一十次: arr[9000] / qwDemage,
    凹一百次: arr[9900] / qwDemage
  }
})


const score = computed(() => {
  const data = scoreBlock.value
  const res = Object.keys(data).reduce((t, key) => {
    t.世界boss = t.世界boss * data[key]
    return t
  }, { 世界boss: 1 })
  return res
})

</script>

<template>

  <h3>当前搭配：</h3>
  <div class="block">
    <el-select v-model="collocation" multiple placeholder="Select">
      <el-option v-for="item in tags" :key="item.name" :label="item.name" :value="item.name" />
    </el-select>
  </div>

  <h3>属性总览</h3>
  <el-row class="block">
    <el-col v-for="item in Object.keys(allData) " :key="item" :span="12">
      <span>{{ item }}:</span>
      <span style="color: red;padding-left: 5px;">{{ allData[item] }}</span>
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
  <el-button class="fixed" circle>+</el-button>
</template>

<style scoped>
h3 {
  margin: 8px 0;
}

.block {
  padding-bottom: 12px;
}

.fixed {
  position: fixed;
  right: 10px;
  bottom: 20px;
  font-size: 30px;
  font-weight: 600;
}
</style>