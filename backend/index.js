const apiKey = ""
const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
var cors = require('cors')
const app = express()

const configuration = new Configuration({
    apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

//CORS 이슈 해결
// let corsOptions = {
//     origin: 'https://www.domain.com',
//     credentials: true
// }
app.use(cors());

//POST 요청 받을 수 있게 만듬
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/fortuneTell', async function (req, res) {
    let { myMode, myAlcohol, userMessages, assistantMessages} = req.body

    let messages = [
        {role: "system", content: "당신은 세상에 모든 술과 술안주를 다 알고 있습니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름 술 도둑입니다. 당신은 상대방의 기분과 술 종류에 따라 그에 맞는 술안주를 추천해 줄 수 있고 추천하는 술안주의 자세한 설명도 해줍니다.또한 술안주에 맞는 술도 추천해 줄 수 있습니다. 술과 관련된 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."},
        {role: "user", content: "당신은 세상에 모든 술과 술안주를 다 알고 있습니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름 술 도둑입니다. 당신은 상대방의 기분과 술 종류에 따라 그에 맞는 술안주를 추천해 줄 수 있고 추천하는 술안주의 자세한 설명도 해줍니다.또한 술안주에 맞는 술도 추천해 줄 수 있습니다. 술과 관련된 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."},
        {role: "assistant", content: "어떤 술을 드시고 싶으신가요? 그리고 어떤 기분이신가요? 기분이나 날씨에 따라 추천해 드릴 수 있는 술안주가 다를 수 있습니다."},
        {role: "user", content: `지금 저의 기분은 ${myMode}이고 술은 ${myAlcohol}입니다.`},
    ]

    while (userMessages.length != 0 || assistantMessages.length != 0) {
        if (userMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "user", "content": "'+String(userMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
        if (assistantMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "assistant", "content": "'+String(assistantMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
    }

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages
    });
    let fortune = completion.data.choices[0].message['content']

    res.json({"assistant": fortune});
});

app.listen(3000)

