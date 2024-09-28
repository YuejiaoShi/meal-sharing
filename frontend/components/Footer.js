export default function Footer() {
  return (
    <footer className="bg-lime-900 text-white py-6">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; 2023 Meal Sharing. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="/meals" className="hover:text-lime-300">
            Menu
          </a>
          <a href="/about" className="hover:text-lime-300">
            About Us
          </a>
          <a href="/contact" className="hover:text-lime-300">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
