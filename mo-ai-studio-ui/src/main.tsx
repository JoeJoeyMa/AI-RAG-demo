import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.tsx"
import { Provider } from "./provider.tsx"
import "./styles/globals.css"
import "./styles/github-markdown.css"
import { Toaster } from "sonner"
import "./i18n.js"
import "./globalStore.ts"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider>
      <App />
      <Toaster expand={true} richColors closeButton></Toaster>
    </Provider>
  </BrowserRouter>
)
