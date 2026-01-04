import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import { NovaTextScroll } from '@/components/core/text-effect/nova-text-scroll';
import { useCeremony } from '@/hooks/core/useCeremony';
import { useSettingStore } from '@/store/modules/setting';

export function NovaFestivalTextScroll() {
  const { currentFestivalData } = useCeremony();
  const { showFestivalText, setShowFestivalText } = useSettingStore();

  const text = currentFestivalData?.scrollText || '';

  const containerStyle = useMemo<CSSProperties>(
    () => ({
      height: showFestivalText && text !== '' ? '48px' : '0',
    }),
    [showFestivalText, text],
  );

  const handleClose = () => {
    setShowFestivalText(false);
  };

  if (!text) {
    return null;
  }

  return (
    <div
      className="overflow-hidden transition-[height] duration-600 ease-in-out"
      style={containerStyle}>
      {showFestivalText && currentFestivalData?.scrollText !== '' && (
        <NovaTextScroll
          text={text}
          style={{ marginBottom: '12px' }}
          showClose
          onClose={handleClose}
        />
      )}
    </div>
  );
}
