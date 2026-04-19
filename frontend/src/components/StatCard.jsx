import { motion } from "framer-motion";

export default function StatCard({ title, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition duration-300"
    >
      <p className="text-gray-500">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </motion.div>
  );
}
