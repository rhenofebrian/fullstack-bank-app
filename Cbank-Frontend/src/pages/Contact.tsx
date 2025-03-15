import { useState, ChangeEvent, FormEvent } from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Message sent successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 px-4 py-24">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Contact Us
        </h1>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <textarea
            name="message"
            rows={4}
            placeholder="Your Message"
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          ></textarea>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            Send Message
          </button>
        </form>

        {/* Contact Information */}
        <div className="space-y-4 mt-6">
          <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <MapPin className="w-5 h-5" /> Telkom University, Bojongsoang
          </p>
          <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Phone className="w-5 h-5" /> +62 812-3456-7890
          </p>
          <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Mail className="w-5 h-5" /> support@cbank.com
          </p>
        </div>
      </div>

      {/* Google Maps with Telkom University location */}
      <div className="mt-8 max-w-3xl w-full mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Our Location
        </h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63351.75360971135!2d107.6098109420087!3d-6.973033211668396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e9ba280aaf2f%3A0x301e8f1fc28b220!2sTelkom%20University!5e0!3m2!1sen!2sid!4v1709800000000"
          width="100%"
          height="400"
          allowFullScreen
          loading="lazy"
          className="rounded-lg shadow-lg"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactPage;
