import { useState } from 'react';
import { BUSINESS_CONTACT } from '@/lib/boutique';
export function InquiryActions({summary,label='Copy inquiry'}:{summary:string;label?:string}){
 const [status,setStatus]=useState('');
 return <div className="inquiry-actions"><button className="button button-dark" onClick={async()=>{try{await navigator.clipboard.writeText(summary);setStatus('Copied. Your inquiry is ready to share with the jeweller.');}catch{setStatus('Please select and copy the summary below.');}}}>{label}<span aria-hidden="true">↗</span></button>
 {BUSINESS_CONTACT.whatsapp&&<a className="button" target="_blank" rel="noreferrer" href={`https://wa.me/${BUSINESS_CONTACT.whatsapp}?text=${encodeURIComponent(summary)}`}>Continue in WhatsApp ↗</a>}
 {BUSINESS_CONTACT.instagram&&<a className="button" target="_blank" rel="noreferrer" href={BUSINESS_CONTACT.instagram}>Visit the verified Instagram ↗</a>}
 <p className="field-note">{!BUSINESS_CONTACT.whatsapp&&!BUSINESS_CONTACT.instagram?'Direct contact is not connected for this demo. Copy your inquiry and share it through your chosen channel.':'Review your inquiry before sending. Instagram does not prefill a direct message; copy the summary first.'}</p><p className="feedback" role="status">{status}</p><details className="summary-details"><summary>Review inquiry details</summary><pre>{summary}</pre></details></div>;
}
