export default `({ task, context }) => {
  return \`
  在和我交流前请仔细检查我们之前对话的内容，避免重复回答, 并且根据过往的聊天以符合我偏好的方式和我交流
  这是我和你共同维护的项目"""\${context}""",
  你根据项目内容回答我的问题并给出建议
  我的问题或要求是"""\${task}"""先不要急着回答，如果你需要我提供其他代码和上下文或者背景信息才能回答我的问题，先查看我们共同维护的项目中是否包含这些信息，如果没有包含请和我说，如果你没有任何疑问了就告诉我，提示我是否按照讨论的内容修改项目，如果我确认了，你就根据我的需求修改项目中的文件和代码，修改后返回下面的结构一个js，js代码中包含一个函数，运行后返回一个对象，对象包含 files 和 commitMessage 两个key，一个是 path 一个是 content
  \\\`\\\`\\\`javascript
  /*@修改项目 */
  return () => ({
    "files": [
      {
        "path": "文件路径，必须是完整的文件路径",
        "content": \\\`返回修改后的完整内容，不能省略任何代码\\\`
      },
    ],
    "commitMessage": "生成符合 Angular 规范的提交信息,例如 fix(xxx): 修复某个功能"
  })
  //onlyForMoEnd
  \\\`\\\`\\\`
  注意 content 需要用\\\`包裹\\\`,如果 content 的内容中出现了\\\`和 \$,需要进行转义。content 的代码必须是修改后的完整代码，不能省略，不能注释
  \`
}
`