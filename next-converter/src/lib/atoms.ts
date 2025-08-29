import { atomWithStorage } from 'jotai/utils';

export const maxUploadSizeAtom = atomWithStorage<number>('maxUploadSize', 100);
