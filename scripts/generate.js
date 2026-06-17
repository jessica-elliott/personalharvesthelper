const fs = require('fs');
const path = require('path');

const BASE = '/tmp/opencode/personalharvesthelper';
const SITE_URL = 'https://personalharvesthelper.com';

const HEAD = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  __TITLE__
  __DESC__
  <link rel="icon" href="/images/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="__BASE__/css/style.css">
</head>
<body>`;

const FOOTER = `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <h3>&#127793; Personal Harvest Helper</h3>
        <p>Personalized gardening guidance that tells you exactly what to plant and what to do next in your garden. Built for beginners, powered by your local weather.</p>
      </div>
      <div class="footer-col">
        <h4>Pages</h4>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about/">About</a></li>
          <li><a href="/blog/">Blog</a></li>
          <li><a href="/contact/">Contact</a></li>
          <li><a href="/waitlist/">Join the Waitlist</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Blog Categories</h4>
        <ul>
          <li><a href="/categories/beginner-gardening/">Beginner Gardening</a></li>
          <li><a href="/categories/what-to-plant-this-month/">What to Plant This Month</a></li>
          <li><a href="/categories/vegetable-guides/">Vegetable Guides</a></li>
          <li><a href="/categories/herb-guides/">Herb Guides</a></li>
          <li><a href="/categories/watering-help/">Watering Help</a></li>
          <li><a href="/categories/garden-problems/">Garden Problems</a></li>
          <li><a href="/categories/raised-bed-gardening/">Raised Bed Gardening</a></li>
          <li><a href="/categories/container-gardening/">Container Gardening</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <ul>
          <li><a href="/privacy-policy/">Privacy Policy</a></li>
          <li><a href="/terms-of-use/">Terms of Use</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 Personal Harvest Helper. All rights reserved.</span>
      <span>Built with &#127793; for home gardeners</span>
    </div>
  </div>
</footer>
<script src="__BASE__/js/main.js"></script>
</body>
</html>`;

function nav(current) {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/about/', label: 'About' },
    { href: '/blog/', label: 'Blog' },
    { href: '/contact/', label: 'Contact' },
    { href: '/waitlist/', label: 'Join the Waitlist', cta: true }
  ];
  return `<header class="site-header">
  <nav class="navbar container" aria-label="Main navigation">
    <a href="/" class="logo"><span class="logo-icon">&#127793;</span>Personal Harvest Helper</a>
    <button class="mobile-toggle" aria-label="Toggle menu" aria-expanded="false">&#9776;</button>
    <ul class="nav-links">
      ${links.map(l => `<li><a href="${l.href}"${current === l.href ? ' class="active"' : ''}${l.cta ? ' class="nav-cta"' : ''}>${l.label}</a></li>`).join('\n      ')}
    </ul>
    <div class="overlay"></div>
  </nav>
</header>`;
}

function page(title, desc, bodyHtml, current) {
  const h = HEAD
    .replace('__TITLE__', `<title>${title}</title>`)
    .replace('__DESC__', `<meta name="description" content="${desc.replace(/"/g,'&quot;')}">`)
    .replace('__BASE__', '..');
  const f = FOOTER.replace('__BASE__', '..');
  return h + '\n' + nav(current) + '\n<main>\n' + bodyHtml + '\n</main>\n' + f;
}

// Unsplash photo IDs for photography
const PHOTOS = {
  hero: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=600&fit=crop',
  garden: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&h=500&fit=crop',
  tomatoes: 'https://images.unsplash.com/photo-1592840455693-10e5881e90c7?w=800&h=500&fit=crop',
  cucumber: 'https://images.unsplash.com/photo-1449305340167-2e3b4b3c7cb0?w=800&h=500&fit=crop',
  basil: 'https://images.unsplash.com/photo-1618372038498-e8e8e792d9d1?w=800&h=500&fit=crop',
  peppers: 'https://images.unsplash.com/photo-1563565375-f3f9db2f6d47?w=800&h=500&fit=crop',
  lettuce: 'https://images.unsplash.com/photo-1556800572-483c5ae2f1ab?w=800&h=500&fit=crop',
  watering: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=500&fit=crop',
  raisedbed: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=500&fit=crop',
  containers: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=500&fit=crop',
  seasonal: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&h=500&fit=crop',
  pests: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&h=500&fit=crop',
  seedling: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&h=500&fit=crop',
  harvest: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=500&fit=crop'
};

const CATEGORIES = [
  { slug: 'beginner-gardening', name: 'Beginner Gardening', desc: 'Start here if you are new to vegetable gardening. These beginner-friendly guides will help you grow with confidence.' },
  { slug: 'what-to-plant-this-month', name: 'What to Plant This Month', desc: 'Know exactly what to plant right now. Month-by-month planting guides for a productive garden all year.' },
  { slug: 'vegetable-guides', name: 'Vegetable Guides', desc: 'In-depth growing guides for your favorite vegetables. From planting to harvest and everything in between.' },
  { slug: 'herb-guides', name: 'Herb Guides', desc: 'Learn how to grow, harvest, and preserve fresh herbs at home. Simple guides for beginner herb gardeners.' },
  { slug: 'watering-help', name: 'Watering Help', desc: 'Master the art of watering your garden. Learn how much, how often, and the best time to water every plant.' },
  { slug: 'garden-problems', name: 'Garden Problems', desc: 'Identify, treat, and prevent common garden problems. From pests and diseases to nutrient deficiencies.' },
  { slug: 'raised-bed-gardening', name: 'Raised Bed Gardening', desc: 'Everything you need to know about raised bed vegetable gardens. Build, fill, plant, and maintain with confidence.' },
  { slug: 'container-gardening', name: 'Container Gardening', desc: 'Grow vegetables and herbs in containers on your patio, balcony, or windowsill. Perfect for small spaces.' }
];

