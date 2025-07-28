import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const services = [
    {
      title: 'Salesforce Implementation',
      description: 'Complete Salesforce setup and configuration tailored to your business needs.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: '/services#implementation',
    },
    {
      title: 'Custom Development',
      description: 'Bespoke Salesforce solutions and custom applications built to your specifications.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      href: '/services#development',
    },
    {
      title: 'Integration Services',
      description: 'Seamless integration with your existing systems and third-party applications.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      href: '/services#integration',
    },
    {
      title: 'Training & Support',
      description: 'Comprehensive training programs and ongoing support for your team.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      href: '/services#training',
    },
  ]

  const stats = [
    { label: 'Projects Completed', value: '150+' },
    { label: 'Happy Clients', value: '75+' },
    { label: 'Years Experience', value: '8+' },
    { label: 'Success Rate', value: '98%' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container-custom relative z-10">
          <div className="py-24 md:py-32 lg:py-40">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Expert Salesforce Consulting for{' '}
                <span className="gradient-text">Modern Businesses</span>
              </h1>
              <p className="text-xl md:text-2xl text-neutral-200 mb-8 max-w-3xl mx-auto">
                We help businesses maximize their Salesforce investment with custom solutions, 
                expert implementation, and ongoing optimization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="btn-secondary text-lg px-8 py-4">
                  Get Started Today
                </Link>
                <Link to="/case-studies" className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600">
                  View Case Studies
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-neutral-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Our Services
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Comprehensive Salesforce solutions designed to transform your business operations 
              and drive growth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card-hover p-8 text-center group">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors duration-200">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                <p className="text-neutral-600 mb-6">{service.description}</p>
                <Link
                  to={service.href}
                  className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                >
                  Learn More
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help you maximize your Salesforce investment 
            and achieve your business goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn bg-white text-primary-600 hover:bg-neutral-100 text-lg px-8 py-4">
              Schedule a Consultation
            </Link>
            <Link to="/services" className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600">
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 