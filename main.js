const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN)

// // Starting Bot -> /start
// bot.start((ctx) => ctx.reply('Welcome'))

// // When user type /help
// bot.help((ctx) => ctx.reply('Send me a sticker'))

// // When user respond
// bot.on('sticker', (ctx) => ctx.reply('👍'))

// // When on trigger
// bot.hears('hi', (ctx) => ctx.reply('Hey there'))

// Async Processes
// bot.use(async (ctx, next) => {
//     const start = new Date()
//     await next()
//     const ms = new Date() - start
//     console.log('Response time: %sms', ms)
//   })

bot.command('oldschool', (ctx) => ctx.reply('Hello'))
bot.command('hipster', Telegraf.reply('λ'))
bot.on('dice',(ctx) => {
    console.log(ctx.message)
    ctx.reply("nicedice")
})
bot.command('say',(ctx)=> {
    msg = ctx.message.text
    msgArray = msg.split(' ')
    msgArray.shift()
    newMsg = msgArray.join(' ')
    ctx.reply(newMsg)
} )
bot.command('fortune',(ctx) => {

    axios.get("https://jsonplaceholder.typicode.com/todos/1")
    .then(res => {
        const data = res.data.title
        ctx.reply(data)
    }).catch()
})
bot.command('testing',(ctx)=>{
    ctx.telegram.sendMessage(ctx.chat.id, "TESTING", 
    {
        reply_markup: {
            inline_keyboard: [
                [{text: "Button1", callback_data: "DL"},{text: "Button2", callback_data: "HL"}],[{text:"Button3",callback_data: "CL"}]
            ]
        }
    })
})

bot.action("DL",(ctx)=>{
    ctx.deleteMessage()
    stateCode = ctx.match // return DL 
    getData(stateCode)
    .then((result)=>{
        ctx.telegram.sendMessage(ctx.chat.id, results, 
            {
                reply_markup: {
                    inline_keyboard: [
                        [{text: "GO BACK",callback_data: "gohome"}]
                    ]
                }
            })
    })
})

bot.action('gohome',(ctx)=>{
    ctx.deleteMessage()
    ctx.telegram.sendMessage(ctx.chat.id, "TESTING", 
    {
        reply_markup: {
            inline_keyboard: [
                [{text: "Button1", callback_data: "DL"},{text: "Button2", callback_data: "HL"}],[{text:"Button3",callback_data: "CL"}]
            ]
        }
    })
})

async function getData(stateCode){
    url = "https://api.covid19india.org/data.json"
    let res = await axios.get(url)
    stateDattaArr = res.data.statewise
    dataState = stateDattaArr.filter((elem) => {return elem.statecode == stateCode})
    cases = dataState[0]
    results = `
    Cases in ${cases.state}: 
    Confirmed Cases: ${cases.confirmed}
    `
    return results
}

// Polling
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))