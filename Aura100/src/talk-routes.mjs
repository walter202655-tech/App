import {turnRequestSchema,feedbackRequestSchema,talkInstructions,feedbackInstructions,FEEDBACK_SCHEMA} from "./conversation.mjs";
import {streamText,generateStructured,moderateText} from "./ai-service.mjs";
const BLOCKED="\\u0000BLOCKED",ERROR="\\u0000ERROR";
function badRequest(res,p){return res.status(400).json({error:"Los datos enviados no son válidos.",code:"BAD_REQUEST",details:p.error.issues.map(i=>({path:i.path.join("."),message:i.message}))});}
export function registerTalkRoutes(app){
 app.post("/api/ai/talk",async(req,res,next)=>{
  const p=turnRequestSchema.safeParse(req.body);if(!p.success)return badRequest(res,p);const d=p.data,c=new AbortController();res.on("close",()=>{if(!res.writableEnded)c.abort();});let started=false;
  try{if(await moderateText(d.message))return res.status(422).json({error:"No puedo procesar ese contenido. Reformula el mensaje como una conversación segura.",code:"CONTENT_REVIEW_REQUIRED"});let reply="";
   for await(const delta of streamText({instructions:talkInstructions(d.level,d.scenario),input:[...d.history,{role:"user",content:d.message}],maxOutputTokens:600,signal:c.signal})){reply+=delta;}
   if(!reply.trim())return res.status(502).json({error:"La conversación no produjo una respuesta.",code:"EMPTY_AI_RESPONSE"});
   if(await moderateText(reply))return res.status(502).json({error:"La respuesta generada no pudo mostrarse.",code:"OUTPUT_BLOCKED"});
   res.status(200);res.setHeader("Content-Type","text/plain; charset=utf-8");res.setHeader("X-Accel-Buffering","no");res.flushHeaders();started=true;
   for(let i=0;i<reply.length;i+=28){if(c.signal.aborted)return;res.write(reply.slice(i,i+28));if(i+28<reply.length)await new Promise(resolve=>setTimeout(resolve,14));}
   res.end();
  }catch(e){if(c.signal.aborted)return;if(!started)return next(e);console.error("Aura100 talk stream error:",e?.code||e?.name||"UnknownError");res.write(ERROR);res.end();}
 });
 app.post("/api/ai/talk/feedback",async(req,res,next)=>{try{const p=feedbackRequestSchema.safeParse(req.body);if(!p.success)return badRequest(res,p);const d=p.data;if(await moderateText(d.message))return res.status(422).json({error:"No puedo analizar ese contenido.",code:"CONTENT_REVIEW_REQUIRED"});const r=await generateStructured({instructions:feedbackInstructions(d.level),input:JSON.stringify({partnerMessage:d.partnerMessage,message:d.message,learnerMessage:d.message}),schemaName:"aura100_talk_feedback",schema:FEEDBACK_SCHEMA,maxOutputTokens:700,model:process.env.OPENAI_FEEDBACK_MODEL||undefined});const lower=d.message.toLowerCase();const corrections=(Array.isArray(r.corrections)?r.corrections:[]).filter(x=>x?.original&&x?.corrected&&x.original.trim().toLowerCase()!==x.corrected.trim().toLowerCase()&&lower.includes(x.original.trim().toLowerCase())).slice(0,2);const feedback={isCorrect:!corrections.length,corrections,naturalAlternative:corrections.length?"":String(r.naturalAlternative||""),usefulWords:(Array.isArray(r.usefulWords)?r.usefulWords:[]).slice(0,2)};if(await moderateText(JSON.stringify(feedback)))return res.status(502).json({error:"El análisis no pudo mostrarse.",code:"OUTPUT_BLOCKED"});res.json({feedback});}catch(e){next(e);}});
}
