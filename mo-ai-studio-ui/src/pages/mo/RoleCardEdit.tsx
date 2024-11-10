import React, { useState, useEffect } from "react"
import {
  Button,
  Input,
  Textarea,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Slider,
  Card,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react"
import { Icon } from "@iconify/react"
import { variableSetters } from "./setter/variableSetters"
import { message } from "@/components/Message"
import { z } from "zod"
import { RoleCard } from "./types"
import { modelConfig } from "./DevChatModelConfig"
import { useTranslation } from "react-i18next"
import { getOutputProcessorOptions } from "./outputProcessors"

const variableSchema = z.object({
  name: z.string().min(1, "variable_name_required"),
  setter: z.string().min(1, "setter_required"),
})

const customInstructionSchema = z.object({
  prefix: z.string().min(1, "instruction_prefix_required"),
  instruction: z.string().min(1, "instruction_content_required"),
})

const roleCardSchema = z.object({
  name: z.string().min(1, "role_name_required"),
  constraint: z.string().min(1, "constraint_required"),
  instruction: z.string().min(1, "instruction_required"),
  variables: z.record(variableSchema),
  outputProcessor: z.string().optional(),
  baseModel: z.string().min(1, "base_model_required"),
  temperature: z.number().min(0).max(2),
  customInstructions: z.array(customInstructionSchema),
})

const temperaturePresets = [
  { label: "code_generation", value: 0.0 },
  { label: "data_extraction", value: 0.7 },
  { label: "general_conversation", value: 1.0 },
  { label: "translation", value: 1.1 },
  { label: "creative_writing", value: 1.25 },
]

const RoleCardEdit = ({
  card,
  onSave,
  onClose,
  chatForMagicWand,
}: {
  card: RoleCard | null
  onSave: (card: RoleCard) => void
  onClose: () => void
  chatForMagicWand: (input: string, field: string, onChunk: (chunk: string) => void) => Promise<void>
}) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<RoleCard>({
    id: "",
    name: "",
    constraint: "",
    instruction: "",
    variables: {},
    outputProcessor: "",
    isDefault: false,
    baseModel: "",
    temperature: 1.0,
    customInstructions: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [magicWandField, setMagicWandField] = useState<"constraint" | "instruction" | null>(null)
  const [magicWandInput, setMagicWandInput] = useState("")
  const { isOpen: isMagicWandOpen, onOpen: onMagicWandOpen, onClose: onMagicWandClose } = useDisclosure()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (card) {
      setFormData({
        ...card,
        variables: { ...card.variables },
        temperature: card.temperature !== undefined ? card.temperature : 1.0,
        customInstructions: card.customInstructions || [],
      })
    } else {
      setFormData({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: "",
        constraint: "",
        instruction: "",
        variables: {},
        outputProcessor: "",
        isDefault: false,
        baseModel: "",
        temperature: 1.0,
        customInstructions: [],
      })
    }
    setErrors({})
  }, [card])

  const validateForm = () => {
    try {
      roleCardSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          newErrors[err.path.join(".")] = t(err.message)
        })
        console.log(newErrors)
        setErrors(newErrors)
      }
      return false
    }
  }

  const validateField = (field: string, value: any) => {
    try {
      roleCardSchema.shape[field].parse(value)
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: t(error.errors[0].message) }))
      }
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const handleVariableChange = (name: string, field: string, value: any) => {
    console.log("name, field, value", name, field, value)
    setFormData((prev) => ({
      ...prev,
      variables: {
        ...prev.variables,
        [name]: {
          ...prev.variables[name],
          [field]: value,
        },
      },
    }))
    validateField(`variables.${name}.${field}`, value)
  }

  const handleAddVariable = () => {
    const newVarName = `var_${Object.keys(formData.variables).length + 1}`
    setFormData((prev) => ({
      ...prev,
      variables: {
        ...prev.variables,
        [newVarName]: { name: newVarName, setter: "textSetter", value: "" },
      },
    }))
  }

  const handleRemoveVariable = (name: string) => {
    setFormData((prev) => {
      const newVariables = { ...prev.variables }
      delete newVariables[name]
      return { ...prev, variables: newVariables }
    })
  }

  const handleAddCustomInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      customInstructions: [...prev.customInstructions, { prefix: "", instruction: "" }],
    }))
  }

  const handleRemoveCustomInstruction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customInstructions: prev.customInstructions.filter((_, i) => i !== index),
    }))
  }

  const handleCustomInstructionChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      customInstructions: prev.customInstructions.map((instruction, i) =>
        i === index ? { ...instruction, [field]: value } : instruction
      ),
    }))
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
    } else {
      message.error(t("fill_all_required_fields"))
    }
  }

  const handleTemperatureChange = (value: number) => {
    handleInputChange("temperature", value)
  }

  const handleTemperaturePresetChange = (value: string) => {
    const preset = temperaturePresets.find((p) => p.label === value)
    if (preset) {
      handleInputChange("temperature", preset.value)
    }
  }

  const handleMagicWandClick = (field: "constraint" | "instruction") => {
    setMagicWandField(field)
    setMagicWandInput("")
    onMagicWandOpen()
  }

  const handleMagicWandConfirm = async () => {
    if (!magicWandField || !magicWandInput) return

    setIsProcessing(true)
    try {
      await chatForMagicWand(magicWandInput, magicWandField, (chunk) => {
        setFormData((prev) => ({
          ...prev,
          [magicWandField]: prev[magicWandField] + chunk,
        }))
      })
    } catch (error) {
      console.error("Magic wand processing error:", error)
      message.error(t("magic_wand_error"))
    } finally {
      setIsProcessing(false)
      onMagicWandClose()
    }
  }

  if (formData.isDefault) {
    return (
      <>
        <ModalHeader>{t("view_default_role")}</ModalHeader>
        <ModalBody>
          <p>{t("default_role_notice")}</p>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onPress={onClose}>
            {t("close")}
          </Button>
        </ModalFooter>
      </>
    )
  }

  return (
    <>
      <ModalHeader>{card ? t("edit_role") : t("add_new_role")}</ModalHeader>
      <ModalBody>
        <Input
          label={t("role_name")}
          placeholder={t("enter_role_name")}
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className='mb-4'
          isInvalid={!!errors.name}
          errorMessage={errors.name}
        />
        <div className='mb-4 relative'>
          <Textarea
            label={t("constraint")}
            placeholder={t("enter_constraint")}
            value={formData.constraint}
            onChange={(e) => handleInputChange("constraint", e.target.value)}
            minRows={3}
            isInvalid={!!errors.constraint}
            errorMessage={errors.constraint}
          />
          <Button
            isIconOnly
            color='primary'
            variant='light'
            onPress={() => handleMagicWandClick("constraint")}
            className='absolute top-0 right-0'
          >
            <Icon icon='mdi:magic' />
          </Button>
        </div>
        <div className='mb-4 relative'>
          <Textarea
            label={t("instruction")}
            placeholder={t("enter_instruction")}
            value={formData.instruction}
            onChange={(e) => handleInputChange("instruction", e.target.value)}
            minRows={3}
            isInvalid={!!errors.instruction}
            errorMessage={errors.instruction}
          />
          <Button
            isIconOnly
            color='primary'
            variant='light'
            onPress={() => handleMagicWandClick("instruction")}
            className='absolute top-0 right-0'
          >
            <Icon icon='mdi:magic' />
          </Button>
        </div>
        <div className='mb-4'>
          <h4 className='font-semibold mb-2'>{t("custom_variables")}</h4>
          {Object.entries(formData.variables).map(([name, variable]) => (
            <div key={name} className='flex items-center gap-2 mb-2'>
              <Input
                placeholder={t("variable_name")}
                value={variable.name}
                onValueChange={(value) => console.log(value)}
                onChange={(e) => handleVariableChange(name, "name", e.target.value)}
                isInvalid={!!errors[`variables.${name}.name`]}
                errorMessage={errors[`variables.${name}.name`]}
              />
              <Select
                selectedKeys={[variable.setter]}
                onChange={(e) => handleVariableChange(name, "setter", e.target.value)}
              >
                {Object.entries(variableSetters).map(([key, setter]) => (
                  <SelectItem key={key} value={key}>
                    {t(setter.name)}
                  </SelectItem>
                ))}
              </Select>
              <Button isIconOnly color='danger' variant='light' onPress={() => handleRemoveVariable(name)}>
                <Icon icon='mdi:delete' />
              </Button>
            </div>
          ))}
          <Button variant='flat' size='sm' onPress={handleAddVariable}>
            {t("add_variable")}
          </Button>
        </div>
        <div className='mb-4'>
          <h4 className='font-semibold mb-2'>{t("custom_instructions")}</h4>
          {formData.customInstructions.map((instruction, index) => (
            <Card key={index} className='p-4 mb-2'>
              <div className='flex items-center gap-2 mb-2'>
                <Input
                  placeholder={t("instruction_prefix")}
                  value={instruction.prefix}
                  onChange={(e) => handleCustomInstructionChange(index, "prefix", e.target.value)}
                  className='flex-grow'
                />
                <Button isIconOnly color='danger' variant='light' onPress={() => handleRemoveCustomInstruction(index)}>
                  <Icon icon='mdi:delete' />
                </Button>
              </div>
              <Textarea
                placeholder={t("instruction_content")}
                value={instruction.instruction}
                onChange={(e) => handleCustomInstructionChange(index, "instruction", e.target.value)}
                minRows={2}
              />
            </Card>
          ))}
          <Button variant='flat' size='sm' onPress={handleAddCustomInstruction}>
            {t("add_custom_instruction")}
          </Button>
        </div>
        <Select
          label={t("select_output_processor")}
          placeholder={t("select_output_processor")}
          selectedKeys={[formData.outputProcessor]}
          onChange={(e) => handleInputChange("outputProcessor", e.target.value)}
          className='mb-4'
        >
          {getOutputProcessorOptions().map((option) => (
            <SelectItem key={option.key} value={option.value}>
              {t(option.label)}
            </SelectItem>
          ))}
        </Select>
        <Select
          label={t("select_base_model")}
          placeholder={t("select_base_model")}
          selectedKeys={[formData.baseModel]}
          onChange={(e) => handleInputChange("baseModel", e.target.value)}
          className='mb-4'
          isInvalid={!!errors.baseModel}
          errorMessage={errors.baseModel}
        >
          {Object.entries(modelConfig.models).map(([key, model]) => (
            <SelectItem key={key} value={key}>
              {model.name}
            </SelectItem>
          ))}
        </Select>
        <div className='mb-4'>
          <h4 className='font-semibold mb-2'>{t("temperature_setting")}</h4>
          <Slider
            label={t("temperature")}
            step={0.01}
            maxValue={2}
            minValue={0}
            value={formData.temperature}
            onChange={handleTemperatureChange}
            className='max-w-md'
          />
          <Select
            label={t("quick_setting")}
            placeholder={t("select_preset_temperature")}
            selectedKeys={[temperaturePresets.find((p) => p.value === formData.temperature)?.label || ""]}
            onChange={(e) => handleTemperaturePresetChange(e.target.value)}
            className='mt-2'
          >
            {temperaturePresets.map((preset) => (
              <SelectItem key={preset.label} value={preset.label}>
                {t(preset.label)}
              </SelectItem>
            ))}
          </Select>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color='danger' variant='light' onPress={onClose} startContent={<Icon icon='mdi:close' />}>
          {t("cancel")}
        </Button>
        <Button color='primary' onPress={handleSave} startContent={<Icon icon='mdi:content-save' />}>
          {t("save")}
        </Button>
      </ModalFooter>

      <Modal isOpen={isMagicWandOpen} onClose={onMagicWandClose}>
        <ModalContent>
          <ModalHeader>{t("magic_wand")}</ModalHeader>
          <ModalBody>
            <Textarea
              label={t("enter_magic_wand_input")}
              placeholder={t("magic_wand_placeholder")}
              value={magicWandInput}
              onChange={(e) => setMagicWandInput(e.target.value)}
              minRows={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={onMagicWandClose}>
              {t("cancel")}
            </Button>
            <Button color='primary' onPress={handleMagicWandConfirm} isLoading={isProcessing}>
              {t("confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default RoleCardEdit