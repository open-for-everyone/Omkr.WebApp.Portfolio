import {InjectionToken} from '@angular/core'

export type Saver = (blob: Blob, filename?: string) => void

export const SAVER = new InjectionToken<Saver>('saver')

export function getSaver(): Saver {
  return (blob: Blob, filename?: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    if (filename) a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
}
