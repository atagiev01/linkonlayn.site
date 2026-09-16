import { Invitation, Template } from '../types';

export interface TemplateRenderProps {
  invitation: Invitation;
  template: Template;
  onOpenRSVP?: () => void;
  isGuestMode?: boolean;
}
