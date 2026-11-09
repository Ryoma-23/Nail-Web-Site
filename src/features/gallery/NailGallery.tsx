'use client';

import { useState } from 'react';
import { sampleDesigns, type NailDesign } from './data';
import { DesignModal } from './DesignDetail';
import { Demo, Grid } from './ui';

export default function NailGallery() {
  const [design, setDesign] = useState<NailDesign | null>(null);
  return <Demo label="G01" title="ネイル作品集" guide="画像をタップすると、作品の別カットや詳しい情報を見られます。">
    <Grid designs={sampleDesigns.slice(0, 12)} onOpen={setDesign} />
    {design && <DesignModal design={design} onClose={() => setDesign(null)} />}
  </Demo>;
}
