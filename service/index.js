// 使用express 给前端提供一个接口
const express = require('express')
const { Ollama }  = require('@langchain/community/llms/ollama');
const app = express()
const port = 3000
// 接口允许跨域 cros
const cors = require('cors');
app.use(cors());

const ollama = new Ollama({
  baseUrl: 'http://127.0.0.1:11434',
  model: 'deepseek-r1:32b'
})

// 这个接口 接受一个字符串
app.get('/chat', async(req, res) => {
  // 获取字符串
  const { keyword } = req.query
  // 调用函数
  const result = keyword?.split('').reverse().join('') || '请输入'
  const stream = await ollama.stream(result)
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  res.send(chunks.join(""))
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
