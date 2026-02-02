import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="subtitle">Our Story</span>
          <h1>We Create Memories That Last A Lifetime</h1>
          <p>Triplane is more than a travel agency. We are a team of explorers, storytellers, and dreamers dedicated to bringing the world's beauty to your doorstep.</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <span className="subtitle">Who We Are</span>
              <h2>Redefining The Art Of Travel</h2>
              <p>
                Founded in 2024, Triplane was born from a simple belief: travel should be effortless, immersive, and deeply personal. We've spent years scouting the most breathtaking corners of the globe to curate experiences that go beyond the ordinary.
              </p>
              <p>
                From the hidden alleys of Rome to the pristine peaks of the Himalayas, our mission is to connect you with the soul of every destination. We handle every detail, so you can focus on the moments that matter.
              </p>
              <div style={{ marginTop: '40px' }}>
                <a href="/packages" className="btn btn-primary">Start Your Adventure</a>
              </div>
            </div>
            <div className="mission-image">
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Travelers exploring the desert"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services/Values Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="subtitle" style={{ color: 'var(--accent)' }}>Why Triplane</span>
            <h2>Our Core Principles</h2>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-gem"></i>
              </div>
              <h3>Exclusive Access</h3>
              <p>
                Gain access to private tours, hidden vistas, and boutique experiences that aren't available to the general public.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-user-check"></i>
              </div>
              <h3>Personalized Curation</h3>
              <p>
                No two travelers are alike. We tailor every itinerary to match your unique pace, interests, and style.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-leaf"></i>
              </div>
              <h3>Responsible Tourism</h3>
              <p>
                We believe in leaving a positive footprint. Our tours support local communities and promote environmental preservation.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Seamless Safety</h3>
              <p>
                Your security is paramount. We provide 24/7 global support and partner only with verified, high-end operators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="subtitle">The Visionaries</span>
            <h2>Behind The Triplane Experience</h2>
          </div>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" alt="Rudraksh Singh" />
              </div>
              <h3>Rudraksh Singh</h3>
              <p className="member-role">Founder & CEO</p>
              <p className="member-bio">Visionary leader with a passion for uncovering the world's most exclusive destinations.</p>
            </div>
            <div className="team-member">
              <div className="member-photo">
                <img src="/assets/arun.png" alt="Arun Vashisth" />
              </div>
              <h3>Arun Vashisth</h3>
              <p className="member-role">Creative Director</p>
              <p className="member-bio">Arun curates our tour itineraries with an eye for the most photogenic and immersive locations.</p>
            </div>
            <div className="team-member">
              <div className="member-photo">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop" alt="Tushar Sharma" />
              </div>
              <h3>Tushar Sharma</h3>
              <p className="member-role">Lead Photographer</p>
              <p className="member-bio">Expert in visual storytelling, capturing the soul of every journey we undertake.</p>
            </div>
            <div className="team-member">
              <div className="member-photo">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop" alt="Tushar Kadian" />
              </div>
              <h3>Tushar Kadian</h3>
              <p className="member-role">Operations Manager</p>
              <p className="member-bio">Ensuring that every logistics detail is handled with precision and care.</p>
            </div>
            <div className="team-member">
              <div className="member-photo">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop" alt="Anirudh" />
              </div>
              <h3>Anirudh</h3>
              <p className="member-role">Customer Experience</p>
              <p className="member-bio">Dedicated to ensuring that our guests have a seamless and unforgettable voyage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <h2>Ready To Rewrite Your Travel Story?</h2>
          <p>Join the thousands of happy travelers who have discovered the world differently.</p>
          <div style={{ marginTop: '40px' }}>
            <a href="/packages" className="btn" style={{ background: 'white', color: 'var(--accent)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>Explore Our Destinations</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
