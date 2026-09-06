/**
 * EarnifyX Lab - Tutorials & Guides Dataset
 */
const TUTORIALS_DATA = [
    {
        id: "chrome-extension-starter-tutorial",
        title: "Build Your First AI Chrome Extension in 30 Minutes",
        category: "Extension Tutorials",
        difficulty: "Beginner",
        time: "15 min",
        type: "Code Walkthrough",
        thumbnail: "assets/images/tut-1.svg",
        description: "Step-by-step tutorial covering manifest.json, background scripts, popup UI, and making secure API calls to Claude/OpenAI.",
        steps: [
            "Setting up the Manifest V3 configuration",
            "Creating the popup interface with clean HTML/CSS",
            "Connecting to OpenAI API with streaming responses",
            "Testing locally in chrome://extensions"
        ],
        featured: true
    },
    {
        id: "master-midjourney-consistent-characters",
        title: "Create Consistent AI Characters Across 20+ Scenes",
        category: "AI Tutorials",
        difficulty: "Intermediate",
        time: "12 min",
        type: "Visual Guide",
        thumbnail: "assets/images/tut-2.svg",
        description: "Master the --cref (character reference) and --sref (style reference) flags in Midjourney v6 to produce cohesive comic and video assets.",
        steps: [
            "Generating your base character portrait seed",
            "Using character reference flags effectively",
            "Controlling lighting, expressions, and clothing changes",
            "Fixing facial discrepancies in post-production"
        ],
        featured: true
    },
    {
        id: "automate-youtube-to-newsletter",
        title: "Automate YouTube Video to Multi-Platform Newsletter",
        category: "Automation Guides",
        difficulty: "Advanced",
        time: "20 min",
        type: "Automation Blueprint",
        thumbnail: "assets/images/tut-3.svg",
        description: "Build an automated pipeline that listens for new YouTube uploads, pulls transcripts, writes a polished newsletter issue, and drafts it in Beehiiv/Substack.",
        steps: [
            "Configuring webhook triggers on YouTube RSS",
            "Extracting and cleaning subtitle text with Python",
            "Running structured prompt synthesis via Claude 3.5",
            "Pushing drafts to Substack / Beehiiv API"
        ],
        featured: true
    }
];

if (typeof window !== "undefined") {
    window.TUTORIALS_DATA = TUTORIALS_DATA;
}
