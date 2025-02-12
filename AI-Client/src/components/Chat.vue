<script setup>
import { ref } from 'vue'
import request from '../utils/request'

const keyword = ref('')

const handleSend = () => {
  if(requestStatus.value === 1) return 
  console.log(keyword.value)
  request.get('/chat', {
    params: {
      keyword: keyword.value
    }
  }).then(res => {
    console.log(res)
  })
}

const messageList = ref([]) // 请求消息列表
const requestStatus = ref(0) // 请求状态 0:未请求 1:请求中 2:请求成功 3:请求失败
const requestTimes = ref(0) // 请求次数
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
  <div>
    <p v-for="(item, index) in messageList" :key="index">
      {{ item }}
    </p>
  </div>
</template>