const ALL_POSTS = [
  // === Beginner Gardening ===
  {
    slug: 'how-to-start-a-vegetable-garden-for-beginners',
    title: 'How To Start A Vegetable Garden For Beginners',
    category: 'beginner-gardening',
    date: '2026-06-17', readTime: 5,
    img: PHOTOS.garden,
    seo: 'Step-by-step guide to starting your first vegetable garden. Learn site selection, soil prep, seed starting, and more for beginner gardeners.',
    sections: [
      ['h2', 'Choose the Right Location'],
      ['p', 'The first and most important decision for your vegetable garden is where to put it. Most vegetables need full sun — at least 6-8 hours of direct sunlight per day. Observe your yard throughout the day to find the sunniest spot. Avoid areas shaded by trees, fences, or buildings. You also want good drainage; water should not pool after rain. If you have poor soil, raised beds and containers are both excellent alternatives.'],
      ['h2', 'Start Small'],
      ['p', 'One of the biggest mistakes new gardeners make is planting too much too soon. A 4x4 foot raised bed or a few large containers is plenty for a beginner. You can always expand next year. Starting small means less weeding, less watering, and less overwhelm. You will actually enjoy the process rather than feeling buried by it.'],
      ['h2', 'Pick the Right Vegetables'],
      ['p', 'As a beginner, you want vegetables that are forgiving and productive. Some of the easiest include tomatoes, peppers, cucumbers, lettuce, basil, zucchini, green beans, and radishes. Most germinate quickly, grow fast, and produce a generous harvest even with minimal experience. For a full list, see our post on the 10 easiest vegetables to grow.'],
      ['h2', 'Prepare Your Soil'],
      ['p', 'Good soil is the foundation of a great garden. Vegetables need rich, well-draining soil full of organic matter. If planting in the ground, mix in 2-3 inches of compost before planting. For raised beds, use a mix of topsoil, compost, and vermiculite. A soil test kit can tell you if your pH or nutrient levels need adjustment.'],
      ['h2', 'Plant at the Right Time'],
      ['p', 'Timing is everything in gardening. Each vegetable has an ideal planting window based on your local climate. Cool-season crops like lettuce and peas can be planted early spring, while warm-season crops like tomatoes and peppers should wait until after the last frost date. The Personal Harvest Helper app will tell you exactly what to plant and when, based on your location and current weather.'],
      ['h2', 'Water Consistently'],
      ['p', 'Most vegetables need about 1-2 inches of water per week, varying with temperature and soil type. Water deeply and less frequently rather than giving plants a little water every day. Deep watering encourages roots to grow downward. Water at the base of plants, not on leaves, to prevent disease. Morning is the best time to water.'],
      ['h2', 'Harvest Regularly'],
      ['p', 'Most vegetables taste best when harvested at peak ripeness, and picking regularly encourages plants to produce more. Tomatoes should be picked when fully colored but still firm. Cucumbers are best when medium-sized. Leafy greens like lettuce can be harvested leaf by leaf. Zucchini should be picked when 6-8 inches long.'],
      ['h2', 'Enjoy the Process'],
      ['p', 'Gardening is a journey, not a destination. You will have successes and failures — every gardener does. The important thing is to learn from each season and keep going. The Personal Harvest Helper app is designed to make this journey smoother by giving you personalized daily guidance so you can focus on enjoying your garden rather than worrying about it.']
    ]
  },
  {
    slug: 'the-10-easiest-vegetables-to-grow',
    title: 'The 10 Easiest Vegetables To Grow',
    category: 'beginner-gardening',
    date: '2026-06-17', readTime: 6,
    img: PHOTOS.garden,
    seo: 'Discover the 10 easiest vegetables to grow for beginner gardeners. These foolproof crops give you the best chance of success in your first garden.',
    sections: [
      ['h2', 'Why Start With Easy Vegetables?'],
      ['p', 'When you are new to gardening, nothing builds confidence like a successful harvest. Starting with vegetables that are forgiving, fast-growing, and productive will help you learn the basics without getting discouraged. These 10 are widely considered the easiest for beginners, and they are some of the most rewarding to eat fresh from the garden.'],
      ['h2', '1. Tomatoes'],
      ['p', 'Tomatoes are the most popular home garden vegetable for good reason. They are productive, delicious, and relatively easy to grow. Cherry tomatoes are especially forgiving. Give them full sun, consistent water, and a sturdy cage or trellis. See our complete guide on how to grow tomatoes.'],
      ['h2', '2. Cucumbers'],
      ['p', 'Cucumbers grow fast and produce an impressive amount of fruit from just a few plants. They need warm soil, full sun, and plenty of water. Trellising saves space and keeps fruit clean. Pick regularly to encourage more production. Check our guide on how to grow cucumbers.'],
      ['h2', '3. Basil'],
      ['p', 'Basil is the perfect herb for beginners. It grows quickly, thrives in warm weather, and adds incredible flavor to dishes. The more you harvest, the bushier it grows. Just pinch off the top set of leaves regularly. See our guide on how to grow basil.'],
      ['h2', '4. Peppers'],
      ['p', 'Peppers come in endless varieties, from sweet bell peppers to spicy jalapeños. They love heat and sun. Peppers are relatively pest-free and produce steadily all season. Check out our full guide on how to grow peppers.'],
      ['h2', '5. Lettuce'],
      ['p', 'Lettuce is one of the fastest and easiest vegetables to grow. Loose-leaf varieties are particularly easy — just sow seeds, thin as needed, and start harvesting outer leaves in as little as 30 days. See our guide on how to grow lettuce.'],
      ['h2', '6. Zucchini and Summer Squash'],
      ['p', 'Zucchini is famously productive — a single plant can yield enough squash for a whole family. It grows best in full sun with rich soil and consistent water. Watch for powdery mildew and pick when 6-8 inches long.'],
      ['h2', '7. Green Beans'],
      ['p', 'Green beans are incredibly easy to grow from seed directly in the garden. Bush varieties need no trellising. Pole beans climb and produce over a longer period. Both are reliable and productive.'],
      ['h2', '8. Radishes'],
      ['p', 'Radishes are the fastest vegetable from seed to harvest, often ready in just 25-30 days. This makes them incredibly satisfying. They can be planted in early spring and again in fall. Succession plant every two weeks for continuous harvest.'],
      ['h2', '9. Carrots'],
      ['p', 'Carrots are easy if you give them loose, stone-free soil. Shorter varieties are ideal for beginners and containers. Keep soil consistently moist for good germination and sweet roots.'],
      ['h2', '10. Kale'],
      ['p', 'Kale is a nutritional powerhouse and one of the hardiest vegetables. It tolerates cold, heat, and imperfect soil. Harvest outer leaves as needed and the plant keeps producing for months. The perfect low-maintenance green.']
    ]
  },
  {
    slug: 'common-beginner-gardening-mistakes',
    title: 'Common Beginner Gardening Mistakes',
    category: 'beginner-gardening',
    date: '2026-06-17', readTime: 5,
    img: PHOTOS.garden,
    seo: 'Avoid these 10 common beginner gardening mistakes. Learn what not to do in your first vegetable garden for the best chance of success.',
    sections: [
      ['h2', 'Mistake 1: Planting Too Much Too Soon'],
      ['p', 'It is exciting to start a garden, but a huge garden requires huge amounts of time and water. Start with 3-5 vegetable varieties in a small space. A small, well-maintained garden produces more food and joy than a large, neglected one.'],
      ['h2', 'Mistake 2: Overwatering'],
      ['p', 'Overwatering kills more plants than underwatering. Roots need oxygen as well as water. Signs include yellowing leaves, wilting despite wet soil, and mold on the soil surface. Always check soil moisture before watering. See our guide on how to know if you are overwatering.'],
      ['h2', 'Mistake 3: Underwatering'],
      ['p', 'Vegetables need consistent moisture, especially during flowering and fruiting. Inconsistent watering causes blossom end rot in tomatoes and bitter flavors. See signs of underwatering vegetables to identify issues early.'],
      ['h2', 'Mistake 4: Poor Soil Preparation'],
      ['p', 'Your plants are only as good as the soil they grow in. Take time to test your soil, add compost, and ensure good drainage. Healthy soil full of organic matter produces healthy, productive plants.'],
      ['h2', 'Mistake 5: Ignoring Sunlight Requirements'],
      ['p', 'Most vegetables need 6-8 hours of direct sun. If you plant a full-sun vegetable in shade, it will grow slowly and produce little fruit. Observe your garden throughout the day before planting.'],
      ['h2', 'Mistake 6: Planting Too Early or Too Late'],
      ['p', 'Planting warm-season crops before the last frost can kill them. Planting cool-season crops too late means they bolt in heat. Know your local frost dates. The Personal Harvest Helper app removes this guesswork with location-specific recommendations.'],
      ['h2', 'Mistake 7: Crowding Plants'],
      ['p', 'Seed packets have spacing recommendations for a reason. Plants need room for roots to spread and leaves to get sunlight and airflow. Crowded plants compete for resources and get more disease.'],
      ['h2', 'Mistake 8: Not Mulching'],
      ['p', 'A 2-3 inch layer of organic mulch conserves moisture, suppresses weeds, moderates soil temperature, and adds organic matter. New gardeners often skip this and end up with more weeds and watering.'],
      ['h2', 'Mistake 9: Giving Up After a Bad Season'],
      ['p', 'Every gardener has bad seasons. Pests, disease, weather extremes happen. Learn from what went wrong and try again. The Personal Harvest Helper app helps you avoid many common mistakes with clear, daily guidance.']
    ]
  },
  // === What to Plant This Month ===
  {
    slug: 'what-to-plant-in-july',
    title: 'What To Plant In July',
    category: 'what-to-plant-this-month',
    date: '2026-06-17', readTime: 5,
    img: PHOTOS.seasonal,
    seo: 'Wondering what to plant in July? Despite the heat, plenty of vegetables and herbs can still be planted for a late-summer and fall harvest.',
    sections: [
      ['h2', 'It Is Not Too Late'],
      ['p', 'Many gardeners think July is too late to plant anything. That is not true. July is the perfect time to plant a second round of warm-season crops and start preparing for fall. The key is choosing vegetables that mature quickly or are heat-tolerant.'],
      ['h2', 'Warm-Season Crops for July'],
      ['p', 'You can still plant fast-maturing varieties of beans, cucumbers, and summer squash in early July. Bush beans produce in as little as 50 days. Succession plant a new batch every two weeks for a continuous harvest through September.'],
      ['h2', 'Heat-Loving Herbs'],
      ['p', 'Basil, oregano, thyme, and rosemary love hot weather and can be planted in July. Basil thrives in summer heat and grows quickly from transplants. Keep herbs well-watered and harvest regularly.'],
      ['h2', 'Starting Fall Crops'],
      ['p', 'July is when to start thinking about fall gardening. Start seeds indoors for cool-season crops like broccoli, cauliflower, and cabbage in mid-to-late July. Check your first frost date and count backward for the right timing.'],
      ['h2', 'Tips for July Planting'],
      ['p', 'Provide shade for transplants during the hottest part of the day for the first week. Water deeply and consistently. Mulch heavily to keep soil cool. Plant in the evening so plants settle in overnight before the heat.'],
      ['h2', 'What Not to Plant in July'],
      ['p', 'Avoid planting cool-season crops like lettuce and spinach directly in the garden in July — heat causes them to bolt. Wait until late August or early September for a fall harvest.']
    ]
  },
  {
    slug: 'what-to-plant-in-august',
    title: 'What To Plant In August',
    category: 'what-to-plant-this-month',
    date: '2026-06-17', readTime: 5,
    img: PHOTOS.seasonal,
    seo: 'Discover what to plant in August for a successful fall vegetable garden. These crops thrive when planted in late summer for autumn harvesting.',
    sections: [
      ['h2', 'August: The Transition Month'],
      ['p', 'August is a transitional time. The heat of summer is still present, but fall is approaching. August is ideal for planting a second garden that carries you through autumn. With planning, you can enjoy fresh vegetables well into October.'],
      ['h2', 'Quick-Maturing Vegetables'],
      ['p', 'Radishes (25-30 days), baby greens like arugula (20-30 days), green onions (50-60 days), and bush beans (50-60 days) are excellent for August planting. You will harvest before the first frost if you plant early in the month.'],
      ['h2', 'Cool-Season Crops'],
      ['p', 'August is perfect for cool-season vegetables like carrots, beets, turnips, and kale. These crops taste better after a light frost, which converts starches to sugars. Swiss chard tolerates both heat and cold.'],
      ['h2', 'Leafy Greens for Fall'],
      ['p', 'Spinach, lettuce, and other greens prefer cool weather. Plant in partial shade or use shade cloth. Succession plant every two weeks for a continuous supply through fall.'],
      ['h2', 'Extending Your Season'],
      ['p', 'Row covers or cold frames can add 4-6 weeks to your growing season. Floating row covers are inexpensive and provide several degrees of frost protection while letting in light and water.']
    ]
  },
  {
    slug: 'what-to-plant-in-september',
    title: 'What To Plant In September',
    category: 'what-to-plant-this-month',
    date: '2026-06-17', readTime: 5,
    img: PHOTOS.seasonal,
    seo: 'Learn what to plant in September for a productive fall vegetable garden. Cool-season crops, garlic prep, and cover crops are perfect for September.',
    sections: [
      ['h2', 'September Gardening Opportunities'],
      ['p', 'September brings cooler temperatures that many vegetables love. While warm-season crops wind down, cool-season vegetables are just getting started. September is also time to think about next year by preparing for garlic and planting cover crops.'],
      ['h2', 'Leafy Greens for September'],
      ['p', 'September is ideal for planting lettuce, spinach, kale, Swiss chard, and arugula. These greens thrive in cool weather and often taste better than spring crops. Keep soil moist until seedlings establish. Expect baby greens in 3-4 weeks.'],
      ['h2', 'Garlic Prep'],
      ['p', 'September is time to prepare your garlic bed for October planting. Garlic needs a cold period to develop bulbs. Clear the area, amend soil with compost, and order seed garlic. Softneck varieties suit mild climates; hardneck for cold regions.'],
      ['h2', 'Cover Crops for Soil Health'],
      ['p', 'Plant cover crops like winter rye, crimson clover, or hairy vetch in September. These protect soil from erosion, suppress weeds, and add organic matter when tilled under in spring. One of the best things for long-term soil health.'],
      ['h2', 'Overwintering Vegetables'],
      ['p', 'In mild climates, plant overwintering vegetables like onions, garlic, and certain carrot varieties. These grow slowly through fall, go dormant in winter, and resume in early spring for an early harvest.']
    ]
  },
  {
    slug: 'main-focus-for-october',
    title: 'Main Focus for October: Preparing Your Garden for Winter',
    category: 'what-to-plant-this-month',
    date: '2026-06-17', readTime: 5,
    img: PHOTOS.seasonal,
    seo: 'October garden checklist: what to plant, harvest, and clean up before winter. Prepare your vegetable garden for a successful spring.',
    sections: [
      ['h2', 'October Garden Priorities'],
      ['p', 'October is a month of transition. The main harvest season is ending and it is time to prepare for winter. How you handle October sets the stage for next spring.'],
      ['h2', 'Harvest Warm-Season Crops'],
      ['p', 'Before the first frost, harvest all remaining tomatoes, peppers, squash, and basil. Green tomatoes ripen indoors in a paper bag with a ripe banana. Peppers can be picked at any size.'],
      ['h2', 'Plant Garlic and Onions'],
      ['p', 'October is prime time for planting garlic. Separate bulbs into cloves and plant 2 inches deep, 6 inches apart, pointy side up. Mulch heavily with straw. Plant onion sets for an early spring harvest.'],
      ['h2', 'Clean Up Spent Plants'],
      ['p', 'Remove dead or dying plants. Do not compost diseased plants — trash them to prevent spread. Remove weeds so they do not go to seed. Healthy material goes in the compost.'],
      ['h2', 'Amend and Mulch Beds'],
      ['p', 'Fall is perfect for adding compost or well-rotted manure. Top with shredded leaves or straw. Organic matter breaks down over winter and enriches soil for spring.'],
      ['h2', 'Order Seeds for Next Year'],
      ['p', 'October is a great time to order seeds. Many companies release catalogs in late fall. Ordering early ensures you get varieties before they sell out. Note what worked this year.'],
      ['h2', 'Protect Perennial Herbs'],
      ['p', 'Perennial herbs like oregano, thyme, and chives benefit from protective mulch in cold climates. Container perennials should be moved to sheltered locations or wrapped for insulation.']
    ]
  },
  {
    slug: 'how-to-end-the-fall-season',
    title: 'How to End the Fall Season: Garden Cleanup and Winter Prep',
    category: 'what-to-plant-this-month',
    date: '2026-06-17', readTime: 6,
    img: PHOTOS.seasonal,
    seo: 'Complete guide to ending the fall gardening season. Learn garden cleanup, winter soil preparation, and tool maintenance for next spring.',
    sections: [
      ['h2', 'A Proper Garden Closing'],
      ['p', 'How you close your garden for winter impacts how it performs next spring. A thorough end-of-season routine prevents pests and diseases from overwintering, protects soil, and makes spring planting smoother.'],
      ['h2', 'Complete Cleanup'],
      ['p', 'Remove all plant debris. Dead material can harbor pests and disease. Pull up annual vegetables roots and all. Compost only healthy material. Bag diseased plants for the trash.'],
      ['h2', 'Soil Care for Winter'],
      ['p', 'After cleanup, spread 1-2 inches of compost over beds. Plant a winter cover crop or cover bare soil with shredded leaves. Soil left bare loses nutrients to erosion and leaching over winter.'],
      ['h2', 'Tool Maintenance'],
      ['p', 'Fall is perfect for cleaning and storing tools. Scrub dirt, sharpen blades, oil wooden handles, and store in a dry place. Drain and coil hoses before freezing. Good tool care saves money and frustration.'],
      ['h2', 'Plan for Next Season'],
      ['p', 'Review your garden journal and note what worked. Draw a garden map and plan crop rotation. Order seeds early. The Personal Harvest Helper app will help you plan and execute next season with personalized guidance.'],
      ['h2', 'Enjoy the Off-Season'],
      ['p', 'Read gardening books, attend workshops, and connect with other gardeners. Winter is also great for indoor projects like a windowsill herb garden or building new raised beds. The gardener\'s work is never truly done.']
    ]
  },
  // === Vegetable Guides ===
  {
    slug: 'how-to-grow-tomatoes',
    title: 'How To Grow Tomatoes: A Complete Guide',
    category: 'vegetable-guides',
    date: '2026-06-16', readTime: 7,
    img: PHOTOS.tomatoes,
    seo: 'The complete guide to growing tomatoes from seed to harvest. Learn planting, watering, pruning, staking, and troubleshooting tomato problems.',
    sections: [
      ['h2', 'Why Grow Tomatoes?'],
      ['p', 'Tomatoes are the most popular home garden vegetable. Homegrown taste far better than store-bought. They are versatile, productive, and there are thousands of varieties. Whether for sandwiches, salads, or sauces, there is a tomato for you.'],
      ['h2', 'Choosing Varieties'],
      ['p', 'Determinate (bush) varieties grow compact and set fruit all at once — great for containers and canning. Indeterminate (vining) varieties produce continuously until frost — they need supports but yield longer. Popular beginner varieties include Better Boy, Sun Gold cherry, and Roma paste.'],
      ['h2', 'Starting from Seed vs. Transplants'],
      ['p', 'Starting from seed gives more variety choice but needs equipment. Beginners should start with transplants from a reputable nursery. Plant after last frost when soil reaches 60°F. If starting seeds indoors, begin 6-8 weeks before last frost.'],
      ['h2', 'Planting Tomatoes'],
      ['p', 'Plant deep — bury the stem up to the first true leaves. Roots form along the buried stem. Space 18-36 inches apart. Install cages or stakes at planting time. Add compost and balanced organic fertilizer to each hole.'],
      ['h2', 'Watering Tomatoes'],
      ['p', 'Consistent watering is critical. Aim for 1-2 inches per week. Inconsistent watering causes blossom end rot and cracking. Water at the base — wet foliage promotes disease. Drip irrigation is ideal. See how often to water tomatoes for details.'],
      ['h2', 'Pruning and Staking'],
      ['p', 'Indeterminate tomatoes need regular pruning. Remove suckers between main stem and branches. Tie main stem to a stake. Determinate varieties need minimal pruning. Pruning improves air circulation and reduces disease.'],
      ['h2', 'Common Problems'],
      ['p', 'Blossom end rot is caused by inconsistent watering. Yellow leaves can indicate nitrogen deficiency or overwatering. Hornworms are large caterpillars that can be hand-picked. See our guide on yellow tomato leaves for troubleshooting.'],
      ['h2', 'Harvesting'],
      ['p', 'Harvest when fully colored and slightly soft. Tomatoes continue ripening after picking. For best flavor, harvest at peak and use within days. Store at room temperature — refrigeration ruins texture and flavor.']
    ]
  },
  {
    slug: 'how-to-grow-cucumbers',
    title: 'How To Grow Cucumbers',
    category: 'vegetable-guides',
    date: '2026-06-16', readTime: 6,
    img: PHOTOS.cucumber,
    seo: 'Learn how to grow cucumbers from seed to harvest. Covers planting, trellising, watering, and troubleshooting common cucumber problems.',
    sections: [
      ['h2', 'A Garden Favorite'],
      ['p', 'Cucumbers are one of the most productive vegetables. A few plants produce an abundant supply all summer. They grow quickly and are relatively disease-free with proper care. Two main types: slicing for fresh eating and pickling for preserving.'],
      ['h2', 'When and Where to Plant'],
      ['p', 'Cucumbers need full sun and warm soil (70°F+) to germinate. Plant seeds directly 1-2 weeks after last frost. In cooler climates, start indoors 3 weeks before transplanting, but cucumbers prefer direct sowing.'],
      ['h2', 'Planting and Spacing'],
      ['p', 'Sow seeds 1 inch deep, 12 inches apart in rows 3 feet apart. Plant 6-8 seeds per hill and thin to strongest 2-3. Cucumbers are heavy feeders — amend soil with plenty of compost.'],
      ['h2', 'Trellising'],
      ['p', 'Trellising is highly recommended. Growing vertically saves space, improves airflow, reduces disease, and keeps fruit clean. Use a sturdy trellis or cattle panel. Bush varieties do not need trellising.'],
      ['h2', 'Watering and Fertilizing'],
      ['p', 'Cucumbers need consistent moisture, especially when flowering and fruiting. Give 1-2 inches per week. Mulch to retain moisture. Feed with balanced organic fertilizer every 3-4 weeks. Inconsistent watering causes bitter fruit.'],
      ['h2', 'Harvesting'],
      ['p', 'Check plants daily once they start producing. Harvest slicing cucumbers at 6-8 inches. Pickling at 2-4 inches. Do not let cucumbers turn yellow on the vine — this stops production. Regular harvesting encourages more fruit.'],
      ['h2', 'Troubleshooting'],
      ['p', 'Bitter cucumbers come from heat stress or inconsistent watering. Misshapen fruit indicates pollination issues — plant flowers to attract bees. See our guide on why cucumbers are dying for more help.']
    ]
  },
  {
    slug: 'how-to-grow-peppers',
    title: 'How To Grow Peppers',
    category: 'vegetable-guides',
    date: '2026-06-16', readTime: 6,
    img: PHOTOS.peppers,
    seo: 'Learn how to grow sweet and hot peppers from seed to harvest. Includes planting tips, watering schedule, and troubleshooting common pepper problems.',
    sections: [
      ['h2', 'Sweet and Spicy Options'],
      ['p', 'Peppers come in incredible variety, from sweet bells to fiery habaneros. They are relatively easy, productive, and beautiful plants. They also store well — enjoy homegrown peppers for months after harvest.'],
      ['h2', 'Choosing Varieties'],
      ['p', 'Bell peppers are the most popular sweet type. Banana and Italian frying peppers are sweet and productive. For heat, try jalapeño, serrano, or cayenne. Beginners should start with bell peppers or jalapeños.'],
      ['h2', 'Starting from Seed'],
      ['p', 'Peppers need a head start indoors. Start seeds 8-10 weeks before last frost. Pepper seeds need warmth (80-90°F) — use a heat mat. Once emerged, provide strong light. Harden off before transplanting.'],
      ['h2', 'Planting Outdoors'],
      ['p', 'Transplant when night temperatures are consistently above 55°F. Space 18-24 inches apart in full sun. Peppers love heat — black plastic mulch can boost growth. Add compost at planting. Stake taller varieties.'],
      ['h2', 'Watering and Feeding'],
      ['p', 'Peppers need consistent moisture, especially during flowering. Water deeply 1-2 times per week. Mulch to retain moisture. Feed with phosphorus-rich fertilizer when flowers appear. Too much nitrogen gives leaves but few fruits.'],
      ['h2', 'Common Problems'],
      ['p', 'Flower drop is usually from temperature extremes. Sunscald appears as pale patches on fruit — provide enough foliage. Aphids can be treated with neem oil. Peppers are generally quite resilient.'],
      ['h2', 'Harvesting'],
      ['p', 'Sweet peppers can be harvested at any size, but flavor improves as they ripen. Green bells are immature; the same pepper left on turns red or orange and becomes sweeter. Hot peppers are hottest when fully ripe.']
    ]
  },
  {
    slug: 'how-to-grow-lettuce',
    title: 'How To Grow Lettuce',
    category: 'vegetable-guides',
    date: '2026-06-16', readTime: 5,
    img: PHOTOS.lettuce,
    seo: 'Complete guide to growing lettuce at home. Learn about varieties, planting, watering, harvesting, and how to extend your lettuce season.',
    sections: [
      ['h2', 'The Perfect Beginner Crop'],
      ['p', 'Lettuce is one of the easiest and most rewarding vegetables. It grows quickly, takes little space, and can be harvested continuously. Fresh-picked lettuce is incredibly crisp and far superior to store-bought bags.'],
      ['h2', 'Types of Lettuce'],
      ['p', 'Loose-leaf is the easiest — harvest individual leaves without removing the whole plant. Romaine forms tall, crisp heads. Butterhead has soft, tender heads. Skip crisphead (iceberg) as a beginner.'],
      ['h2', 'When and Where to Plant'],
      ['p', 'Lettuce is a cool-season crop for spring and fall. Plant seeds 2-4 weeks before last frost in spring. For fall, plant 6-8 weeks before first frost. Lettuce tolerates partial shade — unusual for vegetables.'],
      ['h2', 'Planting'],
      ['p', 'Scatter seeds on the soil surface and press in gently. Keep soil consistently moist until germination (2-8 days). Thin to 6-12 inches apart. Eat the thinnings!'],
      ['h2', 'Watering'],
      ['p', 'Lettuce has shallow roots and needs consistent moisture. Water lightly but frequently. Inconsistent watering causes bitter flavor and bolting. Mulch keeps soil cool and moist.'],
      ['h2', 'Harvesting'],
      ['p', 'For cut-and-come-again, cut leaves 1 inch above soil when 3-4 inches tall. The plant regrows. For full heads, cut at the base. Harvest outer leaves of loose-leaf varieties, leaving the center to grow.'],
      ['h2', 'Extending the Season'],
      ['p', 'Use shade cloth in summer to delay bolting. Plant in containers you can move to shade. Succession plant every 2-3 weeks. Cold frames extend harvest well into winter in many climates.']
    ]
  },
  // === Herb Guides ===
  {
    slug: 'how-to-grow-basil',
    title: 'How To Grow Basil',
    category: 'herb-guides',
    date: '2026-06-16', readTime: 5,
    img: PHOTOS.basil,
    seo: 'Complete guide to growing basil from seed or transplant. Learn planting, pruning, harvesting, and preserving this delicious herb.',
    sections: [
      ['h2', 'Why Grow Basil?'],
      ['p', 'Basil is one of the most rewarding herbs. It is incredibly easy, grows quickly, and homegrown flavor is incomparable. A single plant produces cup after cup of leaves all summer. Basil and tomatoes are the perfect garden pair.'],
      ['h2', 'Varieties to Try'],
      ['p', 'Sweet basil is classic for pesto and Italian cooking. Genovese is the standard for pesto. Thai basil has anise flavor for Southeast Asian dishes. Lemon and cinnamon basil add unique notes. Try 2-3 varieties.'],
      ['h2', 'Planting'],
      ['p', 'Basil loves heat. Plant after all frost danger passes and soil is above 70°F. Space 12-18 inches apart in full sun. Basil grows well in containers and raised beds. Seeds germinate in 5-10 days.'],
      ['h2', 'Pruning for Bushy Growth'],
      ['p', 'The secret to productive basil is regular pruning. Once the plant has 6-8 leaves, pinch the top set just above leaf nodes. This encourages branching. Keep pruning every 2-3 weeks. Never let basil flower — leaf production slows afterward.'],
      ['h2', 'Watering'],
      ['p', 'Basil likes consistent moisture but not waterlogged soil. Water when top inch feels dry. In hot weather, containers may need daily watering. Water at the base to keep leaves dry.'],
      ['h2', 'Harvesting and Storing'],
      ['p', 'Harvest in morning when oils are highest. Cut stems above a leaf node, taking no more than one-third. Store fresh in a glass of water on the counter. For long-term storage, freeze in olive oil, make pesto, or dry.']
    ]
  },
  // === Watering Help ===
  {
    slug: 'how-often-should-you-water-tomatoes',
    title: 'How Often Should You Water Tomatoes?',
    category: 'watering-help',
    date: '2026-06-15', readTime: 6,
    img: PHOTOS.watering,
    seo: 'Complete guide to watering tomatoes. Learn how often, how much, and the best time of day to water tomato plants for healthy growth.',
    sections: [
      ['h2', 'Why Watering Matters'],
      ['p', 'Watering is the single most important factor for healthy, productive tomatoes. Too little causes wilt and small fruit. Too much suffocates roots and dilutes flavor. Getting it right is essential.'],
      ['h2', 'How Much Water?'],
      ['p', 'Mature plants need 1-2 inches per week from rain or irrigation. In hot weather (85°F+) they may need more. Check soil 2-3 inches down — if dry, water. If moist, wait. Containers may need daily water in heat.'],
      ['h2', 'How Often?'],
      ['p', 'Deep, less frequent watering beats shallow daily sprinkling. Water deeply 2-3 times per week. Deep watering encourages downward root growth. Sandy soil needs more frequent watering than clay.'],
      ['h2', 'Best Time of Day'],
      ['p', 'Morning is best. Plants have moisture for the day and leaves dry before night, reducing disease. Avoid evening watering. If you must water mid-day, water at the base only.'],
      ['h2', 'Signs of Overwatering'],
      ['p', 'Yellowing lower leaves, wilting despite wet soil, and mold on soil surface. Let soil dry out before next watering. Check drainage. See our guide on overwatering for more details.'],
      ['h2', 'Signs of Underwatering'],
      ['p', 'Wilting that does not recover overnight, dry cracked soil, flower drop, and small fruit. See signs of underwatering vegetables to catch problems early.'],
      ['h2', 'Watering Techniques'],
      ['p', 'Always water at the base, not from above. Drip irrigation and soaker hoses are ideal. Mulch helps retain moisture. Adjust for weather — heat waves and wind increase needs.']
    ]
  },
  {
    slug: 'how-often-should-you-water-raised-beds',
    title: 'How Often Should You Water Raised Beds?',
    category: 'watering-help',
    date: '2026-06-15', readTime: 5,
    img: PHOTOS.raisedbed,
    seo: 'Learn the best watering practices for raised bed vegetable gardens. Raised beds drain faster and need a different watering approach than in-ground gardens.',
    sections: [
      ['h2', 'Why Raised Beds Are Different'],
      ['p', 'Raised beds drain faster because they are filled with loose, well-draining soil. This is great for roots but means more frequent watering. Understanding raised bed watering is key to success.'],
      ['h2', 'How Often?'],
      ['p', 'In average summer weather, raised beds need watering every 1-3 days. In hot, dry conditions, water daily. In cool weather, 4-5 days. Always check 2 inches deep — if dry, water.'],
      ['h2', 'Factors Affecting Frequency'],
      ['p', 'Soil composition matters — more compost retains moisture longer. Bed depth — deeper beds (12+ inches) hold more moisture. Plant size — large plants like tomatoes need more than herbs. Sun and wind increase needs.'],
      ['h2', 'Best Watering Methods'],
      ['p', 'Drip irrigation or soaker hoses are most efficient. They deliver water to soil, minimize evaporation, and keep foliage dry. A timer automates consistency. For hand watering, use a gentle spray wand.'],
      ['h2', 'Mulching Helps'],
      ['p', 'A 2-3 inch layer of organic mulch dramatically reduces evaporation. Straw, shredded leaves, or grass clippings work well. You will water less and plants will be healthier.'],
      ['h2', 'Seasonal Adjustments'],
      ['p', 'Spring and fall need less water than summer. Young seedlings need gentle, frequent water. Mature plants with deep roots go longer between waterings. Adjust based on weather forecasts.']
    ]
  },
  {
    slug: 'how-to-know-if-youre-overwatering',
    title: 'How To Know If You Are Overwatering',
    category: 'watering-help',
    date: '2026-06-15', readTime: 5,
    img: PHOTOS.watering,
    seo: 'Learn the signs of overwatering in vegetable gardens. Identify symptoms early and take corrective action before root rot kills your plants.',
    sections: [
      ['h2', 'The Most Common Mistake'],
      ['p', 'Overwatering is the number one cause of plant problems for new gardeners. More plants die from overwatering than underwatering. Learning the signs can save your garden.'],
      ['h2', 'Yellowing Lower Leaves'],
      ['p', 'When plants get too much water, the oldest leaves often turn yellow and droop. Waterlogged soil prevents roots from absorbing oxygen. If you see yellow lower leaves with wet soil, overwatering is likely.'],
      ['h2', 'Wilting Despite Wet Soil'],
      ['p', 'This is the most confusing symptom — a plant that looks thirsty when soil is wet. Damaged roots cannot take up water. Always check soil before watering. If wet and wilting, let it dry out.'],
      ['h2', 'Mold on Soil Surface'],
      ['p', 'Green algae or white fuzzy mold on soil is a clear sign of excess moisture. Scrape it off, improve airflow, and let soil dry more between waterings.'],
      ['h2', 'Stunted Growth'],
      ['p', 'Constantly overwatered plants grow slowly with pale or yellow leaves. Often mistaken for nutrient deficiency, but the real problem is root suffocation.'],
      ['h2', 'How to Fix It'],
      ['p', 'Stop watering immediately and let soil dry. Check drainage holes. Move containers to a sunnier spot. Improve garden bed drainage with compost. Always check soil moisture before watering going forward.']
    ]
  },
  {
    slug: 'signs-of-underwatering-vegetables',
    title: 'Signs Of Underwatering Vegetables',
    category: 'watering-help',
    date: '2026-06-15', readTime: 5,
    img: PHOTOS.watering,
    seo: 'Recognize the signs of underwatering in your garden. Learn how to identify and fix drought stress before it reduces your harvest.',
    sections: [
      ['h2', 'A Common Stressor'],
      ['p', 'While overwatering is more common, underwatering causes significant stress and reduces yields. Many gardeners fear overwatering and under water instead. Finding balance is key.'],
      ['h2', 'Wilting Leaves'],
      ['p', 'The most obvious sign. Leaves droop and lose firmness. Some afternoon wilting is normal, but if they do not recover by evening, plants need water urgently. Prolonged wilting causes permanent damage.'],
      ['h2', 'Dry Cracked Soil'],
      ['p', 'If soil pulls away from pot sides or bed edges and the surface is hard and cracked, it is time to water. Water slowly so it penetrates rather than running off.'],
      ['h2', 'Leaf Curling and Browning'],
      ['p', 'Underwatered plants curl leaves inward to conserve moisture. Edges turn brown and crispy. Lower leaves yellow and drop as the plant sacrifices them.']      ,
      ['h2', 'Blossom Drop and Poor Fruit'],
      ['p', 'Stressed plants prioritize survival over reproduction. Flowers drop without setting fruit. Fruits may be small or misshapen. Blossom end rot is often from inconsistent watering.'],
      ['h2', 'How to Fix It'],
      ['p', 'Water slowly and deeply. Give a thorough soaking, let it absorb, then water again. Establish a consistent routine. Check soil moisture daily. Mulch to retain moisture. Consider drip irrigation with a timer.']
    ]
  },
  {
    slug: 'best-time-of-day-to-water-your-garden',
    title: 'Best Time Of Day To Water Your Garden',
    category: 'watering-help',
    date: '2026-06-15', readTime: 5,
    img: PHOTOS.watering,
    seo: 'Learn the best time of day to water your garden. Morning watering is best — we explain why and what to do if you cannot water in the morning.',
    sections: [
      ['h2', 'Why Timing Matters'],
      ['p', 'When you water is almost as important as how much. The right timing means the difference between healthy plants and disease-prone ones.'],
      ['h2', 'Morning is Best'],
      ['p', 'Early morning (5-9 AM) is ideal. Plants have moisture for the day when they need it most. Water on leaves dries quickly in morning sun, reducing fungal disease risk.'],
      ['h2', 'Avoid Evening Watering'],
      ['p', 'Evening is the worst time. Water sits on leaves and soil overnight, creating ideal conditions for fungal diseases, mildew, and rot. Slugs also thrive in moist conditions.'],
      ['h2', 'Afternoon is OK in Emergencies'],
      ['p', 'Afternoon watering loses much to evaporation but is fine if a plant is wilting. Just switch to morning for regular watering.'],
      ['h2', 'Adjust for Weather'],
      ['p', 'On hot, windy days, morning water is essential. On cool, cloudy days, you can water later. Before rain, skip watering. The Personal Harvest Helper app gives daily watering recommendations based on your local weather.']
    ]
  },
  // === Garden Problems ===
  {
    slug: 'why-are-my-tomato-leaves-turning-yellow',
    title: 'Why Are My Tomato Leaves Turning Yellow?',
    category: 'garden-problems',
    date: '2026-06-15', readTime: 6,
    img: PHOTOS.tomatoes,
    seo: 'Yellow tomato leaves can signal several issues. Learn the common causes from overwatering to nutrient deficiencies and how to fix them.',
    sections: [
      ['h2', 'A Common Concern'],
      ['p', 'Yellow leaves on tomatoes are alarming but not always a crisis. The key is identifying the pattern and cause so you can take the right action.'],
      ['h2', 'Cause 1: Normal Aging'],
      ['p', 'If the lowest leaves turn yellow and drop as the plant grows taller, that is normal. Remove them for better airflow. The rest of the plant should look healthy.'],
      ['h2', 'Cause 2: Overwatering'],
      ['p', 'Yellow leaves with consistently wet soil point to overwatering. Roots cannot absorb oxygen. Let soil dry out and adjust watering. Check drainage. See our overwatering guide.'],
      ['h2', 'Cause 3: Underwatering'],
      ['p', 'Yellow leaves that are also wilted or crispy indicate underwatering. Water deeply and consistently. Inconsistent watering also causes blossom end rot.'],
      ['h2', 'Cause 4: Nitrogen Deficiency'],
      ['p', 'If the whole plant looks pale green to yellow starting from the bottom, nitrogen is likely low. Apply balanced organic fertilizer or fish emulsion.'],
      ['h2', 'Cause 5: Disease'],
      ['p', 'Yellow leaves with brown spots may indicate early blight or fusarium wilt. Remove affected leaves promptly. Rotate crops next year and choose resistant varieties.'],
      ['h2', 'How to Diagnose'],
      ['p', 'Check soil moisture first. Look at the pattern — lower leaves only or whole plant? Check for spots. Adjust watering, then fertilize if needed. The Personal Harvest Helper app helps identify these issues with personalized guidance.']
    ]
  },
  {
    slug: 'why-are-my-cucumbers-dying',
    title: 'Why Are My Cucumbers Dying?',
    category: 'garden-problems',
    date: '2026-06-15', readTime: 6,
    img: PHOTOS.cucumber,
    seo: 'Is your cucumber plant dying? Learn the most common causes of cucumber decline and how to save your crop.',
    sections: [
      ['h2', 'Diagnosing Cucumber Problems'],
      ['p', 'Cucumbers are usually vigorous growers, so when they decline, something is wrong. Common causes are pests, disease, or watering issues. Here is how to diagnose and fix the problem.'],
      ['h2', 'Powdery Mildew'],
      ['p', 'White powdery spots on leaves that turn yellow and die. Prevent with proper spacing, base watering, and resistant varieties. Treat with neem oil. See how to prevent powdery mildew.'],
      ['h2', 'Cucumber Beetles'],
      ['p', 'These pests chew leaves and transmit bacterial wilt. Use yellow sticky traps, row covers on young plants, or neem oil. Hand-pick if infestation is small.'],
      ['h2', 'Overwatering and Root Rot'],
      ['p', 'Yellow leaves, wilting despite wet soil, and foul smell from soil indicate root rot. Improve drainage and reduce watering. Ensure containers have clear drainage holes.'],
      ['h2', 'Underwatering Stress'],
      ['p', 'Wilting that does not recover by evening, bitter fruit. Cucumbers need consistent moisture. Water deeply when top inch is dry. Mulch to retain moisture.'],
      ['h2', 'Poor Pollination'],
      ['p', 'Plants flowering but not fruiting? Poor pollination. Plant flowers to attract bees. Avoid pesticides during flowering. Hand-pollinate with a small brush.'],
      ['h2', 'Prevention'],
      ['p', 'Start with disease-resistant varieties. Rotate crops yearly. Provide proper spacing. Water at the base. Inspect daily and catch problems early. Healthy plants resist pests better.']
    ]
  },
  {
    slug: 'common-garden-pests-and-how-to-stop-them',
    title: 'Common Garden Pests And How To Stop Them',
    category: 'garden-problems',
    date: '2026-06-15', readTime: 7,
    img: PHOTOS.pests,
    seo: 'Identify and control common garden pests that attack vegetables. Learn organic methods to protect your garden from aphids, hornworms, slugs, and more.',
    sections: [
      ['h2', 'Organic Pest Management'],
      ['p', 'Most pest problems can be managed without harsh chemicals. Early detection and targeted organic controls are key. Here are the most common garden pests and how to stop them naturally.'],
      ['h2', 'Aphids'],
      ['p', 'Tiny insects that cluster on new growth and suck plant sap. Control: Blast with water, apply insecticidal soap or neem oil. Ladybugs and lacewings are natural predators.'],
      ['h2', 'Tomato Hornworms'],
      ['p', 'Large green caterpillars that defoliate plants overnight. Look for dark droppings on lower leaves. Control: Hand-pick at dawn or dusk. Use Bt (Bacillus thuringiensis) spray — an organic option that targets caterpillars. Till soil in fall to destroy pupae.'],
      ['h2', 'Slugs and Snails'],
      ['p', 'They chew irregular holes in leaves and fruit at night. Control: Hand-pick with a flashlight. Set beer traps or board traps. Diatomaceous earth creates a barrier. Remove garden debris where they hide.'],
      ['h2', 'Cucumber Beetles'],
      ['p', 'Striped and spotted beetles attack cucumbers, squash, and melons. They transmit bacterial wilt. Control: Floating row covers, yellow sticky traps, kaolin clay. Remove infected plants.'],
      ['h2', 'Squash Bugs'],
      ['p', 'Dark bugs that suck sap from squash and pumpkin leaves. Look for copper eggs on leaf undersides. Control: Crush egg clusters. Hand-pick adults into soapy water. Remove debris at season end.'],
      ['h2', 'Preventive Strategies'],
      ['p', 'Healthy plants resist pests better. Rotate crops, plant diverse gardens, use row covers, keep the garden clean, and inspect daily. The Personal Harvest Helper app will include pest alerts tailored to your plants.']
    ]
  },
  {
    slug: 'how-to-prevent-powdery-mildew',
    title: 'How To Prevent Powdery Mildew',
    category: 'garden-problems',
    date: '2026-06-15', readTime: 5,
    img: PHOTOS.pests,
    seo: 'Learn how to prevent and treat powdery mildew in your vegetable garden. Organic methods to stop this common fungal disease before it spreads.',
    sections: [
      ['h2', 'What Is Powdery Mildew?'],
      ['p', 'Powdery mildew is a common fungal disease that appears as white or gray powdery spots on leaves. It thrives in moderate temperatures (60-80°F) with high humidity and poor air circulation. Unlike many fungi, it does not need wet leaves.'],
      ['h2', 'Which Plants Are Affected?'],
      ['p', 'Most common on cucurbits (cucumbers, squash, zucchini), tomatoes, peppers, and peas. Different species affect different plants, so mildew on cucumbers will not spread to roses.'],
      ['h2', 'Prevention Through Spacing'],
      ['p', 'Proper spacing is your first defense. Crowded plants create humid pockets where mildew thrives. Follow spacing recommendations for good air circulation.'],
      ['h2', 'Watering Practices'],
      ['p', 'Water at the base, not overhead. Wet foliage promotes mildew. Use drip irrigation. If overhead watering is necessary, do it in the morning so leaves dry quickly.'],
      ['h2', 'Resistant Varieties'],
      ['p', 'Look for PM-resistant varieties. Cucumbers like Diva and Sugar Crunch have good resistance. Butternut squash is more resistant than other winter types.'],
      ['h2', 'Natural Treatments'],
      ['p', 'If mildew appears, treat immediately: baking soda spray (1 tbsp baking soda + 1/2 tsp soap + 1 gallon water), neem oil, or milk spray (1 part milk to 9 parts water). Remove severely infected leaves.'],
      ['h2', 'Long-Term Prevention'],
      ['p', 'Rotate crops, clean up debris, choose resistant varieties, and maintain healthy soil. Stressed plants are more susceptible. These strategies greatly reduce powdery mildew impact.']
    ]
  },
  {
    slug: 'why-isnt-my-garden-producing-vegetables',
    title: 'Why Isnt My Garden Producing Vegetables?',
    category: 'garden-problems',
    date: '2026-06-15', readTime: 6,
    img: PHOTOS.garden,
    seo: 'Troubleshoot why your vegetable garden is not producing. Learn common reasons for poor yields and how to fix them for a bountiful harvest.',
    sections: [
      ['h2', 'A Frustrating Situation'],
      ['p', 'You planted, watered, and weeded, but your garden is not producing. Here are the most common reasons and how to fix them.'],
      ['h2', 'Not Enough Sunlight'],
      ['p', 'Most vegetables need 6-8 hours of direct sun daily. If your garden is shady, plants will be leggy with few flowers. Consider moving your garden or cutting back branches.'],
      ['h2', 'Poor Pollination'],
      ['p', 'Plants flowering but not fruiting? Plant flowers to attract bees. Avoid pesticides during flowering. Hand-pollinate squash and cucumbers with a small brush.'],
      ['h2', 'Too Much Nitrogen'],
      ['p', 'Lush green growth with no fruit is a classic sign of too much nitrogen. Switch to a phosphorus-rich fertilizer. Bone meal is a good source.'],
      ['h2', 'Temperature Stress'],
      ['p', 'Extreme temperatures prevent fruit set. Tomatoes drop flowers above 75°F at night or below 55°F. Use shade cloth in heat waves. Choose heat-tolerant varieties.'],
      ['h2', 'Inconsistent Watering'],
      ['p', 'Alternating dry and wet soil stresses plants. Water consistently and deeply. Use mulch. Drip irrigation with a timer provides the most consistent watering.'],
      ['h2', 'Pests and Disease'],
      ['p', 'Hidden problems can silently reduce yields. Inspect regularly, including roots. Rotate crops yearly. Build healthy soil with compost for stronger plants.']
    ]
  },
  // === Raised Bed Gardening ===
  {
    slug: 'raised-bed-gardening-for-beginners',
    title: 'Raised Bed Gardening For Beginners',
    category: 'raised-bed-gardening',
    date: '2026-06-17', readTime: 5,
    img: PHOTOS.raisedbed,
    seo: 'Everything you need to know about raised bed gardening. Learn how to build, fill, and plant raised beds for a successful vegetable garden.',
    sections: [
      ['h2', 'Why Raised Beds?'],
      ['p', 'Raised beds are one of the best options for beginners. They warm up faster in spring, drain better, and give you complete control over soil quality. They also reduce weeding, are easier on your back, and create a neat garden space.'],
      ['h2', 'Choosing Size and Location'],
      ['p', 'Standard beds are 4 feet wide by 6-8 feet long, 10-12 inches deep. The 4-foot width lets you reach the center from either side. Place in full sun (6-8 hours). Leave 2 feet between beds for walking.'],
      ['h2', 'Materials'],
      ['p', 'Untreated cedar, redwood, or fir resist rot naturally. Avoid treated lumber. Concrete blocks and galvanized steel are also popular. Line the bottom with cardboard to prevent weeds.'],
      ['h2', 'Filling Your Bed'],
      ['p', 'Use a mix of topsoil, compost, and vermiculite (60-30-10 ratio). Many stores sell pre-mixed raised bed soil. Fill to the top — soil settles over time.'],
      ['h2', 'What to Plant'],
      ['p', 'Almost anything grows well in raised beds. Tomatoes, peppers, cucumbers, lettuce, carrots, radishes, beans, and kale all thrive. Loose soil is especially good for root vegetables. Plant more densely than in-ground gardens.'],
      ['h2', 'Watering'],
      ['p', 'Raised beds drain faster, so they may need more frequent watering. Check soil moisture daily. A soaker hose or drip irrigation makes watering easier. See how often to water raised beds.'],
      ['h2', 'Maintenance'],
      ['p', 'Add fresh compost each season. Rotate crops yearly. Consider cover crops in the off-season. With proper care, raised beds produce abundantly for many years.']
    ]
  },
  // === Container Gardening ===
  {
    slug: 'container-gardening-for-beginners',
    title: 'Container Gardening For Beginners',
    category: 'container-gardening',
    date: '2026-06-17', readTime: 5,
    img: PHOTOS.containers,
    seo: 'Learn how to start a container vegetable garden on your patio, balcony, or windowsill. Perfect for beginners with limited space.',
    sections: [
      ['h2', 'Why Container Gardening?'],
      ['p', 'Container gardening is perfect for beginners with limited space. You can grow a surprising amount of food on a balcony, patio, or sunny windowsill. Containers give you control over soil and drainage, and they are portable.'],
      ['h2', 'Choosing Containers'],
      ['p', 'Most vegetables need at least 5 gallons of soil per plant. Tomatoes and peppers need 5-gallon pots minimum. Lettuce and herbs can grow in 1-2 gallons. Drainage holes are essential. Terracotta, ceramic, plastic, and fabric grow bags all work.'],
      ['h2', 'Use Quality Potting Mix'],
      ['p', 'Do not use garden soil in containers — it is too heavy. Use high-quality potting mix that is light and drains well. Add slow-release organic fertilizer at planting.'],
      ['h2', 'Best Vegetables for Containers'],
      ['p', 'Cherry tomatoes, bush cucumbers, peppers, lettuce, and herbs all thrive in containers. Dwarf or patio varieties are bred specifically for pots. Radishes and green onions are also excellent choices.'],
      ['h2', 'Watering'],
      ['p', 'Containers dry out much faster than garden beds. You may need to water daily, even twice a day in heat waves. Check soil moisture with your finger. Self-watering containers help reduce frequency.'],
      ['h2', 'Feeding'],
      ['p', 'Container plants need regular fertilizer since nutrients wash out with frequent watering. Use a balanced water-soluble organic fertilizer every 2-4 weeks. Liquid seaweed or fish emulsion are excellent choices.']
    ]
  }
];

