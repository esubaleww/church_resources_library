const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./config/db");

const Resource = require("./models/Resource");
const Prayer = require("./models/Prayer");
const Event = require("./models/Event");

const resources = [
  {
    title: "Ethiopian Orthodox Bible",
    description: "Complete 81 books of the Ethiopian Orthodox Tewahedo Canon",
    icon: "Book",
    category: "Scripture",
    type: "Book",
    link: "#",
  },
  {
    title: "Daily Scripture Readings",
    description: "Daily readings according to the Ethiopian Orthodox calendar",
    icon: "BookOpen",
    category: "Scripture",
    type: "Web",
    link: "#",
  },
  {
    title: "Book of Enoch",
    description: "Study the Book of Enoch, part of Ethiopian Orthodox canon",
    icon: "BookOpen",
    category: "Scripture",
    type: "PDF",
    link: "#",
  },
  {
    title: "Fetha Negest",
    description: "The Law of the Kings - Ethiopian Orthodox church law",
    icon: "Book",
    category: "Teachings",
    type: "Book",
    link: "#",
  },
  {
    title: "Didascalia",
    description: "Ancient teachings of the Apostles in Ethiopian tradition",
    icon: "FileText",
    category: "Teachings",
    type: "PDF",
    link: "#",
  },
  {
    title: "Qene Poetry",
    description:
      "Traditional Ethiopian Orthodox sacred poetry and interpretations",
    icon: "BookOpen",
    category: "Teachings",
    type: "Article",
    link: "#",
  },
  {
    title: "Ethiopian Calendar Guide",
    description: "Understanding the 13-month Ethiopian calendar and feast days",
    icon: "Calendar",
    category: "Spiritual Life",
    type: "Web",
    link: "#",
  },
  {
    title: "Fasting Traditions",
    description: "Guide to Ethiopian Orthodox fasting practices and periods",
    icon: "Heart",
    category: "Spiritual Life",
    type: "PDF",
    link: "#",
  },
  {
    title: "Prayer of St. Mary",
    description: "Traditional Marian prayers and devotions",
    icon: "BookOpen",
    category: "Spiritual Life",
    type: "Book",
    link: "#",
  },
  {
    title: "Divine Liturgy of St. Mary",
    description: "Understanding the Qeddase - Ethiopian Divine Liturgy",
    icon: "Cross",
    category: "Liturgy",
    type: "PDF",
    link: "#",
  },
  {
    title: "Anaphoras Collection",
    description: "The 14 Anaphoras of the Ethiopian Orthodox Church",
    icon: "Book",
    category: "Liturgy",
    type: "Book",
    link: "#",
  },
  {
    title: "Mezmur & Zema",
    description: "Ethiopian Orthodox hymns and sacred chants",
    icon: "Headphones",
    category: "Liturgy",
    type: "Audio",
    link: "#",
  },
  {
    title: "Nine Saints",
    description:
      "History of the Nine Saints who spread Christianity in Ethiopia",
    icon: "Users",
    category: "History",
    type: "Article",
    link: "#",
  },
  {
    title: "Axumite Christianity",
    description: "The ancient roots of Ethiopian Orthodox faith",
    icon: "BookOpen",
    category: "History",
    type: "PDF",
    link: "#",
  },
  {
    title: "St. Frumentius",
    description: "Life of Abba Selama, Apostle of Ethiopia",
    icon: "Book",
    category: "History",
    type: "Article",
    link: "#",
  },
  {
    title: "Documentary Series",
    description: "Video series on Ethiopian Orthodox faith and culture",
    icon: "Video",
    category: "Media",
    type: "Video",
    link: "#",
  },
  {
    title: "Orthodox Podcasts",
    description:
      "Ethiopian Orthodox teachings and discussions in multiple languages",
    icon: "Headphones",
    category: "Media",
    type: "Audio",
    link: "#",
  },
  {
    title: "Global Community",
    description: "Connect with Ethiopian Orthodox communities worldwide",
    icon: "Globe",
    category: "Media",
    type: "Web",
    link: "#",
  },
];

const prayers = [
  {
    title: "Wedeasse Maryam",
    time: "Daily - Various Times",
    description: "Praises of Mary - Traditional Marian devotional prayers",
    image:
      "https://images.unsplash.com/photo-1652207069570-8307e991d3e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Mahlet (Psalms)",
    time: "Daily - 5:00 AM & 6:00 PM",
    description: "Daily recitation of Psalms and spiritual songs",
    image:
      "https://images.unsplash.com/photo-1621164871985-9bacd7a1eb87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    title: "Prayer of Covenant",
    time: "Morning",
    description: "Morning prayers renewing our covenant with God",
    image:
      "https://images.unsplash.com/photo-1704276864429-9ed5be4cdd25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

const events = [
  {
    title: "Qeddase (Divine Liturgy)",
    date: "Every Sunday",
    time: "7:00 AM",
    location: "Campus Chapel",
    description: "Weekly celebration of the Holy Qeddase with Ge'ez chanting",
    attendees: 45,
  },
  {
    title: "Ge'ez Language Class",
    date: "Tuesdays & Thursdays",
    time: "7:00 PM",
    location: "Student Center - Room 201",
    description: "Learn the ancient language of Ethiopian Orthodox liturgy",
    attendees: 28,
  },
  {
    title: "Mahber (Fellowship)",
    date: "Saturdays",
    time: "5:00 PM",
    location: "Campus Chapel",
    description: "Community gathering with coffee ceremony and discussion",
    attendees: 32,
  },
  {
    title: "Gena (Ethiopian Christmas)",
    date: "January 7",
    time: "4:00 AM",
    location: "Campus Chapel",
    description: "Celebration of Gena with all-night vigil and Qeddase",
    attendees: 65,
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    await Resource.deleteMany({});
    await Resource.insertMany(resources);
    console.log("Resources seeded");

    await Prayer.deleteMany({});
    await Prayer.insertMany(prayers);
    console.log("Prayers seeded");

    await Event.deleteMany({});
    await Event.insertMany(events);
    console.log("Events seeded");

    mongoose.disconnect();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    mongoose.disconnect();
  }
};

seedDB();
