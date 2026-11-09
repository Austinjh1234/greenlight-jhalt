'use client';
export default function WhatsAppLink({message='Hello Greenlight, I have a question about my Portugal visa.'}:{message?:string}){
 const raw=process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER?.replace(/\D/g,'');
 if(!raw)return null;
 const href='https://wa.me/'+raw+'?text='+encodeURIComponent(message);
 return <a className="whatsapp-fab" href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat with Greenlight on WhatsApp">WhatsApp support ↗</a>;
}
