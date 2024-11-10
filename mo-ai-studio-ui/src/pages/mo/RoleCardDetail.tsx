import React from "react"
import { Button, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react"
import { Icon } from "@iconify/react"
import ReactMarkdown from "react-markdown"
import { variableSetters } from "./setter/variableSetters"
import { useTranslation } from "react-i18next"

const format = (input) => {
  return new String(input).toString()
}

const RoleCardDetail = ({ card, onClose }) => {
  const { t } = useTranslation()

  return (
    <>
      <ModalHeader className='flex flex-col gap-1'>{card.name}</ModalHeader>
      <ModalBody>
        <div className='space-y-4'>
          <div>
            <h4 className='font-semibold mb-2'>{t("constraint")}：</h4>
            <div className='bg-gray-100 p-3 rounded-md overflow-auto max-h-60'>
              <ReactMarkdown>{card.constraint}</ReactMarkdown>
            </div>
          </div>
          <div>
            <h4 className='font-semibold mb-2'>{t("instruction")}：</h4>
            <div className='bg-gray-100 p-3 rounded-md overflow-auto max-h-60'>
              <ReactMarkdown>{format(card.instruction)}</ReactMarkdown>
            </div>
          </div>
          <div>
            <h4 className='font-semibold mb-2'>{t("custom_variables")}：</h4>
            <ul className='list-disc list-inside'>
              {Object.entries(card.variables || {}).map(([vName, { name, setter }]) => (
                <li key={name}>
                  {name}: {variableSetters[setter]?.name || t("setter_not_set")}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className='font-semibold mb-2'>{t("output_processor")}：</h4>
            <p>
              {card.outputProcessor === "exaProcessor"
                ? t("exa_search_processor")
                : card.outputProcessor || t("not_set")}
            </p>
          </div>
          <div>
            <h4 className='font-semibold mb-2'>{t("base_model")}：</h4>
            <p>{card.baseModel}</p>
          </div>
          <div>
            <h4 className='font-semibold mb-2'>{t("temperature_setting")}：</h4>
            <p>{card.temperature}</p>
          </div>
          <div>
            <h4 className='font-semibold mb-2'>{t("custom_instructions")}：</h4>
            {card.customInstructions && card.customInstructions.length > 0 ? (
              <ul className='list-disc list-inside'>
                {card.customInstructions.map((instruction, index) => (
                  <li key={index} className='mb-2'>
                    <strong>{t("prefix")}：</strong> {instruction.prefix}
                    <div className='bg-gray-100 p-2 rounded-md mt-1 overflow-auto max-h-60'>
                      <ReactMarkdown>{instruction.instruction}</ReactMarkdown>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{t("no_custom_instructions")}</p>
            )}
          </div>
          {card.isDefault && <p className='text-sm text-gray-500'>{t("default_role_notice")}</p>}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color='primary' onPress={onClose} startContent={<Icon icon='mdi:close' />}>
          {t("close")}
        </Button>
      </ModalFooter>
    </>
  )
}

export default RoleCardDetail
