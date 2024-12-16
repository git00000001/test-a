<script setup>
import { ref, computed } from 'vue'
import { base, baseTags } from './assets/config'
import { Edit } from '@element-plus/icons-vue'

const collocation = ref([])
const tags = ref([...baseTags])
const dialogVisible = ref(false)
const edit = ref(false)
const activeName = ref('装备库')
const baseInfo = ref({ ...base })
const form = ref({ 被动列表: [], 被动: {}, 精通列表: [], 精通: {} })

const setTags = () => {
  const local = JSON.parse(localStorage.tags || '{}')
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
  Object.keys(res).forEach(v => {
    console.log(v, res[v], res[v].name)
  })
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
  return res
})


const deleteTags = (index) => {
  const tag = tags.value.splice(index, 1)
  console.log(tag)
}
</script>

<template>

  <h3 @click="dialogVisible = true">当前搭配：</h3>
  <div class="set block">
    <el-select v-model="collocation" multiple filterable placeholder="请选择装备">
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
  <el-row class="block">
    <el-col v-for="item in Object.keys(score) " :key="item" :span="24">
      <span>{{ item }}:</span>
      <span style="color: red;padding-left: 5px;">{{ score[item].toFixed(2) }}</span>
    </el-col>
    <el-col v-for="item in Object.keys(maxData) " :key="item" :span="24">
      <span>{{ item }}:</span>
      <span style="color: red;padding-left: 5px;">{{ maxData[item].toFixed(2) }}倍</span>
    </el-col>
  </el-row>
  <el-button class="fixed" type="primary" :icon="Edit" circle @click="edit = true" />


  <el-dialog v-model="dialogVisible" width="80%" title="装备信息">
    <div class="info" v-for="keys in Object.keys(selectData)">
      <p>{{ selectData[keys].name }}</p>
      <el-row class="info-block">
        <el-col v-for="itemC in selectData[keys].被动 " :key="itemC.name" :span="12">
          <span>{{ itemC.name }}:</span>
          <span style="color: red;padding-left: 5px;">{{ itemC.value }}</span>
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
              <el-option label="防具" value="防具" />
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
            <el-select v-model="form.精通列表" multiple size="small" placeholder="请选择被动">
              <el-option v-for="key in Object.keys(baseInfo)" :label="key" :value="key" />
            </el-select>
            <div style="width: 100%;height: 4px;"></div>
            <div v-for="item in form.精通列表" :key="item">
              <el-input v-model="form.精通[item]" size="small">
                <template #prepend>{{ item }}</template>
              </el-input>
            </div>
          </el-form-item>
          <el-button type="primary" style="width: 100%;margin-top: 12px;" size="small" round>添加至装备库</el-button>
          <!-- <el-form-item label="精通">
            <el-select v-model="form.精通" multiple size="small" placeholder="请选择被动">
              <el-option v-for="key in Object.keys(baseInfo)" :label="key" :value="key" />
            </el-select>
          </el-form-item>
          <div v-for="item in form.被动列表" :key="item">
            <el-input v-model="form.被动[item]" type="number" size="small">
              <template #prepend>{{ item }}</template>
            </el-input>
          </div> -->

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
  font-size: 14px;
}

.block {
  padding-bottom: 4px;
  font-size: 12px;
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