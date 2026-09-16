import React from 'react';
import { CalendarPlus } from 'lucide-react';

interface CalendarButtonProps {
  brideName: string;
  groomName: string;
  weddingDate: string; // YYYY-MM-DD
  weddingTime: string; // HH:mm
  venue: string;
  address: string;
  className?: string;
}

export const CalendarExportButton: React.FC<CalendarButtonProps> = ({
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venue,
  address,
  className = '',
}) => {
  const handleAddToCalendar = () => {
    try {
      const title = encodeURIComponent(`${brideName} & ${groomName} Toy Mərasimi`);
      const details = encodeURIComponent(
        `${brideName} və ${groomName} cütlüyünün təntənəli toy mərasimi.\nÜnvan: ${venue}, ${address}`
      );
      const location = encodeURIComponent(`${venue}, ${address}`);

      // Format YYYYMMDDTHHmmSSZ
      const cleanDate = weddingDate.replace(/-/g, '');
      const cleanTime = weddingTime.replace(/:/g, '') + '00';
      const startDateTime = `${cleanDate}T${cleanTime}`;

      // Assume 5 hours duration
      const endHour = (parseInt(weddingTime.split(':')[0], 10) + 5) % 24;
      const endHourStr = String(endHour).padStart(2, '0');
      const endDateTime = `${cleanDate}T${endHourStr}${cleanTime.slice(2)}`;

      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${details}&location=${location}`;

      window.open(googleCalUrl, '_blank');
    } catch (e) {
      console.error('Failed to generate calendar link:', e);
    }
  };

  return (
    <button
      id="add-to-calendar-btn"
      onClick={handleAddToCalendar}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${className}`}
    >
      <CalendarPlus className="w-4 h-4" />
      <span>Təqvimə Əlavə Et</span>
    </button>
  );
};
