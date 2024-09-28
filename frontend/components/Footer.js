export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; 2023 Meal Sharing. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="/meals" className="hover:text-gray-400">
            Menu
          </a>
          <a href="/about" className="hover:text-gray-400">
            About Us
          </a>
          <a href="/contact" className="hover:text-gray-400">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
