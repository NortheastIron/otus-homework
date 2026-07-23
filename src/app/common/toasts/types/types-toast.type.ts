import { TYPES_TOAST } from '@common/toasts/constants';

export type TypesToast = typeof TYPES_TOAST[keyof typeof TYPES_TOAST];