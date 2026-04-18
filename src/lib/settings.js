import { cache } from 'react';
import { query } from './db';

/**
 * Fetches all site settings from the database and returns them as a key-value object.
 * Uses React cache for request-level memoization.
 */
export const getSiteSettings = cache(async function getSiteSettings() {
  try {
    const results = await query('SELECT setting_key, setting_value FROM site_settings');
    
    // Transform array of {setting_key, setting_value} into a single object
    const settings = {
      site_name: 'Pushpa Arts', // Default fallbacks
      site_tagline: 'Exquisite Handcrafted Furniture',
      contact_email: 'info@pushpaarts.com',
      contact_phone: '+91-9414162629',
      contact_address: 'Udaipur, Rajasthan, India',
      whatsapp_number: '+919414162629'
    };

    if (results && results.length > 0) {
      results.forEach(row => {
        settings[row.setting_key] = row.setting_value;
      });
    }

    return settings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    // Return defaults on error
    return {
      site_name: 'Pushpa Arts',
      site_tagline: 'Exquisite Handcrafted Furniture',
      contact_email: 'info@pushpaarts.com',
      contact_phone: '+91-9414162629',
      contact_address: 'Udaipur, Rajasthan, India',
      whatsapp_number: '+919414162629'
    };
  }
});
