import { TypesToast } from '@common/toasts/types';

export type Toast = {
    id: string;
    text: string;
    type: TypesToast;
}