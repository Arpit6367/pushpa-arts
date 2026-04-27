require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('🌱 Seeding CMS data...');

  try {
    // 1. Seed Pages
    const pages = [
      {
        slug: 'about-udaipur',
        title: 'About Udaipur',
        content: `
          <p>Udaipur, often called the "Venice of the East," is a city steeped in royal history and unparalleled craftsmanship. Founded in 1559 by Maharana Udai Singh II, it has been the heart of Mewar royalty for centuries.</p>
          <p>The city's artistic heritage is most visible in its stunning palaces, but its true soul lies in the hands of its artisans. From the intricate <strong>Bone Inlay</strong> work to the delicate <strong>Mother of Pearl</strong> engravings, Udaipur's crafts are a testament to human patience and skill.</p>
          <h3>Our Heritage</h3>
          <p>Pushpa Arts was born in the narrow alleys of the old city, where the rhythmic sound of chisels hitting wood has been the background score for generations. We take pride in preserving these ancient techniques while bringing them to a global audience.</p>
        `,
        meta_title: 'Udaipur Heritage & Craftsmanship | Pushpa Arts',
        meta_description: 'Discover the royal heritage and exquisite craftsmanship of Udaipur, the home of Pushpa Arts.'
      },
      {
        slug: 'shipping',
        title: 'Shipping & Logistics',
        content: `
          <p>At Pushpa Arts, we understand that our furniture is more than just an object; it's a piece of art. That's why we take extreme care in ensuring it reaches you in perfect condition.</p>
          <h3>International Shipping</h3>
          <p>We ship to over 40 countries worldwide, including the USA, UK, UAE, and Australia. We partner with leading logistics providers to ensure timely and safe delivery.</p>
          <h3>Packaging</h3>
          <p>Each piece is packed using high-density foam, multiple layers of bubble wrap, and finally secured in a heavy-duty seaworthy wooden crate. This multi-layered protection is designed to withstand long transits.</p>
          <h3>Delivery Timelines</h3>
          <p>Since most of our items are made-to-order, the crafting process takes 4-8 weeks, followed by 3-5 weeks for sea freight or 1-2 weeks for air freight.</p>
        `,
        meta_title: 'Global Shipping Policy | Pushpa Arts',
        meta_description: 'Information about our international shipping, packaging standards, and delivery timelines.'
      },
      {
        slug: 'terms-conditions',
        title: 'Terms & Conditions',
        content: `
          <p>Welcome to Pushpa Arts. By accessing our website and services, you agree to comply with the following terms.</p>
          <h3>Product Authenticity</h3>
          <p>Every piece at Pushpa Arts is handcrafted. Due to the nature of handmade products, slight variations in color, texture, and inlay patterns are not defects but markers of authenticity.</p>
          <h3>Ordering & Payment</h3>
          <p>A 50% advance is required to initiate custom orders. The remaining balance must be cleared before the shipment is dispatched from our studio in Udaipur.</p>
        `,
        meta_title: 'Terms and Conditions | Pushpa Arts',
        meta_description: 'Read the terms and conditions for ordering handcrafted furniture from Pushpa Arts.'
      },
      {
        slug: 'privacy-policy',
        title: 'Privacy Policy',
        content: `
          <p>Your privacy is of utmost importance to us. This policy outlines how we handle your personal information.</p>
          <h3>Information Collection</h3>
          <p>We collect information you provide during inquiries, such as name, email, and shipping address, solely to facilitate your orders and provide better service.</p>
          <h3>Data Protection</h3>
          <p>We do not sell or share your data with third parties, except for logistics partners required to deliver your furniture.</p>
        `,
        meta_title: 'Privacy Policy | Pushpa Arts',
        meta_description: 'How we protect and manage your personal data at Pushpa Arts.'
      }
    ];

    for (const page of pages) {
      await connection.execute(
        `INSERT INTO pages (slug, title, content, meta_title, meta_description) 
         VALUES (?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content)`,
        [page.slug, page.title, page.content, page.meta_title, page.meta_description]
      );
    }

    // 2. Seed Blogs
    const blogs = [
      {
        title: 'The Timeless Elegance of Bone Inlay',
        slug: 'timeless-elegance-of-bone-inlay',
        excerpt: 'Discover the ancient art form that has graced royal palaces for centuries.',
        content: `
          <p>Bone inlay is a decorative technique that involves embedding hand-carved pieces of bone into a wooden frame. This art form originated in the royal courts of Rajasthan, where it was used to create ornate furniture for Maharajas.</p>
          <p>The process begins with the careful selection of wood, usually Mango or Teak. Artisans then carve intricate patterns and fill them with ethically sourced bone pieces, often arranged in floral or geometric designs.</p>
          <p>Today, bone inlay furniture is a staple in luxury interior design, blending traditional craftsmanship with modern aesthetics.</p>
        `,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000',
        is_active: 1
      },
      {
        title: 'Mother of Pearl: Nature’s Jewel in Furniture',
        slug: 'mother-of-pearl-furniture-guide',
        excerpt: 'How the shimmering interior of seashells is transformed into breathtaking furniture.',
        content: `
          <p>Mother of Pearl, or Nacre, is the iridescent inner layer of mollusk shells. In Udaipur, our master craftsmen use this delicate material to create furniture that literally glows.</p>
          <p>Unlike bone inlay, Mother of Pearl has a natural shimmer that changes with the light. This makes it a favorite for statement pieces like mirrors, consoles, and bedside tables.</p>
        `,
        image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=2000',
        is_active: 1
      }
    ];

    for (const blog of blogs) {
      await connection.execute(
        `INSERT INTO blogs (title, slug, excerpt, content, image, is_active) 
         VALUES (?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content)`,
        [blog.title, blog.slug, blog.excerpt, blog.content, blog.image, blog.is_active]
      );
    }

    // 3. Seed Projects (Exhibitions)
    const projects = [
      {
        title: 'The Royal Suite - London',
        slug: 'royal-suite-london',
        description: 'A complete bespoke furniture collection for a luxury boutique hotel in Mayfair, London. This project features hand-carved teak wood and premium Mother of Pearl inlay.',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000',
        client_name: 'Mayfair Collection',
        is_active: 1
      },
      {
        title: 'Desert Oasis Villa - Dubai',
        slug: 'desert-oasis-villa-dubai',
        description: 'Modern Bone Inlay pieces customized for a high-end private residence in Palm Jumeirah. The collection includes a grand console and matching bedside tables.',
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000',
        client_name: 'Private Estate',
        is_active: 1
      }
    ];

    for (const project of projects) {
      await connection.execute(
        `INSERT INTO projects (title, slug, description, image, client_name, is_active) 
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), image=VALUES(image)`,
        [project.title, project.slug, project.description, project.image, project.client_name, project.is_active]
      );
    }

    // 4. Seed Clients
    const clients = [
      { name: 'Aman Resorts', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Aman_Resorts_logo.svg/1200px-Aman_Resorts_logo.svg.png', is_active: 1, sort_order: 1 },
      { name: 'Taj Hotels', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Taj_Hotels_Resorts_and_Palaces_logo.svg/1200px-Taj_Hotels_Resorts_and_Palaces_logo.svg.png', is_active: 1, sort_order: 2 },
      { name: 'Four Seasons', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/Four_Seasons_Hotels_and_Resorts_logo.svg/1200px-Four_Seasons_Hotels_and_Resorts_logo.svg.png', is_active: 1, sort_order: 3 }
    ];

    for (const client of clients) {
      await connection.execute(
        `INSERT INTO clients (name, logo, is_active, sort_order) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE logo=VALUES(logo)`,
        [client.name, client.logo, client.is_active, client.sort_order]
      );
    }

    // 5. Seed FAQs
    const faqs = [
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship our handcrafted furniture to over 40 countries, including the USA, Europe, Middle East, and Australia. We handle all customs and documentation.',
        is_active: 1,
        sort_order: 1
      },
      {
        question: 'Is your bone ethically sourced?',
        answer: 'Absolutely. We only use bone from animals that have died of natural causes. This is a centuries-old tradition in Rajasthan that respects the cycle of nature.',
        is_active: 1,
        sort_order: 2
      },
      {
        question: 'Can I customize the design and size?',
        answer: 'Customization is our specialty. You can choose any pattern, color, and dimensions to suit your specific interior requirements.',
        is_active: 1,
        sort_order: 3
      }
    ];

    for (const faq of faqs) {
      await connection.execute(
        `INSERT INTO faqs (question, answer, is_active, sort_order) 
         VALUES (?, ?, ?, ?)`,
        [faq.question, faq.answer, faq.is_active, faq.sort_order]
      );
    }

    // 6. Seed Hero Slides
    const slides = [
      {
        title: 'Masterpieces of Mewar',
        subtitle: 'Bespoke Handcrafted Luxury Furniture from Udaipur',
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000',
        button_text: 'Explore Collection',
        button_link: '/product-category/bone-inlay-furniture',
        sort_order: 1
      },
      {
        title: 'The Royal Legacy',
        subtitle: 'Preserving Centuries of Artistic Heritage',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000',
        button_text: 'View Art Journal',
        button_link: '/blogs',
        sort_order: 2
      }
    ];

    for (const slide of slides) {
      await connection.execute(
        `INSERT INTO hero_slides (title, subtitle, image, button_text, button_link, sort_order) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [slide.title, slide.subtitle, slide.image, slide.button_text, slide.button_link, slide.sort_order]
      );
    }

    // 7. Seed Testimonials
    const testimonials = [
      {
        name: 'Sarah Jenkins',
        designation: 'Interior Designer, London',
        content: 'The bone inlay console table from Pushpa Arts is the centerpiece of my latest project. The attention to detail is simply breathtaking.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
        rating: 5,
        sort_order: 1
      },
      {
        name: 'Ahmed Al-Sayed',
        designation: 'Private Collector, Dubai',
        content: 'Pushpa Arts has a unique ability to blend traditional Rajasthani art with modern luxury requirements. Exceptional quality.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
        rating: 5,
        sort_order: 2
      }
    ];

    for (const t of testimonials) {
      await connection.execute(
        `INSERT INTO testimonials (name, designation, content, image, rating, sort_order) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [t.name, t.designation, t.content, t.image, t.rating, t.sort_order]
      );
    }

    // 8. Seed Material Mastery
    const mastery = [
      {
        title: 'Silver Furniture',
        description: 'Exquisite silver-clad furniture, a hallmark of Udaipur’s royal legacy.',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000',
        link: '/product-category/silver-furniture',
        sort_order: 1
      },
      {
        title: 'Bone Inlay',
        description: 'Intricate patterns handcrafted from ethically sourced bone embedded in teak.',
        image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=1000',
        link: '/product-category/bone-inlay-furniture',
        sort_order: 2
      },
      {
        title: 'Mother of Pearl',
        description: 'Shimmering nacre arrangements that bring a natural glow to any space.',
        image: 'https://images.unsplash.com/photo-1616486701797-0f33f61038ec?q=80&w=1000',
        link: '/product-category/mop-inlay-furniture',
        sort_order: 3
      }
    ];

    for (const m of mastery) {
      await connection.execute(
        `INSERT INTO material_mastery (title, description, image, link, sort_order) 
         VALUES (?, ?, ?, ?, ?)`,
        [m.title, m.description, m.image, m.link, m.sort_order]
      );
    }

    console.log('✅ Seeding completed successfully!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await connection.end();
  }
}

seed();