// Utility
function escapeHtml(t) { return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function dateDisplay(d) { return new Date(d).toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'}); }

function postCard(p) {
  return `<div class="blog-card">
    <img class="blog-card-image" src="${p.img}" alt="${escapeHtml(p.title)}" loading="lazy">
    <div class="blog-card-body">
      <span class="blog-card-category">${CATEGORIES.find(c=>c.slug===p.category)?.name||p.category}</span>
      <h3><a href="/blog/${p.slug}/">${p.title}</a></h3>
      <p>${p.seo}</p>
      <div class="blog-meta">${dateDisplay(p.date)} &middot; ${p.readTime} min read</div>
    </div>
  </div>`;
}

// === Generate all blog posts ===
ALL_POSTS.forEach((post, idx) => {
  const dir = path.join(BASE, 'blog', post.slug);
  fs.mkdirSync(dir, { recursive: true });

  const prev = idx > 0 ? ALL_POSTS[idx-1] : null;
  const next = idx < ALL_POSTS.length-1 ? ALL_POSTS[idx+1] : null;
  const related = ALL_POSTS.filter(p => p.category === post.category && p.slug !== post.slug).slice(0, 3);
  const cat = CATEGORIES.find(c => c.slug === post.category);

  const contentHtml = post.sections.map(s => {
    if (s[0] === 'h2') return `<h2>${s[1]}</h2>`;
    if (s[0] === 'p') return `<p>${s[1]}</p>`;
    return '';
  }).join('\n');

  const catName = cat ? cat.name : post.category;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(post.title)} – Personal Harvest Helper</title>
  <meta name="description" content="${escapeHtml(post.seo)}">
  <link rel="icon" href="/images/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
${nav('/blog/')}
<main>
  <article>
    <div class="post-header">
      <div class="container">
        <a href="/categories/${post.category}/" class="post-category">${catName}</a>
        <h1>${post.title}</h1>
        <p class="post-meta">${dateDisplay(post.date)} &middot; ${post.readTime} min read</p>
      </div>
    </div>
    <div class="container">
      <img class="post-featured-image" src="${post.img}" alt="${escapeHtml(post.title)}" loading="lazy">
    </div>
    <div class="post-content">
      ${contentHtml}
    </div>
    ${related.length > 0 ? `
    <div class="section section-alt">
      <div class="container">
        <h2 style="text-align:center;margin-bottom:32px;">Related Posts</h2>
        <div class="blog-grid">
          ${related.map(r => `
          <div class="blog-card">
            <img class="blog-card-image" src="${r.img}" alt="${escapeHtml(r.title)}" loading="lazy">
            <div class="blog-card-body">
              <span class="blog-card-category">${CATEGORIES.find(c=>c.slug===r.category)?.name||r.category}</span>
              <h3><a href="/blog/${r.slug}/">${r.title}</a></h3>
            </div>
          </div>`).join('\n          ')}
        </div>
      </div>
    </div>` : ''}
    <div class="section section-alt" style="background:var(--green-100);">
      <div class="container text-center">
        <h2 style="margin-bottom:12px;">Get Personalized Gardening Guidance</h2>
        <p style="max-width:500px;margin:0 auto 24px;">Join the waitlist for Personal Harvest Helper — the app that tells you exactly what to plant and what to do next in your garden, based on your location and weather.</p>
        <form class="signup-form" action="#" method="POST">
          <input type="email" placeholder="Enter your email" required aria-label="Email address">
          <button type="submit" class="btn btn-primary">Join the Waitlist</button>
        </form>
        <p style="font-size:0.85rem;color:var(--gray-500);margin-top:12px;">No spam. Unsubscribe anytime.</p>
      </div>
    </div>
    <div class="section">
      <div class="container">
        <div style="display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap;">
          <div>${prev ? `<a href="/blog/${prev.slug}/">&larr; ${prev.title}</a>` : ''}</div>
          <div>${next ? `<a href="/blog/${next.slug}/">${next.title} &rarr;</a>` : ''}</div>
        </div>
      </div>
    </div>
  </article>
</main>
${FOOTER.replace('__BASE__','')}
<script src="/js/main.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`Post: blog/${post.slug}/`);
});

// === Generate category pages ===
CATEGORIES.forEach(cat => {
  const catPosts = ALL_POSTS.filter(p => p.category === cat.slug);
  const dir = path.join(BASE, 'categories', cat.slug);
  fs.mkdirSync(dir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cat.name} – Personal Harvest Helper Blog</title>
  <meta name="description" content="${escapeHtml(cat.desc)}">
  <link rel="icon" href="/images/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
${nav('/categories/'+cat.slug+'/')}
<main>
  <section class="page-header">
    <div class="container">
      <h1>${cat.name}</h1>
      <p>${cat.desc}</p>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="blog-grid">
        ${catPosts.map(p => postCard(p)).join('\n        ')}
      </div>
    </div>
  </section>
  <section class="section section-alt">
    <div class="container text-center">
      <h2 style="margin-bottom:12px;">Never Miss a Gardening Tip</h2>
      <p style="max-width:500px;margin:0 auto 24px;">Join our mailing list for beginner-friendly gardening advice and early access to the Personal Harvest Helper app.</p>
      <form class="signup-form" action="#" method="POST">
        <input type="email" placeholder="Enter your email" required aria-label="Email address">
        <button type="submit" class="btn btn-primary">Join the Waitlist</button>
      </form>
    </div>
  </section>
</main>
${FOOTER.replace('__BASE__','')}
<script src="/js/main.js"></script>
</body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`Cat: categories/${cat.slug}/`);
});

