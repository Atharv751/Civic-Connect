"use client"

import { useLanguage } from "@/contexts/language-context"

// Translation function that uses the language context
export function useTranslation() {
  const { language, t } = useLanguage()
  return { t }
}

// Static translation function for components that can't use hooks
export function t(key: string): string {
  // Get language from localStorage to match the context behavior
  const language =
    typeof window !== "undefined"
      ? (() => {
          const savedSettings = localStorage.getItem("municipalSettings")
          if (savedSettings) {
            const parsed = JSON.parse(savedSettings)
            return parsed.language || "en"
          }
          return "en"
        })()
      : "en"

  // Use the same translations object from the context
  const translations: any = {
    en: {
      nav: {
        dashboard: "Dashboard",
        mapView: "Map View",
        problems: "Problems",
        settings: "Settings",
        signOut: "Sign Out",
      },
      dashboard: {
        title: "Municipal Dashboard",
        overview: "Dashboard Overview",
        overviewDescription: "Monitor and manage citizen-reported problems across the municipality",
        totalProblems: "Total Problems",
        resolved: "Resolved",
        pending: "Pending",
        resolutionRate: "Resolution Rate",
        problemsOverTime: "Problems Over Time",
        problemsByType: "Problems by Type",
        monthlyReported: "Monthly reported vs resolved problems",
        typeDistribution: "Distribution of problem categories",
        recentProblems: "Recent Problems",
        topProblemTypes: "Top Problem Types",
        mostUpvoted: "Most Upvoted Problem",
        highestPriority: "Problem with highest community priority",
        recentActivity: "Recent Activity",
        latestReports: "Latest problem reports and status updates",
        fromLastMonth: "from last month",
        reports: "reports",
        votes: "votes",
        reported: "Reported",
      },
      role: {
        municipal: "Municipal Staff",
        ngo: "NGO",
      },
      status: {
        pending: "pending",
        inprogress: "in progress",
        resolved: "resolved",
      },
      priority: {
        high: "high",
        medium: "medium",
        low: "low",
        priority: "Priority",
      },
      problemType: {
        potholes: "Potholes",
        streetlights: "Streetlights",
        garbage: "Garbage",
        waterissues: "Water Issues",
        other: "Other",
      },
    },
    hi: {
      nav: {
        dashboard: "डैशबोर्ड",
        mapView: "मैप व्यू",
        problems: "समस्याएं",
        settings: "सेटिंग्स",
        signOut: "साइन आउट",
      },
      dashboard: {
        title: "नगरपालिका डैशबोर्ड",
        overview: "डैशबोर्ड अवलोकन",
        overviewDescription: "नगरपालिका में नागरिकों द्वारा रिपोर्ट की गई समस्याओं की निगरानी और प्रबंधन करें",
        totalProblems: "कुल समस्याएं",
        resolved: "हल की गई",
        pending: "लंबित",
        resolutionRate: "समाधान दर",
        problemsOverTime: "समय के साथ समस्याएं",
        problemsByType: "प्रकार के अनुसार समस्याएं",
        monthlyReported: "मासिक रिपोर्ट की गई बनाम हल की गई समस्याएं",
        typeDistribution: "समस्या श्रेणियों का वितरण",
        recentProblems: "हाल की समस्याएं",
        topProblemTypes: "मुख्य समस्या प्रकार",
        mostUpvoted: "सबसे अधिक वोट वाली समस्या",
        highestPriority: "सबसे अधिक सामुदायिक प्राथमिकता वाली समस्या",
        recentActivity: "हाल की गतिविधि",
        latestReports: "नवीनतम समस्या रिपोर्ट और स्थिति अपडेट",
        fromLastMonth: "पिछले महीने से",
        reports: "रिपोर्ट",
        votes: "वोट",
        reported: "रिपोर्ट की गई",
      },
      role: {
        municipal: "नगरपालिका कर्मचारी",
        ngo: "एनजीओ",
      },
      status: {
        pending: "लंबित",
        inprogress: "प्रगति में",
        resolved: "हल की गई",
      },
      priority: {
        high: "उच्च",
        medium: "मध्यम",
        low: "कम",
        priority: "प्राथमिकता",
      },
      problemType: {
        potholes: "गड्ढे",
        streetlights: "स्ट्रीट लाइट",
        garbage: "कचरा",
        waterissues: "पानी की समस्याएं",
        other: "अन्य",
      },
    },
  }

  const keys = key.split(".")
  let value: any = translations[language as keyof typeof translations]

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k]
    } else {
      // Fallback to English
      value = translations.en
      for (const fallbackKey of keys) {
        if (value && typeof value === "object" && fallbackKey in value) {
          value = value[fallbackKey]
        } else {
          return key
        }
      }
      break
    }
  }

  return typeof value === "string" ? value : key
}
