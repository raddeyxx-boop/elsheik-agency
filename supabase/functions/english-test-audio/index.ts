import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
Deno.serve(async(req)=>{
 try{
  const{attempt_id,anonymous_token,paths}=await req.json()
  if(!attempt_id||!anonymous_token||!Array.isArray(paths))return new Response('طلب غير صالح',{status:400})
  const url=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const verifier=createClient(url,anon,{global:{headers:{Authorization:req.headers.get('Authorization')||''}}})
  const{data:allowed,error}=await verifier.rpc('english_attempt_allowed',{p_id:attempt_id,p_token:anonymous_token})
  if(error||!allowed)return new Response('غير مصرح',{status:403})
  const admin=createClient(url,service),urls:Record<string,string>={}
  for(const path of paths.slice(0,2)){const{data}=await admin.storage.from('english-test-audio').createSignedUrl(String(path),600);if(data?.signedUrl)urls[String(path)]=data.signedUrl}
  return Response.json({urls})
 }catch{return new Response('تعذر تجهيز المقاطع الصوتية',{status:500})}
})
