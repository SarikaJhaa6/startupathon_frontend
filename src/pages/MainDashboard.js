import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './MainDashboard.css';
import { motion, AnimatePresence } from "framer-motion"; // Keep only if used
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faLinkedin, faYoutubeSquare  } from "@fortawesome/free-brands-svg-icons";
import gsap from "gsap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function MainDashboard() {
  const [challenges, setChallenges] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);  const [currentIndex, setCurrentIndex] = useState(0);

  const foundersData = [
    { name: "Cillian Leonowicz", role: "Director in Technology Consulting & Blockchain Lead, EY", description: "Set up a Big 4's first global Blockchain Lab, managed some of the earliest PoC's in Europe and first \"production\" systems...", image: "/images/i1.jpg", linkedin: "https://linkedin.com/in/cillian", url: "https://airtable.com/appLrgl1rWXkvfqQO/shrGMYx627Gp4p85P/tblN2zimQDejQnVh4/viw6eINeykMApJkoj/recDtgyG3chLzp8Mn" },
    { name: "Frank Wang", role: "Transformative Work Lead at Mask Network, Co-Founder at Meson Network, Mask", description: "Co-founded Meson Network, bootstrapped to reach 2/3 of Akaimai's bandwidth resources in 3 months...", image: "/images/i2.png", linkedin: "https://linkedin.com/in/frank", url: "https://airtable.com/appLrgl1rWXkvfqQO/shrGMYx627Gp4p85P/tblN2zimQDejQnVh4/viw6eINeykMApJkoj/recDrzdjIJIfre6A2" },
    { name: "Eric Hendrickus", role: "Investments, Central Capital Ventura", description: "Mentor in SYNRGY, a fintech focused accelerator, Mentor in 1000 Startup Digital, an accelerator...", image: "/images/i3.png", linkedin: "https://linkedin.com/in/eric", url: "https://airtable.com/appLrgl1rWXkvfqQO/shrGMYx627Gp4p85P/tblN2zimQDejQnVh4/viw6eINeykMApJkoj/recBBogmJWY0gnIDE" },
    { name: "Stefon Crawford", role: "VC Analyst, General Motors Ventures", description: "Experienced Investor responsible for identifying innovation within the private market for General Motors...", image: "/images/i4.png", linkedin: "https://linkedin.com/in/stefon", url: "https://airtable.com/appLrgl1rWXkvfqQO/shrGMYx627Gp4p85P/tblN2zimQDejQnVh4/viw6eINeykMApJkoj/recByRc5tO1nTiGJs" },
    { name: "Adam Wong", role: "Accelerator Principal, Starburst Aerospace", description: "Pitched as a finalist at AFWERX pitch day, chosen as a USA delegate to the International Telecommunication...", image: "/images/i5.png", linkedin: "https://linkedin.com/in/alice", url: "https://airtable.com/appLrgl1rWXkvfqQO/shrGMYx627Gp4p85P/tblN2zimQDejQnVh4/viw6eINeykMApJkoj/recsFYOgTXbYXVDZu" },
    { name: "Stephen Grinalds", role: "CTO, Chisos Capital", description: "3x DLT Industry Founder United Nations Working Group", image: "/images/i6.png", linkedin: "https://linkedin.com/in/bob", url: "https://airtable.com/appLrgl1rWXkvfqQO/shrGMYx627Gp4p85P/tblN2zimQDejQnVh4/viw6eINeykMApJkoj/recsyqAdob03UvtqD" },
    { name: "Jorge Carrasco", role: "Director of Emerging Technologies, Etisalat", description: "Launched B2B digital solutions across EMEA, including mobile apps, wifi access, omnichannel digital...", image: "/images/i7.jpg", linkedin: "https://linkedin.com/in/sarah", url: "https://airtable.com/appLrgl1rWXkvfqQO/shrGMYx627Gp4p85P/tblN2zimQDejQnVh4/viw6eINeykMApJkoj/recoL753Zu7PpRvp3" },
    { name: "Anuraag Sunder", role: "Managing Director, J Syzygia Consultants", description: "Awarded prestigious Chevening Fellowship by Her Majesty's Govt. Member- Chatham House...", image: "/images/i8.jpg", linkedin: "https://linkedin.com/in/david", url: "https://airtable.com/appLrgl1rWXkvfqQO/shrGMYx627Gp4p85P/tblN2zimQDejQnVh4/viw6eINeykMApJkoj/recot0kr6zdxzDWKN" },
    { name: "Marisa Mcknight", role: "Founding Partner, Multisummit, LLC", description: "5+ years in cryptocurrency industry across Japan and Singapore lived in USA, Japan, Singapore, and visited 40+ countries.", image: "/images/i9.png", linkedin: "https://linkedin.com/in/emily", url: "https://airtable.com/appLrgl1rWXkvfqQO/shrGMYx627Gp4p85P/tblN2zimQDejQnVh4/viw6eINeykMApJkoj/recqwOR9PS15VOYc0" },
    { name: "Leeor Groen", role: "Director, Spartan Group", description: "World Economic Forum Global Shaper, Co-chair 2020 Pre-Davos Summit...", image: "/images/i10.jpg", linkedin: "https://linkedin.com/in/jason", url: "https://airtable.com/appLrgl1rWXkvfqQO/shrGMYx627Gp4p85P/tblN2zimQDejQnVh4/viw6eINeykMApJkoj/recnpf5DBpcRj9igA" },
    { name: "Dr. Jason Corbett", role: "Managing Partner of the year 2021 by Asia Legal Business", description: "Investing in the next wave of startups...", image: "/images/i11.png", linkedin: "https://linkedin.com/in/olivia", url: "https://airtable.com/appLrgl1rWXkvfqQO/shrGMYx627Gp4p85P/tblN2zimQDejQnVh4/viw6eINeykMApJkoj/recPuW86KZ7mQTN15" },
    { name: "William Herkelrath", role: "Serial Entrepreneur", description: "Passionate about deep tech...", image: "/images/i12.png", linkedin: "https://linkedin.com/in/michael", url: "https://airtable.com/appLrgl1rWXkvfqQO/shrGMYx627Gp4p85P/tblN2zimQDejQnVh4/viw6eINeykMApJkoj/recrAl3dYpO7t5azc" },
    { name: "Danish Chaudhry", role: "CEO, FMFW.io", description: "Managing Director of Bitcoin.com exchange for 2 years. Has his own venture fund with 150+...", image: "/images/i13.png", linkedin: "https://linkedin.com/in/sophia", url: "https://airtable.com/appLrgl1rWXkvfqQO/shrGMYx627Gp4p85P/tblN2zimQDejQnVh4/viw6eINeykMApJkoj/recg9vkEfZRapj5g9" },
    { name: "Warren Lorenz", role: "Managing Principal, TechMeetsTrader", description: "Advises $50 million family office fund on asset allocation, provide trade ideas, and risk management...", image: "/images/i14.jpg", linkedin: "https://linkedin.com/in/ryan", url: "https://airtable.com/appLrgl1rWXkvfqQO/shrGMYx627Gp4p85P/tblN2zimQDejQnVh4/viw6eINeykMApJkoj/recBpdexKOUgVmf09" },
    { name: "Andy Watson", role: "CEO, AngelPeak Partners", description: "CEO of Dubai World completing $14bn debt restructure. Managed 85 distressed global investments...", image: "/images/i15.jpg", linkedin: "https://linkedin.com/in/natalie", url: "https://airtable.com/appLrgl1rWXkvfqQO/shrGMYx627Gp4p85P/tblN2zimQDejQnVh4/viw6eINeykMApJkoj/recNvgejTXyrpbQPu" },
  ];
  const totalSlides = Math.ceil(foundersData.length / 4);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);
  // const showMoreRow = () => setVisibleRows((prev) => prev + 1);
  // const showLess = () => setVisibleRows(1);
  
  // useEffect(() => {
  //   axios.get('http://localhost:5000/api/challenges/visible')
  //     .then(response => setChallenges(response.data))
  //     .catch(error => console.error('Error fetching challenges:', error));

  //   const handleScroll = () => {
  //     const steps = document.querySelectorAll('.timeline_item');
  //     let currentStep = -1;  // Reset to no active step
  //     steps.forEach((step, index) => {
  //       const rect = step.getBoundingClientRect();
  //       // Only update active step when the step is visible in the viewport (within 50% of the viewport)
  //       if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
  //         currentStep = index;
  //       }
  //     });
  //     setActiveStep(currentStep);
  //   };

  //   window.addEventListener('scroll', handleScroll);
    
  //   return () => window.removeEventListener('scroll', handleScroll);

  // }, []);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get(
          'https://startupathonbackend-production.up.railway.app/api/challenges/visible'
        );
        setChallenges(response.data);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    };
  
    fetchChallenges();
  
    const handleScroll = () => {
      const steps = document.querySelectorAll('.timeline_item');
      let currentStep = -1; // Reset to no active step
  
      steps.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        // Update active step only when the step is within 50% of the viewport
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
          currentStep = index;
        }
      });
  
      setActiveStep(currentStep);
    };
  
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  

  useEffect(() => {
    const rewardsSection = document.querySelector('.rewards-section');
    
    // Create an IntersectionObserver to detect when the rewards section enters the viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animate the cards only when the section is in view
          const cards = document.querySelectorAll('.reward-card');
          cards.forEach((card, index) => {
            gsap.from(card, {
              opacity: 0,
              y: 20,
              duration: 0.5,
              delay: index * 0.1,
              ease: "power2.out"
            });
          });
        }
      });
    }, {
      threshold: 0.5,  // Trigger when 50% of the rewards section is in view
    });

    // Observe the rewards section
    if (rewardsSection) {
      observer.observe(rewardsSection);
    }

    return () => {
      if (rewardsSection) {
        observer.unobserve(rewardsSection);
      }
    };
  }, []);

  useEffect(() => {
    const headerText = document.getElementById('headerText');
  
    const handleScrollHeader = () => {
      const rect = headerText.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
  
      // Trigger animation only when the entire element is visible in the viewport
      if (rect.top >= 0 && rect.bottom <= viewportHeight) {
        gsap.to(headerText, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out"
        });
      } else {
        gsap.to(headerText, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    };
  
    window.addEventListener('scroll', handleScrollHeader);
  
    // Trigger on initial page load as well
    handleScrollHeader();
  
    return () => window.removeEventListener('scroll', handleScrollHeader);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".timeline-item");
      let newActiveStep = 0;

      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          newActiveStep = index + 1;
        }
      });

      setActiveStep(newActiveStep);

      // Update the progress bar dynamically
      const progressLine = document.querySelector(".timeline-progress");
      if (progressLine) {
        progressLine.style.height = `${(newActiveStep / elements.length) * 100}%`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  const steps = [
    {
      title: "Dive into the Challenge Details Video",
      description: (
        <>
          <strong style={{ fontSize: "1.5em" }}>It all starts here!</strong>
          <br />
          <br />
          Receive an exciting task—your startup idea—with a detailed video to spark creativity and clarify our vision.
          <br />
          <br />
          <em style={{ fontSize: "1em" }}>
            💡 Pro Tip: Pay attention—it’s more than just instructions. It’s your roadmap to success!
          </em>
        </>
      ),
    },
    {
      title: "Build, Submit & Shine",
      description: (
        <>
   
          Create a prototype that showcases your approach, then submit your work with a Loom video presentation (no GitHub repo or complex code required). Your creative solution is what matters most.
          <br />
          <br />
          <em style={{ fontSize: "1em" }}>
            💡 Stay ahead: Submit on time or early to show your dedication!
          </em>
        </>
      ),
    },
    {
      title: "Get Feedback, Level Up!",
      description: (
        <>
          {/* <strong style={{ fontSize: "1.2em" }}>Get Feedback, Level Up!</strong>
          <br />
          <br /> */}
          Three days after submission, we review your work. If it stands out, you're in! If not, we'll share feedback on how to improve. The cycle continues until we find the perfect fit.
          <br />
          <br />
          <em style={{ fontSize: "1em" }}>
            💡 Pro Tip: This feedback is gold. Use it to sharpen your submission or learn what it takes to win!
          </em>
        </>
      ),
    },
    {
      title: "Claim Your Crown",
      description: (
        <>
          <strong style={{ fontSize: "1.5em" }}>Ace the challenge to become the project leader.</strong>
          <br />
          <br />
         
          Lead the Project. Ace the challenge, and take charge as BOSS. Enjoy ownership, 20% equity, and a competitive salary. Turn vision into impact with top-tier talent!
        </>
      ),
    },
  ];
  

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleSubscribe = async () => {
    if (!email) {
      setMessage({ type: "error", text: "Please enter an email." });
      return;
    }
  
    setLoading(true);
    setMessage(null); // Reset message on new request
  
    try {
      const response = await axios.post(
        "https://startupathonbackend-production.up.railway.app/api/subscribers/add-subscriber",
        { email }
      );
      setMessage({ type: "success", text: "Subscribed successfully!" });
      setEmail(""); // Clear input after success
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage({ type: "error", text: "This email is already subscribed." });
      } else {
        setMessage({ type: "error", text: "Something went wrong. Try again later." });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const startupCards =  [
    {
      "id": 1,
      "title": "NeighborGood",
      "icon": "/images/icon1.png",
      "image": "/images/img1.jpg",
      "name": "Purnendu Thamb",
      "role": "Lead Developer, NeighborGood.",
      "description": "NeighborGood aims to create the simplest platform for neighborhoods to connect, using an AI agent that acts as a social extrovert to find activities for people to enjoy together.",
      "funding": "$61,500"
    },
    {
      "id": 2,
      "title": "DevisAI",
      "icon": "/images/icon2.png",
      "image": "/images/img2.jpg",
      "name": "Naman Jain",
      "role": "Leader, DevisAI.",
      "description": "Generate up to 20 meme tokens daily. Users vote, and the top-voted coin gets featured on pump.fun with their website, Twitter, and Telegram channel.",
      "funding": "$10,500"
    },
    {
      "id": 3,
      "title": "Ovadrive",
      "icon": "/images/icon3.png",
      "image": "/images/img3.jpg",
      "name": "Yash Rastogi",
      "role": "Lead Developer, Ovadrive.",
      "description": "Ovadrive is designed to turn your phone into an assistant following you everywhere, learning all about your life and helping to utilize that.",
      "funding": "$61,500"
    },
    {
      "id": 4,
      "title": "Tatbox",
      "icon": "/images/icon4.png",
      "image": "/images/img4.jpg",
      "name": "Youssif Taha",
      "role": "Leader, Tatbox.",
      "description": "Tatbox revolutionizes the tattoo industry, offering enthusiasts and artists a seamless, personalized experience with advanced AI and a vibrant marketplace for unique designs.",
      "funding": "$61,500"
    },
    {
      "id": 5,
      "title": "FaceSearchAI",
      "icon": "/images/icon5.svg",
      "image": "/images/img5.jpg",
      "name": "Adil Sameer",
      "role": "Leader, FaceSearchAI.",
      "description": "Find anyone online with face recognition search engine. Search for people by photo and verify you are talking to the person they claim to be.",
      "funding": "$10,500"
    },
    {
      "id": 6,
      "title": "AiBiden",
      "icon": "/images/icon6.png",
      "image": "/images/img6.jpg",
      "name": "Rohan Nimbalkar",
      "role": "Leader, AiBiden.",
      "description": "AIBiden - An AI version of President Biden that answers questions previously asked to the real President, generating AI responses in video format using his voice.",
      "funding": "$10,500"
    },
    {
      "id": 7,
      "title": "ShortsLol",
      "icon": "/images/icon7.png",
      "image": "/images/img7.jpg",
      "name": "Vikhash Gupta",
      "role": "Leader, ShortsLol.",
      "description": "A cutting-edge platform for creating, sharing, and enjoying captivating short videos, designed to connect creators and audiences with ease.",
      "funding": "$61,500"
    },
    {
      "id": 8,
      "title": "Delivery App",
      "icon": "/images/icon8.png",
      "image": "/images/img8.jpg",
      "name": "Sai Kumar Husangi",
      "role": "Leader, Delivery App.",
      "description": "SaveShip: Firebase back-end, Flutter front-end, with location tracking, age verification, and secure user management.",
      "funding": "$10,500"
    },
    {
      "id": 9,
      "title": "AI Animator",
      "icon": "/images/icon9.png",
      "image": "/images/img9.jpg",
      "name": "Pushpak Hingulapur",
      "role": "Leader, AI Animator.",
      "description": "A web app that animates two combined photos, using AI tools like Klingi or Runway ML.",
      "funding": "$10,500"
    },
    {
      "id": 10,
      "title": "StoneCanyon",
      "icon": "/images/icon10.png",
      "image": "/images/img10.jpg",
      "name": "Pratham Mangla",
      "role": "Leader, StoneCanyon.",
      "description": "AI chatbot for home improvement: captures info, answers FAQs, analyzes images, and schedules appointments.",
      "funding": "$10,000"
    },
    {
      "id": 11,
      "title": "Creatorship",
      "icon": "/images/icon11.png",
      "image": "/images/img11.jpg",
      "name": "Rakesh Singh",
      "role": "Leader, Creatorship.",
      "description": "AI-powered creator marketplace for seamless collaboration. Smart matching, automated media kits, real-time analytics, and equity partnerships make it the go-to for influencer marketing.",
      "funding": "$10,500"
    },
    {
      "id": 12,
      "title": "AIHumanRights",
      "icon": "/images/icon12.png",
      "image": "/images/img12.jpg",
      "name": "Tanmay Pawana",
      "role": "Leader, AIHumanRights.",
      "description": "A uniquely crafted AI personality, designed to advocate for rights and amplify important issues with precision and empathy.",
      "funding": "$10,500"
    }
  ]
  
  return (
    <div>
      <Navbar />

     {/* Hero Section */}
<div className="hero">
  <div className="team-image-container">
    <img src="/images/dash1img.png" alt="Team" className="team-img" />
    <div className="team-img-overlay"></div>
  </div>
  <h1>Startupathon</h1>
  <motion.div
    id="headerText" 
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: 'easeOut' }}
  >        
  <p id='headerText'>Your Chance to Build, Lead, and Succeed as a Founder</p>
  </motion.div>
</div>

      {/* Video Section */}
      <div className="video-section">
        <iframe
          className="embedly-embed"
          src="https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.loom.com%2Fembed%2F996f59a2e5c34fd38b86544833c23dde&amp;display_name=Loom&amp;url=https%3A%2F%2Fwww.loom.com%2Fshare%2F996f59a2e5c34fd38b86544833c23dde&amp;image=https%3A%2F%2Fcdn.loom.com%2Fsessions%2Fthumbnails%2F996f59a2e5c34fd38b86544833c23dde-2bf900e52ff1c51c.gif&amp;type=text%2Fhtml&amp;schema=loom"
          width="940"
          height="705"
          scrolling="no"
          allowFullScreen
          title="Building Billion-Dollar Companies: Startup-A-Thon Insights"
        />
      </div>

      {/* Buttons Section */}
      <div className="button-section">
        <div className="border-gradient">
          <button className="btn btn-purple">
            Ongoing Startupathon <i className="fas fa-volume-up"></i>
          </button>
        </div>
        <div className="border-gradient">
          <button className="btn btn-purple">
            Startupathon Guide <i className="fas fa-question-circle"></i>
          </button>
        </div>
        <div className="border-gradient">
          <button className="btn btn-purple">
            Past Startupathons <i className="fas fa-check-circle"></i>
          </button>
        </div>
        <div className="border-gradient">
          <button className="btn btn-purple">
            Mentor Network <i className="fas fa-magic"></i>
          </button>
        </div>
      </div>

      {/* Rewards Section */}
      <div className="rewards-section">
        <h2 id='secondSectionHeader'>Startupathon Success Comes with Extraordinary Rewards</h2>
        
        <div className="perks-cards-wrap row-1">
          <div className="reward-card">
            <div className="gradient">
              <div className="peark-logo-wrap">
                <img src="/images/card1.png" alt="Reward 1" loading="lazy" />
              </div>
              <div className="perk-head">Competitive Salary</div>
            </div>
          </div>
          <div className="reward-card">
            <div className="gradient">
              <div className="peark-logo-wrap">
                <img src="/images/card2.png" alt="Reward 2" />
              </div>
              <div className="perk-head">&ge; $10,000 USD in Company Funding</div>
            </div>
          </div>
          <div className="reward-card">
            <div className="gradient">
              <div className="peark-logo-wrap">
                <img src="/images/card3.png" alt="Reward 3" />
              </div>
              <div className="perk-head">&ge; 10% Founder Equity</div>
            </div>
          </div>
          <div className="reward-card">
            <div className="gradient">
              <div className="peark-logo-wrap">
                <img src="/images/card4.png" alt="Reward 4" />
              </div>
              <div className="perk-head">&ge; $100,000 USD AWS Credits</div>
            </div>
          </div>
          <div className="reward-card">
            <div className="gradient">
              <div className="peark-logo-wrap">
                <img src="/images/card5.png" alt="Reward 5" />
              </div>
              <div className="perk-head">$1,000 OpenAI Credits</div>
            </div>
          </div>
        </div>
        
        <div id="ongoing-pro" className="perks-cards-wrap row-2">
          <div className="reward-card">
            <div className="gradient">
              <div className="peark-logo-wrap">
                <img src="/images/card6.png" alt="Reward 6" />
              </div>
              <div className="perk-head">$120,000 USD IBM Cloud Credits</div>
            </div>
          </div>
          <div className="reward-card">
            <div className="gradient">
              <div className="peark-logo-wrap">
                <img src="/images/card7.png" alt="Reward 7" />
              </div>
              <div className="perk-head">$2,500 Twilio Credits</div>
            </div>
          </div>
          <div className="reward-card">
            <div className="gradient">
              <div className="peark-logo-wrap">
                <img src="/images/card8.png" alt="Reward 8" />
              </div>
              <div className="perk-head">$2,000 Airtable Credits</div>
            </div>
          </div>
        </div>
      </div>


      {/* Challenges Section */}
      <img 
  src={challenge.image 
    ? `https://startupathonbackend-production.up.railway.app${challenge.image}` 
    : `/randomImages/logo${Math.floor(Math.random() * 9) + 1}.png`} 
  alt={challenge.title} 
/>

      <div id='startupathon-guide' className="section-timeline-2">
      <div className="container-9">
        <div className="pro-sec-intro-wrap">
          <h1>Found an idea that matches your skills?</h1>
          <div className="sec-subhead how-to-crack-sec">
            Here’s a simple guide on how the Startupathon process works once you find a project idea that suits your skills.
          </div>
        </div>
        <div className="timeline-container">
      {/* Full Gray Timeline Line */}
      <div className="timeline-line"></div>

      {/* Dynamic Progress Line */}
      <div className="timeline-progress" style={{ height: "0%" }}></div>

      {steps.map((step, index) => (
        <div key={index} className={`timeline-item ${index < activeStep ? "active" : ""}`}>
          {index % 2 === 0 ? (
            <>
              <div className="timeline-title left">{step.title}</div>
              <div className="timeline-point"></div>
              <div className="timeline-content right">{step.description}</div>
            </>
          ) : (
            <>
              <div className="timeline-content left">{step.description}</div>
              <div className="timeline-point"></div>
              <div className="timeline-title right">{step.title}</div>
            </>
          )}
        </div>
      ))}
    </div>
      </div>
    </div>
    <div class="video-showcase-section">
  <h1>Work Smart, Win Big: Pro Tips from <em>Swapnil Sharma</em>, CTO of Ovadrive (A Startupathon Success)</h1>
  
  <div class="video-showcase-container">
    <div class="video-showcase-card">
      <iframe id="player" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" 
        title="Maximize Your Webapp's Potential with V0 by Vercel and Claude" 
        width="640" height="360" 
        src="https://www.youtube.com/embed/pn_HoowYNTQ?wmode=opaque&widget_referrer=https%3A%2F%2Fpersistventures.com%2F&enablejsapi=1&origin=https%3A%2F%2Fcdn.embedly.com&widgetid=1">
      </iframe>
    </div>
  
    <h2>Our Hiring Process: Shared Through Candidate Stories</h2>
    
    <div class="video-showcase-card">
      <iframe class="embedly-embed" 
        src="//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.loom.com%2Fembed%2F0847b9257f144fd0830a8536dfbc8e81&display_name=Loom&url=https%3A%2F%2Fwww.loom.com%2Fshare%2F0847b9257f144fd0830a8536dfbc8e81%3Fsid%3D841fa6ba-1690-45ed-bc33-6ff84d4f85d8&image=https%3A%2F%2Fcdn.loom.com%2Fsessions%2Fthumbnails%2F0847b9257f144fd0830a8536dfbc8e81-3fb333027ee2e702.gif&type=text%2Fhtml&schema=loom" 
        width="940" height="705" 
        scrolling="no" allowfullscreen 
        title="How We Empower Leaders Without Resumes">
      </iframe>
    </div>
  </div>
</div>
<div class="idea-pitch-section">
  <div class="idea-pitch-container">
    <h1 class="idea-pitch-title">Got an idea of your own?</h1>
    <p class="idea-pitch-description">
      <em>We are always on the lookout for visionaries with great startup ideas, ready to become successful founders. If that's you, apply below for our Fellowship program.</em>
    </p>
    <button class="apply-button">Apply For Fellowship</button>
  </div>
</div>
<section id="completed-startupathon" className="explore-startups-section">
      <h2 id="exploreH1">Completed Startupathon Challenges</h2>
      <p id="exploreH2">
        People like you have cracked Startupathon challenges and are now leading
        thriving startups.
      </p>
      <div className="startup-cards-grid">
        <AnimatePresence>
          {startupCards.slice(0, showMore ? 18 : 6).map((startup) => (
            <motion.div
              key={startup.id}
              className="startup-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="card-header">
                <h4 id="headerH4">
                  {startup.title}{" "}
                  <img
                    src={startup.icon}
                    alt={`${startup.title} icon`}
                    style={{ width: "25px", height: "25px" }}
                  />
                </h4>
              </div>
              <div className="card-body">
                <img
                  src={startup.image}
                  alt={startup.name}
                  className="card-image"
                />
                <div className="card-info">
                  <h4 id="descriptionH4">{startup.name}</h4>
                  <p id="paraRole" className="role">
                    {startup.role}
                  </p>
                  <p id="descriptionPara">{startup.description}</p>
                </div>
              </div>
              <div className="card-footer">
                <p className="funding">
                  <span id="funding-text">Initial Funding Offered: </span>
                  <strong id="funding-value">{startup.funding}</strong>
                </p>
                <button className="view-details-btn">View More Details</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <motion.p
        className="see-more-btn"
        onClick={toggleShowMore}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {showMore ? "See Less" : "See More"}
      </motion.p>
    </section>

    <section className="founder-network-section">
      <h2 className="section-title">By getting accepted, you unlock access to our elite founder network.</h2>
      <p className="section-subtitle">Join Persist and gain access to our 400+ millionaire and billionaire startup network.</p>
      
      <div className="founder-slideshow-container">
        <button onClick={prevSlide} className="prev-btn">
          <FaChevronLeft />
        </button>
        
        <div className="founder-cards-container">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              className="founder-cards-grid"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              {foundersData.slice(currentIndex * 4, (currentIndex + 1) * 4).map((founder, index) => (
                <motion.div key={index} className="founder-card">
                  <img src={founder.image} alt={founder.name} className="founder-image" />
                  <h4 className="founder-name">{founder.name}</h4>
                  <p className="founder-role">{founder.role}</p>
                  <div style={{width: '100%'}}>
                    <p className="founder-description" onClick={() => window.open(founder.url, "_blank")}>
                      {founder.description}
                    </p>
                    <a href={founder.linkedin} className="linkedin-icon">in</a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <button onClick={nextSlide} className="next-btn">
          <FaChevronRight />
        </button>
      </div>
      
      <div className="slideshow-indicators">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <span 
            key={index} 
            className={`indicator ${index === currentIndex ? "active" : ""}`} 
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>

<section className="startupathon-section">
      <motion.h2 
        className="startupathon-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        You are just one <span className="highlight">Startupathon Challenge</span> away from an exciting career as the <span className="highlight">founder of a company</span>, 
        <span className="highlight"> with a full salary</span> and <span className="highlight">ownership</span> in what you build.
      </motion.h2>

      <motion.div 
        className="tweet-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="twitter-tweet twitter-tweet-rendered">
          <iframe 
            id="twitter-widget-0" 
            scrolling="no" 
            frameBorder="0" 
            allowTransparency="true" 
            allowFullScreen="true" 
            title="X Post"
            src="https://platform.twitter.com/embed/Tweet.html?dnt=false&amp;embedId=twitter-widget-0&amp;frame=false&amp;hideCard=false&amp;hideThread=false&amp;id=1814625998136029202&amp;lang=en&amp;theme=light"
          ></iframe>
        </div>
      </motion.div>
    </section>

    <div class="newsletter-section">
    <div className="newsletter-container">
      <p className="newsletter-description">
        Sign up to get notified first about new <strong>Startupathon</strong> projects and receive updates through our newsletter.
      </p>
      <div className="email-input">
        <input
          type="email"
          placeholder="Enter your email ID"
          className="email-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading} // Disable input while loading
        />
        <button className="subscribe-btn" onClick={handleSubscribe} disabled={loading}>
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {message && <p className={message.type === "error" ? "error-text" : "success-text"}>{message.text}</p>}
    </div>
    </div>
    <footer className="footer-container">
      <div className="footer-content">
        {/* Left Section */}
        <div className="footer-brand">
          <img src="/images/logo.svg" alt="Persist Ventures Logo" className="footer-logo" />
          <p className="footer-description">
            We partner with entrepreneurs and businesses to help scale and grow their ideas. 
            With a diverse team skilled in every sector, there is no business we cannot help get a leg up.
          </p>
          {/* Social Icons */}
          <div className="social-icons">
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="icon">
        <FontAwesomeIcon icon={faInstagram} />
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="icon">
        <FontAwesomeIcon icon={faLinkedin} />
      </a>
      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="icon">
        <FontAwesomeIcon icon={faYoutubeSquare } />
      </a>
    </div>

        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <div>
            <h4 className="footer-heading">Quick links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/investor-application">Investor Application</Link></li>
              <li><Link to="/job-application">Job Application</Link></li>
              <li><Link to="/startup-accelerator">Apply To Startup Accelerator</Link></li>
              <li><Link to="/career-accelerator">Career Accelerator Program</Link></li>
              <li><Link to="/team">Our Team</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="footer-heading">Legal</h4>
            <ul>
              <li><Link to="/terms-of-service">Terms of Service</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/decentralized-intelligence-agency">Decentralized Intelligence Agency</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p id='allRightsText'>All rights reserved © 2025 persistventures.com</p>
      </div>
    </footer>
    </div>
  );
}

export default MainDashboard;
