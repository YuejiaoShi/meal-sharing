"use client";
import { useThemeContext } from "@/context/themeContext";
import Link from "next/link";

const footerSections = [
  {
    title: "Meal",
    links: [
      { href: "/meals", label: "Our Meals" },
      { href: "/share-a-meal", label: "Share A Meal" },
    ],
  },
  {
    title: "About Us",
    links: [
      { href: "/our-story", label: "Our Story" },
      { href: "/team", label: "Meet the Team" },
      { href: "/careers", label: "Careers" },
    ],
  },
  {
    title: "Contact Us",
    links: [
      { icon: "/ContactIcons/phone.png", label: "+45 11111111" },
      { icon: "/ContactIcons/location.png", label: "Copenhagen, Denmark" },
      { icon: "/ContactIcons/email.png", label: "info@mealsharing.com" },
    ],
  },
];

const socialMediaLinks = [
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: "/socialmedia/facebook-icon.png",
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: "/socialmedia/instagram-icon.png",
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    icon: "/socialmedia/linkedin-icon.png",
  },
  {
    href: "https://tiktok.com",
    label: "TikTok",
    icon: "/socialmedia/tiktok-icon.png",
  },
];

const Footer = () => {
  const theme = useThemeContext();

  return (
    <footer
      className={`${
        theme.isDarkMode
          ? "bg-darkMode-bg text-darkMode-text"
          : "bg-lightMode-bg text-lightMode-text"
      } py-12`}
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
        <div className="col-span-1 flex flex-col items-start">
          <img
            src={theme.isDarkMode ? "/favicon-white.png" : "/favicon.ico"}
            alt="Restaurant Logo"
            className="w-16 h-auto mb-4 block"
          />
          <p className="mb-4">
            Welcome to Meal Sharing. Join us for delicious meals and celebrate
            the joy of good food with us!
          </p>
          <p>© 2024 Meal Sharing by Yuejiao Shi. All rights reserved.</p>
        </div>
        {footerSections.map((section, index) => (
          <div key={index} className="col-span-1">
            <h3 className="font-semibold mb-4">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  {link.icon ? (
                    <>
                      <img
                        src={link.icon}
                        alt={link.label}
                        className="w-4 h-4"
                      />
                      <span>{link.label}</span>
                    </>
                  ) : (
                    <Link href={link.href} className="hover:underline">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div
          id="social-media"
          className="col-span-1 md:col-span-4 flex justify-center md:justify-end mt-8 md:mt-0 space-x-4"
        >
          <h3 className="font-semibold">Follow us</h3>
          <div className="flex items-center space-x-4">
            {socialMediaLinks.map((media, index) => (
              <Link
                key={index}
                href={media.href}
                aria-label={media.label}
                className="text-white hover:text-gray-400"
              >
                <img src={media.icon} alt={media.label} className="w-6 h-6" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
