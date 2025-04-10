// utils/dateFormat.js
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('cs-CZ', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Stejný den
  if (start.toDateString() === end.toDateString()) {
    return formatDate(startDate);
  }
  
  // Stejný měsíc a rok
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()}. - ${formatDate(endDate)}`;
  }
  
  // Stejný rok
  if (start.getFullYear() === end.getFullYear()) {
    const startFormatted = start.toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'long'
    });
    return `${startFormatted} - ${formatDate(endDate)}`;
  }
  
  // Rozdílné roky
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};
