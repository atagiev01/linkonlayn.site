import React, { lazy } from 'react';
import { TemplateRenderProps } from './types';
import { Template } from '../types';

// Each wedding guest only ever needs ONE of these templates at a time, so we
// load them lazily (per-template code-split chunks) instead of bundling all
// five designs into every visitor's initial download.
const ElegantGoldTemplate = lazy(() =>
  import('./ElegantGoldTemplate').then((m) => ({ default: m.ElegantGoldTemplate }))
);
const FloralWeddingTemplate = lazy(() =>
  import('./FloralWeddingTemplate').then((m) => ({ default: m.FloralWeddingTemplate }))
);
const LuxuryWeddingTemplate = lazy(() =>
  import('./LuxuryWeddingTemplate').then((m) => ({ default: m.LuxuryWeddingTemplate }))
);
const MinimalWeddingTemplate = lazy(() =>
  import('./MinimalWeddingTemplate').then((m) => ({ default: m.MinimalWeddingTemplate }))
);
const CustomCodeTemplate = lazy(() =>
  import('./CustomCodeTemplate').then((m) => ({ default: m.CustomCodeTemplate }))
);
const GoldenEnvelopeTemplate = lazy(() =>
  import('./GoldenEnvelopeTemplate').then((m) => ({ default: m.GoldenEnvelopeTemplate }))
);
const EmeraldSealEnvelopeTemplate = lazy(() =>
  import('./EmeraldSealEnvelopeTemplate').then((m) => ({ default: m.EmeraldSealEnvelopeTemplate }))
);
const PastelRoseTemplate = lazy(() =>
  import('./PastelRoseTemplate').then((m) => ({ default: m.PastelRoseTemplate }))
);
const BlushGardenTemplate = lazy(() =>
  import('./BlushGardenTemplate').then((m) => ({ default: m.BlushGardenTemplate }))
);
const NeonNightTemplate = lazy(() =>
  import('./NeonNightTemplate').then((m) => ({ default: m.NeonNightTemplate }))
);
const BohoLinenTemplate = lazy(() =>
  import('./BohoLinenTemplate').then((m) => ({ default: m.BohoLinenTemplate }))
);
const WildMeadowTemplate = lazy(() =>
  import('./WildMeadowTemplate').then((m) => ({ default: m.WildMeadowTemplate }))
);
const CrimsonPetalsTemplate = lazy(() =>
  import('./CrimsonPetalsTemplate').then((m) => ({ default: m.CrimsonPetalsTemplate }))
);

export interface TemplateDefinition {
  id: string;
  name: string;
  component: React.FC<TemplateRenderProps>;
  category: Template['category'];
  description: string;
  previewImage: string;
}

export const TEMPLATE_REGISTRY: Record<string, React.FC<TemplateRenderProps>> = {
  'elegant-gold': ElegantGoldTemplate,
  'floral': FloralWeddingTemplate,
  'floral-wedding': FloralWeddingTemplate,
  'luxury': LuxuryWeddingTemplate,
  'luxury-wedding': LuxuryWeddingTemplate,
  'minimal': MinimalWeddingTemplate,
  'minimal-wedding': MinimalWeddingTemplate,
  'custom-code': CustomCodeTemplate,
  'custom-video-envelope': CustomCodeTemplate,
  'custom-modern-gold': CustomCodeTemplate,
  'golden-seal': GoldenEnvelopeTemplate,
  'emerald-seal': EmeraldSealEnvelopeTemplate,
  'pastel-rose': PastelRoseTemplate,
  'blush-garden': BlushGardenTemplate,
  'neon-night': NeonNightTemplate,
  'boho-linen': BohoLinenTemplate,
  'wild-meadow': WildMeadowTemplate,
  'crimson-petals': CrimsonPetalsTemplate,
};

export function getTemplateComponent(templateId: string, template?: Template): React.FC<TemplateRenderProps> {
  // If explicitly custom code template or has customHtml
  if (template?.isCustomCode || (template?.customHtml && template.customHtml.trim().length > 0)) {
    return CustomCodeTemplate;
  }

  const normalized = (templateId || '').toLowerCase().trim();

  if (
    normalized.startsWith('custom') ||
    normalized.includes('html') ||
    normalized.includes('code') ||
    normalized.includes('envelope') ||
    normalized.includes('video')
  ) {
    return CustomCodeTemplate;
  }

  const component = TEMPLATE_REGISTRY[normalized];

  if (component) {
    return component;
  }

  // Fallback if templateId contains keywords
  if (normalized.includes('gold')) return ElegantGoldTemplate;
  if (normalized.includes('floral') || normalized.includes('flower')) return FloralWeddingTemplate;
  if (normalized.includes('luxury') || normalized.includes('royal')) return LuxuryWeddingTemplate;
  if (normalized.includes('minimal')) return MinimalWeddingTemplate;
  if (normalized.includes('emerald')) return EmeraldSealEnvelopeTemplate;
  if (normalized.includes('pastel') || normalized.includes('rose')) return PastelRoseTemplate;
  if (normalized.includes('blush')) return BlushGardenTemplate;
  if (normalized.includes('neon')) return NeonNightTemplate;
  if (normalized.includes('boho') || normalized.includes('linen') || normalized.includes('rustic')) return BohoLinenTemplate;
  if (normalized.includes('meadow') || normalized.includes('wild')) return WildMeadowTemplate;
  if (normalized.includes('crimson') || normalized.includes('torn') || normalized.includes('burgundy') || normalized.includes('petals')) return CrimsonPetalsTemplate;

  // Ultimate fallback
  return ElegantGoldTemplate;
}

