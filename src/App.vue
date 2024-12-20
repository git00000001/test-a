<script setup>
import { ref, computed, watch } from 'vue'
import { base, baseTags } from './assets/config'
import { Edit } from '@element-plus/icons-vue'

const collocation = ref([])
const tags = ref([])
const equipShow = ref(false)
const blockShow = ref(false)
const rankShow = ref(false)
const edit = ref(false)
const activeName = ref('装备库')
const baseInfo = ref({ ...base })
const rankList = ref([])
const form = ref({ 被动列表: [], 被动: {}, 精通列表: [], 精通: '', 精通加成: {} })

const setTags = () => {
  const local = JSON.parse(localStorage.tags || '{}')
  baseTags.forEach(tag => {
    if (!local[tag.name]) local[tag.name] = tag
  })
  tags.value = Object.values(local)
}
setTags()
const addTags = () => {
  const tags = {
    name: form.value.name,
    type: form.value.type,
    精通: form.value.精通,
    精通加成: Object.keys(form.value.精通加成).map(v => {
      return { name: v, value: Number(form.value.精通加成[v]) }
    }),
    被动: Object.keys(form.value.被动).map(v => {
      return { name: v, value: Number(form.value.被动[v]) }
    })
  }
  const local = JSON.parse(localStorage.tags || '{}')
  local[tags.name] = tags
  localStorage.tags = JSON.stringify(local)
  form.value = { 被动列表: [], 被动: {}, 精通列表: [], 精通: '', 精通加成: {} }
  activeName.value = '装备库'
  setTags()
}

const selectData = computed(() => {
  const data = collocation.value.map(v => {
    return tags.value.find(item => item.name === v) || { type: '' }
  })
  const 职业 = data.find(v => v.type.includes('职业')) || { 被动: [], 精通: '无', type: '', name: '' }
  const 武器 = data.find(v => v.type === '武器') || { 被动: [], name: '' }
  const 防具 = data.find(v => v.type.includes('防具')) || { 被动: [], type: '', name: '' }
  const 首饰 = data.find(v => v.type === '首饰') || { 被动: [], name: '' }
  const 护符 = data.find(v => v.type === '护符') || { 被动: [], name: '' }
  const res = {
    职业, 武器, 防具, 首饰, 护符
  }
  return {
    职业, 武器, 防具, 首饰, 护符
  }
})

