import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enEvents from "./locales/en/events.json";
import amEvents from "./locales/am/events.json";
import enCommunity from "./locales/en/community.json";
import amCommunity from "./locales/am/community.json";

import enAbout from "./locales/en/about.json";
import amAbout from "./locales/am/about.json";

import enNav from "./locales/en/nav.json";
import amNav from "./locales/am/nav.json";
import enResources from "./locales/en/resources.json";
import amResources from "./locales/am/resources.json";
import enHero from "./locales/en/hero.json";
import amHero from "./locales/am/hero.json";
import enPrayers from "./locales/en/prayers.json";
import amPrayers from "./locales/am/prayers.json";
import amFooter from "./locales/am/footer.json";
import enFooter from "./locales/en/footer.json";
import enMyMessages from "./locales/en/myMessages.json";
import amMyMessages from "./locales/am/myMessages.json";
const savedLang = localStorage.getItem("lang") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      events: enEvents.events,
      community: enCommunity.community,
      about: enAbout.about,
      nav: enNav.nav,
      resources: enResources.resources,
      hero: enHero.hero,
      prayers: enPrayers.prayers,
      footer: enFooter.footer,
      myMessages: enMyMessages.myMessages,
    },
    am: {
      events: amEvents.events,
      community: amCommunity.community,
      about: amAbout.about,
      nav: amNav.nav,
      resources: amResources.resources,
      hero: amHero.hero,
      prayers: amPrayers.prayers,
      footer: amFooter.footer,
      myMessages: amMyMessages.myMessages,
    },
  },
  ng: savedLang,
  fallbackLng: "en",
  ns: [
    "events",
    "community",
    "about",
    "nav",
    "resources",
    "hero",
    "prayers",
    "footer",
  ],

  defaultNS: "events",
  interpolation: { escapeValue: false },
});

export default i18n;
