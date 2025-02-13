<script setup>
import { ref } from 'vue'
import request from '../utils/request'

const keyword = ref('')
const messageList = ref([]) // 请求消息列表
const isLoading = ref(false)
const currentInfo = ref(null)

const handleSend = () => {
  isLoading.value = true
  request
    .get('/chat', {
      params: {
        keyword: keyword.value,
      },
    })
    .then((res) => {
      isLoading.value = false
      currentInfo.value && messageList.value.push(currentInfo)
      currentInfo.value = {
        questions: keyword.value,
        answers: res,
      }
      typeWriter('typewriter', res, 150)
    })
    .catch(() => {
      isLoading.value = false
    })
}
// 打字机效果
function typeWriter(elementId, texts, speed = 100) {
  const el = document.getElementById(elementId)
  let index = 0
  function type() {
    const currentText = texts[index]
    el.innerHTML += currentText
    index++
    if (index < texts.length) {
      setTimeout(type, speed)
    }
  }
  type()
}
</script>

<template>
  <div class="chat-box">
    <h1>欢迎使用</h1>
    <div class="chat-message">
      <p v-for="(item, index) in messageList" :key="index">
        <span>{{ item?.join('') }}</span>
      </p>
      <p v-loading="isLoading" id="typewriter" class="typewriter"></p>
    </div>

    <div class="footer">
      <el-input v-model="keyword" style="width: 100%" max-length="200" show-word-limit placeholder="请输入关键词">
        <template #append>
          <el-button @click="handleSend">发送</el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<style>
.chat-box {
  position: relative;
  height: 80vh;
  width: 100%;
  box-sizing: border-box;
}
.chat-message {
  height: calc(100vh - 180px);
  overflow-y: auto;
}
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 20px;
}
</style>
