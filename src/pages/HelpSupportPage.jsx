import React from 'react';
import { 
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const HelpSupportPage = () => {
  const faqs = [
    { question: 'How do I track my shipment?', answer: 'You can track your shipment by entering your tracking number in the search bar or viewing it in the Shipments page.' },
    { question: 'What are the delivery times?', answer: 'Standard delivery takes 2-3 business days. Express delivery is available for next-day service.' },
    { question: 'How can I change my delivery address?', answer: 'Contact customer support within 24 hours of placing your order to change the delivery address.' },
    { question: 'What should I do if my package is delayed?', answer: 'Check the tracking status first. If there are unusual delays, contact our support team for assistance.' }
  ];

  const supportOptions = [
    { icon: ChatBubbleLeftRightIcon, title: 'Live Chat', description: 'Chat with our support team', action: 'Start Chat', color: 'var(--primary)' },
    { icon: PhoneIcon, title: 'Phone Support', description: 'Call us at +90 212 123 4567', action: 'Call Now', color: 'var(--primary-600)' },
    { icon: DocumentTextIcon, title: 'Documentation', description: 'Browse our help articles', action: 'View Docs', color: 'var(--primary-700)' }
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)', overflow: 'auto' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: 'var(--card)', padding: '24px', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text)', margin: 0 }}>Help & Support</h1>
        <p style={{ color: 'var(--muted)', margin: '4px 0 0 0', fontSize: '14px' }}>Get help with your shipments and account</p>
      </div>

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* Support Options */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginBottom: '24px' }}>Contact Support</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {supportOptions.map((option, index) => (
              <div key={index} style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: `${option.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <option.icon style={{ width: '28px', height: '28px', color: option.color }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)', margin: '0 0 8px 0' }}>{option.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', margin: '0 0 16px 0' }}>{option.description}</p>
                <button style={{
                  padding: '10px 20px',
                  backgroundColor: option.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  {option.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)', marginBottom: '24px' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <QuestionMarkCircleIcon style={{ width: '24px', height: '24px', color: 'var(--primary)', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)', margin: '0 0 8px 0' }}>{faq.question}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0 }}>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
