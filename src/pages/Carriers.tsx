import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, MessageSquare, AlertCircle, PhoneOff } from 'lucide-react';

export default function Carriers() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple font-bold text-sm mb-4">
            <Smartphone size={16} /> SMS Terms
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-dark mb-6">SMS & Carrier Terms</h1>
          <p className="text-xl text-brand-text-gray max-w-2xl mx-auto">
            Guidelines and agreements regarding our mobile alert systems and SMS notifications.
          </p>
          <p className="text-sm text-gray-400 mt-6 font-medium">Last Updated: August 24, 2026</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <MessageSquare className="text-brand-purple mb-4" size={24} />
            <h3 className="font-bold text-brand-dark mb-2">Crucial Alerts</h3>
            <p className="text-sm text-brand-text-gray leading-relaxed">We use SMS for time-sensitive security incidents and multi-sig authorization requests.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <AlertCircle className="text-brand-purple mb-4" size={24} />
            <h3 className="font-bold text-brand-dark mb-2">Standard Rates</h3>
            <p className="text-sm text-brand-text-gray leading-relaxed">Standard message and data rates may apply depending on your mobile carrier plan.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <PhoneOff className="text-brand-purple mb-4" size={24} />
            <h3 className="font-bold text-brand-dark mb-2">Easy Opt-Out</h3>
            <p className="text-sm text-brand-text-gray leading-relaxed">You can opt out at any time by replying STOP to any of our automated messages.</p>
          </div>
        </div>

        <div className="prose prose-lg text-brand-text-gray max-w-none space-y-8 animate-fade-in">
          <section>
            <h2 className="text-2xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">1. SMS Alerts & Consent</h2>
            <p>By opting into our emergency SMS alert system, you consent to receive text messages regarding active security incidents, case updates, and multi-sig authorization requests from Tracefield. These messages are critical to the timely recovery and securing of digital assets.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">2. Message Frequency & Rates</h2>
            <p>Message frequency varies based on your active case status and alert preferences. <strong>Message and data rates may apply.</strong> Please check with your mobile carrier for details on your specific plan.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">3. Opt-Out & Unsubscribing</h2>
            <p>You can cancel the SMS service at any time. Just text <strong>"STOP"</strong> to our shortcode. After you send the SMS message "STOP" to us, we will send you an SMS message to confirm that you have been unsubscribed. After this, you will no longer receive SMS messages from us.</p>
            <p>If you want to join again, just sign up as you did the first time or adjust your preferences in your dashboard settings, and we will resume sending SMS messages to you.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">4. Assistance & Support</h2>
            <p>If you are experiencing issues with the messaging program you can reply with the keyword <strong>HELP</strong> for more assistance, or you can get help directly by contacting our support team at info@tracefield.co.uk or via the secure portal.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-brand-dark border-b border-gray-100 pb-4 mb-6">5. Carrier Liability Disclaimer</h2>
            <p>Mobile carriers (e.g., AT&T, Verizon, T-Mobile, Vodafone) are not liable for delayed or undelivered messages. Delivery is subject to effective transmission from your network operator.</p>
          </section>

          <section className="bg-gray-50 p-8 rounded-2xl border border-gray-200 mt-12">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Need help with alerts?</h2>
            <p className="mb-6">Contact our support team to manage your notification preferences.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-colors">
              Contact Support
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
