// Fixed public-site health probe. No secrets, input URLs, customer data or writes.
const paths=['/','/personvern/','/avtalevilkar/'];
export default {
 async fetch(request,env={}) {
  if(request.method!=='GET')return new Response('Method not allowed',{status:405});
  if(new URL(request.url).pathname!=='/health')return new Response('Not found',{status:404});
  if(!env.MONITOR_TOKEN||request.headers.get('X-Ravenforge-Monitor')!==env.MONITOR_TOKEN)return new Response('Forbidden',{status:403});
  const checks=await Promise.all(paths.map(async path=>{
   try {
    const response=await fetch('https://ravenforge.no'+path,{
     method:'GET',redirect:'manual',headers:{'User-Agent':'RavenforgeUptimeProbe/1.0','Cache-Control':'no-cache'},
     cf:{cacheTtl:0,cacheEverything:false},signal:AbortSignal.timeout(12000)});
    await response.body?.cancel();return {path,status:response.status,okay:response.status===200};
   }catch{return {path,status:null,okay:false};}
  }));
  const healthy=checks.every(c=>c.okay);
  return Response.json({healthy,checkedAt:new Date().toISOString(),checks},{status:healthy?200:503,headers:{'Cache-Control':'no-store'}});
 }
};
