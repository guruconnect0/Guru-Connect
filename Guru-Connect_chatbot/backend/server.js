import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());

app.post("/chat",async(req,res)=>{
    try{
    const usermsg=req.body.message.toLowerCase();
   const allowedKeywords = [
  "study", "studies", "student", "education", "school", "college", "university",
  "exam", "exams", "test", "quiz", "assignment", "homework", "syllabus",
  "career", "career path", "career guidance", "career growth",
  "job", "jobs", "job search", "job role", "job preparation",
  "placement", "placements", "campus placement", "off campus",
  "interview", "mock interview", "hr interview", "technical interview",
  "resume", "cv", "portfolio", "linkedin", "profile",
  "internship", "intern", "trainee", "apprentice",
  "skill", "skills", "upskill", "reskill",
  "learning", "learn", "training", "practice",
  "course", "courses", "certification", "certificate",
  "mentor", "mentorship", "mentoring", "coach", "coaching",
  "guidance", "guide", "support", "counselling", "counseling",
  "guruconnect", "guru", "mentor connect",
  "coding", "programming", "developer", "software", "engineer",
  "web development", "ai", "machine learning", "data science",
  "roadmap", "growth", "future", "career plan",
  "fresher", "graduate", "pass out",
  "project", "projects", "portfolio",
  "soft skills", "communication", "english",
  "confidence", "presentation", "public speaking"
];

    const containsKeyword = allowedKeywords.some(keyword => usermsg.includes(keyword));
    if (!containsKeyword) {
      return res.json({ reply: "Sorry, GuruConnect only helps with education, study, career, skills and mentorship." });
    }
 
const response=await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,{

    contents:[
        {
            parts:[{text:`You are GuruConnect AI Mentor.

You only answer questions related to:
education, study, exams, placements, careers, courses, skills, internships, mentorship and GuruConnect.
1. One short point
2. One short point
3. One short point
4. One short point
5. One short point

Rules:  
- Each point must be on a new line
- Do not write multiple points in one line
- Do not write paragraphs
- Do not use markdown, bullets, ** or ##
- Max 5 points
- Max 100 words
- Use friendly emojis to make it engaging
Question:${usermsg}`
        }]
        }
    ]
}

);
let reply=response.data.candidates[0].content.parts[0].text;
reply = reply.replace(/(\d+\.)/g, "\n$1").trim();

res.json({reply});
}
catch(err){
    console.error(err);
    res.status(500).json({reply:"gemini API error"});
}
});
app.listen(5000,()=>{
    console.log("Server running on port 5000");
});

