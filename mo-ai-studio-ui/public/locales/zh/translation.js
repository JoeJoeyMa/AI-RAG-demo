import common from './common';
import auth from './auth';
import settings from './settings';
import roles from './roles';
import pricing from './pricing';
import product from './product';
import company from './company';
import tools from './tools';

export default {
  ...common,
  ...auth,
  ...settings,
  ...roles,
  ...pricing,
  ...product,
  ...company,
  ...tools,
  mo_description: "Mo 是 Mo AI Studio 上的超级开发智能体，支持全种类 IDE 和编程语言。它能一次修改大量文件，实现正确推理，并支持跨项目的上下文修改和自定义智能体，你可以完全定义专属的 Mo。",
  mo_ai_studio_description: "Mo AI Studio 是企业级 AI 智能体运行平台，能运行各种定制的聪明 AI 智能体。Mo AI Studio 为这些 AI 智能体提供了系统级的能力，让 AI 智能体可以操作系统文件，编写和修改文档，回答问题，共享知识，助力企业实现真正的智能化协同。",
  download_mo_ai_studio: "下载 Mo AI Studio",
  see_what_mo_can_do: "来看看 Mo 能做什么吧！",
  mo_modify_website: "Mo 修改网站",
  mo_refactor_large_file: "Mo 重构 700 行大文件",
  mo_generate_i18n: "Mo 生成 i18n 多语言翻译",
  mo_can_do_more: "Mo 能做的远不止这些，想知道更多吗？",
  // 新增翻译
  login_failed: "登录失败",
  login_error_log: "登录错误：",
  login_error: "登录过程中发生错误",
  welcome_register_mobenai: "欢迎注册 Mobenai Development",
  enterprise_name: "企业名称",
  enter_enterprise_name: "输入你的企业名称",
  phone_number: "手机号",
  enter_phone_number: "输入你的手机号",
  verification_code: "验证码",
  enter_verification_code: "输入验证码",
  resend_code_countdown: "{{seconds}}秒后重发",
  send_verification_code: "发送验证码",
  enter_password: "输入你的密码",
  agree_terms_and_policy: "我同意",
  terms_of_service: "服务条款",
  and: "和",
  privacy_policy: "隐私政策",
  already_have_account: "已经有账号？",
  register_success: "注册成功",
  register_success_message: "注册企业成功，请重新登录。默认账号 admin，密码是您刚才设置的密码",
  i_know: "我知道了",
  enterprise_name_required: "企业名称是必填项",
  phone_required: "手机号是必填项",
  sms_code_required: "验证码是必填项",
  password_min_length: "密码至少需要8个字符",
  password_letter_required: "密码必须包含至少一个字母",
  password_number_required: "密码必须包含至少一个数字",
  agree_terms_required: "请同意服务条款和隐私政策",
  sms_sent: "验证码已发送",
  // 添加的翻译
  magic_wand_error: "处理魔法棒请求时发生错误",
};