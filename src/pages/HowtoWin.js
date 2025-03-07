import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import "./HowToWin.css";

const steps = [
  { id: 1, title: "Find the Challenge That Fits You", description: "We regularly post exciting challenges on our website and other hiring platforms. Browse through them and select the challenge that aligns with your skills and interests.", image: "/images/step1.png" },
  { id: 2, title: "Apply and Participate", description: "Submit your application and start solving the challenge.", image: "/images/step2.png" },
  { id: 3, title: "Get Mentorship & Feedback", description: "Receive expert guidance and improve your work.", image: "/images/step3.png" },
  { id: 4, title: "Compete & Showcase", description: "Present your work and gain visibility.", image: "/images/step4.png" },
  { id: 5, title: "Submit Your Work", description: "Send your final submission for review.", image: "/images/step5.png" },
];

const HowToWin = () => {
  const [visibleStep, setVisibleStep] = useState(1);
  const [hideText, setHideText] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setHideText(scrollTop > 50);

      const newStep = Math.min(1 + Math.floor(scrollTop / 200), steps.length);
      setVisibleStep(newStep);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="how-to-win-page">
      <Navbar />
      <div className={`how-to-win-container ${hideText ? "hide-text" : ""}`}>
        <h1 className="how-to-win-title">How the Startupathon Hiring Process Works</h1>
        <p className="how-to-win-subtitle">
        At Startupathon, we make it easy for aspiring leaders to apply and get involved in challenges. Our hiring process helps you showcase your skills, build your potential, lead , and succeed as a founder.
        </p>
      </div>

      <div className="steps-container">
        {steps.slice(0, visibleStep).map((step, index) => (
          <motion.div
            key={step.id}
            className="step-card"
            style={{ zIndex: steps.length - index }}
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: index * -30,
              scale: 1,
              transition: { duration: 0.5, ease: "easeOut" },
            }}
          >
            <div className="step-image">
              <img src={step.image} alt={step.title} />
            </div>
            <div className="step-content">
              <h2>Step {step.id}</h2>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HowToWin;
