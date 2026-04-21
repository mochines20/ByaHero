import { useState, useRef, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { api } from '../../lib/api';
import { useToastStore } from '../../store/uiStore';

interface SOSButtonProps {
  isActive?: boolean;
}

export function SOSButton({ isActive = true }: SOSButtonProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isTriggered, setIsTriggered] = useState(false);
  const [incidentId, setIncidentId] = useState<string>('');
  const holdTimer = useRef<NodeJS.Timeout>();
  const countdownTimer = useRef<NodeJS.Timeout>();
  const pushToast = useToastStore((s) => s.pushToast);

  useEffect(() => {
    if (isHolding && countdown > 0) {
      countdownTimer.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(countdownTimer.current);
    }

    if (isHolding && countdown === 0) {
      triggerSOS();
    }
  }, [isHolding, countdown]);

  const triggerSOS = async () => {
    try {
      if (!navigator.geolocation) {
        pushToast('Geolocation not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const { data } = await api.post('/sos/trigger', {
          latitude,
          longitude,
          transportType: 'jeepney',
          transportPlate: '',
        });

        setIsTriggered(true);
        setIncidentId(data.incidentId);
        setIsHolding(false);
        pushToast('SOS Alert sent to emergency contacts!');
      });
    } catch (error: any) {
      pushToast(error.message || 'Failed to trigger SOS');
      setIsHolding(false);
      setCountdown(3);
    }
  };

  const cancelSOS = async () => {
    if (!incidentId) return;

    try {
      await api.post('/sos/cancel', { incidentId });
      setIsTriggered(false);
      setIncidentId('');
      pushToast('SOS alert cancelled');
    } catch (error: any) {
      pushToast(error.message || 'Failed to cancel SOS');
    }
  };

  const handleMouseDown = () => {
    if (!isActive || isTriggered) return;
    setIsHolding(true);
    setCountdown(3);
  };

  const handleMouseUp = () => {
    setIsHolding(false);
    setCountdown(3);
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (countdownTimer.current) clearTimeout(countdownTimer.current);
  };

  if (!isActive) return null;

  if (isTriggered) {
    return (
      <div className="fixed bottom-24 right-4 z-50 bg-red-600 text-white p-4 rounded-lg shadow-lg">
        <div className='flex items-center justify-between mb-2'>
          <span className='font-bold'>SOS ACTIVE</span>
          <button onClick={cancelSOS} className='ml-2'>
            <X size={20} />
          </button>
        </div>
        <p className='text-sm'>Alert sent to emergency contacts</p>
        <button
          onClick={cancelSOS}
          className='w-full mt-2 bg-white text-red-600 py-1 px-2 rounded font-semibold text-sm'
        >
          Cancel SOS
        </button>
      </div>
    );
  }

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      className={`fixed bottom-24 right-4 z-50 rounded-full p-4 flex items-center justify-center transition-all text-white shadow-lg ${
        isHolding ? "bg-red-500 scale-110" : "bg-red-600 hover:bg-red-700"
      }`}
      title='Hold for 3 seconds to trigger SOS'
    >
      <div className='relative'>
        <AlertCircle size={32} />
        {isHolding && (
          <div className='absolute inset-0 flex items-center justify-center text-white font-bold text-sm'>
            {countdown}
          </div>
        )}
      </div>
    </button>
  );
}
