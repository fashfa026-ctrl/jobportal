import React from 'react';
import { employerFeatures, jobSeekerFeatures } from "../../utils/data";

const Features = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Everything You Need to  
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Succeed
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
            Whether you're looking for your next opportunity or the perfect 
            candidate, we have the tools and features to make it happen.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">

          {/* Job Seekers Section */}
          <div>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                For Job Seekers
              </h3>

              {/* FIXED div */}
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-8">
              {jobSeekerFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="group flex items-start space-x-4 p-6 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-950/20 border border-transparent dark:hover:border-blue-900/10 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-950/50 rounded-xl flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900 transition-colors">
                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employers Section */}
          <div>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                For Employers
              </h3>

              {/* FIXED typo t0 → to */}
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-purple-600 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-8">
              {employerFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="group flex items-start space-x-4 p-6 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-950/20 border border-transparent dark:hover:border-purple-900/10 transition-all duration-300 cursor-pointer"
                >
                  {/* FIXED fex → flex */}
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-950/50 rounded-xl flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900 transition-colors">
                    <feature.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;