// === Generate blog index ===
const blogIndex = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gardening Blog – Personal Harvest Helper</title>
  <meta name="description" content="Beginner-friendly gardening tips, guides, and advice. Learn how to start a vegetable garden, grow tomatoes, water correctly, and solve common problems.">
  <link rel="icon" href="/images/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
${nav('/blog/')}
<main>
  <section class="page-header">
    <div class="container">
      <h1>Gardening Blog</h1>
      <p>Beginner-friendly guides, tips, and advice to help you grow your own vegetables and herbs with confidence.</p>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="category-list">
        ${CATEGORIES.map(c => `<a href="/categories/${c.slug}/" class="category-tag">${c.name}</a>`).join('\n        ')}
      </div>
      <div class="blog-grid">
        ${ALL_POSTS.map(p => postCard(p)).join('\n        ')}
      </div>
    </div>
  </section>
  <section class="section section-alt">
    <div class="container text-center">
      <h2 style="margin-bottom:12px;">Get Gardening Tips &amp; Updates</h2>
      <p style="max-width:500px;margin:0 auto 24px;">Join our mailing list for beginner-friendly gardening advice and early access to the Personal Harvest Helper app.</p>
      <form class="signup-form" action="#" method="POST">
        <input type="email" placeholder="Enter your email" required aria-label="Email address">
        <button type="submit" class="btn btn-primary">Join the Waitlist</button>
      </form>
    </div>
  </section>
