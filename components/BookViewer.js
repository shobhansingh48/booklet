"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

const Page = forwardRef(function Page({ src, number, cover = false }, ref) {
  return (
    <div ref={ref} className={`page ${cover ? "hard-cover" : ""}`}>
      <div className="page-inner">
        <img src={src} alt={`Page ${number}`} draggable="false" />
        {!cover && <span className="page-number">{number}</span>}
      </div>
    </div>
  );
});

export default function BookViewer({ book }) {
  const ref = useRef(null);
  const audioCtxRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [page, setPage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [ready, setReady] = useState(false);

  const src = n => `/api/book/${encodeURIComponent(book.id)}/page/${n}`;

  useEffect(() => {
    const block = e => {
      if (e.target.closest(".viewer")) e.preventDefault();
    };
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, []);

  function getFlip() {
    try {
      return ref.current?.pageFlip?.() ?? null;
    } catch {
      return null;
    }
  }

  // Browsers generally allow audio after a user gesture. This creates a
  // small paper-like rustle without requiring an external audio file.
  function playPageTurnSound(direction = 1) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      const duration = 0.16;

      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < data.length; i++) {
        const t = i / data.length;
        const envelope = Math.pow(1 - t, 2.2);
        const flutter = Math.sin(i * 0.085) * 0.18 + Math.sin(i * 0.021) * 0.10;
        data[i] = (Math.random() * 2 - 1) * envelope * (0.55 + flutter);
      }

      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      source.buffer = buffer;
      filter.type = "bandpass";
      filter.frequency.value = direction > 0 ? 1700 : 1450;
      filter.Q.value = 0.65;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.045, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);
      source.stop(now + duration);
    } catch {
      // Sound is decorative; never let it interfere with navigation.
    }
  }

  function next() {
    const flip = getFlip();
    if (!flip) return;
    playPageTurnSound(1);
    flip.flipNext();
  }

  function prev() {
    const flip = getFlip();
    if (!flip) return;
    playPageTurnSound(-1);
    flip.flipPrev();
  }

  function zoomBy(amount) {
    setZoom(z => Math.min(2, Math.max(1, +(z + amount).toFixed(2))));
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setFullscreen(true);
      } else {
        await document.exitFullscreen();
        setFullscreen(false);
      }
    } catch {}
  }

  return (
    <main className="viewer">
      <header className="toolbar">
        <div className="title">
          <span>BOOKLET</span>
          <strong>{book.title}</strong>
        </div>

        <div className="controls">
          <button onClick={prev} disabled={!ready || page === 0}>‹</button>
          <span>{page + 1} / {book.pages}</span>
          <button onClick={next} disabled={!ready || page >= book.pages - 1}>›</button>
          <button onClick={() => zoomBy(-0.2)} disabled={zoom <= 1}>−</button>
          <button onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
          <button onClick={() => zoomBy(0.2)} disabled={zoom >= 2}>+</button>
          <button onClick={toggleFullscreen}>{fullscreen ? "×" : "⛶"}</button>
        </div>
      </header>

      <section className="stage">
        <div className="book-wrap" style={{ transform: `scale(${zoom})` }}>
          <HTMLFlipBook
            ref={ref}
            width={520}
            height={736}
            size="fixed"
            minWidth={320}
            maxWidth={520}
            minHeight={452}
            maxHeight={736}
            drawShadow={true}
            maxShadowOpacity={0.48}
            showCover={true}
            mobileScrollSupport={true}
            useMouseEvents={true}
            swipeDistance={30}
            clickEventForward={true}
            usePortrait={false}
            startPage={0}
            startZIndex={0}
            autoSize={false}
            flippingTime={700}
            showPageCorners={true}
            disableFlipByClick={false}
            onInit={() => {
              setReady(true);
              const flip = getFlip();
              if (flip) setPage(flip.getCurrentPageIndex());
            }}
            onFlip={e => setPage(Number(e.data))}
            className="flip-book"
          >
            <Page src={src(1)} number={1} cover />
            <Page src={src(2)} number={2} />
            <Page src={src(3)} number={3} />
            <Page src={src(4)} number={4} />
            <Page src={src(5)} number={5} />
            <Page src={src(6)} number={6} />
            <Page src={src(7)} number={7} />
            <Page src={src(8)} number={8} cover />
          </HTMLFlipBook>
        </div>

        <button className="nav left" onClick={prev} disabled={!ready || page === 0}>‹</button>
        <button className="nav right" onClick={next} disabled={!ready || page >= book.pages - 1}>›</button>
      </section>

      <footer className="footer">
        <button onClick={prev} disabled={!ready || page === 0}>Previous</button>
        <span>Drag a page corner or click the page • Swipe on mobile</span>
        <button onClick={next} disabled={!ready || page >= book.pages - 1}>Next</button>
      </footer>
    </main>
  );
}
