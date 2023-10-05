const app = require("express")();
const { isAjax } = require("../server/middlewares/functions");
const { Configuration, OpenAIApi } = require("openai");
const config = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(config);

app.get("/revisarGPT", isAjax, async (req, res) => {
  try {
    const txt = req.query.txt;
    if (!txt) return res.send("");
    res.cookie("disable", txt);
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Revisa la ortografia y redaccion del siguiente texto, trata de que quede formal: "${txt}"`,
      max_tokens: 200,
      temperature: 0.6,
    });
    const revisedTxt = completion.data.choices[0].text.trim();
    res.send(revisedTxt);
  } catch (err) {
    res.send("An error ocurred");
  }
});

app.get("/reducirGPT", isAjax, async (req, res) => {
  try {
    const txt = req.query.txt.trim();
    if (!txt) return res.send("");
    res.cookie("disable", txt);
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Reduce el siguiente texto no pierdas la idea principal ni la coherencia, es importante que no sobrepases los 246 caracteres: "${txt}"`,
      max_tokens: 200,
      temperature: 0.6,
    });
    const revisedTxt = completion.data.choices[0].text.trim();
    res.send(revisedTxt);
  } catch (err) {
    res.send("An error ocurred");
  }
});

app.get("/deshacerGPT", isAjax, async (req, res) => {
  const txt = req.cookies.disable || "";
  res.clearCookie("disable");
  res.send(txt);
});

module.exports = app;
