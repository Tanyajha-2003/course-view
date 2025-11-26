import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Course from './models/Course.js';
import Section from './models/Section.js';
import Video from './models/Video.js';

const MONGODB_URI = process.env.MONGODB_URI;
if(!MONGODB_URI) { console.error('MONGODB_URI needed'); process.exit(1); }

await mongoose.connect(MONGODB_URI);

console.log('Connected for seeding');
await Video.deleteMany({});
await Section.deleteMany({});
await Course.deleteMany({});

const samples = [
  {
    title: 'Introduction to Machine Learning',
    description: 'ML basics, supervised/unsupervised, simple projects.',
    level: 'Beginner',
    language: 'English',
    sections: [
      { title: 'Introduction To Machine Learning', lectures: [
          { title: 'What is ML?', videoUrl: 'https://www.youtube.com/embed/Gv9_4yMHFhI', duration: '08:32' }
        ]
      },
      { title: 'Concepts Of Machine Learning', lectures: [
          { title: 'Supervised vs Unsupervised', videoUrl: 'https://www.youtube.com/embed/0Lt9w-BxKFQ', duration: '12:10' },
          { title: 'Bias-Variance', videoUrl: 'https://www.youtube.com/embed/EuBBz3bI-aA', duration: '10:05' }
        ]
      }
    ]
  }
];

for(const cdata of samples){
  const course = await Course.create({
    title: cdata.title, description: cdata.description, level: cdata.level, language: cdata.language
  });
  for(const [sidx, sdata] of cdata.sections.entries()){
    const section = await Section.create({ courseId: course._id, title: sdata.title, order: sidx+1 });
    for(const [vidx, v] of sdata.lectures.entries()){
      await Video.create({ courseId: course._id, sectionId: section._id, title: v.title, videoUrl: v.videoUrl, duration: v.duration, order: vidx+1 });
    }
  }
}
console.log('Seeding done');
await mongoose.disconnect();
process.exit(0);
