import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'glass-effect shadow-lg backdrop-blur-xl' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg">
                <ApperIcon name="Home" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  HomeFinder Pro
                </h1>
                <p className="text-xs text-surface-600 hidden sm:block">Find Your Perfect Home</p>
              </div>
            </motion.div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-surface-700 hover:text-primary transition-colors font-medium">
                Properties
              </a>
              <a href="#" className="text-surface-700 hover:text-primary transition-colors font-medium">
                Agents
              </a>
              <a href="#" className="text-surface-700 hover:text-primary transition-colors font-medium">
                About
              </a>
            </nav>

            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden sm:flex items-center space-x-2 hover:bg-primary/10 hover:text-primary transition-all"
              >
                <ApperIcon name="Heart" className="h-4 w-4" />
                <span>Saved</span>
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <ApperIcon name="User" className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-surface-50/30 to-primary/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge 
                variant="secondary" 
                className="mb-6 px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20 hover:shadow-lg transition-all"
              >
                <ApperIcon name="TrendingUp" className="h-4 w-4 mr-2" />
                Over 10,000+ Properties Available
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Find Your
                <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Dream Home
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-surface-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Discover the perfect property with our advanced search tools, detailed listings, and expert guidance. Your next home is just a click away.
              </p>

              {/* Quick Search */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="flex flex-col sm:flex-row gap-3 p-3 bg-white rounded-2xl shadow-property-card border border-surface-200/50">
                  <div className="flex-1 relative">
                    <ApperIcon name="MapPin" className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
                    <Input 
                      placeholder="Enter city, neighborhood, or ZIP code..."
                      className="pl-12 pr-4 py-3 border-0 bg-transparent text-base placeholder:text-surface-400 focus:ring-0 focus:border-0"
                    />
                  </div>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-lg hover:shadow-xl transition-all transform hover:scale-105 px-8 py-3"
                  >
                    <ApperIcon name="Search" className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                {[
                  { number: '10K+', label: 'Properties', icon: 'Home' },
                  { number: '500+', label: 'Agents', icon: 'Users' },
                  { number: '50+', label: 'Cities', icon: 'MapPin' },
                  { number: '99%', label: 'Satisfaction', icon: 'Star' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-surface-200/30 hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <ApperIcon name={stat.icon} className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-surface-900 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-surface-600 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Feature Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MainFeature />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center">
                  <ApperIcon name="Home" className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">HomeFinder Pro</h3>
                  <p className="text-surface-400 text-sm">Find Your Perfect Home</p>
                </div>
              </div>
              <p className="text-surface-300 mb-6 max-w-md leading-relaxed">
                The most comprehensive real estate platform to help you find, compare, and secure your dream property with confidence.
              </p>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'Instagram', 'Linkedin'].map((social) => (
                  <button
                    key={social}
                    className="w-10 h-10 bg-surface-800 hover:bg-primary rounded-xl flex items-center justify-center transition-colors"
                  >
                    <ApperIcon name={social} className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3 text-surface-300">
                <li><a href="#" className="hover:text-white transition-colors">Browse Properties</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Find Agents</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Market Reports</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mortgage Calculator</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-surface-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-surface-800 mt-12 pt-8 text-center text-surface-400">
            <p>&copy; 2024 HomeFinder Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home