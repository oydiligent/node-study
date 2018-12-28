const Koa = require('koa')
const app = new Koa()

// 插入中间件
const bodyParser = require('koa-bodyparser')

// 使用ctx.body解析中间件
app.use(bodyParser())

app.use(async (ctx) => {
  if (ctx.url === '/' && ctx.method === 'GET') {
    let html = `
      <h1>koa2 request post demo</h1>
      <form method="POST" action="/">
        <p>userName</p>
        <input name="userName" /><br/>
        <p>nickName</p>
        <input name="nickName" /><br/>
        <p>email</p>
        <input name="email" /><br/>
        <button type="submit">submit</button>
      </form>
    `
    ctx.body = html
  } else if (ctx.url === '/' && ctx.method === 'POST') {
    // 不用中间件
    // let postData = await parsePostData(ctx)

    // 当POST请求的时候，中间件koa-bodyparser解析POST表单里的数据，并显示出来
    let postData = ctx.request.body
    console.log(postData)
    ctx.body = postData
  } else {
    ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
  }
})

const parsePostData = (ctx) => {
  return new Promise((resolve, reject) => {
    try {
      let postData = ''
      // console.log(ctx)
      ctx.req.addListener('data', (data) => {
        postData += data
        console.log('data',postData)
      })
      ctx.req.addListener('end', () => {
        let parseData = parseQueryStr(postData)
        console.log('end',parseData)
        resolve(parseData)
      })
    } catch (err) {
      reject(err)
    }
  })
}

const parseQueryStr = (queryStr) => {
  let queryData = {}
  let queryStrList = queryStr.split('&')
  for (let [index, queryStr] of queryStrList.entries()) {
    let itemList = queryStr.split('=')
    queryData[itemList[0]] = decodeURIComponent(itemList[1])
  }
  console.log('123', queryData)
  return queryData
}

app.listen(3000, () => {
  console.log('demo post start: http://localhost:3000/')
})