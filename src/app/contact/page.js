import { getPageBySlug, getFaqs } from '@/lib/cms';
import { getStudioPageMetadata } from '@/lib/metadata';
import ContactContent from './ContactContent';

export async function generateMetadata() {
  return getStudioPageMetadata('contact', 'Contact Pushpa Exports for custom luxury furniture inquiries and studio visits in Udaipur.');
}

export default async function ContactPage() {
  const [page, faqs] = await Promise.all([
    getPageBySlug('contact'),
    getFaqs()
  ]);

  return <ContactContent page={page} faqs={faqs} />;
}


