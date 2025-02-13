<script setup>
import { ref } from 'vue'
import request from '../utils/request'

const keyword = ref('')

const handleSend = () => {
  isLoading.value = true
  request.get('/chat', {
    params: {
      keyword: keyword.value
    }
  }).then(res => {
    requestTimes.value += 1
    isLoading.value = false
    messageList.value.push(res.data)
  }).catch(()=> {
    isLoading.value = false
  })
}

const messageList = ref([]) // 请求消息列表
const requestTimes = ref(0) // 请求次数

const isLoading = ref(false)
</script>

<template>
  <h1>欢迎使用</h1>
  <div>
    <el-input v-model="keyword" placeholder="请输入关键词">
      <template #append>
        <el-button type="primary" @click="handleSend">发送</el-button>
      </template>
    </el-input>
    
  </div>
  <div v-loading="isLoading">
    <p v-for="(item, index) in messageList" :key="index">
      {{ item }}
    </p>
  </div>
</template>
