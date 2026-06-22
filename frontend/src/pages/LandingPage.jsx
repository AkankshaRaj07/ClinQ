import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Sticky nav transition
    const handleScroll = () => {
      const nav = document.getElementById('landing-nav');
      if (nav) {
        if (window.scrollY > 50) {
          nav.classList.add('shadow-sm', 'py-2');
          nav.classList.remove('py-4');
        } else {
          nav.classList.remove('shadow-sm', 'py-2');
          nav.classList.add('py-4');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="bg-background text-on-background min-h-screen w-full relative overflow-x-hidden">
      <style>{`
        .hero-gradient {
          background: radial-gradient(circle at 70% 30%, var(--color-primary-container, rgba(30, 64, 175, 0.1)) 0%, transparent 50%);
        }
        .floating {
          animation: floating 3s ease-in-out infinite;
        }
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
      
      {/* TopNavBar */}
      <nav id="landing-nav" className="bg-surface/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant/30 transition-all duration-300 py-4">
        <div className="w-full mx-auto px-margin-mobile lg:px-margin-desktop flex justify-between items-center">
          <a className="text-2xl font-extrabold text-primary tracking-tight" href="#">ClinQ</a>
          <div className="hidden md:flex items-center space-x-8">
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleGetStarted}
              className="px-6 py-2 rounded-lg bg-primary text-on-primary font-bold text-sm hover:bg-primary-container transition-all active:opacity-80"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-24 pb-20 md:pt-32 overflow-hidden hero-gradient">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={staggerContainer}
            className="w-full mx-auto px-margin-mobile lg:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeInUp} className="z-10 text-center lg:text-left mt-12 lg:mt-0">
              <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 text-on-surface tracking-tight leading-tight">
                Queue Management for <br className="hidden lg:block"/> <span className="text-primary">Modern Healthcare</span>
              </h1>
              <p className="text-xl text-on-surface-variant mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Reduce wait times and improve patient satisfaction with real-time tracking, seamless check-ins, and intelligent data routing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={handleGetStarted} className="px-8 py-4 rounded-lg bg-primary text-on-primary font-bold shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  Get Started <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
                <button onClick={handleGetStarted} className="px-8 py-4 rounded-lg border border-outline-variant bg-surface text-on-surface-variant font-bold hover:bg-surface-container transition-all">
                  Book a Demo
                </button>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="relative z-10 floating hidden lg:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/30">
                <img className="w-full aspect-video object-cover" alt="ClinQ Dashboard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCB8VR8jV7K_Ml5OGJo9DGyswNdUpDAKFIJiIb3ASBCHONJAkEbMHN6jwxw3zDbmfSs9qlL2km7AHTJV9PNUg4r4zeYazBHWWXIYYFNUnJdkIvFvbP5KmGqJXK_sJfUbAAWf0djIYIcuHEj8wJqGe2mDqWw1_cHtzRNZ5B_0lA2Tpc9QbaOmgSc9eL_R_0CEP7Ldx1yzeckWFoFvHDPDvj0yRK7zWqUMd-FRYpgdqV2QMFeEZDCKq7jqmT3CsvbZTKb4iBQY7wLzyK" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-container/30 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl"></div>
            </motion.div>
          </motion.div>
        </section>

        {/* Value Proposition */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={staggerContainer}
          className="py-24 bg-surface-container-lowest"
        >
          <div className="w-full mx-auto px-margin-mobile lg:px-margin-desktop">
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <span className="text-primary font-bold text-sm uppercase tracking-widest">Why Choose ClinQ</span>
              <h2 className="text-4xl font-extrabold text-on-surface mt-2 tracking-tight">Precision Built for Excellence</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeInUp} className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">sync</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-4">Real-time Sync</h3>
                <p className="text-base text-on-surface-variant leading-relaxed">Instant updates across all devices. Receptionists and clinicians stay perfectly aligned with live patient status tracking.</p>
              </motion.div>
              <motion.div variants={fadeInUp} className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-secondary-container/30 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">person_check</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-4">Patient Autonomy</h3>
                <p className="text-base text-on-surface-variant leading-relaxed">Empower patients to check in via mobile, view live wait times, and receive SMS notifications when it's their turn.</p>
              </motion.div>
              <motion.div variants={fadeInUp} className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-tertiary-container flex items-center justify-center text-on-tertiary-container mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-4">Data-Driven Insights</h3>
                <p className="text-base text-on-surface-variant leading-relaxed">Analyze peak times, staff performance, and patient throughput to optimize your clinic's daily operational flow.</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={staggerContainer}
          className="py-24 overflow-hidden" 
          id="features"
        >
          <div className="w-full mx-auto px-margin-mobile lg:px-margin-desktop space-y-32">
            
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div variants={fadeInUp} className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/10 text-primary font-bold text-sm mb-6">
                  <span className="material-symbols-outlined text-sm">assignment_ind</span>
                  For Receptionists
                </div>
                <h2 className="text-4xl font-extrabold text-on-surface mb-6 tracking-tight">Effortless Intake Management</h2>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary mt-0.5">check_circle</span>
                    <span className="text-lg text-on-surface-variant">One-click patient check-in with automated digital forms.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary mt-0.5">check_circle</span>
                    <span className="text-lg text-on-surface-variant">Smart queue prioritization based on urgency and arrival.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary mt-0.5">check_circle</span>
                    <span className="text-lg text-on-surface-variant">Direct internal messaging to clinical staff for seamless handovers.</span>
                  </li>
                </ul>
              </motion.div>
              <motion.div variants={fadeInUp} className="lg:w-1/2 relative w-full">
                <div className="rounded-3xl shadow-xl border border-outline-variant/30 overflow-hidden bg-surface">
                  <img className="w-full h-[400px] object-cover" alt="Receptionist using ClinQ" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAE9mwsshEYCurxmoCK3SuUWCKr9LdIcSEHuhsW73L32Z6y_BviCtnXWABuQiOu5tiZSGOjlC8UeL8aSlu8dQV3Nf1pQO-C7UquxECGcPmPlo3MG8t6jo5EVfSEaqJltBP8ZUihAL_Ln22iTgoDxRID33kGDW-jsR1An2w306Me80Dg7dw8agAFud_gseBQeT49BZ0ZoOEgCK9_yiv9mq9ooq0hYHurZc2HrzH6MxvP58EveWSjiyPoIoJMnVtd1r59qkwrHl4pjxl" />
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <motion.div variants={fadeInUp} className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container/30 text-secondary font-bold text-sm mb-6">
                  <span className="material-symbols-outlined text-sm">smartphone</span>
                  For Patients
                </div>
                <h2 className="text-4xl font-extrabold text-on-surface mb-6 tracking-tight">A Stress-Free Waiting Experience</h2>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary mt-0.5">check_circle</span>
                    <span className="text-lg text-on-surface-variant">Real-time SMS updates so patients can wait where they're comfortable.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary mt-0.5">check_circle</span>
                    <span className="text-lg text-on-surface-variant">Digital QR check-ins to reduce physical contact and front-desk friction.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary mt-0.5">check_circle</span>
                    <span className="text-lg text-on-surface-variant">Feedback loops to capture patient satisfaction immediately after care.</span>
                  </li>
                </ul>
              </motion.div>
              <motion.div variants={fadeInUp} className="lg:w-1/2 relative w-full">
                <div className="rounded-3xl shadow-xl border border-outline-variant/30 overflow-hidden bg-surface">
                  <img className="w-full h-[400px] object-cover" alt="Patient using ClinQ app" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB35bye8-zXPq7RNPl1rxsokYpWndP6DX_8jnf8G_YLZbFJ2bmfhD0St6_ikFQ5q5hH_3zpTQMfL1id8RypjlDrlT-ge5TP7UEJTbm5HWJpcLqh2pOBBK68bBSw_H8R6ttk11rnggxG1FfDdauxvs5ln9HRopS91UGeDVciZSjamk6VU4QLNq4lSsRCrf9X4vToPrGA_ixasocBBByQrpxecuqog0oeqNuHY_6IifNHP-xvuCyg8rtKZEbKJrSj46Ix7kLkrYwU5uAD" />
                </div>
              </motion.div>
            </div>

          </div>
        </motion.section>

        {/* Social Proof */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }} 
          variants={staggerContainer}
          className="py-24 bg-surface-container-low/50"
        >
          <div className="w-full mx-auto px-margin-mobile lg:px-margin-desktop">
            <motion.p variants={fadeInUp} className="text-center font-bold text-sm text-outline mb-10 uppercase tracking-widest">Trusted by leading medical centers</motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center items-center gap-12 mb-20 opacity-60 grayscale hover:grayscale-0 transition-all">
              <span className="text-2xl text-on-surface-variant font-bold">MediCorp</span>
              <span className="text-2xl text-on-surface-variant font-bold">HealthPulse</span>
              <span className="text-2xl text-on-surface-variant font-bold">St. Judes</span>
              <span className="text-2xl text-on-surface-variant font-bold">CarePoint</span>
              <span className="text-2xl text-on-surface-variant font-bold">VitalsPlus</span>
            </motion.div>
            <motion.div variants={fadeInUp} className="max-w-3xl mx-auto">
              <div className="p-10 rounded-3xl bg-surface border border-outline-variant/30 shadow-sm relative text-center">
                <span className="material-symbols-outlined text-primary text-5xl mb-6">format_quote</span>
                <p className="text-xl text-on-surface italic mb-8 leading-relaxed">
                  "ClinQ has revolutionized how our outpatient clinic operates. We've seen a 35% reduction in perceived wait times and our patient satisfaction scores have never been higher. The implementation was seamless and our staff loves the interface."
                </p>
                <div>
                  <p className="text-2xl text-primary font-bold mb-1">Dr. Sarah Chen</p>
                  <p className="text-base text-on-surface-variant">Clinic Director, Metro Health Systems</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-50px" }} 
          variants={staggerContainer}
          className="py-32 bg-primary text-on-primary text-center relative overflow-hidden"
        >
          <motion.div variants={fadeInUp} className="w-full mx-auto px-margin-mobile lg:px-margin-desktop relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to transform your clinic's workflow?</h2>
            <p className="text-xl opacity-90 mb-10 leading-relaxed">Join leading medical centers improving their efficiency and patient care with ClinQ.</p>
            <button onClick={handleGetStarted} className="px-10 py-5 rounded-xl bg-surface text-primary font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl">
              Get Started
            </button>
          </motion.div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant/50">
        <div className="w-full mx-auto px-margin-mobile lg:px-margin-desktop py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <a className="text-2xl font-extrabold text-on-surface tracking-tight" href="#">ClinQ</a>
            <p className="mt-4 text-on-surface-variant text-base leading-relaxed">Empowering healthcare providers with precision queue management and patient engagement tools.</p>
          </div>
          <div>
            <h4 className="font-bold text-sm text-on-surface mb-6 uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              <li><a className="text-on-surface-variant hover:text-primary transition-colors font-medium" href="#">Features</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors font-medium" href="#">Security</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors font-medium" href="#">API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm text-on-surface mb-6 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              <li><a className="text-on-surface-variant hover:text-primary transition-colors font-medium" href="#">About Us</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors font-medium" href="#">Contact Us</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors font-medium" href="#">Blog</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors font-medium" href="#">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm text-on-surface mb-6 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              <li><a className="text-on-surface-variant hover:text-primary transition-colors font-medium" href="#">Privacy Policy</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors font-medium" href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="w-full mx-auto px-margin-mobile lg:px-margin-desktop py-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center text-on-surface-variant text-sm font-medium">
          <p>© 2026 ClinQ Systems. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a className="hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined text-[20px]">public</span></a>
            <a className="hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined text-[20px]">alternate_email</span></a>
            <a className="hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined text-[20px]">share</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
