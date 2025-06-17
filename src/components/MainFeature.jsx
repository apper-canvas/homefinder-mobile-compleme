import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { Slider } from './ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import propertyService from '../services/api/propertyService'
import savedPropertyService from '../services/api/savedPropertyService'

const MainFeature = () => {
  const [properties, setProperties] = useState([])
  const [savedProperties, setSavedProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 2000000],
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    location: '',
    minSquareFeet: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  // Load properties on mount
  useEffect(() => {
    loadProperties()
    loadSavedProperties()
  }, [])

  const loadProperties = async () => {
    setLoading(true)
    try {
      const result = await propertyService.getAll()
      setProperties(result || [])
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const loadSavedProperties = async () => {
    try {
      const result = await savedPropertyService.getAll()
      setSavedProperties(result || [])
    } catch (err) {
      console.error('Failed to load saved properties:', err)
    }
  }

  const handleSaveProperty = async (propertyId) => {
    try {
      const isAlreadySaved = savedProperties.some(saved => saved.propertyId === propertyId)
      
      if (isAlreadySaved) {
        const savedProperty = savedProperties.find(saved => saved.propertyId === propertyId)
        await savedPropertyService.delete(savedProperty.id)
        setSavedProperties(prev => prev.filter(saved => saved.propertyId !== propertyId))
        toast.success('Property removed from favorites')
      } else {
        const newSaved = await savedPropertyService.create({
          propertyId,
          savedDate: new Date().toISOString()
        })
        setSavedProperties(prev => [...prev, newSaved])
        toast.success('Property saved to favorites')
      }
    } catch (err) {
      toast.error('Failed to update saved properties')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const filteredProperties = properties.filter(property => {
    if (!property) return false
    
    const matchesPrice = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1]
    const matchesBedrooms = !filters.bedrooms || property.bedrooms >= parseInt(filters.bedrooms)
    const matchesBathrooms = !filters.bathrooms || property.bathrooms >= parseFloat(filters.bathrooms)
    const matchesType = !filters.propertyType || property.propertyType === filters.propertyType
    const matchesLocation = !filters.location || 
      property.address?.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
      property.address?.state?.toLowerCase().includes(filters.location.toLowerCase()) ||
      property.address?.zipCode?.includes(filters.location)
    const matchesSquareFeet = !filters.minSquareFeet || property.squareFeet >= parseInt(filters.minSquareFeet)
    
    return matchesPrice && matchesBedrooms && matchesBathrooms && matchesType && matchesLocation && matchesSquareFeet
  })

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 2000000],
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      location: '',
      minSquareFeet: ''
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const PropertyCard = ({ property }) => {
    const isSaved = savedProperties.some(saved => saved.propertyId === property.id)
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="property-card-hover"
      >
        <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-property-card hover:shadow-2xl transition-all duration-300 rounded-3xl">
          <div className="relative">
            <div className="relative h-64 overflow-hidden rounded-t-3xl">
              <img
                src={property.images?.[0] || '/api/placeholder/400/300'}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Save Button */}
              <button
                onClick={() => handleSaveProperty(property.id)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all ${
                  isSaved 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <ApperIcon name="Heart" className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              
              {/* Property Type Badge */}
              <Badge className="absolute top-4 left-4 bg-primary/90 text-white border-0 px-3 py-1">
                {property.propertyType}
              </Badge>
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-surface-900 line-clamp-1">
                  {property.title}
                </h3>
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(property.price)}
                </div>
              </div>
              
              <div className="flex items-center text-surface-600 mb-4">
                <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
                <span className="text-sm line-clamp-1">
                  {property.address?.street}, {property.address?.city}, {property.address?.state}
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-surface-600">
                  <div className="flex items-center">
                    <ApperIcon name="Bed" className="h-4 w-4 mr-1" />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Bath" className="h-4 w-4 mr-1" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Square" className="h-4 w-4 mr-1" />
                    <span>{property.squareFeet?.toLocaleString()} sqft</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-surface-500">
                  Listed {new Date(property.listingDate).toLocaleDateString()}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setSelectedProperty(property)
                        setCurrentImageIndex(0)
                      }}
                      className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white border-0 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  {selectedProperty && (
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl border-0 shadow-2xl">
                      <PropertyDetailsModal property={selectedProperty} />
                    </DialogContent>
                  )}
                </Dialog>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    )
  }

  const PropertyDetailsModal = ({ property }) => (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-surface-900">
          {property.title}
        </DialogTitle>
        <div className="flex items-center text-surface-600">
          <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
          <span>{property.address?.street}, {property.address?.city}, {property.address?.state} {property.address?.zipCode}</span>
        </div>
      </DialogHeader>
      
      {/* Image Gallery */}
      <div className="relative">
        <div className="h-80 overflow-hidden rounded-2xl">
          <img
            src={property.images?.[currentImageIndex] || '/api/placeholder/800/400'}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {property.images?.length > 1 && (
          <div className="flex space-x-2 mt-4 overflow-x-auto scrollbar-hide">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Property Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-surface-600">Price:</span>
              <span className="font-semibold text-primary text-xl">{formatPrice(property.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-600">Bedrooms:</span>
              <span className="font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-600">Bathrooms:</span>
              <span className="font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-600">Square Feet:</span>
              <span className="font-medium">{property.squareFeet?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-600">Property Type:</span>
              <span className="font-medium">{property.propertyType}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Features</h3>
          <div className="flex flex-wrap gap-2">
            {property.features?.map((feature, index) => (
              <Badge key={index} variant="secondary" className="bg-surface-100 text-surface-700">
                {feature}
              </Badge>
            ))}
          </div>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Agent Information</h3>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="font-medium">{property.agent?.name}</div>
              <div className="text-sm text-surface-600">{property.agent?.email}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Description</h3>
        <p className="text-surface-600 leading-relaxed">{property.description}</p>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <ApperIcon name="Home" className="h-8 w-8 text-primary" />
          </div>
          <p className="text-surface-600">Loading properties...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-500" />
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadProperties} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Discover Amazing Properties
        </h2>
        <p className="text-surface-600 text-lg max-w-2xl mx-auto">
          Browse through our curated collection of premium properties and find your perfect home
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-filter-panel border border-surface-200/50 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Search" className="h-5 w-5 text-surface-400" />
              <Input
                placeholder="Search by location..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-64 bg-surface-50/50 border-surface-200/50 focus:border-primary/50 rounded-xl"
              />
            </div>
            
            <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange('propertyType', value)}>
              <SelectTrigger className="w-40 bg-surface-50/50 border-surface-200/50 rounded-xl">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Condo">Condo</SelectItem>
                <SelectItem value="Townhouse">Townhouse</SelectItem>
              </SelectContent>
            </Select>
            
            <Collapsible open={showFilters} onOpenChange={setShowFilters}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 rounded-xl">
                  <ApperIcon name="Filter" className="h-4 w-4 mr-2" />
                  More Filters
                  <ApperIcon name={showFilters ? "ChevronUp" : "ChevronDown"} className="h-4 w-4 ml-2" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-surface-50/50 rounded-2xl">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price Range</label>
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => handleFilterChange('priceRange', value)}
                      max={2000000}
                      min={0}
                      step={50000}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs text-surface-600">
                      <span>{formatPrice(filters.priceRange[0])}</span>
                      <span>{formatPrice(filters.priceRange[1])}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Min Bedrooms</label>
                      <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange('bedrooms', value)}>
                        <SelectTrigger className="bg-white/50">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any</SelectItem>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Min Bathrooms</label>
                      <Select value={filters.bathrooms} onValueChange={(value) => handleFilterChange('bathrooms', value)}>
                        <SelectTrigger className="bg-white/50">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any</SelectItem>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="1.5">1.5+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Min Square Feet</label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={filters.minSquareFeet}
                      onChange={(e) => handleFilterChange('minSquareFeet', e.target.value)}
                      className="bg-white/50"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              className="text-surface-600 hover:text-surface-900"
            >
              Clear All
            </Button>
            
            <div className="flex items-center bg-surface-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm text-primary' 
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                <ApperIcon name="Grid3X3" className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm text-primary' 
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                <ApperIcon name="List" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-surface-600">
            Showing <span className="font-medium">{filteredProperties.length}</span> of{' '}
            <span className="font-medium">{properties.length}</span> properties
          </p>
          
          {Object.values(filters).some(value => 
            (Array.isArray(value) && (value[0] !== 0 || value[1] !== 2000000)) ||
            (!Array.isArray(value) && value !== '')
          ) && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Filters Applied
            </Badge>
          )}
        </div>
      </div>

      {/* Property Grid/List */}
      <AnimatePresence mode="wait">
        {filteredProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-surface-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Search" className="h-12 w-12 text-surface-400" />
            </div>
            <h3 className="text-xl font-semibold text-surface-900 mb-2">No Properties Found</h3>
            <p className="text-surface-600 mb-6">
              Try adjusting your filters to see more results
            </p>
            <Button onClick={clearFilters} className="bg-gradient-to-r from-primary to-primary-dark">
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }
          >
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature