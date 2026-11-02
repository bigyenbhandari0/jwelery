import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BrandIntro } from '@/components/auren/BrandIntro';

describe('intro first paint', () => {
  it('includes the covering intro before any client effects run', () => {
    const markup = renderToString(<BrandIntro />);
    expect(markup).toContain('brand-intro playing');
    expect(markup).toContain('Enter the maison');
  });
});
