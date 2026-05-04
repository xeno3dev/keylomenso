import { useEffect, useRef } from 'react';
import { redirect } from 'react-router';

import { env } from '@documenso/lib/utils/env';

import type { Route } from './+types/signup';

export function meta() {
  return [{ title: 'Keylo – Vendor Platform' }];
}

/**
 * If signup is NOT explicitly disabled, redirect to signin.
 * To show this page: set NEXT_PUBLIC_DISABLE_SIGNUP=true in your env.
 */
export function loader({ request: _request }: Route.LoaderArgs) {
  const NEXT_PUBLIC_DISABLE_SIGNUP = env('NEXT_PUBLIC_DISABLE_SIGNUP');

  if (NEXT_PUBLIC_DISABLE_SIGNUP !== 'true') {
    throw redirect('/signin');
  }

  return {};
}

export default function SignupUnavailable() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <>
      <style>{`
        .su-root {
          min-height: 100vh;
          background: #050a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 2rem;
          font-family: 'Geist Variable', 'Geist', sans-serif;
        }

        /* ── blobs ── */
        .su-blob-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .su-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: suBlobFloat 12s ease-in-out infinite;
        }
        .su-blob-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, #1D9E75 0%, #0F6E56 60%, transparent 100%);
          top: -100px; left: -100px;
          opacity: 0.18;
          animation-delay: 0s;
        }
        .su-blob-2 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, #0F6E56 0%, #085041 60%, transparent 100%);
          bottom: -80px; right: -60px;
          opacity: 0.14;
          animation-delay: -4s;
        }
        .su-blob-3 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, #5DCAA5 0%, #1D9E75 70%, transparent 100%);
          top: 55%; left: 60%;
          opacity: 0.10;
          animation-delay: -8s;
        }
        @keyframes suBlobFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(40px, -30px) scale(1.05); }
          66%       { transform: translate(-20px, 30px) scale(0.97); }
        }

        /* cursor glow */
        .su-cursor-blob {
          position: fixed;
          width: 340px; height: 340px;
          background: radial-gradient(circle, rgba(29,158,117,0.13) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(40px);
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: left 0.4s ease, top 0.4s ease;
          z-index: 0;
        }

        /* grid noise */
        .su-noise {
          position: fixed;
          inset: 0;
          background-image:
            repeating-linear-gradient(0deg,  rgba(29,158,117,0.03) 0px, transparent 1px, transparent 60px, rgba(29,158,117,0.03) 61px),
            repeating-linear-gradient(90deg, rgba(29,158,117,0.03) 0px, transparent 1px, transparent 60px, rgba(29,158,117,0.03) 61px);
          z-index: 0;
          pointer-events: none;
        }

        /* ── card ── */
        .su-card-wrapper { position: relative; z-index: 2; }

        .su-card-border {
          padding: 1.5px;
          border-radius: 24px;
          background: linear-gradient(135deg, #1D9E75 0%, #085041 25%, #050a0a 50%, #0F6E56 75%, #5DCAA5 100%);
          background-size: 300% 300%;
          animation: suBorderFlow 6s ease infinite;
          box-shadow: 0 0 60px rgba(29,158,117,0.12), 0 0 120px rgba(29,158,117,0.06);
        }
        @keyframes suBorderFlow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .su-card {
          background: #080f0e;
          border-radius: 22.5px;
          padding: 3rem 3.5rem;
          max-width: 520px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .su-card::before {
          content: '';
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 70%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(93,202,165,0.4), transparent);
        }

        /* logo */
        .su-logo {
          height: 48px;
          width: auto;
          margin-bottom: 2.5rem;
        }

        /* badge */
        .su-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 100px;
          background: rgba(29,158,117,0.1);
          border: 0.5px solid rgba(29,158,117,0.3);
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #5DCAA5;
          margin-bottom: 1.5rem;
        }
        .su-badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #1D9E75;
          animation: suPulse 2s ease-in-out infinite;
        }
        @keyframes suPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }

        /* text */
        .su-headline {
          font-size: 1.65rem;
          font-weight: 700;
          line-height: 1.25;
          letter-spacing: -0.03em;
          color: #e8f5f1;
          margin-bottom: 1rem;
        }
        .su-headline em {
          font-style: normal;
          color: #1D9E75;
        }
        .su-sub {
          font-size: 0.95rem;
          color: rgba(232,245,241,0.45);
          line-height: 1.6;
          max-width: 360px;
          margin-bottom: 2.25rem;
          font-weight: 400;
        }

        /* domain pill */
        .su-domain {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 16px;
          border-radius: 10px;
          background: rgba(29,158,117,0.06);
          border: 0.5px solid rgba(29,158,117,0.2);
          font-family: 'Geist Mono', 'Courier New', monospace;
          font-size: 0.82rem;
          color: #5DCAA5;
          letter-spacing: 0.02em;
          margin-bottom: 2rem;
          text-decoration: none;
          transition: background 0.2s;
        }
        .su-domain:hover { background: rgba(29,158,117,0.1); }
        .su-domain-arrow { color: rgba(93,202,165,0.5); font-size: 0.75rem; }

        .su-divider {
          width: 100%;
          height: 0.5px;
          background: linear-gradient(90deg, transparent, rgba(29,158,117,0.2), transparent);
          margin-bottom: 2rem;
        }

        /* ── Uiverse button — Keylo-tinted ── */
        .su-button {
          cursor: pointer;
          font-size: 1rem;
          font-family: inherit;
          border-radius: 16px;
          border: none;
          padding: 2px;
          background: radial-gradient(circle 80px at 80% -10%, #ffffff, #181b1b);
          position: relative;
          transition: background 0.3s, transform 0.3s;
          text-decoration: none;
          display: inline-block;
        }
        .su-button:hover { transform: scale(0.98); }
        .su-button::after {
          content: "";
          position: absolute;
          width: 65%; height: 60%;
          border-radius: 120px;
          top: 0; right: 0;
          box-shadow: 0 0 20px #ffffff38;
          z-index: -1;
          transition: box-shadow 0.3s;
        }
        .su-button:hover::after { box-shadow: 0 0 10px #ffffff18; }

        .su-blob1 {
          position: absolute;
          width: 70px; height: 100%;
          border-radius: 16px;
          bottom: 0; left: 0;
          background: radial-gradient(circle 60px at 0% 100%, #1D9E75, rgba(8,80,65,0.63), transparent);
          box-shadow: -10px 10px 30px rgba(29,158,117,0.2);
          transition: background 0.3s, box-shadow 0.3s;
        }
        .su-button:hover .su-blob1 { box-shadow: -5px 5px 20px #000; }

        .su-inner {
          padding: 14px 32px;
          border-radius: 14px;
          color: #fff;
          z-index: 3;
          position: relative;
          background: radial-gradient(circle 80px at 80% -50%, #2a3330, #0f1111);
          transition: background 0.3s;
          font-weight: 600;
          letter-spacing: -0.01em;
          font-size: 0.95rem;
        }
        .su-button:hover .su-inner {
          background: radial-gradient(circle 80px at 80% -50%, #1a2422, #0a0f0e);
        }
        .su-inner::before {
          content: "";
          width: 100%; height: 100%;
          left: 0; top: 0;
          border-radius: 14px;
          background: radial-gradient(circle 60px at 0% 100%, rgba(29,158,117,0.15), rgba(8,80,65,0.1), transparent);
          position: absolute;
          transition: opacity 0.3s;
        }
        .su-button:hover .su-inner::before { opacity: 0; }

        .su-footer-note {
          margin-top: 1.5rem;
          font-size: 0.75rem;
          color: rgba(232,245,241,0.2);
          letter-spacing: 0.01em;
        }
      `}</style>

      <div className="su-root">
        {/* background blobs */}
        <div className="su-blob-bg">
          <div className="su-blob su-blob-1" />
          <div className="su-blob su-blob-2" />
          <div className="su-blob su-blob-3" />
        </div>
        <div className="su-noise" />
        <div className="su-cursor-blob" ref={cursorRef} />

        {/* card */}
        <div className="su-card-wrapper">
          <div className="su-card-border">
            <div className="su-card">

              {/* logo – drop keylo_white.svg into apps/remix/public/ */}
              <img
                src="/keylo_white.svg"
                alt="Keylo"
                className="su-logo"
              />

              {/* badge */}
              <div className="su-badge">
                <div className="su-badge-dot" />
                Now accepting vendors
              </div>

              <h1 className="su-headline">
                Own a rental business?<br />
                <em>Join Keylo.</em>
              </h1>

              <p className="su-sub">
                The all-in-one platform for vehicle rental vendors in the
                Caribbean and beyond.
              </p>

              <a
                className="su-domain"
                href="https://getkeylo.app"
                target="_blank"
                rel="noreferrer"
              >
                <span className="su-domain-arrow">↗</span>
                getkeylo.app
              </a>

              <div className="su-divider" />

              <a
                className="su-button"
                href="https://getkeylo.app"
                target="_blank"
                rel="noreferrer"
              >
                <div className="su-blob1" />
                <div className="su-inner">Try Keylo Today</div>
              </a>

              <p className="su-footer-note">
                Vendor accounts are managed by invitation.
              </p>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
