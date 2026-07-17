<template>
  <div class="tags">
    <el-tag
      :key="tag.name"
      v-for="(tag, index) in tags"
      :closable="tag.name !== 'home'"
      :effect="route.name === tag.name ? 'dark' : 'plain'"
      @click="changeMenu(tag)"
      @close="handleClose(tag, index)"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAllDataStore } from '@/stores'

const store = useAllDataStore()
const route = useRoute()
const router = useRouter()

const tags = computed(() => store.state.tags)

const changeMenu = (tag) => {
  store.selectMenu(tag)
  router.push(tag.name)
}

// 关闭 tag
const handleClose = (tag, index) => {
  store.updateTags(tag)

  // 如果关闭的不是当前路由，不跳转
  if (tag.name !== route.name) return

  // 关闭的是当前激活 tab 时跳转逻辑
  if (index === store.state.tags.length) {
    // 关闭的是最后一个 tag，跳转到前一个
    store.selectMenu(tags.value[index - 1])
    router.push(tags.value[index - 1].name)
  } else {
    // 跳转到后一个 tag
    store.selectMenu(tags.value[index])
    router.push(tags.value[index].name)
  }
}
</script>

<style lang="less" scoped>
.tags {
  margin: 20px 0 0 20px;
}
.el-tag {
  margin-right: 10px;
  cursor: pointer;
}
</style>
