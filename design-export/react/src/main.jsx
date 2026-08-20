import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import Showcase from './Showcase.jsx';
import './styles/base.css';

/* BrowserRouter porque los CTA usan <Link>; LazyMotion porque los componentes
   usan `m` en vez de `motion` — sin él, no se dibujan. */
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LazyMotion features={domAnimation} strict>
        <Showcase />
      </LazyMotion>
    </BrowserRouter>
  </React.StrictMode>,
);