const allData = computed(() => {
  const { 职业, 武器, 防具, 首饰, 护符 } = selectData.value
  let res = {}
  Object.keys(baseInfo.value).forEach(key => {
    res[key] = Number(baseInfo.value[key])
  })
  const arr = [武器, 防具, 首饰, 护符]
  arr.forEach(v => {
    v.被动.forEach(item => {
      switch (item.name) {
        case '技攻':
          res[item.name] = (res[item.name] + 100) * (item.value + 100) / 100 - 100
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
  return {
    ...res,
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
  }
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
    凹一凹: arr[9000] / qwDemage,
    熬一熬: arr[9900] / qwDemage
  }
})


const score = computed(() => {
  const data = scoreBlock.value
  const res = Object.keys(data).reduce((t, key) => {
    t.世界boss = t.世界boss * data[key]
    return t
  }, { 世界boss: 1 })
  if (selectData.value.首饰.name.includes('魂骨')) {
    const 一阶段 = 0.23
    const d1 = 一阶段 * (scoreBlock.value.黄字区 - 0.5) + (1 - 一阶段) * 1.25 * scoreBlock.value.黄字区
    const d2 = 一阶段 * scoreBlock.value.黄字区 + (1 - 一阶段) * 1.25 * scoreBlock.value.黄字区
    const percent = d1 / d2
    res.世界boss = res.世界boss * percent
  }
  res.世界boss = Math.floor(res.世界boss)
  if (Object.values(selectData.value).every(v => v.name)) {
    let rank = JSON.parse(localStorage.rank || '{}')
    rank[selectData.value.职业.name] = rank[selectData.value.职业.name] || {}
    rank[selectData.value.职业.name][
      selectData.value.武器.name +
      selectData.value.防具.name +
      selectData.value.首饰.name +
      selectData.value.护符.name] = res.世界boss
    localStorage.rank = JSON.stringify(rank)
    updateRank()
  }

  return res
})

watch(selectData, (newX) => {
  if (newX.职业.name) updateRank()
})

const updateRank = () => {
  let rank = JSON.parse(localStorage.rank || '{}')
  rank[selectData.value.职业.name] = rank[selectData.value.职业.name] || {}
  rankList.value = Object.keys(rank[selectData.value.职业.name]).map(v => {
    return {
      name: v,
      value: rank[selectData.value.职业.name][v]
    }
  }).sort((a, b) => b.value - a.value)
}
const deleteTags = (index) => {
  const tag = tags.value.splice(index, 1)[0]
  const local = JSON.parse(localStorage.tags || '{}')
  delete local[tag.name]
  console.log(local, tag, local[tag.name])
  localStorage.tags = JSON.stringify(local)
}
</script>

<template>

  <h3><span @click="equipShow = true">当前搭配</span></h3>
  <div class="set block">
    <el-select v-model="collocation" multiple filterable placeholder="请选择装备">
      <el-option v-for="item in tags" :key="item.name" :label="item.name" :value="item.name" />
    </el-select>
  </div>

  <h3><span @click="blockShow = true">属性总览</span></h3>
  <el-row class="block">
    <el-col v-for="item in Object.keys(allData) " :key="item" :span="12">
      <span>{{ item }}:</span>
      <span style="color: red;padding-left: 5px;">{{ Math.floor(allData[item] * 100) / 100 }}</span>
    </el-col>
    <el-col :span="12">
      <span>精通加成:</span>
      <span style="color: red;padding-left: 5px;">{{ selectData.防具.type.includes(selectData.职业.精通) ? '是' : '否' }}</span>
    </el-col>
  </el-row>

  <h3 style="margin-top: 20px;"><span @click="rankShow = true">搭配评分</span></h3>
  <el-row class="block">
    <el-col v-for="item in Object.keys(score) " :key="item" :span="24">
      <span>{{ item }}:</span>
      <span style="color: red;padding-left: 5px;">{{ score[item] }}</span>
    </el-col>
    <el-col v-for="item in Object.keys(maxData) " :key="item" :span="24">
      <span>{{ item }}:</span>
      <span style="color: red;padding-left: 5px;">{{ maxData[item].toFixed(2) }}倍</span>
    </el-col>
  </el-row>
  <el-button class="fixed" type="primary" :icon="Edit" circle @click="edit = true" />


  <el-dialog v-model="equipShow" width="80%" title="装备信息">
    <div class="info" v-for="keys in Object.keys(selectData)">
      <p>{{ selectData[keys].name }}</p>
      <el-row class="info-block">
        <el-col v-for="itemC in selectData[keys].被动 " :key="itemC.name" :span="12">
          <span>{{ itemC.name }}:</span>
          <span style="color: red;padding-left: 5px;">{{ itemC.value }}</span>
        </el-col>
        <el-col v-if="selectData[keys].精通 !== '无' && keys === '职业'" :span="12">
          <span>精通:</span>
          <span style="color: red;padding-left: 5px;">{{ selectData[keys].精通 }}</span>
        </el-col>
      </el-row>
    </div>
    <template #footer></template>
  </el-dialog>
  <el-dialog v-model="blockShow" width="80%" title="加成信息">
    <div class="info">
      <el-row class="info-block">
        <el-col v-for="key in Object.keys(scoreBlock)" :span="12">
          <span>{{ key }}:</span>
          <span style="color: red;padding-left: 5px;">{{ scoreBlock[key].toFixed(2) }}</span>
        </el-col>
      </el-row>
    </div>
    <template #footer></template>
  </el-dialog>
  <el-dialog v-model="rankShow" width="80%" title="职业搭配排行">
    <div class="info" v-if="rankList">
      <el-row class="info-block">
        <el-col v-for="item in rankList" :span="24">
          <span>{{ item.name }}:</span>
          <span style="color: red;padding-left: 5px;">{{ item.value }}</span>
        </el-col>
      </el-row>
    </div>
    <template #footer></template>
  </el-dialog>
  <el-dialog v-model="edit" width="80%">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="装备库" name="装备库">
        <el-tag v-for="(tag, index) in tags" :key="tag.name" closable @close="deleteTags(index)">
          {{ tag.name }}
        </el-tag>
      </el-tab-pane>
      <el-tab-pane label="新增" name="新增">
        <el-form :model="form" label-width="50px">
          <el-form-item label="名称">
            <el-input v-model="form.name" size="small" placeholder="装备名称" />
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="form.type" size="small" placeholder="装备类型">
              <el-option label="职业-物理" value="职业-物理" />
              <el-option label="职业-魔法" value="职业-魔法" />
              <el-option label="武器" value="武器" />
              <el-option label="防具-布甲" value="防具-布甲" />
              <el-option label="防具-皮甲" value="防具-皮甲" />
              <el-option label="防具-轻甲" value="防具-轻甲" />
              <el-option label="防具-重甲" value="防具-重甲" />
              <el-option label="防具-板甲" value="防具-板甲" />
              <el-option label="首饰" value="首饰" />
              <el-option label="护符" value="护符" />
            </el-select>
          </el-form-item>
          <el-form-item label="被动">
            <el-select v-model="form.被动列表" multiple size="small" placeholder="请选择被动">
              <el-option v-for="key in Object.keys(baseInfo)" :label="key" :value="key" />
            </el-select>
            <div style="width: 100%;height: 4px;"></div>
            <div v-for="item in form.被动列表" :key="item">
              <el-input v-model="form.被动[item]" size="small">
                <template #prepend>{{ item }}</template>
              </el-input>
            </div>
          </el-form-item>

          <el-form-item label="精通" v-if="form.type && form.type.includes('职业')">
            <el-select v-model="form.精通" size="small" placeholder="精通">
              <el-option label="布甲" value="布甲" />
              <el-option label="皮甲" value="皮甲" />
              <el-option label="轻甲" value="轻甲" />
              <el-option label="重甲" value="重甲" />
              <el-option label="板甲" value="板甲" />
            </el-select>
            <el-select v-model="form.精通列表" multiple size="small" placeholder="精通加成">
              <el-option v-for="key in Object.keys(baseInfo)" :label="key" :value="key" />
            </el-select>
            <div style="width: 100%;height: 4px;"></div>
            <div v-for="item in form.精通列表" :key="item">
              <el-input v-model="form.精通加成[item]" size="small">
                <template #prepend>{{ item }}</template>
              </el-input>
            </div>
          </el-form-item>
          <el-button type="primary" @click="addTags" style="width: 100%;margin-top: 12px;" size="small"
            round>添加至装备库</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="基础信息" name="基础信息">
        <div v-for="key in Object.keys(baseInfo) " :key="key">
          <el-input v-model="baseInfo[key]" size="small">
            <template #prepend>{{ key }}</template>
          </el-input>
        </div>

      </el-tab-pane>
    </el-tabs>
    <template #footer></template>
  </el-dialog>
</template>

<style>
h3 {
  margin: 6px 0;
  font-size: 16px;
}

.block {
  padding-bottom: 4px;
  font-size: 14px;
}

.fixed {
  position: fixed;
  right: 10px;
  bottom: 20px;
}

.el-dialog {
  padding: 14px;
}

.el-dialog__title {
  font-size: 14px;
}

.el-dialog__header {
  padding-bottom: 6px;
}

.info {
  font-size: 12px;
}

.info p {
  margin: 4px;
  color: #999;
  font-weight: 600;
}

.el-tag {
  margin-right: 4px;
  margin-bottom: 4px;
}
</style>