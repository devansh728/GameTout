import { Developer } from "@/types/portfolio";

/**
 * Demo portfolio data for showcasing the new UI design
 * Mix of premium (paid) and basic (free) profiles
 */
export const demoPortfolios: Developer[] = [
  // Premium Profiles (with fire effect, large cards)
  {
    id: 1001,
    name: "Arjun Sharma",
    role: "Senior Game Developer",
    location: "Bangalore",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    status: "Open for Work",
    exp: "8 Yrs",
    rate: "₹3L/mo",
    badges: ["Unity", "Unreal", "C++"],
    skills: [
      { name: "Unity", level: 95 },
      { name: "C#", level: 90 },
      { name: "Unreal Engine", level: 85 },
      { name: "C++", level: 80 },
    ],
    category: "Programmer",
    isPremium: true,
  },
  {
    id: 1002,
    name: "Priya Menon",
    role: "Lead 3D Artist",
    location: "Mumbai",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    status: "Freelance",
    exp: "6 Yrs",
    rate: "₹2.5L/mo",
    badges: ["Blender", "Maya", "ZBrush"],
    skills: [
      { name: "Blender", level: 92 },
      { name: "Maya", level: 88 },
      { name: "Substance Painter", level: 85 },
    ],
    category: "Artist",
    isPremium: true,
  },
  {
    id: 1003,
    name: "Vikram Patel",
    role: "Game Design Director",
    location: "Hyderabad",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    status: "Open for Work",
    exp: "10 Yrs",
    rate: "₹4L/mo",
    badges: ["Level Design", "GDD", "Balancing"],
    skills: [
      { name: "Game Design", level: 98 },
      { name: "Level Design", level: 92 },
      { name: "Narrative Design", level: 88 },
    ],
    category: "Designer",
    isPremium: true,
  },

  // Basic Profiles (square cards, muted design)
  {
    id: 2001,
    name: "Rahul Kumar",
    role: "Unity Developer",
    location: "Delhi",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    status: "Open for Work",
    exp: "3 Yrs",
    badges: ["Unity", "C#"],
    skills: [
      { name: "Unity", level: 75 },
      { name: "C#", level: 70 },
    ],
    category: "Programmer",
    isPremium: false,
  },
  {
    id: 2002,
    name: "Sneha Reddy",
    role: "2D Artist",
    location: "Chennai",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    status: "Freelance",
    exp: "2 Yrs",
    badges: ["Photoshop", "Illustrator"],
    skills: [
      { name: "Photoshop", level: 80 },
      { name: "Illustrator", level: 75 },
    ],
    category: "Artist",
    isPremium: false,
  },
  {
    id: 2003,
    name: "Aditya Singh",
    role: "Backend Developer",
    location: "Pune",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400",
    status: "Deployed",
    exp: "4 Yrs",
    badges: ["Node.js", "MongoDB"],
    skills: [
      { name: "Node.js", level: 82 },
      { name: "MongoDB", level: 78 },
    ],
    category: "Programmer",
    isPremium: false,
  },
  {
    id: 2004,
    name: "Meera Nair",
    role: "UI/UX Designer",
    location: "Kochi",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    status: "Open for Work",
    exp: "3 Yrs",
    badges: ["Figma", "Adobe XD"],
    skills: [
      { name: "Figma", level: 85 },
      { name: "UI Design", level: 80 },
    ],
    category: "Designer",
    isPremium: false,
  },
  {
    id: 2005,
    name: "Karthik Rao",
    role: "Game Audio Designer",
    location: "Bangalore",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    status: "Freelance",
    exp: "5 Yrs",
    badges: ["FMOD", "Wwise"],
    skills: [
      { name: "FMOD", level: 88 },
      { name: "Sound Design", level: 85 },
    ],
    category: "Audio",
    isPremium: false,
  },
  {
    id: 2006,
    name: "Ananya Joshi",
    role: "Junior Developer",
    location: "Jaipur",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    status: "Open for Work",
    exp: "1 Yr",
    badges: ["Unity", "Python"],
    skills: [
      { name: "Unity", level: 60 },
      { name: "Python", level: 65 },
    ],
    category: "Programmer",
    isPremium: false,
  },
  {
    id: 2007,
    name: "Rohan Gupta",
    role: "VFX Artist",
    location: "Mumbai",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400",
    status: "Deployed",
    exp: "4 Yrs",
    badges: ["After Effects", "Nuke"],
    skills: [
      { name: "After Effects", level: 82 },
      { name: "Nuke", level: 75 },
    ],
    category: "Artist",
    isPremium: false,
  },
  {
    id: 2008,
    name: "Pooja Sharma",
    role: "Technical Artist",
    location: "Noida",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    status: "Open for Work",
    exp: "3 Yrs",
    badges: ["Shaders", "Rigging"],
    skills: [
      { name: "Shader Programming", level: 78 },
      { name: "Rigging", level: 72 },
    ],
    category: "Artist",
    isPremium: false,
  },

  // More Premium Profiles
  {
    id: 1004,
    name: "Sanjay Krishnan",
    role: "Technical Director",
    location: "Chennai",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
    status: "Freelance",
    exp: "12 Yrs",
    rate: "₹5L/mo",
    badges: ["Pipeline", "Python", "C++"],
    skills: [
      { name: "Pipeline Development", level: 95 },
      { name: "Python", level: 92 },
      { name: "C++", level: 88 },
    ],
    category: "Programmer",
    isPremium: true,
  },

  // More Basic Profiles
  {
    id: 2009,
    name: "Neha Verma",
    role: "QA Tester",
    location: "Gurgaon",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400",
    status: "Open for Work",
    exp: "2 Yrs",
    badges: ["Testing", "Jira"],
    skills: [
      { name: "Game Testing", level: 80 },
      { name: "Bug Tracking", level: 85 },
    ],
    category: "Producer",
    isPremium: false,
  },
  {
    id: 2010,
    name: "Amit Desai",
    role: "Mobile Developer",
    location: "Ahmedabad",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400",
    status: "Freelance",
    exp: "4 Yrs",
    badges: ["Flutter", "React Native"],
    skills: [
      { name: "Flutter", level: 85 },
      { name: "Dart", level: 80 },
    ],
    category: "Programmer",
    isPremium: false,
  },
  {
    id: 2011,
    name: "Divya Iyer",
    role: "Concept Artist",
    location: "Bangalore",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
    status: "Open for Work",
    exp: "5 Yrs",
    badges: ["Concept Art", "Photoshop"],
    skills: [
      { name: "Concept Art", level: 90 },
      { name: "Digital Painting", level: 88 },
    ],
    category: "Artist",
    isPremium: false,
  },
  {
    id: 2012,
    name: "Suresh Babu",
    role: "AR/VR Developer",
    location: "Hyderabad",
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400",
    status: "Open for Work",
    exp: "3 Yrs",
    badges: ["Unity XR", "Oculus"],
    skills: [
      { name: "Unity XR", level: 78 },
      { name: "VR Development", level: 75 },
    ],
    category: "Programmer",
    isPremium: false,
  },

  // Another Premium Profile
  {
    id: 1005,
    name: "Lakshmi Venkat",
    role: "Animation Director",
    location: "Mumbai",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    status: "Open for Work",
    exp: "9 Yrs",
    rate: "₹3.5L/mo",
    badges: ["Animation", "Rigging", "Maya"],
    skills: [
      { name: "Character Animation", level: 96 },
      { name: "Maya", level: 92 },
      { name: "Motion Capture", level: 85 },
    ],
    category: "Artist",
    isPremium: true,
  },

  // Fill with more basic profiles
  {
    id: 2013,
    name: "Rajesh Pillai",
    role: "Multiplayer Developer",
    location: "Kochi",
    avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=400",
    status: "Deployed",
    exp: "6 Yrs",
    badges: ["Photon", "Mirror"],
    skills: [
      { name: "Networking", level: 85 },
      { name: "Photon", level: 80 },
    ],
    category: "Programmer",
    isPremium: false,
  },
  {
    id: 2014,
    name: "Tanya Malhotra",
    role: "Environment Artist",
    location: "Delhi",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400",
    status: "Freelance",
    exp: "4 Yrs",
    badges: ["Unreal", "World Machine"],
    skills: [
      { name: "Environment Art", level: 82 },
      { name: "Unreal Engine", level: 78 },
    ],
    category: "Artist",
    isPremium: false,
  },
  {
    id: 2015,
    name: "Varun Saxena",
    role: "AI Programmer",
    location: "Pune",
    avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400",
    status: "Open for Work",
    exp: "5 Yrs",
    badges: ["AI", "Behavior Trees"],
    skills: [
      { name: "Game AI", level: 88 },
      { name: "Behavior Trees", level: 85 },
    ],
    category: "Programmer",
    isPremium: false,
  },
];

/**
 * Get demo portfolios by category
 */
export const getDemoByCategory = (category: string): Developer[] => {
  if (category === "All") return demoPortfolios;
  return demoPortfolios.filter((d) => d.category === category);
};

/**
 * Get only premium demo portfolios
 */
export const getPremiumDemos = (): Developer[] => {
  return demoPortfolios.filter((d) => d.isPremium);
};

/**
 * Get only basic demo portfolios
 */
export const getBasicDemos = (): Developer[] => {
  return demoPortfolios.filter((d) => !d.isPremium);
};

export default demoPortfolios;
