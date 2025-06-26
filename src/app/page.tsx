'use client'

import { useEffect } from "react";

export default function Home() {
  // return (
      
  //     <div>
        
  //     <div className="login_leftbox">
  //       <div className="login_logo"><img src="/images/logo.png" className="img-fluid" /></div>
  //     </div>
      
      
  //   </div>

      
  // );
  
  return (
    <div>
    {/* Banner Section */}
    <header className="bg-primary text-white text-center py-5">
      <h1>HRMS Dashboard</h1>
      <p className="lead">Your all-in-one solution for HR management</p>
    </header>

    {/* About Section */}
    <section className="container my-5">
      <h2>About Our App</h2>
      <p>
        The HRMS Dashboard simplifies your HR operations with easy-to-use features, 
        seamless employee management, and detailed analytics.
      </p>
    </section>

    {/* Subscription Plans Section */}
    <section className="container my-5">
      <h2>Subscription Plans</h2>
      <div className="row">
        <div className="col-md-4">
          <div className="card border-secondary mb-4">
            <div className="card-body">
              <h3 className="card-title text-primary">Basic Plan</h3>
              <p className="card-text">Price: Free</p>
              <p>Features: Up to 50 employees, basic analytics, and email support.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-secondary mb-4">
            <div className="card-body">
              <h3 className="card-title text-primary">Professional Plan</h3>
              <p className="card-text">Price: $49/month</p>
              <p>Features: Up to 500 employees, advanced reporting, and priority support.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-secondary mb-4">
            <div className="card-body">
              <h3 className="card-title text-primary">Enterprise Plan</h3>
              <p className="card-text">Price: $99/month</p>
              <p>Features: Unlimited employees, custom integrations, and 24/7 support.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Contact Section */}
    <section className="container my-5">
      <h2>Contact Us</h2>
      <p>Have questions or need help? Reach out to us at:</p>
      <p>Email: <a href="mailto:support@hrmsdashboard.com">support@hrmsdashboard.com</a></p>
      <p>Phone: +1 123-456-7890</p>
    </section>

    {/* Footer */}
    <footer className="bg-dark text-white text-center py-3">
      <p>&copy; 2025 HRMS Dashboard | <a href="#" className="text-info">Privacy Policy</a></p>
    </footer>
  </div>
  );
}
