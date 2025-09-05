"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "hi" | "raj"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.mapView": "Map View",
    "nav.problems": "Problems",
    "nav.settings": "Settings",
    "nav.signOut": "Sign out",

    // Dashboard
    "dashboard.title": "Municipal Dashboard",
    "dashboard.overview": "Dashboard Overview",
    "dashboard.overviewDescription": "Monitor and manage citizen-reported problems across the municipality",
    "dashboard.totalProblems": "Total Problems",
    "dashboard.resolved": "Resolved",
    "dashboard.pending": "Pending",
    "dashboard.resolutionRate": "Resolution Rate",
    "dashboard.problemsOverTime": "Problems Over Time",
    "dashboard.problemsByType": "Problems by Type",
    "dashboard.monthlyReported": "Monthly reported vs resolved problems",
    "dashboard.typeDistribution": "Distribution of problem categories",
    "dashboard.recentProblems": "Recent Problems",
    "dashboard.topProblemTypes": "Top Problem Types",
    "dashboard.mostUpvoted": "Most Upvoted Problem",
    "dashboard.highestPriority": "Problem with highest community priority",
    "dashboard.recentActivity": "Recent Activity",
    "dashboard.latestReports": "Latest problem reports and status updates",
    "dashboard.fromLastMonth": "from last month",
    "dashboard.reports": "reports",
    "dashboard.votes": "votes",
    "dashboard.reported": "Reported",
    "dashboard.resolved": "Resolved",

    // Problem statuses
    "status.pending": "pending",
    "status.inProgress": "in progress",
    "status.resolved": "resolved",

    // Problem types
    "problemType.potholes": "Potholes",
    "problemType.streetlights": "Streetlights",
    "problemType.garbage": "Garbage",
    "problemType.waterIssues": "Water Issues",
    "problemType.other": "Other",

    // User roles
    "role.municipal": "Municipal Staff",
    "role.ngo": "NGO",

    // Priority levels
    "priority.high": "high",
    "priority.medium": "medium",
    "priority.low": "low",
    "priority.priority": "Priority",

    // Time indicators
    "time.hoursAgo": "hours ago",
    "time.dayAgo": "day ago",

    // Settings
    "settings.title": "Settings",
    "settings.description": "Manage your account settings and preferences",
    "settings.profile": "Profile",
    "settings.notifications": "Notifications",
    "settings.map": "Map",
    "settings.problems": "Problems",
    "settings.system": "System",
    "settings.save": "Save Settings",
    "settings.saved": "Settings saved successfully!",
    "settings.savedDescription": "Your preferences have been updated.",

    // Profile
    "profile.title": "Profile Information",
    "profile.description": "Update your personal information and account details",
    "profile.fullName": "Full Name",
    "profile.email": "Email",
    "profile.phone": "Phone Number",
    "profile.department": "Department",

    // System
    "system.title": "System Preferences",
    "system.description": "Configure system-wide settings and preferences",
    "system.theme": "Theme",
    "system.language": "Language",
    "system.timezone": "Timezone",
    "system.light": "Light",
    "system.dark": "Dark",
    "system.system": "System",
  },
  hi: {
    // Navigation
    "nav.dashboard": "डैशबोर्ड",
    "nav.mapView": "मैप व्यू",
    "nav.problems": "समस्याएं",
    "nav.settings": "सेटिंग्स",
    "nav.signOut": "साइन आउट",

    // Dashboard
    "dashboard.title": "नगरपालिका डैशबोर्ड",
    "dashboard.overview": "डैशबोर्ड अवलोकन",
    "dashboard.overviewDescription": "नगरपालिका में नागरिकों द्वारा रिपोर्ट की गई समस्याओं की निगरानी और प्रबंधन करें",
    "dashboard.totalProblems": "कुल समस्याएं",
    "dashboard.resolved": "हल की गई",
    "dashboard.pending": "लंबित",
    "dashboard.resolutionRate": "समाधान दर",
    "dashboard.problemsOverTime": "समय के साथ समस्याएं",
    "dashboard.problemsByType": "प्रकार के अनुसार समस्याएं",
    "dashboard.monthlyReported": "मासिक रिपोर्ट की गई बनाम हल की गई समस्याएं",
    "dashboard.typeDistribution": "समस्या श्रेणियों का वितरण",
    "dashboard.recentProblems": "हाल की समस्याएं",
    "dashboard.topProblemTypes": "मुख्य समस्या प्रकार",
    "dashboard.mostUpvoted": "सबसे अधिक वोट वाली समस्या",
    "dashboard.highestPriority": "सबसे अधिक सामुदायिक प्राथमिकता वाली समस्या",
    "dashboard.recentActivity": "हाल की गतिविधि",
    "dashboard.latestReports": "नवीनतम समस्या रिपोर्ट और स्थिति अपडेट",
    "dashboard.fromLastMonth": "पिछले महीने से",
    "dashboard.reports": "रिपोर्ट",
    "dashboard.votes": "वोट",
    "dashboard.reported": "रिपोर्ट की गई",
    "dashboard.resolved": "हल की गई",

    // Problem statuses
    "status.pending": "लंबित",
    "status.inProgress": "प्रगति में",
    "status.resolved": "हल की गई",

    // Problem types
    "problemType.potholes": "गड्ढे",
    "problemType.streetlights": "स्ट्रीट लाइट",
    "problemType.garbage": "कचरा",
    "problemType.waterIssues": "पानी की समस्याएं",
    "problemType.other": "अन्य",

    // User roles
    "role.municipal": "नगरपालिका कर्मचारी",
    "role.ngo": "एनजीओ",

    // Priority levels
    "priority.high": "उच्च",
    "priority.medium": "मध्यम",
    "priority.low": "कम",
    "priority.priority": "प्राथमिकता",

    // Time indicators
    "time.hoursAgo": "घंटे पहले",
    "time.dayAgo": "दिन पहले",

    // Settings
    "settings.title": "सेटिंग्स",
    "settings.description": "अपनी खाता सेटिंग्स और प्राथमिकताओं को प्रबंधित करें",
    "settings.profile": "प्रोफ़ाइल",
    "settings.notifications": "सूचनाएं",
    "settings.map": "नक्शा",
    "settings.problems": "समस्याएं",
    "settings.system": "सिस्टम",
    "settings.save": "सेटिंग्स सहेजें",
    "settings.saved": "सेटिंग्स सफलतापूर्वक सहेजी गईं!",
    "settings.savedDescription": "आपकी प्राथमिकताएं अपडेट कर दी गई हैं।",

    // Profile
    "profile.title": "प्रोफ़ाइल जानकारी",
    "profile.description": "अपनी व्यक्तिगत जानकारी और खाता विवरण अपडेट करें",
    "profile.fullName": "पूरा नाम",
    "profile.email": "ईमेल",
    "profile.phone": "फोन नंबर",
    "profile.department": "विभाग",

    // System
    "system.title": "सिस्टम प्राथमिकताएं",
    "system.description": "सिस्टम-व्यापी सेटिंग्स और प्राथमिकताओं को कॉन्फ़िगर करें",
    "system.theme": "थीम",
    "system.language": "भाषा",
    "system.timezone": "समय क्षेत्र",
    "system.light": "हल्का",
    "system.dark": "गहरा",
    "system.system": "सिस्टम",
  },
  raj: {
    // Navigation
    "nav.dashboard": "डैशबोर्ड",
    "nav.mapView": "नक्शो",
    "nav.problems": "समस्यावां",
    "nav.settings": "सेटिंग",
    "nav.signOut": "साइन आउट",

    // Dashboard
    "dashboard.title": "नगरपालिका डैशबोर्ड",
    "dashboard.overview": "डैशबोर्ड अवलोकन",
    "dashboard.overviewDescription": "नगरपालिका में नागरिकों द्वारा रिपोर्ट की गई समस्याओं की निगरानी और प्रबंधन करें",
    "dashboard.totalProblems": "कुल समस्यावां",
    "dashboard.resolved": "हल होई",
    "dashboard.pending": "लंबित",
    "dashboard.resolutionRate": "समाधान दर",
    "dashboard.problemsOverTime": "टाइम के साथ समस्यावां",
    "dashboard.problemsByType": "किस्म के हिसाब सूं समस्यावां",
    "dashboard.monthlyReported": "मासिक रिपोर्ट की गई बनाम हल होई",
    "dashboard.typeDistribution": "समस्या श्रेणियों का वितरण",
    "dashboard.recentProblems": "हाल की समस्यावां",
    "dashboard.topProblemTypes": "मुख्य समस्या प्रकार",
    "dashboard.mostUpvoted": "सबसे अधिक वोट वाली समस्या",
    "dashboard.highestPriority": "सबसे अधिक सामुदायिक प्राथमिकता वाली समस्या",
    "dashboard.recentActivity": "हाल की गतिविधि",
    "dashboard.latestReports": "नवीनतम समस्या रिपोर्ट और स्थिति अपडेट",
    "dashboard.fromLastMonth": "पिछले महीने से",
    "dashboard.reports": "रिपोर्ट",
    "dashboard.votes": "वोट",
    "dashboard.reported": "रिपोर्ट की गई",
    "dashboard.resolved": "हल होई",

    // Problem statuses
    "status.pending": "लंबित",
    "status.inProgress": "प्रगति में",
    "status.resolved": "हल होई",

    // Problem types
    "problemType.potholes": "गड्ढे",
    "problemType.streetlights": "स्ट्रीट लाइट",
    "problemType.garbage": "कचरा",
    "problemType.waterIssues": "पानी की समस्याएं",
    "problemType.other": "अन्य",

    // User roles
    "role.municipal": "नगरपालिका कर्मचारी",
    "role.ngo": "एनजीओ",

    // Priority levels
    "priority.high": "उच्च",
    "priority.medium": "मध्यम",
    "priority.low": "कम",
    "priority.priority": "प्राथमिकता",

    // Time indicators
    "time.hoursAgo": "घंटा पहले",
    "time.dayAgo": "दिन पहले",

    // Settings
    "settings.title": "सेटिंग",
    "settings.description": "आपकी खाता सेटिंग अर प्राथमिकतावां नै संभालो",
    "settings.save": "सेटिंग सेव करो",
    "settings.saved": "सेटिंग सफलता सूं सेव होगी!",
    "settings.savedDescription": "आपकी प्राथमिकतावां अपडेट होगी।",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedSettings = localStorage.getItem("municipalSettings")
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      if (parsed.language) {
        setLanguage(parsed.language)
      }
    }
  }, [])

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