</main>
${FOOTER.replace('__BASE__','')}
<script src="/js/main.js"></script>
</body>
</html>`;
fs.writeFileSync(path.join(BASE, 'blog', 'index.html'), blogIndex);
console.log('Blog index created');

// === Generate sitemap ===
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc><priority>1.0</priority></url>
  <url><loc>${SITE_URL}/about/</loc><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/blog/</loc><priority>0.9</priority></url>
  <url><loc>${SITE_URL}/contact/</loc><priority>0.7</priority></url>
  <url><loc>${SITE_URL}/waitlist/</loc><priority>0.9</priority></url>
  <url><loc>${SITE_URL}/privacy-policy/</loc><priority>0.5</priority></url>
  <url><loc>${SITE_URL}/terms-of-use/</loc><priority>0.5</priority></url>
${CATEGORIES.map(c => `  <url><loc>${SITE_URL}/categories/${c.slug}/</loc><priority>0.7</priority></url>`).join('\n')}
${ALL_POSTS.map(p => `  <url><loc>${SITE_URL}/blog/${p.slug}/</loc><priority>0.8</priority></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(BASE, 'sitemap.xml'), sitemap);
console.log('sitemap.xml created');

// === Generate robots.txt ===
fs.writeFileSync(path.join(BASE, 'robots.txt'), `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml`);
console.log('robots.txt created');

// === Generate RSS feed ===
const rssItems = ALL_POSTS.map(p => {
  const cat = CATEGORIES.find(c => c.slug === p.category);
  return `<item>
  <title>${escapeHtml(p.title)}</title>
  <link>${SITE_URL}/blog/${p.slug}/</link>
  <description>${escapeHtml(p.seo)}</description>
  <pubDate>${new Date(p.date).toUTCString()}</pubDate>
  <guid>${SITE_URL}/blog/${p.slug}/</guid>
  <category>${cat ? cat.name : ''}</category>
</item>`;
}).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Personal Harvest Helper Blog</title>
  <link>${SITE_URL}/blog/</link>
  <description>Beginner-friendly gardening tips and guides to help you grow your own vegetables and herbs.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
</channel>
</rss>`;
fs.writeFileSync(path.join(BASE, 'rss.xml'), rss);
console.log('rss.xml created');

console.log('\nDone! All files generated.');
console.log(`Total posts: ${ALL_POSTS.length}`);
console.log(`Total categories: ${CATEGORIES.length}`);