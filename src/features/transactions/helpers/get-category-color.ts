export const getCategoryColor = (category: string) => {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-800",
    "bg-red-100 text-red-800",
    "bg-indigo-100 text-indigo-800",
  ];
  const index = category.length % colors.length;
  return colors[index];
};
