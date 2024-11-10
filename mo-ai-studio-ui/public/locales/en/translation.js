import common from "./common"
import auth from "./auth"
import settings from "./settings"
import roles from "./roles"
import pricing from "./pricing"
import product from "./product"
import company from "./company"
import tools from "./tools"

export default {
  ...common,
  ...auth,
  ...settings,
  ...roles,
  ...pricing,
  ...product,
  ...company,
  ...tools,
  mo_description:
    "Mo is a super development intelligent agent on Mo AI Studio, supporting all types of IDEs and programming languages. It can modify a large number of files at once, implement correct reasoning, and support cross-project context modification and custom intelligent agents. You can completely define your own Mo.",
  mo_ai_studio_description:
    "Mo AI Studio is an enterprise-level AI intelligent agent running platform that can run various customized smart AI intelligent agents. Mo AI Studio provides system-level capabilities for these AI intelligent agents, allowing them to operate system files, write and modify documents, answer questions, share knowledge, and help enterprises achieve truly intelligent collaboration.",
  download_mo_ai_studio: "Download Mo AI Studio",
  see_what_mo_can_do: "Let's see what Mo can do!",
  mo_modify_website: "Mo Modifies Website",
  mo_refactor_large_file: "Mo Refactors 700-line Large File",
  mo_generate_i18n: "Mo Generates i18n Multilingual Translation",
  mo_can_do_more: "Mo can do much more than this, want to know more?",
  // New translations
  login_failed: "Login failed",
  login_error_log: "Login error:",
  login_error: "An error occurred during login",
  welcome_register_mobenai: "Welcome to register Mobenai Development",
  enterprise_name: "Enterprise Name",
  enter_enterprise_name: "Enter your enterprise name",
  phone_number: "Phone Number",
  enter_phone_number: "Enter your phone number",
  verification_code: "Verification Code",
  enter_verification_code: "Enter verification code",
  resend_code_countdown: "Resend in {{seconds}}s",
  send_verification_code: "Send Code",
  enter_password: "Enter your password",
  agree_terms_and_policy: "I agree to the ",
  terms_of_service: "Terms of Service",
  and: " and ",
  privacy_policy: "Privacy Policy",
  already_have_account: "Already have an account? ",
  register_success: "Registration Successful",
  register_success_message:
    "Enterprise registration successful. Please log in again. The default account is admin, and the password is the one you just set.",
  i_know: "I understand",
  enterprise_name_required: "Enterprise name is required",
  phone_required: "Phone number is required",
  sms_code_required: "Verification code is required",
  password_min_length: "Password must be at least 8 characters long",
  password_letter_required: "Password must contain at least one letter",
  password_number_required: "Password must contain at least one number",
  agree_terms_required: "Please agree to the terms of service and privacy policy",
  sms_sent: "Verification code sent",
  // Added translation
  magic_wand_error: "An error occurred while processing the magic wand request",
};