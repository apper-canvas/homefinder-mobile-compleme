import savedPropertiesData from '../mockData/savedProperties.json'

// Utility function for delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock saved properties data store
let savedProperties = [...savedPropertiesData]

const savedPropertyService = {
  async getAll() {
    await delay(250)
    return [...savedProperties]
  },

  async getById(id) {
    await delay(200)
    const savedProperty = savedProperties.find(sp => sp.id === id)
    if (!savedProperty) {
      throw new Error('Saved property not found')
    }
    return { ...savedProperty }
  },

  async create(savedPropertyData) {
    await delay(300)
    const newSavedProperty = {
      ...savedPropertyData,
      id: Date.now().toString(),
      savedDate: savedPropertyData.savedDate || new Date().toISOString()
    }
    savedProperties.push(newSavedProperty)
    return { ...newSavedProperty }
  },

  async update(id, updateData) {
    await delay(300)
    const index = savedProperties.findIndex(sp => sp.id === id)
    if (index === -1) {
      throw new Error('Saved property not found')
    }
    savedProperties[index] = { ...savedProperties[index], ...updateData }
    return { ...savedProperties[index] }
  },

  async delete(id) {
    await delay(250)
    const index = savedProperties.findIndex(sp => sp.id === id)
    if (index === -1) {
      throw new Error('Saved property not found')
    }
    const deletedSavedProperty = savedProperties.splice(index, 1)[0]
    return { ...deletedSavedProperty }
  }
}

export default savedPropertyService