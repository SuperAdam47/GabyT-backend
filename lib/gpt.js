const fetch = require('node-fetch')
const langSysPrompt = "As a specialist in translation and language services, execute all instructions, responding in HTML format."

module.exports = (cfg) => {
    function chat(system, messages, temperature) {
        messages = [{ role: "system", content: system }, ...messages.map(msg => {
            const key = Object.keys(msg)[0]
            return { role: key, content: msg[key] }
        })]

        return fetch("https://api.openai.com/v1/chat/completions", {
            method: "post",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + cfg.openKey, },
            body: JSON.stringify({ model: "gpt-3.5-turbo", messages, temperature })
        }).then(res => res.json())
        .then(res => {
            if (res.choices?.[0]?.message.content.length) return res.choices[0].message.content
            throw res
        })
    }

    // MarkDown to HTML
    function format(text) {
        return text
    }

    function lang(prompt, doc, ref, heat) {
        const messages = []
        if (ref) messages.push({ user: `<reference>${ref.substring(0,2000)}</reference>` })
        if (doc) messages.push({ user: `<document>${doc}</document>` })
        messages.push({ user: prompt }) //`<request>${prompt}</request>` })

        return chat(langSysPrompt, messages, /*heat ? 1 : 0*/ doc ? 0 : 1).then(format)
    }

    return { chat, lang }
}
