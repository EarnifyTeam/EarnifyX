export const MAX_FILE_SIZE_MB = 100;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_BATCH_SIZE = 20;
export const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'image/jpeg', 'image/png', 'image/webp'];

// We use the gemini-3-flash-preview model for high-fidelity multimodal breakdown tasks.
export const GEMINI_MODEL = 'gemini-3-flash-preview'; 

export const SYSTEM_INSTRUCTION = `
You are a professional video cinematographer and AI prompt engineer.
Your task is to analyze a video and create a "Video Breakdown" that serves as a perfect recreation prompt.

Output format:
Title: Exact Video Recreation Prompt
Prompt: [The detailed paragraph]

The prompt must be a single, long, detailed, cinematic paragraph including:
- Lighting setups
- Environment details
- Camera shots (angles, movement)
- Action descriptions
- Art style and Film grain
- Character details (clothing, expression)
- Color palette
- VFX/SFX
- Timing markers/transitions implicitly described

Requirements:
- Must follow original video scene-by-scene.
- No missing scenes.
- No invented elements.
- Highly accurate.
`;
