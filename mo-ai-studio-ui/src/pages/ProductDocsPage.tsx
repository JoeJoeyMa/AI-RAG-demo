import React from "react"
import { useTranslation } from "react-i18next"

function ProductDocsPage() {
  const { t } = useTranslation()

  return (
    <div className='container mx-auto px-4 py-12 md:py-24 lg:py-32 md:px-56 lg:px-72 min-h-screen flex flex-col justify-center'>
      <h1 className='text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center md:text-left'>
        {t("product_docs")}
      </h1>
      <p className='text-lg md:text-xl text-gray-400 mb-12 text-center md:text-left'>
        {t("product_docs_description")}
      </p>
      <div className='mt-12'>
        <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-center md:text-left'>
          {t("getting_started")}
        </h2>
        <p className='text-lg md:text-xl text-gray-400 mb-4 text-center md:text-left'>
          {t("getting_started_description")}
        </p>
      </div>
    </div>
  )
}

export default ProductDocsPage
