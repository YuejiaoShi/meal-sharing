import Link from "next/link";

const footerSections = [
  {
    title: "Menu",
    links: [
      { href: "/meals", label: "Our Menu" },
      { href: "/specials", label: "Chef's Specials" },
      { href: "/drinks", label: "Drinks" },
      { href: "/desserts", label: "Desserts" },
      { href: "/catering", label: "Catering" },
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
    title: "Customer Service",
    links: [
      { href: "/contact", label: "Contact Us" },
      { href: "/locations", label: "Find a Location" },
      { href: "/reservations", label: "Reservations" },
      { href: "/faq", label: "FAQ" },
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
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Adjust the padding here */}
        <div className="col-span-1 flex flex-col items-start">
          <img
            src="/favicon-white.png"
            alt="Restaurant Logo"
            className="w-16 h-auto mb-4 block mx-auto"
          />
          <p className="mb-4">
            Welcome to Meal Sharing. Join us for delicious meals and great
            company!
          </p>
          <p>© 2024 Meal Sharing. All rights reserved.</p>
        </div>
        {footerSections.map((section, index) => (
          <div key={index} className="col-span-1">
            <h3 className="font-semibold mb-4">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-span-1 md:col-span-4 flex justify-center md:justify-end mt-8 md:mt-0 space-x-4">
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
