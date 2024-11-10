// 辅助函数：将 Blob 转换为 Data URL
function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export async function transcribeAudio(blob) {
  const form = new FormData()
  const dataUrl = await blobToDataURL(blob)
  form.append("model", "iic/SenseVoiceSmall")
  form.append("file", dataUrl)

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: "Bearer sk-zntjrehanhqgnfutelvbaafwuygfusirrgxjvbbeprecsflj",
    },
  }

  options.body = form

  fetch("https://api.siliconflow.cn/v1/audio/transcriptions", options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err))
}
