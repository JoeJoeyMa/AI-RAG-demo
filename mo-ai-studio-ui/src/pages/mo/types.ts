export interface RoleCard {
  id: string
  name: string
  constraint: string
  instruction: string
  variables: Record<string, {
    name: string
    setter: string
    value: any
  }>
  outputProcessor: string
  isDefault: boolean
  baseModel: string
  temperature: number
  customInstructions?: Array<{
    prefix: string
    instruction: string
  }>
}