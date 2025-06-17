import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-blue-50/30">
      <div className="text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <ApperIcon name="Home" className="h-12 w-12 text-primary" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-surface-200 mb-4">404</h1>
          
          <h2 className="text-2xl md:text-3xl font-bold text-surface-900 mb-4">
            Property Not Found
          </h2>
          
          <p className="text-surface-600 mb-8 leading-relaxed">
            It looks like this property listing has been moved or doesn't exist. 
            Let's help you find your way back to discovering amazing homes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-lg hover:shadow-xl transition-all">
              <Link to="/">
                <ApperIcon name="Home" className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="border-primary/20 text-primary hover:bg-primary/5">
              <ApperIcon name="Search" className="h-5 w-5 mr-2" />
              Search Properties
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound