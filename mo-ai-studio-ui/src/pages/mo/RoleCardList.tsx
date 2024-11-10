import React, { useState, useEffect, useTransition } from "react"
import {
  Button,
  Card,
  Modal,
  ModalContent,
  useDisclosure,
  Tooltip,
  RadioGroup,
  Radio,
  ModalFooter,
  Spinner,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
} from "@nextui-org/react"
import { localDB } from "@/utils/localDB"
import { message } from "@/components/Message"
import RoleCardDetail from "./RoleCardDetail"
import RoleCardEdit from "./RoleCardEdit"
import { Icon } from "@iconify/react"
import { getVariableSetter } from "./setter/variableSetters"
import { defaultRoleCards } from "./defaultRoleCards"
import { RoleCard } from "./types"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { chatForMagicWand } from "@/service/chat"

const RoleCardList = () => {
  const { t } = useTranslation()
  const [defaultCards, setDefaultCards] = useState<RoleCard[]>([])
  const [userCards, setUserCards] = useState<RoleCard[]>([])
  const [selectedCard, setSelectedCard] = useState<RoleCard | null>(null)
  const [selectedCardId, setSelectedCardId] = useState("")
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState("default")

  useEffect(() => {
    startTransition(() => {
      loadRoleCards()
    })
  }, [])

  const loadRoleCards = () => {
    console.log("loadRoleCards")
    const storedCards = localDB.getItem("roleCards") || []
    const defaultCardValues = localDB.getItem("defaultRoleCardValues") || {}

    const defaultCards = defaultRoleCards.map((card) => ({
      ...card,
      isDefault: true,
      variables: Object.entries(card.variables).reduce((acc, [key, value]) => {
        acc[key] = {
          ...value,
          value: defaultCardValues[card.id]?.[key]?.value || value.value || "",
        }
        return acc
      }, {}),
    }))

    const userCards = storedCards.map((card: RoleCard) => ({
      ...card,
      id: card.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
      isDefault: false,
    }))

    setDefaultCards(defaultCards)
    setUserCards(userCards)

    const storedSelectedCardId = localDB.getItem("selectedRoleCardId") || ""
    setSelectedCardId(storedSelectedCardId)
  }

  const handleAddCard = () => {
    startTransition(() => {
      setSelectedCard(null)
      onEditOpen()
    })
  }

  const handleEditCard = (card: RoleCard) => {
    startTransition(() => {
      setSelectedCard(card)
      onEditOpen()
    })
  }

  const handleViewCard = (card: RoleCard) => {
    startTransition(() => {
      setSelectedCard(card)
      onDetailOpen()
    })
  }

  const handleDeleteCard = (cardToDelete: RoleCard) => {
    startTransition(() => {
      if (cardToDelete.isDefault) {
        message.error(t("default_role_cannot_be_deleted"))
        return
      }
      const updatedCards = userCards.filter((card) => card.id !== cardToDelete.id)
      setUserCards(updatedCards)
      saveRoleCards(updatedCards)
      if (selectedCardId === cardToDelete.id) {
        setSelectedCardId("")
        localDB.setItem("selectedRoleCardId", "")
      }
      message.success(t("role_deleted"))
      // 触发自定义事件来通知 MoToolBar 更新状态
      window.dispatchEvent(new Event("roleCardsUpdated"))
    })
  }

  const handleSaveCard = (updatedCard: RoleCard) => {
    startTransition(() => {
      let updatedCards
      if (selectedCard) {
        updatedCards = userCards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
      } else {
        updatedCards = [...userCards, { ...updatedCard, isDefault: false }]
      }
      setUserCards(updatedCards)
      saveRoleCards(updatedCards)
      onEditClose()
      message.success(t("role_saved"))
      // 触发自定义事件来通知 MoToolBar 更新状态
      window.dispatchEvent(new Event("roleCardsUpdated"))
    })
  }

  const handleSelectCard = (cardId: string) => {
    startTransition(() => {
      setSelectedCardId(cardId)
      localDB.setItem("selectedRoleCardId", cardId)

      // 获取选中的智能体卡片
      const selectedCard = [...defaultCards, ...userCards].find((card) => card.id === cardId)

      // 如果智能体卡片存在且有自定义指令，则将其存储到 localDB 中
      if (selectedCard && selectedCard.customInstructions) {
        const commands = selectedCard.customInstructions.map((instruction) => ({
          key: instruction.prefix,
          name: instruction.prefix,
        }))
        localDB.setItem("currentRoleCommands", commands)
        console.log(selectedCard)
      } else {
        // 如果没有自定义指令，则清空 localDB 中的 currentRoleCommands
        localDB.setItem("currentRoleCommands", [])
      }
    })
  }

  const handleVariableChange = (cardId: string, variableName: string, value: any) => {
    startTransition(() => {
      const updateCards = (cards: RoleCard[]) =>
        cards.map((card) => {
          if (card.id === cardId) {
            return {
              ...card,
              variables: {
                ...card.variables,
                [variableName]: {
                  ...card.variables[variableName],
                  value: value,
                },
              },
            }
          }
          return card
        })

      if (activeTab === "default") {
        setDefaultCards((prevCards) => {
          const updatedCards = updateCards(prevCards)
          const defaultCardValues = localDB.getItem("defaultRoleCardValues") || {}
          defaultCardValues[cardId] = defaultCardValues[cardId] || {}
          defaultCardValues[cardId][variableName] = { value: value }
          localDB.setItem("defaultRoleCardValues", defaultCardValues)
          return updatedCards
        })
      } else {
        setUserCards((prevCards) => {
          const updatedCards = updateCards(prevCards)
          saveRoleCards(updatedCards)
          return updatedCards
        })
      }
    })
  }

  const saveRoleCards = (cards: RoleCard[]) => {
    localDB.setItem("roleCards", cards)
  }

  const handleCopyCard = (card: RoleCard) => {
    startTransition(() => {
      const newCardId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      const newCard: RoleCard = {
        ...card,
        id: newCardId,
        name: `${card.name} (${t("copy")})`,
        isDefault: false,
      }
      const updatedCards = [...userCards, newCard]
      setUserCards(updatedCards)
      saveRoleCards(updatedCards)

      // 复制 savedFileSelections
      const savedFileSelections = localDB.getItem("savedFileSelections") || {}
      if (savedFileSelections[card.id]) {
        savedFileSelections[newCardId] = JSON.parse(JSON.stringify(savedFileSelections[card.id]))
        localDB.setItem("savedFileSelections", savedFileSelections)
      }

      message.success(t("role_copied"))
      // 触发自定义事件来通知 MoToolBar 更新状态
      window.dispatchEvent(new Event("roleCardsUpdated"))
    })
  }

  const handleSaveToFile = () => {
    startTransition(() => {
      const dataStr = JSON.stringify([...defaultCards, ...userCards], null, 2)
      const blob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "roleCards.json"
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  const handleLoadFromFile = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        startTransition(() => {
          try {
            const importedCards = JSON.parse(e.target.result)
            const newDefaultCards = importedCards.filter((card) => card.isDefault)
            const newUserCards = importedCards.filter((card) => !card.isDefault)
            setDefaultCards(newDefaultCards)
            setUserCards(newUserCards)
            saveRoleCards(newUserCards)
            message.success(t("load_roles_from_file"))
            // 触发自定义事件来通知 MoToolBar 更新状态
            window.dispatchEvent(new Event("roleCardsUpdated"))
          } catch (error) {
            console.error("Error loading roles from file:", error)
            message.error(t("error_loading_roles_from_file"))
          }
        })
      }
      reader.readAsText(file)
    }
  }

  const renderCards = (cards: RoleCard[]) => (
    <RadioGroup value={selectedCardId} onValueChange={handleSelectCard}>
      <div className='grid grid-cols-1 gap-4'>
        {cards.map((card) => (
          <div key={card.id}>
            <Card className='p-4'>
              <div className='flex justify-between items-center mb-2'>
                <Radio value={card.id}>{card.name}</Radio>
                {card.isDefault && <span className='text-xs text-gray-500'>{t("default_role")}</span>}
              </div>
              {selectedCardId === card.id && card.variables && (
                <div className='mb-2'>
                  {Object.entries(card.variables).map(([variableName, varConfig]) => {
                    const Setter = getVariableSetter(varConfig.setter).component
                    return (
                      <Card key={`${card.id}-${variableName}`} className='-mt-1'>
                        <CardHeader>{varConfig.name}</CardHeader>
                        <CardBody>
                          <Setter
                            key={varConfig.name}
                            label={varConfig.name}
                            value={varConfig.value}
                            onValueChange={(value) => handleVariableChange(card.id, variableName, value)}
                            className='mb-2'
                            cardId={card.id}
                            variableName={variableName}
                          />
                        </CardBody>
                      </Card>
                    )
                  })}
                </div>
              )}
              <div className='flex justify-end space-x-2'>
                <Tooltip content={t("view")}>
                  <Button isIconOnly variant='light' onPress={() => handleViewCard(card)}>
                    <Icon icon='mdi:eye' />
                  </Button>
                </Tooltip>
                <Tooltip content={t("copy")}>
                  <Button isIconOnly variant='light' onPress={() => handleCopyCard(card)}>
                    <Icon icon='mdi:content-copy' />
                  </Button>
                </Tooltip>
                {!card.isDefault && (
                  <>
                    <Tooltip content={t("edit")}>
                      <Button isIconOnly variant='light' onPress={() => handleEditCard(card)}>
                        <Icon icon='mdi:pencil' />
                      </Button>
                    </Tooltip>
                    <Tooltip content={t("delete")}>
                      <Button
                        isIconOnly
                        color='danger'
                        variant='light'
                        onPress={() => handleDeleteCard(card)}
                        isDisabled={selectedCardId === card.id}
                      >
                        <Icon icon='mdi:delete' />
                      </Button>
                    </Tooltip>
                  </>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </RadioGroup>
  )

  return (
    <motion.div
      animate={{
        opacity: 1,
        transition: { duration: 0.5 },
      }}
    >
      <div className='space-y-4'>
        <div className='sticky top-0 bg-white z-10 p-4 rounded-md border-spacing-1 shadow-md z-50'>
          <div className='flex space-x-2'>
            <Button size='sm' variant='light' onPress={handleAddCard} startContent={<Icon icon='mdi:plus' />}>
              {t("add_new_role")}
            </Button>
            <Button
              size='sm'
              variant='light'
              onPress={handleSaveToFile}
              startContent={<Icon icon='mdi:content-save' />}
            >
              {t("save_roles_to_file")}
            </Button>
            <Button
              size='sm'
              variant='light'
              startContent={<Icon icon='mdi:file-upload' />}
              onPress={() => document.getElementById("fileInput").click()}
            >
              {t("load_roles_from_file")}
            </Button>
            <input
              type='file'
              id='fileInput'
              style={{ display: "none" }}
              accept='application/json'
              onChange={handleLoadFromFile}
            />
          </div>
        </div>
        <Tabs selectedKey={activeTab} onSelectionChange={setActiveTab as any}>
          <Tab key='default' title={t("default_roles")}>
            {renderCards(defaultCards)}
          </Tab>
          <Tab key='custom' title={t("custom_roles")}>
            {renderCards(userCards)}
          </Tab>
        </Tabs>

        <Modal isOpen={isDetailOpen} onClose={onDetailClose} scrollBehavior='inside' size='4xl'>
          <ModalContent className='max-h-[80vh]'>
            <RoleCardDetail card={selectedCard} onClose={onDetailClose} />
          </ModalContent>
        </Modal>

        <Modal isOpen={isEditOpen} onClose={onEditClose} scrollBehavior='inside' size='4xl'>
          <ModalContent className='max-h-[80vh]'>
            <RoleCardEdit
              chatForMagicWand={chatForMagicWand}
              card={selectedCard}
              onSave={handleSaveCard}
              onClose={onEditClose}
            />
          </ModalContent>
        </Modal>
      </div>
    </motion.div>
  )
}

export default RoleCardList