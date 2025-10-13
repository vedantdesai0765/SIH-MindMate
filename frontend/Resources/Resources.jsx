import React, { useState, useMemo, useEffect } from 'react';
import './styles/Resources.css';

const allResources = [
  { id: 101, type: 'Blog', topic: 'Anxiety', author: 'Dr. Ananya Sharma', content: { en: 'Exam season can be incredibly stressful. Learn how to stay calm and focused with these simple, science-backed mindfulness exercises that you can do anywhere, anytime. A real article would have much more content here for the user to read.', ur: 'امتحانات کا موسم ناقابل یقین حد تک دباؤ والا ہو سکتا ہے۔ ان آسان، سائنس سے ثابت شدہ ذہن سازی کی مشقوں کے ساتھ پرسکون اور مرکوز رہنا سیکھیں جو آپ کہیں بھی، کسی بھی وقت کر سکتے ہیں۔', ks: 'امتحانٕک موسم چھُ واریاہ تناو وول آسِتھ ہیٛکِت۔ ییٚلہِ زن پرسکون تہٕ مرکوز روزنُک طریقہٕ ہیٚچھِو یِمن سٲدٕ، سائنس پؠٹھ مبنی ذہن سازی ہنٛد مشقو سٟتؠ یم توٚہہِ کتھِی تہِ، کُنِی تہِ وقتس پؠٹھ کٔرِتھ ہیٚکِو۔' }, title: { en: 'Navigating Exam Anxiety: 5 Mindfulness Techniques', ur: 'امتحان کی بے چینی پر قابو پانا: ذہن سازی کی 5 تکنیکیں', ks: 'امتحانٕچ پریشٲنی ہنٛد انتظام: 5 ذہن سازی ہنٛدؠ تکنیک' } },
  { id: 102, type: 'Blog', topic: 'General Wellness', author: 'Dr. Sameer Khan', content: { en: 'The transition to college is a huge step. Discover key strategies for building mental resilience to handle homesickness, new social circles, and academic challenges.', ur: 'کالج میں منتقلی ایک بہت بڑا قدم ہے۔ گھر کی یاد، نئے سماجی حلقوں، اور تعلیمی چیلنجوں سے نمٹنے کے لیے ذہنی لچک پیدا کرنے کی کلیدی حکمت عملی دریافت کریں۔', ks: 'کالجس مَنٛز تبدیلی چھُ اَکھ بوٚڈ قدم۔ گھرٕچ یاد، نٔوِسماجی حلقہٕ، تہٕ تعلیمی چیلنجو سٟتؠ نمٹنہٕ خٲطرٕ ذہنی لچک بناونٕکؠ کلیدی حکمت عملی دریافت کٔرِو۔' }, title: { en: 'Building Resilience in Your First Year of College', ur: 'کالج کے پہلے سال میں لچک پیدا کرنا', ks: 'کالجک گۄڈنِس ورِس مَنٛز لچک پٲدٕ کرٕنؠ' } },
  { id: 1, title: 'Mental Health Guidebook (PDF)', type: 'PDF', topic: 'General Wellness', link: 'https://www.globalfamilydoctor.com/site/DefaultSite/filesystem/documents/resources/MHGuidebook-EBookDownload.pdf', description: 'A comprehensive guidebook for mental health from the World Organization of Family Doctors.' },
  { id: 2, title: 'WHO Mental Health Policy Guide (PDF)', type: 'PDF', topic: 'General Wellness', link: 'https://apps.who.int/iris/bitstream/handle/10665/42823/9241562579.pdf', description: 'Official policy and service guidance for mental health from the World Health Organization.' },
  { id: 5, title: 'Therapy in a Nutshell - Free Resources', type: 'Worksheet', topic: 'Self-Help', link: 'https://courses.therapyinanutshell.com/free-resources', description: 'A collection of free courses and worksheets covering skills to manage emotions.' },
  { id: 8, title: 'NHS Mental Wellbeing Audio Guides', type: 'Audio', topic: 'Mindfulness', link: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/mental-wellbeing-audio-guides/', description: 'A series of audio guides from the NHS to help you cope with low mood, anxiety and stress.' },
  { id: 10, title: 'What is Mental Health?', type: 'Video', topic: 'General Wellness', link: 'https://youtu.be/XsdHkGth6Ec', description: 'A brief, informative video from the CDC explaining the basics of mental health.' },
  { id: 11, title: 'Anxiety vs. Stress', type: 'Video', topic: 'Anxiety', link: 'https://youtu.be/KxkZjr2pvRA', description: 'Learn about the connection and differences between anxiety, stress, and depression.' },
  { id: 13, title: 'Kashmiri Instrumental Music for Relaxation', type: 'Video', topic: 'Mindfulness', link: 'https://youtu.be/rFmsBctRFnA', description: 'Soothing and calm music for relaxation, focus, or meditation.' },
  { id: 17, title: 'Centre for Clinical Interventions', type: 'Worksheet', topic: 'Self-Help', link: 'https://www.cci.health.wa.gov.au/resources/looking-after-yourself', description: 'A large collection of modules and worksheets for various mental health conditions.' }
];


const typeIcons = {
  Blog: `<svg class="w-6 h-6" ...>...</svg>`,
  PDF: `<svg class="w-6 h-6" ...>...</svg>`,
  Worksheet: `<svg class="w-6 h-6" ...>...</svg>`,
  Audio: `<svg class="w-6 h-6" ...>...</svg>`,
  Video: `<svg class="w-6 h-6" ...>...</svg>`,
  Article: `<svg class="w-6 h-6" ...>...</svg>`
};

const GlobalStyles = () => {
  useEffect(() => {
    document.body.classList.add('resources-hub');
    return () => { document.body.classList.remove('resources-hub'); };
  }, []);
  return null;
};

const Header = () => (
  <header className="flex justify-between items-center mb-12">
    <a href="home.html" className="flex items-center space-x-4 transition-transform duration-300 hover:scale-105">
      <span className="font-display font-bold text-3xl text-accent-brown">Resources Hub</span>
    </a>
    <a href="home.html" className="hidden sm:inline-block bg-white/80 text-accent-brown font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition">Back to Home</a>
  </header>
);

const ResourceCard = ({ resource, onReadMore }) => {
  const isBlog = resource.type === 'Blog';
  const title = isBlog ? resource.title.en : resource.title;
  const description = resource.description || `By ${resource.author}`;

  return (
    <div className="resource-card bg-white/80 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1.5 p-6 flex flex-col">
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <p className="text-xs font-semibold bg-accent-blue/20 text-accent-brown py-1 px-2 rounded-full">{resource.topic}</p>
          <div className="text-stone-400" dangerouslySetInnerHTML={{ __html: typeIcons[resource.type] || typeIcons['Article'] }} />
        </div>
        <h3 className="font-display text-lg font-semibold text-stone-800 mt-3">{title}</h3>
        <p className="text-sm text-stone-600 mt-1">{description}</p>
      </div>
      {isBlog ? (
        <button onClick={() => onReadMore(resource)} className="mt-4 text-accent-green font-semibold hover:underline text-left">Read Article</button>
      ) : (
        <a href={resource.link} target="_blank" className="mt-4 inline-block text-accent-green font-semibold hover:underline no-underline">Access Resource</a>
      )}
    </div>
  );
};

const FeaturedCard = ({ resource, onReadMore }) => (
  <div onClick={() => onReadMore(resource)} className="resource-card bg-white/80 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1.5 p-6 flex flex-col cursor-pointer">
    <div className="flex-grow">
      <p className="text-xs font-semibold bg-accent-blue/20 text-accent-brown py-1 px-2 rounded-full w-min whitespace-nowrap">{resource.topic}</p>
      <h3 className="font-display text-xl font-semibold text-stone-800 mt-3">{resource.title.en}</h3>
      <p className="text-sm text-stone-600 mt-2">{resource.content.en.substring(0, 100)}...</p>
    </div>
    <span className="mt-4 text-accent-green font-semibold hover:underline">Read Full Article &rarr;</span>
  </div>
);

const BlogModal = ({ post, onClose }) => {
  if (!post) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-primary-bg w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col transform transition-all duration-300 animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-stone-300">
          <div>
            <h2 className="font-display text-2xl font-bold text-stone-800">{post.title.en}</h2>
            <p className="text-sm text-stone-500 mt-1">By {post.author}</p>
          </div>
          <button onClick={onClose} className="flex-shrink-0 text-stone-500 hover:text-stone-800" aria-label="Close">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 sm:p-8 overflow-y-auto prose max-w-none">
          <div className="text-stone-700 space-y-4">
            <p>{post.content.en}</p>
            <div className="p-4 bg-accent-yellow/50 border-l-4 border-accent-yellow rounded-r-lg">
              <h3 className="font-bold font-urdu text-lg">اردو ترجمہ</h3>
              <p className="font-urdu">{post.content.ur}</p>
            </div>
            <div className="p-4 bg-accent-blue/20 border-l-4 border-accent-blue rounded-r-lg">
              <h3 className="font-bold font-urdu text-lg">کٲشُر تَرجَمہ</h3>
              <p className="font-urdu">{post.content.ks}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);

  const topics = useMemo(() => ['All', ...new Set(allResources.map(r => r.topic))], []);
  const featuredPosts = useMemo(() => allResources.filter(r => r.type === 'Blog'), []);

  const filteredResources = useMemo(() => {
    let resources = allResources.filter(r => r.type !== 'Blog');

    if (activeFilter !== 'All') {
      resources = resources.filter(r => r.topic === activeFilter);
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      resources = allResources.filter(r =>
        (r.title.en || r.title).toLowerCase().includes(lowercasedTerm) ||
        (r.description || r.author || '').toLowerCase().includes(lowercasedTerm) ||
        r.topic.toLowerCase().includes(lowercasedTerm)
      ).filter(r => r.type !== 'Blog');
    }

    return resources;
  }, [searchTerm, activeFilter]);

  const handleFilterClick = (topic) => {
    setSearchTerm('');
    setActiveFilter(topic);
  };

  return (
    <>
      <GlobalStyles />
      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        <Header />
        <main>
          {/* Featured Section */}
          <section className="mb-16">
            <h2 className="font-display text-2xl font-bold text-stone-800 mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPosts.map(post => <FeaturedCard key={post.id} resource={post} onReadMore={setSelectedPost} />)}
            </div>
          </section>

          {/* All Resources Section */}
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="font-display text-2xl font-bold text-stone-800">All Resources</h2>
              <div className="w-full sm:w-auto flex-grow sm:flex-grow-0 max-w-sm">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setActiveFilter('All'); }}
                  placeholder="Search all resources..."
                  className="w-full bg-white border border-stone-300 rounded-full py-2 px-5 focus:outline-none focus:ring-2 focus:ring-accent-green transition shadow-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {topics.map(topic => (
                <button
                  key={topic}
                  onClick={() => handleFilterClick(topic)}
                  className={`filter-btn px-4 py-1.5 text-sm font-semibold rounded-full border-2  hover:border-accent-brown ${activeFilter === topic ? 'bg-accent-brown text-white border-accent-brown' : 'bg-white/80 text-stone-700 border-stone-300'}`}
                >
                  {topic}
                </button>
              ))}
            </div>

            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map(resource => <ResourceCard key={resource.id} resource={resource} onReadMore={setSelectedPost} />)}
              </div>
            ) : (
              <p className="text-center text-stone-500 mt-10">No resources found matching your search.</p>
            )}
          </section>
        </main>
      </div>

      <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}
