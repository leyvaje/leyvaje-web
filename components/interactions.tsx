'use client';

import { useEffect, useState } from 'react';

type NavigationItem = readonly [string, string];

export function MobileNavigation({ items }: { items: readonly NavigationItem[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <div className="mobile-navigation">
      <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
        <span>{open ? 'Close' : 'Menu'}</span><span aria-hidden="true">{open ? '×' : '☰'}</span>
      </button>
      {open ? <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">{items.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}</nav> : null}
    </div>
  );
}

export function ContactActions({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    await navigator.clipboard.writeText('jose@leyvaje.com');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <button className={`button button-dark ${compact ? 'button-outline' : ''}`} type="button" onClick={copyEmail}>
      {copied ? 'Copied · jose@leyvaje.com' : compact ? 'Copy email' : 'Copy email address'}
    </button>
  );
}
