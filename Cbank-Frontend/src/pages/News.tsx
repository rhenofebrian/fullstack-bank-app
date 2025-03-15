import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

// Define types for our news data
interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  category: "Promo" | "News";
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | "Promo" | "News"
  >("All");
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: "apple",
            from: "2025-03-10",
            to: "2025-03-10",
            sortBy: "popularity",
            apiKey: "508c98b91879439c8bfdf15829b9604f",
            pageSize: 100, // Get more items to have enough for both categories
          },
        });

        if (response.data.articles) {
          // Transform and categorize the news items
          const transformedNews = response.data.articles.map(
            (article: any, index: number) => {
              // Determine category - for demo purposes, we'll alternate between News and Promo
              // In a real app, you might use keywords or other logic to categorize
              const category = index % 3 === 0 ? "Promo" : "News";

              return {
                id: article.url.split("/").pop() || `news-${index}`,
                title: article.title,
                description: article.description || "",
                url: article.url,
                urlToImage:
                  article.urlToImage || `/placeholder.svg?height=400&width=600`,
                publishedAt: new Date(article.publishedAt).toLocaleDateString(),
                category,
              };
            }
          );

          setNewsItems(transformedNews);
          setTotalPages(Math.ceil(transformedNews.length / itemsPerPage));
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to fetch news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Filter news based on selected category
  const filteredNews =
    selectedCategory === "All"
      ? newsItems
      : newsItems.filter((news) => news.category === selectedCategory);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);

  // Update total pages when category changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredNews.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when changing categories
  }, [filteredNews.length, selectedCategory]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-6 py-10 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
        >
          Promotions & News
        </motion.h1>

        {/* Category Filter */}
        <div className="flex justify-center space-x-4 mb-10">
          {["All", "Promo", "News"].map((category) => (
            <motion.button
              key={category}
              onClick={() =>
                setSelectedCategory(category as "All" | "Promo" | "News")
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg transition text-lg font-medium shadow-md backdrop-blur-lg relative overflow-hidden ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-blue-700 to-blue-400 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border"
              }`}
            >
              <span className="relative z-10">{category}</span>

              {/* Border Animation on Hover */}
              <motion.span
                className="absolute inset-0 border-2 border-blue-500 opacity-0 rounded-lg"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <span className="ml-2 text-lg text-gray-700 dark:text-gray-300">
              Loading news...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10">
            <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* News List */}
        {!loading && !error && (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {currentItems.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image with Hover Effect */}
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={news.urlToImage}
                        alt={news.title}
                        className="w-full h-60 object-cover transition duration-300 ease-in-out"
                        whileHover={{ scale: 1.08 }}
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <p
                        className={`text-sm font-semibold uppercase tracking-wide ${
                          news.category === "Promo"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-700 dark:text-blue-500"
                        }`}
                      >
                        {news.category}
                      </p>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                        {news.title}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {news.publishedAt}
                      </p>
                    </div>

                    {/* Hover Overlay Effect */}
                    <motion.div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredNews.length > 0 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // Show pages around current page
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage > 3) {
                      pageNum = currentPage - 3 + i;
                    }
                    if (currentPage > totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    }
                  }

                  return pageNum <= totalPages ? (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={currentPage === pageNum}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ) : null;
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
