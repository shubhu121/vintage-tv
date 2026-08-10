/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VintageTV } from './components/VintageTV';

export default function App() {
  return (
    <div 
      className="min-h-screen bg-[#121212] flex items-center justify-center overflow-hidden relative selection:bg-transparent"
      style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #251b14 0%, #0a0a0a 100%)' }}
    >
      <VintageTV />
    </div>
  );
}
