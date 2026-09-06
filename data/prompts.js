/**
 * EarnifyX Lab - Master Prompts Dataset
 * Contains high-converting, tested AI prompts across ChatGPT, Midjourney, Claude, Gemini & Automation.
 */
const PROMPTS_DATA = [
    {
        id: "viral-youtube-script-engine",
        title: "YouTube Viral Script Engine",
        category: "YouTube",
        badge: "Free",
        badgeType: "success",
        icon: "▶️",
        iconBg: "#ef4444",
        model: "ChatGPT / Claude",
        views: "18.4k",
        likes: "1,240",
        shortDescription: "Create engaging, high-retention YouTube scripts with psychological hooks, open loops, and retention resets.",
        promptText: `Act as a world-class YouTube storytelling expert and retention strategist.
I am making a video about: [INSERT YOUR TOPIC HERE].
Target Audience: [INSERT AUDIENCE, e.g., beginner programmers / busy entrepreneurs].
Desired Video Length: [e.g., 8-10 minutes].

Please generate a complete, structured YouTube video script with the following sections:

1. THE HOOK (0:00 - 0:45):
   - First 5 seconds visual & verbal hook (Shocking stat, bold contrarian claim, or dramatic question).
   - Core promise: What high-value problem will be solved by the end.
   - Open Loop: Introduce a critical mystery or payoff that happens near the end.

2. THE SETUP & AGITATION (0:45 - 2:00):
   - Explain why the conventional approach fails.
   - Empathize with the viewer's frustration.

3. VALUE PILLARS (Main Body):
   - Break into 3 actionable steps/secrets.
   - Include visual/B-roll cue suggestions in [BRACKETS].
   - Inject mini-retention resets (pattern interrupts) every 90 seconds.

4. CALL TO ACTION & END SCREEN (Last 45 seconds):
   - Seamless transition into the next recommended video with zero outro drop-off signals.`,
        locked: false,
        featured: true,
        tags: ["YouTube", "Video", "Writing", "Free"]
    },
    {
        id: "photorealistic-midjourney-v6",
        title: "Ultra-Realistic Portrait Generator",
        category: "Image",
        badge: "Premium",
        badgeType: "warning",
        icon: "🎨",
        iconBg: "#3b82f6",
        model: "Midjourney v6 / Flux.1",
        views: "24.9k",
        likes: "2,890",
        shortDescription: "Ultra photorealistic 8k portraits with cinema lighting, 85mm lens depth and natural skin texture.",
        promptText: `Cinematic editorial portrait photograph of [SUBJECT: e.g. a 28-year-old creative founder in a minimalist concrete architectural studio], captured on Sony A7R V with 85mm f/1.4 GM lens, natural diffused morning window lighting, rim light highlighting facial contours, hyper-detailed skin pores and fine textures, authentic emotion, subtle film grain, muted color grading, Kodachrome tone, shallow depth of field with creamy bokeh background --ar 16:9 --v 6.0 --style raw --q 2`,
        locked: true,
        previewText: "Cinematic editorial portrait photograph of [SUBJECT]... (Unlock with EarnifyX Premium to view camera parameters, lighting tokens, and aspect ratio flags)",
        featured: true,
        tags: ["Image", "Midjourney", "Flux", "Premium"]
    },
    {
        id: "viral-social-media-hooks",
        title: "30-Day Viral Social Hooks",
        category: "Social Media",
        badge: "Free",
        badgeType: "success",
        icon: "📱",
        iconBg: "#ec4899",
        model: "ChatGPT / Claude / Gemini",
        views: "31.2k",
        likes: "3,100",
        shortDescription: "Viral post ideas and hook frameworks for Instagram Reels, X Threads, and LinkedIn carousels.",
        promptText: `You are a viral social media growth hacker with over 10M combined impressions.
My Niche: [INSERT YOUR NICHE, e.g. SaaS building, Freelancing, Personal Finance].
My Target Audience: [INSERT TARGET AUDIENCE].

Generate 10 high-converting social media hooks categorized by proven psychological frameworks:
1. The Contrarian Hook ("Most people think X, but the reality is Y...")
2. The "Steal My Exact System" Hook ("I spent 500 hours learning X, here is the 2-minute summary...")
3. The Before vs After Transformation Hook
4. The "Stop Doing This Fatal Mistake" Hook
5. The Curated Resource List Hook

For each hook, provide:
- The exact punchy opening line (under 15 words)
- The visual idea or carousel slide 1 headline
- A 3-sentence body structure to maximize comments and saves.`,
        locked: false,
        featured: true,
        tags: ["Social Media", "Writing", "Growth", "Free"]
    },
    {
        id: "profitable-micro-saas-ideation",
        title: "Micro-SaaS & Business Ideator",
        category: "Business",
        badge: "Free",
        badgeType: "success",
        icon: "💡",
        iconBg: "#f59e0b",
        model: "Claude 3.5 Sonnet / GPT-4o",
        views: "14.1k",
        likes: "1,520",
        shortDescription: "Find profitable, low-competition micro-SaaS and digital product opportunities with validation roadmaps.",
        promptText: `Act as a senior startup advisor and tech market researcher.
Analyze the following industry: [INSERT INDUSTRY, e.g. Real Estate, Creator Economy, Dental Clinics].
Target Revenue Goal: $5,000 to $20,000/mo MRR.

Provide 3 distinct B2B Micro-SaaS software concepts that solve painful, expensive, recurring problems:

For each concept, detail:
1. Problem Statement: What specific manual task takes 10+ hours a week?
2. Software Solution: The core MVP feature (keep scope buildable in under 3 weeks).
3. Target Customer Persona & Willingness to Pay ($29/mo vs $99/mo).
4. Unfair Distribution Advantage: Where to find the first 50 paying customers without paid ads (Reddit communities, cold email scrapers, directories).
5. Tech Stack Recommendation: (e.g. Next.js, Supabase, Stripe, AI API).`,
        locked: false,
        featured: true,
        tags: ["Business", "SaaS", "Automation", "Free"]
    },
    {
        id: "daily-ai-automation-agent",
        title: "Autonomous Daily AI Agent",
        category: "Automation",
        badge: "Premium",
        badgeType: "warning",
        icon: "⚙️",
        iconBg: "#8b5cf6",
        model: "Make.com / Python / OpenAI API",
        views: "21.6k",
        likes: "2,430",
        shortDescription: "Automate daily repetitive research, email triaging, social posting and client follow-ups with AI.",
        promptText: `You are an enterprise AI automation architect. Design a modular webhook-driven automation flow using [Make.com / n8n / Python] that connects:
- Input: Daily RSS feeds, Google Sheets lead list, and inbound Gmail inquiries.
- Logic:
  1. Filter messages by intent using LLM JSON schema response.
  2. If Lead: Score lead (1-10) and draft personalized cold response in draft folder.
  3. If Content: Summarize key market trends and generate 3 LinkedIn post drafts directly into Notion Content Hub.
  4. Output: Send a daily summary digest to my Telegram Bot every morning at 8:00 AM.

Provide the exact JSON schema definition, system prompts for each agent node, and error handling fallback logic.`,
        locked: true,
        previewText: "You are an enterprise AI automation architect. Design a modular webhook-driven automation flow... (Unlock with EarnifyX Premium to view full webhook configs and n8n JSON blue-prints)",
        featured: true,
        tags: ["Automation", "Business", "Premium"]
    },
    {
        id: "longform-seo-blog-writer",
        title: "Undetectable Long-Form SEO Article",
        category: "Writing",
        badge: "Free",
        badgeType: "success",
        icon: "✍️",
        iconBg: "#10b981",
        model: "Claude 3.5 Sonnet",
        views: "19.3k",
        likes: "1,870",
        shortDescription: "Write in-depth, human-sounding 2,500+ word SEO articles that rank on Google with zero fluff.",
        promptText: `Act as a senior technical SEO copywriter with 10+ years of editorial experience.
Topic: [INSERT PRIMARY KEYWORD & TOPIC]
Secondary Keywords: [INSERT 3-5 KEYWORDS]
Target Word Count: 2,000 - 2,500 words.

Writing Style Guidelines:
- Human tone: Vary sentence rhythm (mix 4-word punchy sentences with compound explanatory sentences).
- Zero AI clichés: Do NOT use phrases like "In today's fast-paced digital world", "delve into", "tapestry", "revolutionize", "game-changer", "testament".
- Rich formatting: Include comparison tables, markdown checklists, actionable step-by-step instructions, and bold key terms.
- Search Intent: Address the "People Also Ask" questions thoroughly.

Generate a comprehensive article with:
1. SEO Optimized Meta Title (under 60 chars) & Meta Description (under 155 chars).
2. H1 Headline and complete H2/H3 outline.
3. Full article content written out section by section.
4. FAQ section with FAQPage schema friendly format.`,
        locked: false,
        featured: false,
        tags: ["Writing", "SEO", "Blog", "Free"]
    },
    {
        id: "sora-runway-gen3-video-prompt",
        title: "Cinematic Video Generator (Runway / Luma)",
        category: "Video",
        badge: "Premium",
        badgeType: "warning",
        icon: "🎬",
        iconBg: "#6366f1",
        model: "Runway Gen-3 / Kling / Luma Dream Machine",
        views: "16.8k",
        likes: "1,950",
        shortDescription: "Professional camera movement and dynamic lighting prompts for AI cinematic video generators.",
        promptText: `Cinematic FPV drone shot sweeping fast through [SCENE: a neon-drenched Tokyo cyberpunk alleyway during a rainy midnight], reflections in water puddles, camera smoothly ascends upward towards towering holographic billboards, cinematic lighting, 35mm anamorphic lens, volumetric steam rising from street grates, hyper-realistic physics, 4k 60fps slow-motion finish. Camera motion: FPV zoom in, slight tilt up, smooth gimbal stabilization.`,
        locked: true,
        previewText: "Cinematic FPV drone shot sweeping fast through [SCENE]... (Unlock EarnifyX Premium for camera movement syntax, fps multipliers, and motion seeds)",
        featured: false,
        tags: ["Video", "AI", "Runway", "Premium"]
    }
];

if (typeof window !== "undefined") {
    try {
        const saved = localStorage.getItem("earnifyx_data_prompts");
        window.PROMPTS_DATA = saved ? JSON.parse(saved) : PROMPTS_DATA;
    } catch (e) {
        window.PROMPTS_DATA = PROMPTS_DATA;
    }
}
