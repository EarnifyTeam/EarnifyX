/**
 * EarnifyX Lab - Blog Posts Dataset
 */
const BLOG_DATA = [
    {
        id: "how-to-build-chrome-extension-ai",
        title: "How I Built an AI Chrome Extension that Earned $1,200 in Month One",
        category: "Extensions",
        date: "Feb 28, 2026",
        readTime: "6 min read",
        author: "EarnifyX Team",
        thumbnail: "assets/images/blog-1.svg",
        shortDescription: "A practical breakdown of building Manifest V3 extensions with OpenAI APIs, background service workers, and Chrome Web Store approval.",
        content: `Building your own Chrome extension is one of the highest leverage skills for modern creators and indie hackers. In this guide, we break down our entire tech stack, from Manifest V3 service workers to local caching and Stripe checkout integration.`,
        featured: true
    },
    {
        id: "master-prompt-engineering-framework",
        title: "The 4-Part Prompt Framework for 10x Better Claude 3.5 & GPT-4o Outputs",
        category: "AI Prompts",
        date: "Mar 02, 2026",
        readTime: "8 min read",
        author: "EarnifyX Team",
        thumbnail: "assets/images/blog-2.svg",
        shortDescription: "Learn how to use Role Calibration, Negative Constraints, Few-Shot Output Formatting, and Chain-of-Thought reasoning.",
        content: `Most people get mediocre results from LLMs because they treat AI like Google Search rather than a senior colleague. Here is the exact prompt engineering blueprint we use across our lab products.`,
        featured: true
    },
    {
        id: "best-automation-workflows-solopreneurs",
        title: "7 Autonomous AI Workflows Every Solo Creator Should Run in 2026",
        category: "Automation",
        date: "Mar 05, 2026",
        readTime: "5 min read",
        author: "EarnifyX Team",
        thumbnail: "assets/images/blog-3.svg",
        shortDescription: "Stop wasting hours on manual formatting. Connect RSS feeds, video transcripts, and auto-generated social hooks with Make and n8n.",
        content: `When you're running a solo business, time is your scarcest asset. We show you how we connect Make.com, Supabase, and Claude 3.5 Sonnet to publish multi-channel content automatically.`,
        featured: true
    },
    {
        id: "future-of-creator-economy-ai",
        title: "Why AI-First Solo Creators Will Outperform 20-Person Media Agencies",
        category: "Strategy",
        date: "Mar 06, 2026",
        readTime: "7 min read",
        author: "EarnifyX Team",
        thumbnail: "assets/images/blog-4.svg",
        shortDescription: "How individual builders armed with custom software, prompt vaults, and automation agents are disrupting traditional media.",
        content: `The leverage ratio for single creators has exploded. With the right custom software and browser extensions, one person can execute research, production, and distribution at scale.`,
        featured: false
    }
];

if (typeof window !== "undefined") {
    try {
        const saved = localStorage.getItem("earnifyx_data_blog");
        window.BLOG_DATA = saved ? JSON.parse(saved) : BLOG_DATA;
    } catch (e) {
        window.BLOG_DATA = BLOG_DATA;
    }
}
