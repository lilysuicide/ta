// No HTML/API cache: updates stay fresh, and no chat/key is cached by this worker.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
 event.waitUntil((async()=>{
  let data={};try{data=event.data?.json()||{};}catch{}
  const id=typeof data.id==='string'?data.id:'new';
  await self.registration.showNotification(String(data.title||'ta').slice(0,40),{
   body:String(data.body||'有新消息，点开看看。').slice(0,160),tag:'ta-unread',
   icon:new URL('icon-192.png',self.registration.scope).href,badge:new URL('icon-192.png',self.registration.scope).href,
   data:{id},renotify:false});
  const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for(const client of clients)client.postMessage({type:'TA_PUSH',id});
 })());
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 event.waitUntil((async()=>{
  const target=new URL('./',self.registration.scope).href;
  const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for(const client of clients)if(client.url.startsWith(target)){await client.focus();client.postMessage({type:'TA_PUSH'});return;}
  await self.clients.openWindow(target);
 })());
});
