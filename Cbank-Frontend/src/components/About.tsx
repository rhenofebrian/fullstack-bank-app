import { motion } from "framer-motion";
import { offices } from "../data";
import { Building2, Users, CreditCard, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-white ">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-full mx-auto text-center mb-16 md:mb-24 px-4">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            {/* <BlurText
              text="Transforming banking through digital  innovation across global markets"
              delay={100}
              animateBy="letters"
              direction="top"
              className="font-cabinet text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-snug whitespace-nowrap"
            /> */}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400"
          >
            From a local fintech startup to a global banking powerhouse
          </motion.p>
        </div>

        {/* Our Offices Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider">
            Global Banking Centers
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
        </motion.div>

        {/* Offices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24">
          {offices.map((office, index) => {
            const MapComponent = office.mapComponent;

            return (
              <motion.div
                key={office.region}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 2 }}
                className="relative"
              >
                {/* Location Card */}
                <div className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  {/* Map Container */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <div className="absolute inset-0 transform transition-transform duration-500 group-hover:scale-105">
                      <MapComponent
                        dotPosition={{
                          x: office.coordinates.x,
                          y: office.coordinates.y,
                        }}
                        cityName={office.city}
                      />
                    </div>

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-blue-600/0 transition-colors duration-300 group-hover:bg-blue-600/10"></div>
                  </div>

                  {/* Office Info */}
                  <div className="p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                        {office.city}
                      </h2>
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-3 py-1 rounded-full w-fit">
                        Est. {office.established}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                      <Building2 className="h-4 w-4 flex-shrink-0 mr-2" />
                      <p className="text-sm">{office.address}</p>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Banking Services
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {office.services.map((service) => (
                          <span
                            key={service}
                            className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 text-center"
        >
          {[
            {
              label: "Active Accounts",
              value: "10M+",
              icon: <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />,
            },
            {
              label: "Countries Served",
              value: "15+",
              icon: <Globe className="h-6 w-6 mx-auto mb-2 text-blue-500" />,
            },
            {
              label: "Annual Transactions",
              value: "$50B+",
              icon: (
                <CreditCard className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              ),
            },
            {
              label: "Banking Professionals",
              value: "1,000+",
              icon: (
                <Building2 className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              ),
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 3 }}
              className="group p-5 md:p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 dark:border-gray-800"
            >
              <div className="transform transition-transform duration-300 group-hover:scale-110">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.5 }}
          className="max-w-2xl mx-auto text-center mt-16 md:mt-24"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6">
            Our mission is to revolutionize banking through secure, accessible,
            and innovative financial solutions
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            We're building the future of banking where managing your finances is
            as simple as a tap on your phone.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
